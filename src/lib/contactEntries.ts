type ContactFallback = {
  email: string;
  website: string;
  github: string;
  linkedin: string;
  location?: string;
};

function toDisplayUrl(rawUrl: string): string {
  return rawUrl.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

export function buildContactEntries(markdownEntries: string[], fallback: ContactFallback): string[] {
  if (markdownEntries.length > 0) {
    return markdownEntries;
  }

  const entries = [
    `Email: [${fallback.email}](mailto:${fallback.email})`,
    `Website: [${toDisplayUrl(fallback.website)}](${fallback.website})`,
    `GitHub: [${toDisplayUrl(fallback.github)}](${fallback.github})`,
    `LinkedIn: [${toDisplayUrl(fallback.linkedin)}](${fallback.linkedin})`
  ];

  if (fallback.location) {
    entries.push(`Location: ${fallback.location}`);
  }

  return entries;
}
