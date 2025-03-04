import { useEffect, useRef } from "react";
import { IOComponent } from "../io-component";
import hljs from "highlight.js/lib/common";
import { UI } from "@composehq/ts-public";

import { CopyCodeButton } from "./CopyCodeButton";

function Code({
  code,
  label,
  description,
  lang,
}: {
  code: string;
  label?: string;
  description?: string;
  lang?: UI.CodeLanguage.LanguageName;
}) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      // Remove the data-highlighted attribute if it exists so that
      // the code is re-highlighted when it changes.
      if (codeRef.current.getAttribute("data-highlighted") === "yes") {
        codeRef.current.removeAttribute("data-highlighted");
      }
      hljs.highlightElement(codeRef.current);
    }
  }, [code]);

  const language = lang
    ? UI.CodeLanguage.NAME_TO_HLJS_CLASSNAME[lang]
    : undefined;

  return (
    <div className="flex flex-col">
      {label && <IOComponent.Label as="p">{label}</IOComponent.Label>}
      {description && (
        <IOComponent.Description as="p">{description}</IOComponent.Description>
      )}
      <div className="rounded-brand overflow-clip relative group">
        <pre>
          <code
            ref={codeRef}
            className={language}
            style={{
              scrollbarWidth: "thin",
            }}
          >
            {code}
          </code>
        </pre>
        <CopyCodeButton code={code} />
      </div>
    </div>
  );
}

export { Code };
