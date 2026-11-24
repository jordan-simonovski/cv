# Resume Site

CV site built with Astro, styled as a Swiss-style annual report, with a matching PDF resume generated at build time.

## Stack

- Astro static site generation, no client-side JavaScript beyond analytics
- Markdown content source in `src/content/cv/resume.md` (frontmatter + sections)
- Navigation derived from the top-level `# Heading {#id}` sections
- `/resume.pdf` generated with pdf-lib from the same content (`src/pages/resume.pdf.ts`)
- Archivo variable font self-hosted in `public/fonts/`

## Local Development

```bash
npm install
npm run dev
```

Open the local URL from Astro output.

## Build and Test

```bash
npm test
npm run build
```

## Update Resume Content

1. Edit `src/content/cv/resume.md`.
2. Keep section anchors in headings (for example: `# Experience {#experience}`).
3. Frontmatter `headline` and `keyFigures` drive the hero and the key-figures row; `experienceSpans` drive the PDF experience section.
4. Experience entries are `## Role - Company (YYYY-MM to YYYY-MM)`; a `<details>` block becomes the expandable full record.

## Print / PDF Export

- `/resume.pdf` is the canonical PDF (Download PDF link in the page header).
- Browser print also works: `src/styles/print.css` hides navigation and expands every full record.

## Deploy on AWS Amplify

1. Push this repo to GitHub.
2. In Amplify Hosting, connect the repository.
3. Select the branch to deploy.
4. Amplify uses `amplify.yml`:
   - `npm ci`
   - `npm run build`
   - publish `dist/`

No backend resources are required.
