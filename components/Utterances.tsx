import styled from "@emotion/styled";
import { url } from "inspector";
import { useEffect, useRef, useState } from "react"

type Props = {
  issueTerm: string
}

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

const Utterances: React.FC<Props> = ({ issueTerm }) => {

  const scriptElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("here")
    if (scriptElement.current == null) return;
    console.log("item_count", issueTerm, scriptElement.current.children.length)

    if (scriptElement.current.children.length > 0) {
      scriptElement.current.removeChild(scriptElement.current.children[0]);
    }

    const script = document.createElement("script")
    const savedTheme = window.localStorage.getItem("theme");
    const theme = savedTheme == "dark" ? "github-dark" : "github-light"

    script.setAttribute("src", "https://utteranc.es/client.js")
    script.setAttribute("repo", `${process.env.COMMENT_REPOSITORY}`)
    script.setAttribute("issue-term", issueTerm)
    script.setAttribute("label", "Comment")
    script.setAttribute("theme", theme)
    script.setAttribute("crossorigin", "anonymous")
    script.setAttribute("async", `true`)

    scriptElement.current?.appendChild(script)
  }, [issueTerm])
  
  return (
    <>
      <CommentRoot id="comments">
        <div className="utterances-frame" ref={scriptElement}></div>
      </CommentRoot>
    </>
  )
}

export default Utterances
