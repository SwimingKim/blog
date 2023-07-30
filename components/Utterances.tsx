import styled from "@emotion/styled";
import { url } from "inspector";
import { useEffect, useRef, useState } from "react"

const CommentRoot = styled.div`
width: 100% !important;

.comments {
  height: fit-content;
}

.utterances {
  margin-left: 0px;
}

.utterances-frame {
  position: relative !important;
  width: var(--notion-max-width);
}
`

const Utterances: React.FC = () => {

  const scriptElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scriptElement.current?.children.length != 0) return;

    const script = document.createElement("script")
    const savedTheme = window.localStorage.getItem("theme");
    const theme = savedTheme == "dark" ? "github-dark" : "github-light"
    const issue_url = window.location.pathname;

    script.setAttribute("src", "https://utteranc.es/client.js")
    script.setAttribute("repo", `${process.env.COMMENT_REPOSITORY}`)
    script.setAttribute("issue-term", issue_url)
    script.setAttribute("label", "Comment")
    script.setAttribute("theme", theme)
    script.setAttribute("crossorigin", "anonymous")
    script.setAttribute("async", `true`)

    scriptElement.current?.appendChild(script)
  }, [])
  
  return (
    <>
      <CommentRoot id="comments">
        <div className="utterances-frame" ref={scriptElement}></div>
      </CommentRoot>
    </>
  )
}

export default Utterances
