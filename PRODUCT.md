# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- **Recruiters and hiring managers** skimming for role, scale, stack, and availability in under a minute, then downloading the PDF or making contact.
- **Engineering peers** reading for depth: what Jordan built, open source work, community and conference organising.

## Product Purpose

Personal CV site for Jordan Simonovski, a senior/staff platform and observability engineer (currently ClickHouse ClickStack, previously Atlassian Observability). It presents the career record on the web and generates a downloadable PDF resume from the same source. Success: a reader understands who Jordan is, at what scale he has worked, and how to reach him, without friction.

## Positioning

Real, specific scale and ownership: ClickHouse at 100TB/day+, Tempo at 180TB/day, Splunk at 600TB/day, Terraform provider resources taken alpha to stable, OSS tools (helmcov, helmver, heatmap-panel), technical reviewer for *Observability Engineering, 2nd Edition*, organiser of SRECon22 APAC, DevOpsDays Sydney/Wollongong, Monitoring.Sydney.

## Operating Context

- Content lives in `src/content/cv/resume.md` (frontmatter + markdown body); one source feeds the site and the PDF.
- `/resume.pdf` is generated at build time by `src/pages/resume.pdf.ts` with pdf-lib, model built by `src/lib/resumePdf.ts`.
- Readers arrive from LinkedIn, GitHub, recruiter outreach; many will print or download the PDF.

## Capabilities and Constraints

- Astro static site, React islands available, deployed as static output (Amplify config present, Vercel Analytics in use).
- `openToWork` flag drives availability messaging; currently not looking.
- Contact: email, website, GitHub, LinkedIn, Calendly booking link. Phone is "available upon request"; never publish a number.
- PDF must remain text-based and ATS-readable, with working link annotations.

## Brand Commitments

- User-pinned: paper-like, easily readable, light mode.
- Headshot: `src/assets/jordan.*` sourced from the user's provided portrait.
- Voice: plain, first-person-implied, specific numbers, no hype.

## Evidence on Hand

All claims in `resume.md` are user-authored. No testimonials, logos, or synthetic metrics. Earlier "99.98%" / "0.7x delivery profile" metric tiles were decorative and are retired; do not reintroduce invented figures.

## Product Principles

1. The record is the product: content first, chrome last.
2. Skimmable at the top, full depth for anyone who keeps reading.
3. One source, two outputs: web and PDF say the same thing in the same voice.
4. Every number shown is a real number Jordan stands behind.
