"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[540],{1540:function(t,e,n){n.r(e);var r=n(7297),i=n(5893),u=n(6829),c=n(7294);function s(){let t=(0,r.Z)(["\nwidth: 100% !important;\n\n.comments {\n  height: fit-content;\n}\n\n.utterances {\n  margin-left: 0px;\n}\n\n.utterances-frame {\n  position: relative !important;\n  width: var(--notion-max-width);\n}\n"]);return s=function(){return t},t}let l=u.Z.div(s()),o=t=>{let{issueTerm:e}=t,n=(0,c.useRef)(null);return(0,c.useEffect)(()=>{var t;if(console.log("here"),null==n.current)return;console.log("item_count",e,n.current.children.length),n.current.children.length>0&&n.current.removeChild(n.current.children[0]);let r=document.createElement("script"),i=window.localStorage.getItem("theme");r.setAttribute("src","https://utteranc.es/client.js"),r.setAttribute("repo","".concat("swimingkim/comments")),r.setAttribute("issue-term",e),r.setAttribute("label","Comment"),r.setAttribute("theme","dark"==i?"github-dark":"github-light"),r.setAttribute("crossorigin","anonymous"),r.setAttribute("async","true"),null===(t=n.current)||void 0===t||t.appendChild(r)},[e]),(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(l,{id:"comments",children:(0,i.jsx)("div",{className:"utterances-frame",ref:n})})})};e.default=o}}]);