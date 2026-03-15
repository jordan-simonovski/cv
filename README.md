# Observability Resume Site

Interactive CV site built with Astro, React islands, Mermaid+D3 diagrams, and AWS Amplify deployment.

## Stack

- Astro static site generation
- React islands for interactive UI
- D3 + Mermaid runtime architecture diagrams
- Markdown content source in `src/content/cv/resume.md`
- JSON-driven navbar config in `src/config/navigation.json`

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
3. Use fenced code blocks for interactive code cards:

   ~~~md
   ```ts
   const hello = "world";
   ```
   ~~~

4. Use fenced mermaid blocks for interactive architecture diagrams:

   ~~~md
   ```mermaid
   flowchart TD
     A --> B
   ```
   ~~~

## Update Navigation Links

Edit `src/config/navigation.json`:

- Anchor links must start with `#`.
- External links must use `https://`, `http://`, or `mailto:`.

Validation runs at page load via `validateNavigation()`.

## Print / PDF Export

- Open the built site in browser.
- Use print (`Cmd+P`) and save as PDF.
- `src/styles/print.css` removes motion controls, simplifies colors, and improves page breaks.

## Deploy on AWS Amplify

1. Push this repo to GitHub.
2. In Amplify Hosting, connect the repository.
3. Select the branch to deploy.
4. Amplify uses `amplify.yml`:
   - `npm ci`
   - `npm run build`
   - publish `dist/`

No backend resources are required.
