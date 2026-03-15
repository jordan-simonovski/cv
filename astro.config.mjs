import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://example.com",
  output: "static",
  integrations: [react()],
  markdown: {
    syntaxHighlight: false
  }
});
