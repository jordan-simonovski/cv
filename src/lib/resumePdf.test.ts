import { describe, expect, it } from "vitest";

import { buildResumePdfModel } from "./resumePdf";

describe("buildResumePdfModel", () => {
  it("extracts summary, skills, and merged experience highlights for PDF", () => {
    const markdown = [
      "# Summary {#summary}",
      "",
      "Staff engineer building high-scale observability systems.",
      "",
      "# Core Skills {#skills}",
      "",
      "- OpenTelemetry",
      "- Kubernetes",
      "",
      "# Experience {#experience}",
      "",
      "Some fallback text."
    ].join("\n");

    const model = buildResumePdfModel(
      {
        title: "Jordan Simonovski",
        role: "Staff Software Engineer",
        location: "Blue Mountains, Australia",
        email: "jordan.simonovski@gmail.com",
        website: "https://jordansimonov.ski",
        github: "https://github.com/jordan-simonovski",
        linkedin: "https://www.linkedin.com/in/jsimonovski/",
        experienceSpans: [
          {
            id: "a",
            service: "Atlassian",
            role: "Staff Software Engineer",
            start: "2020-05",
            end: "Present",
            status: "ok",
            summary: "Ran observability infra.",
            pdfSummary: "Led observability platform strategy for distributed systems.",
            highlights: [
              "Scaled Tempo to 180TB/day.",
              "Improved MTTR.",
              "Drove cross-team observability standards."
            ],
            pdfHighlights: ["Reduced alert fatigue by 35%.", "Improved incident triage speed."],
            stack: [],
            children: []
          }
        ]
      },
      markdown
    );

    expect(model.summary).toContain("high-scale observability");
    expect(model.skills).toEqual(["OpenTelemetry", "Kubernetes"]);
    expect(model.experiences[0]?.summary).toBe(
      "Led observability platform strategy for distributed systems."
    );
    expect(model.experiences[0]?.highlights).toEqual([
      "Reduced alert fatigue by 35%.",
      "Improved incident triage speed.",
      "Scaled Tempo to 180TB/day.",
      "Improved MTTR.",
      "Drove cross-team observability standards."
    ]);
    expect(model.experiences[0]?.range).toBe("May 2020 - Present");
    expect(model.contact.email).toBe("jordan.simonovski@gmail.com");
  });

  it("falls back to regular summary and highlights when pdf-specific fields are missing", () => {
    const model = buildResumePdfModel(
      {
        title: "Jordan Simonovski",
        role: "Staff Software Engineer",
        location: "Blue Mountains, Australia",
        email: "jordan.simonovski@gmail.com",
        website: "https://jordansimonov.ski",
        github: "https://github.com/jordan-simonovski",
        linkedin: "https://www.linkedin.com/in/jsimonovski/",
        experienceSpans: [
          {
            id: "fallback",
            service: "Consulting",
            role: "Senior SRE",
            start: "2019-06",
            end: "2021-12",
            summary: "Stabilized services through better observability.",
            highlights: ["Cut paging noise by 38%.", "Automated incident workflows."],
            stack: [],
            children: []
          }
        ]
      },
      "# Summary {#summary}\n\nFallback summary\n\n# Core Skills {#skills}\n\n- OpenTelemetry"
    );

    expect(model.experiences[0]?.summary).toBe("Stabilized services through better observability.");
    expect(model.experiences[0]?.highlights).toEqual([
      "Cut paging noise by 38%.",
      "Automated incident workflows."
    ]);
    expect(model.experiences[0]?.range).toBe("Jun 2019 - Dec 2021");
  });

  it("does not truncate highlight lists for PDF output", () => {
    const model = buildResumePdfModel(
      {
        title: "Jordan Simonovski",
        role: "Staff Software Engineer",
        location: "Blue Mountains, Australia",
        email: "jordan.simonovski@gmail.com",
        website: "https://jordansimonov.ski",
        github: "https://github.com/jordan-simonovski",
        linkedin: "https://www.linkedin.com/in/jsimonovski/",
        experienceSpans: [
          {
            id: "long",
            service: "Atlassian",
            role: "Staff Software Engineer",
            start: "2020-05",
            end: "Present",
            summary: "Observability leadership at scale.",
            highlights: ["A", "B", "C", "D", "E", "F"],
            stack: [],
            children: []
          }
        ]
      },
      "# Summary {#summary}\n\nFallback summary\n\n# Core Skills {#skills}\n\n- OpenTelemetry"
    );

    expect(model.experiences[0]?.highlights).toEqual(["A", "B", "C", "D", "E", "F"]);
  });

  it("extracts phone from contact section when present", () => {
    const markdown = [
      "# Summary {#summary}",
      "",
      "Fallback summary.",
      "",
      "# Skills & Other {#skills}",
      "",
      "- AWS",
      "",
      "# Contact {#contact}",
      "",
      "- Phone: +61 451 309 913",
      "- Email: [jordan.simonovski@gmail.com](mailto:jordan.simonovski@gmail.com)",
      "- Website: [blog.jordansimonov.ski](https://blog.jordansimonov.ski)"
    ].join("\n");

    const model = buildResumePdfModel(
      {
        title: "Jordan Simonovski",
        role: "Cloud Engineering Lead",
        location: "Blue Mountains, Australia",
        email: "jordan.simonovski@gmail.com",
        website: "https://blog.jordansimonov.ski",
        github: "https://github.com/jordan-simonovski",
        linkedin: "https://www.linkedin.com/in/jsimonovski/",
        experienceSpans: []
      },
      markdown
    );

    expect(model.contact.phone).toBe("+61 451 309 913");
  });

  it("extracts side quest headings from projects section", () => {
    const markdown = [
      "# Summary {#summary}",
      "",
      "Fallback summary.",
      "",
      "# Core Skills {#skills}",
      "",
      "- OpenTelemetry",
      "",
      "# Side Quests {#projects}",
      "",
      "## K8s Cost and Reliability Control Plane",
      "",
      "- Reduced failed rollout blast radius.",
      "",
      "## Incident Triage Copilot for Observability Workflows",
      "",
      "- Improved time-to-first-query.",
      ""
    ].join("\n");

    const model = buildResumePdfModel(
      {
        title: "Jordan Simonovski",
        role: "Cloud Engineering Lead",
        location: "Blue Mountains, Australia",
        email: "jordan.simonovski@gmail.com",
        website: "https://blog.jordansimonov.ski",
        github: "https://github.com/jordan-simonovski",
        linkedin: "https://www.linkedin.com/in/jsimonovski/",
        experienceSpans: []
      },
      markdown
    );

    expect(model.sideQuests).toEqual([
      "K8s Cost and Reliability Control Plane",
      "Incident Triage Copilot for Observability Workflows"
    ]);
  });
});
