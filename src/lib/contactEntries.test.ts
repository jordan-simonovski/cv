import { describe, expect, it } from "vitest";

import { buildContactEntries } from "./contactEntries";

describe("buildContactEntries", () => {
  it("falls back to cvData contacts when markdown has no contact entries", () => {
    const entries = buildContactEntries([], {
      email: "jordan.simonovski@gmail.com",
      website: "https://blog.jordansimonov.ski",
      github: "https://github.com/jordan-simonovski",
      linkedin: "https://www.linkedin.com/in/jsimonovski/",
      location: "Blue Mountains, Australia"
    });

    expect(entries).toEqual([
      "Email: [jordan.simonovski@gmail.com](mailto:jordan.simonovski@gmail.com)",
      "Website: [blog.jordansimonov.ski](https://blog.jordansimonov.ski)",
      "GitHub: [github.com/jordan-simonovski](https://github.com/jordan-simonovski)",
      "LinkedIn: [linkedin.com/in/jsimonovski](https://www.linkedin.com/in/jsimonovski/)",
      "Location: Blue Mountains, Australia"
    ]);
  });

  it("prefers markdown contact entries when present", () => {
    const entries = buildContactEntries(
      ["Email: [from-markdown@example.com](mailto:from-markdown@example.com)"],
      {
        email: "jordan.simonovski@gmail.com",
        website: "https://blog.jordansimonov.ski",
        github: "https://github.com/jordan-simonovski",
        linkedin: "https://www.linkedin.com/in/jsimonovski/"
      }
    );

    expect(entries).toEqual(["Email: [from-markdown@example.com](mailto:from-markdown@example.com)"]);
  });
});
