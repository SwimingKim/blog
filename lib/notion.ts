import { Client as OfficialClient } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionAPI as RecordMapClient } from "notion-client";
import { Section } from "types/content";
import { ContentPage } from "types/notion";
import { ExtendedRecordMap } from "notion-types";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABSE_ID;

const officalClient = new OfficialClient({
  auth: NOTION_API_KEY,
});
const recordMapClient = new RecordMapClient({});

const convertContentPage = (pageObject: PageObjectResponse) => {
  const { id, last_edited_time } = pageObject;
  const res: ContentPage = {
    id,
    last_edited_time,
    section: { index: 0, title: "" },
    chapter: { index: 0, title: "" },
  };

  Object.keys(pageObject.properties).forEach((propertyName) => {
    const property = pageObject.properties[propertyName];
    switch (propertyName) {
      case "section_title": {
        if (property.type === "select") {
          res.section.title = property.select?.name || "";
        }
        else if (property.type == "rollup") {
          if (property.rollup.type == "array" && property.rollup.array.length > 0) {
            const item = property.rollup.array[0];
            if (item.type == "title") {
              res.section.title = item.title[0].plain_text;
            }
          }
        }
        break;
      }
      case "section_index": {
        if (property.type === "number") {
          res.section.index = property.number as number;
        }
        else if (property.type == "rollup") {
          if (property.rollup.type == "array" && property.rollup.array.length > 0) {
            const item = property.rollup.array[0];
            for (const [key, value] of Object.entries(item)) {
              if (key == "number") {
                res.section.index = value
              }
            }
          }
        }
        break;
      }
      case "chapter_title": {
        if (property.type === "title") {
          res.chapter.title = property.title
            .map((it) => it.plain_text)
            .join(" ") as string;
        }
        break;
      }
      case "chapter_index": {
        if (property.type === "number") {
          res.chapter.index = property.number as number;
        }
        break;
      }
      // case "Slug": {
      //   if (property.type == "rich_text") {
      //     res.slug = property.rich_text
      //     .map((it) => it.plain_text)
      //     .join(" ") as string;
      //   }
      //   break;
      // }
    }
  });

  return res;
};

export const fetchAllPages = async () => {
  try {
    let is_start = true;
    let next_cursor = null;
    let page_results = [] as any[];
    while (is_start || next_cursor != null) {
      let params = {
        database_id: DATABASE_ID as string,
        page_size: 100,
        filter: {
          and: [
            {
              property: 'Public',
              checkbox: {
                equals: true,
              },
            },
          ]
        }
      } as any;

      if (next_cursor != null) params = {
        ...params,
        start_cursor: next_cursor,
      }
      const queryData = await officalClient.databases.query(params);
      page_results = [
        ...page_results,
        ...queryData.results
      ]

      next_cursor = queryData.next_cursor
      console.log(queryData.next_cursor, queryData.results.length)

      is_start = false;
    }

    console.log("items", page_results.length)
    const contents = page_results.map((pageObject) => {
      return convertContentPage(pageObject as PageObjectResponse);
    });
    return contents;
  } catch (e) {
    throw new Error("");
  }
};

const convertPagesToSections = (pages: ContentPage[]) => {
  const sections: Section[] = [];
  pages.map((page) => {
    let sectionIdx = sections.findIndex(
      (section) => section.index === page.section.index
    );

    if (sectionIdx === -1) {
      sections.push({
        title: page.section.title || "",
        index: page.section.index,
        chapters: [],
      });
      sectionIdx = sections.length - 1;
    }

    sections[sectionIdx].chapters.push({
      id: page.id,
      last_edited_time: page.last_edited_time,
      title: page.chapter.title || "",
      index: page.chapter.index,
      section_title: page.section.title,
      section_index: page.section.index,
    });
  });

  return sections;
};

export const getSections = async () => {
  try {
    const pages = await fetchAllPages();
    if (!pages) {
      throw new Error("get sections error");
    }
    return convertPagesToSections(pages);
  } catch (e) {
    throw new Error("FETCH SECTION ERROR");
  }
};

export const getSections_V2 = async (pages: ContentPage[]) => {
  try {
    if (!pages) {
      throw new Error("get sections error");
    }
    return convertPagesToSections(pages);
  } catch (e) {
    throw new Error("FETCH SECTION ERROR");
  }
};

export const fetchRecordMap = async (pageID: string) => {
  try {
    const recordMap: ExtendedRecordMap = await recordMapClient.getPage(pageID);
    return recordMap;
  } catch (e) {
    console.log(e);
    throw new Error("FETCH RECORDMAP ERROR");
  }
};
