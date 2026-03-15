import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const cv = defineCollection({
  loader: glob({ base: "./src/content/cv", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    role: z.string(),
    location: z.string(),
    email: z.string().email(),
    website: z.string().url(),
    github: z.string().url(),
    linkedin: z.string().url(),
    openToWork: z.boolean(),
    availability: z.string(),
    timezone: z.string(),
    workMode: z.string(),
    responseSla: z.string(),
    updatedAt: z.string(),
    experienceSpans: z.array(
      z.object({
        id: z.string(),
        service: z.string(),
        role: z.string(),
        start: z.string(),
        end: z.string(),
        status: z.enum(["ok", "warn", "critical"]),
        summary: z.string(),
        pdfSummary: z.string().optional(),
        highlights: z.array(z.string()),
        pdfHighlights: z.array(z.string()).optional(),
        stack: z.array(z.string()),
        children: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            status: z.enum(["ok", "warn", "critical"]),
            startOffset: z.number(),
            endOffset: z.number(),
            detail: z.string()
          })
        )
      })
    )
  })
});

export const collections = { cv };
