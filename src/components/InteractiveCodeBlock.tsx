import { useMemo, useState } from "react";
import Prism from "prismjs";

import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-bash";

type Props = {
  language: string;
  code: string;
};

const MAX_LINES = 12;

export default function InteractiveCodeBlock({ language, code }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");
  const clipped = !expanded && lines.length > MAX_LINES;
  const displayedCode = clipped ? lines.slice(0, MAX_LINES).join("\n") : code;

  const highlighted = useMemo(() => {
    const grammar = Prism.languages[language] || Prism.languages.plain;
    return Prism.highlight(displayedCode, grammar, language);
  }, [displayedCode, language]);

  async function copyCode(): Promise<void> {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <section className="code-card">
      <header className="code-card-header">
        <div className="code-meta">
          <strong>{language || "text"}</strong>
          <span>{lines.length} lines</span>
        </div>
        <div className="code-actions">
          <button type="button" onClick={copyCode}>
            {copied ? "Copied" : "Copy"}
          </button>
          {lines.length > MAX_LINES ? (
            <button type="button" onClick={() => setExpanded((value) => !value)}>
              {expanded ? "Collapse" : "Expand"}
            </button>
          ) : null}
        </div>
      </header>
      <pre className="code-pre">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </section>
  );
}
