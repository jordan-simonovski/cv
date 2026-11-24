import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://jordansimonov.ski",
  output: "static",
  markdown: {
    syntaxHighlight: false
  }
});
