import { renderInlineMarkdown } from "./markdown";

export function buildProjectEntries(markdownEntries: string[]): string[] {
  return markdownEntries.map((entry) => renderInlineMarkdown(entry));
}
