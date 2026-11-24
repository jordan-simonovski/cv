---
name: Jordan Simonovski — Curriculum Vitae
description: A career record set as a Swiss-style annual report, on the web and in a matching PDF.
colors:
  ultramarine: "#1f3fd1"
  uncoated-paper: "#f4f3ef"
  press-ink: "#15171c"
  body-ink: "#393d46"
  margin-grey: "#5b5f68"
  soft-rule: "#d5d3cc"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(3.25rem, 7.4vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 78"
  figure:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(3rem, 5.4vw, 4.75rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 70"
    fontFeature: "'tnum'"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 1.9vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.3
  title:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 85"
  subtitle:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 600
    lineHeight: 1.3
  lead:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.1875rem, 1.6vw, 1.4375rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "'tnum'"
  label:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.6
  caption:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: "0px"
spacing:
  gutter: "clamp(16px, 4.4vw, 64px)"
  col-gap: "clamp(16px, 1.7vw, 24px)"
  rule-to-label: "18px"
  entry: "36px"
  section: "clamp(56px, 7vw, 96px)"
  figures: "clamp(48px, 6vw, 80px)"
  colophon: "clamp(72px, 9vw, 128px)"
components:
  running-head:
    backgroundColor: "{colors.uncoated-paper}"
    textColor: "{colors.press-ink}"
    typography: "{typography.label}"
    height: "56px"
  section-title:
    textColor: "{colors.press-ink}"
    typography: "{typography.label}"
  figure-value:
    textColor: "{colors.press-ink}"
    typography: "{typography.figure}"
  entry-company:
    textColor: "{colors.press-ink}"
    typography: "{typography.title}"
  entry-range:
    textColor: "{colors.margin-grey}"
    typography: "{typography.label}"
  entry-role-current:
    textColor: "{colors.ultramarine}"
  disclosure-summary:
    textColor: "{colors.press-ink}"
    typography: "{typography.label}"
    padding: "6px 0"
  link:
    textColor: "{colors.ultramarine}"
---

# Design System: Jordan Simonovski — Curriculum Vitae

## Overview

**Creative North Star: "The Swiss Annual Report"**

The career is typeset like a corporate annual report from the Zurich school: one grotesk in several widths, a strict 12-column grid, a margin index column that carries numbered section labels, and real figures set large enough to read as a fact. The page is light, paper-like and quiet. Structure comes from hairline ink rules and grid position, never from containers.

Density is editorial rather than dashboard: generous vertical air between sections, long measures held to 60–68ch, and a single ultramarine that marks only what is live (links, the current role, open availability). The same system is set a second time as an A4 PDF, so the downloaded resume reads as the printed edition of the web page.

**Key Characteristics:**
- Uncoated cool off-white stock with a 5% fractal-noise tooth, ink near-black text.
- Archivo variable, width as hierarchy: condensed for the name, figures and company names; normal width for reading.
- Margin index column (cols 1–3) holds numbered section labels `01`–`07`; content starts at col 4.
- Every section opens on a 1px ink rule; inner divisions use a soft rule.
- Nothing is enclosed: no cards, boxes, pills, shadows, gradients or radii.

## Colors

A near-monochrome print palette with one rationed ink colour.

### Primary
- **Ultramarine**: The only chromatic colour. Links, the current role line, the open-to-work fact when true, the emphasised product in the hero headline, text selection, and focus rings. In the PDF it marks link text and the current role.

### Neutral
- **Uncoated Paper**: Page ground, running-head ground (94% mixed with transparency over a 6px blur), favicon ground, `theme-color`.
- **Press Ink**: Headings, the name, figures, running head, and every structural rule (section tops, running-head base, colophon rule, list dashes).
- **Body Ink**: Long-form prose in the record; slightly softer than headings so headings rank without size inflation.
- **Margin Grey**: Index numerals, dates, figure labels, hero facts, captions, contact terms, colophon, disclosure counts.
- **Soft Rule**: Secondary hairlines only: between experience entries, contact rows, code blocks, and the mobile nav strip.

### Named Rules
**The Colour By Role Rule.** Ultramarine means "live or current": a link, the present role, open availability. It never decorates headings, rules, figures or backgrounds.

**The Two Rules Rule.** Press Ink rules divide sections; Soft Rule divides items within a section. A third rule weight or colour is not part of the system.

## Typography

**Display Font:** Archivo variable (wght 100–900, wdth 62–125%), self-hosted as `archivo-latin.woff2` (with Helvetica Neue, Helvetica, Arial)
**Body Font:** Archivo at normal width (100%)

**Character:** One grotesk carries everything; rank is made with width and weight, not a second family. Tabular numerals are on globally so dates and figures align.

### Hierarchy
- **Display** (700, wdth 78%, clamp 3.25–6rem, lh 0.92, -0.025em): The name only, one word per line, cols 4–10.
- **Figure** (600, wdth 70%, clamp 3–4.75rem, lh 1): Key-figure values; the unit sits at 0.4em, weight 500, tracking 0.
- **Headline** (400, clamp 1.25–1.625rem, lh 1.3, balanced): Hero role line.
- **Lead** (400, clamp 1.1875–1.4375rem, lh 1.5, Press Ink): The Profile section, max 60ch.
- **Title** (700, wdth 85%, 1.625rem, lh 1.15): Company names in the experience ledger.
- **Subtitle** (600, 1.3125rem, lh 1.3): h3 inside prose (side quests).
- **Body** (400, 1.0625rem, lh 1.6): The record, Body Ink, max 68ch.
- **Label** (700 for titles, 400 for meta, 0.875rem): Section titles, running head, dates, figure labels. Sentence case, no tracking.
- **Caption** (400, 0.75rem, lh 1.4, Margin Grey): The "Fig. 1" plate caption.

### Named Rules
**The Width Is Rank Rule.** Condense to rank (name 78%, figures 70%, companies 85%); read at 100%. Never condense running text.

**The Sentence Case Rule.** Labels are sentence case at label size, distinguished by weight and grid position. No uppercase tracking.

## Layout

A 12-column grid (`repeat(12, minmax(0, 1fr))`) inside a 1440px shell with a fluid gutter and fluid column gap. Columns are assigned by role:

- **Cols 1–3, the margin index:** running-head name, hero meta ("Curriculum vitae / Updated"), numbered section titles.
- **Cols 4–10, the text column:** name, headline, facts, links, prose bodies (max 68ch).
- **Cols 11–12, the outer margin:** portrait plate, Download PDF, experience dates.
- **Full width (cols 4–12):** Profile, Skills (three columns of min 22ch), and the experience ledger, which uses subgrid so entry text runs cols 4–10 and dates sit in cols 11–12.
- **Key figures:** four figures at span 3 each, beneath a full-width ink rule.

Vertical rhythm: sections are separated by clamp(56–96px) and open with a 1px ink rule plus 18px to the label; experience entries 36px apart with 32px above a soft rule; colophon clamp(72–128px) below the last section.

Responsive: at ≤1100px the nav drops to its own horizontally scrolling strip under the head (soft-rule top, right-edge fade mask) and figures go 2-up. At ≤820px the grid collapses to one column; the portrait shrinks to a 112px plate placed first, hero meta moves below the links, section titles rise to 1.3125rem above their body, figures stay 2-up, dates drop under the company name, contact rows stack.

### Named Rules
**The Rank By Span Rule.** Importance is shown by column span and position, not by size jumps or containers: index in the margin, record in the text column, dates and portrait in the outer margin.

## Elevation & Depth

Flat. No box-shadows anywhere. Depth is limited to two material cues: the paper tooth (fixed 5% fractal-noise layer behind the page) and the sticky running head, which is Uncoated Paper at 94% over a 6px backdrop blur with a 1px ink base rule.

### Named Rules
**The Flat Stock Rule.** The page is one sheet of paper. Nothing lifts off it; separation is a rule or a gap.

## Shapes

Square everywhere (0 radius): the portrait plate is a hard-edged 4:5 crop (object-position 50% 30%), rules are 1px hairlines, list bullets are 0.55em ink dashes, and the disclosure marker is a drawn 11px plus built from two 1.5px bars. The only rounding is the 1px corner on focus outlines.

### Named Rules
**The Nothing Enclosed Rule.** No element sits inside a box, card, pill or chip. Groupings are made by a rule above and a grid column, never a border around.

## Components

### Running Head
Sticky, 56px tall (96px at mobile, two rows), label size. Name bold in cols 1–3; numbered section nav in cols 4–10 with Margin Grey numerals and Press Ink labels that turn Ultramarine on hover; "Download PDF" in cols 11–12, Ultramarine 600 with an inline 14px stroked download arrow, underline on hover.

### Hero
Margin meta in cols 1–3 (bold "Curriculum vitae", grey updated date). Display name cols 4–10. Portrait plate cols 11–12 spanning all hero rows, with a "Fig. 1 — name, place" caption. Headline cols 4–9 with the current product in Ultramarine (no italics). Facts row in Margin Grey at 0.9375rem; links row in 600 Ultramarine with underlines.

### Key Figures
Full-width ink rule, bold "Key figures" label, then four Figure-style values with small units and grey labels capped at 26ch. Only real, user-authored figures.

### Numbered Sections
Ink rule, label in the margin index as `01 Profile` (grey numeral, min 2.1em wide, then bold title), body from col 4. Prose lists use ink dashes, not bullets; inline code is the body face at 600, not a monospace.

### Experience Ledger
Subgrid entries: company in Title style, role line 600 (Ultramarine when current), dates right in cols 11–12 in Margin Grey label size, aligned on baseline. Soft rule between entries.

### Full-Record Disclosure
Native `<details>`: summary is label-size 600 Press Ink with a drawn plus that rotates 45° to a cross (300ms, cubic-bezier(0.16, 1, 0.3, 1)) and a grey item count. Content height animates via `::details-content` (420ms, same ease). It is the page's one authored motion; reduced-motion removes it. In print, every disclosure is forced open and the summary hidden.

### Contact List
Definition list, grey term / ink value in a 1fr : 3fr grid, 10px rows divided by soft rules; values are links and wrap anywhere.

### Colophon
Ink hairline across, then a grey label-size line (name, place, updated) and a "Download the PDF" link pushed right.

### Links
Ultramarine, 1px underline at 0.2em offset, thickening to 2px on hover (160ms). Focus: 2px Ultramarine outline, 3px offset.

### PDF Edition
`/resume.pdf` is the same system set on A4 with pdf-lib, text-based for ATS:
- Same palette as RGB equivalents, same section numbering, titles and order as the web.
- Static Archivo instances embedded and subset: a condensed bold for the name (32pt), a condensed figure cut for key figures (26pt with 9pt units), regular and semibold for text.
- 44pt margins; a 104pt margin index column holds `01 Profile`-style labels (grey numeral, bold label, 8pt); text column beside it at 9pt on 1.4 leading.
- Each section opens on a 0.6pt ink rule. Key figures run four across beneath a rule.
- Masthead: name, headline, an Ultramarine contact line with working link annotations, grey location line, 64×80pt square-cropped portrait top right.
- Experience: company 10.5pt semibold, dates right-aligned grey, role semibold (Ultramarine when current), ink-dash bullets. Continuation pages carry a running head (name, "Curriculum Vitae", ink rule); folios "n / N" bottom right.

## Do's and Don'ts

### Do:
- **Do** place every new block on the 12-column grid by role: labels cols 1–3, reading text cols 4–10, dates and plates cols 11–12.
- **Do** open every section with a 1px Press Ink rule and a numbered label in the margin index.
- **Do** rank with Archivo width and weight (78% name, 70% figures, 85% companies) before reaching for size.
- **Do** keep Ultramarine to links, the current role and open availability.
- **Do** change the web and the PDF together: same sections, numbering, order and palette.
- **Do** keep reading measures at 60–68ch and numerals tabular.

### Don't:
- **Don't** use cards, boxes, pills, chips, shadows, gradients or rounded corners.
- **Don't** add a second typeface or a monospace; inline code stays in Archivo at 600.
- **Don't** colour headings, rules, figures or backgrounds with Ultramarine.
- **Don't** add uppercase tracked labels above headings; labels live in the margin column in sentence case.
- **Don't** add motion beyond link underlines, nav hover colour and the full-record disclosure.
- **Don't** introduce dark mode; the system is light, paper-only.
