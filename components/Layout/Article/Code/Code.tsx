import style from "./Code.module.scss";

// syntax highlighter
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
// codes
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import c from "react-syntax-highlighter/dist/esm/languages/prism/c";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import cmake from "react-syntax-highlighter/dist/esm/languages/prism/cmake";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import diff from "react-syntax-highlighter/dist/esm/languages/prism/diff";

// themes
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import darcula from "react-syntax-highlighter/dist/esm/styles/prism/darcula";

import {
  CodeCaption,
  CodeWrapper,
  TopBar,
  TopBarLeftCol,
  TopbarRightCol,
  CopyButton,
} from "./Code.style";
import { CodeBlock } from "types/notion";
import { useSnackbar } from "store/SnackbarStore";

SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("c", c);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("cmake", cmake);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("diff", diff);

function copyClipboard(text: string) {
  return window.navigator.clipboard.writeText(text);
}

export default function Code(props: CodeBlock) {
  const {
    block: {
      properties: { title, language, caption: blockCaption },
    },
  } = props;

  const openSnackbar = useSnackbar();

  const code = title.map((it) => it.join("")).join("");
  const caption =
    blockCaption && blockCaption.map((it) => it.join("")).join("");
  let lang = language.at(0)?.at(0);

  if (lang == "C++") lang = "Cpp";

  const onClickCopyCode = async () => {
    await copyClipboard(code);
    openSnackbar({
      message: "복사 되었습니다 ✅",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  };

  return (
    <CodeWrapper>
      <TopBar>
        <TopBarLeftCol>
          <CodeCaption>{lang}</CodeCaption>
        </TopBarLeftCol>
        <TopbarRightCol>
          <CopyButton onClick={onClickCopyCode}>Copy</CopyButton>
        </TopbarRightCol>
      </TopBar>
      <SyntaxHighlighter
        style={darcula}
        showLineNumbers={true}
        language={lang?.toLowerCase()}
        customStyle={{
          marginTop: "0px",
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
        }}
      >
        {code || ""}
      </SyntaxHighlighter>
    </CodeWrapper>
  );
}
