import { useEffect } from "react"

//TODO: useRef?

type Props = {
  issueTerm: string
}

const Utterances: React.FC<Props> = () => {
  useEffect(() => {
    const theme = "preferred-color-scheme"
    const script = document.createElement("script")
    const anchor = document.getElementById("comments")
    if (!anchor) return

    script.setAttribute("src", "https://utteranc.es/client.js")
    script.setAttribute("repo", "swimingkim/comments")
    script.setAttribute("issue-term", "pathname")
    script.setAttribute("label", "Comment")
    script.setAttribute("theme", theme)
    script.setAttribute("crossorigin", "anonymous")
    script.setAttribute("async", `true`)
    // const config: { [key: string]: string } = CONFIG.utterances.config
    // Object.keys(config).forEach((key) => {
    //   script.setAttribute(key, config[key])
    // })
    anchor.appendChild(script)
    return () => {
      anchor.innerHTML = ""
    }
  })
  return (
    <>
      {/* <h2>Hello World</h2> */}
      <div id="comments" className="md:-ml-16">
        {/* <script src="https://utteranc.es/client.js"
          repo="swimingkim/comments"
          issue-term="url" 
          theme="preferred-color-scheme"
          crossorigin="anonymous"
          async>
        </script> */}
        <div className="utterances-frame"></div>
      </div>
    </>
  )
}

export default Utterances
