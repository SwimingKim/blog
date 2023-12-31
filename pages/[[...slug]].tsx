import { getSections, fetchRecordMap, getSections_V2 } from "lib/notion";
import { GetStaticProps } from "next";
import { Section } from "types/content";
import { ExtendedRecordMap } from "notion-types";
import Layout from "../components/Layout/index";
import { createContext, useEffect } from "react";
import { getPageTitle } from "notion-utils";
import config from "config/config.json";
import OpenGraphHead from "components/OpenGraphHead";
import { fetchAllPages } from "../lib/notion";
import { pageViewGA } from "../hooks/usePageViewEffect";
import { useRouter } from "next/router";
import { ContentPage } from "types/notion";

interface Props {
  pageID: string;
  sections: Section[];
  recordMap: ExtendedRecordMap;
  pageTitle?: string;
  currentSection?: Section;
}

interface PageContextData extends Props {
  currentSection?: Section;
}

export const PageContext = createContext<PageContextData>(null as any);

let loaded_pages = [] as ContentPage[];
export default function Page(props: Props) {
  const router = useRouter();
  const { pageID, sections, pageTitle, currentSection } = props;

  if (sections) {
    sections.sort((a, b) => a.index - b.index);
    sections.forEach((section) => {
      section.chapters.sort((a, b) => a.index - b.index);
    });
  }

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;
    pageViewGA({
      pagePath: `/${pageID}`,
      pageTitle: pageTitle,
    });
  }, [router.asPath]);

  return (
    <PageContext.Provider value={{ ...props, currentSection }}>
      <OpenGraphHead title={pageTitle} />
      <Layout />
    </PageContext.Provider>
  );
}

export const getStaticPaths = async () => {
  const renderMode = config.renderMode as "SSG" | "ISR" | "PRE_ISR";
  if (true) {
  // if (renderMode === "SSG" || renderMode === "PRE_ISR") {
    try {
      await loadPages();
      
      let pages = loaded_pages;
      const paths = pages.map((page) => ({ params: { slug: [page.id] } }));
      paths.push({
        params: {
          slug: ["index"]
        }
      })
      return {
        fallback: renderMode === "SSG" ? false : "blocking",
        paths:paths,
      };
    } catch (err) {
      // when fetchPage is failed running like ISR
      console.log(`fetchPage failed: ${err}`);
      console.log(`run like ISR`);
      return {
        fallback: "blocking",
        paths: [],
      };
    }
  }
  // default rendermode is ISR
  return {
    paths: [],
    fallback: "blocking",
  };
};

function isRejected<T>(
  req: PromiseSettledResult<T>
): req is PromiseRejectedResult {
  return req.status === "rejected";
}

const loadPages = async () => {
  if (loaded_pages.length == 0) {
    loaded_pages = await fetchAllPages();
    console.log(`pre-render page count : ${loaded_pages.length}`);
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params as { slug?: string[] };

  await loadPages();

  const homePageID = process.env.NOTION_HOMEPAGE_ID as string;
  let pageID = Array.isArray(slug) ? slug[0] : homePageID;
  if (pageID.indexOf("index") != -1) pageID = homePageID;

  const isContentPage = Array.isArray(slug) && slug.length === 1;

  const [sectionsReq, recordMapReq] = await Promise.allSettled([
    getSections_V2(loaded_pages),
    fetchRecordMap(pageID),
  ]);

  const sections = isRejected(sectionsReq) ? [] : sectionsReq.value;
  const recordMap = isRejected(recordMapReq) ? null : recordMapReq.value;

  let currentSection: Section | null = null;
  if (sections && isContentPage) {
    currentSection =
      sections.find((section) => {
        return (
          section.chapters.findIndex((chapter) => chapter.id === pageID) !== -1
        );
      }) || null;
  }

  let chapterTitle: string | undefined;
  if (recordMap) {
    chapterTitle = getPageTitle(recordMap);
  }

  let pageTitle: string | null = null;
  if (chapterTitle) {
    pageTitle = `${chapterTitle} - ${config.site}`;
  }

  if (currentSection) {
    pageTitle = `${chapterTitle} - ${currentSection.title}`;
  }

  return {
    props: {
      pageID: pageID || "index",
      pageTitle: pageTitle,
      currentSection: currentSection,
      sections: sections,
      recordMap: recordMap,
      // slug: slug,
    },
    revalidate: 1,
  };
};
