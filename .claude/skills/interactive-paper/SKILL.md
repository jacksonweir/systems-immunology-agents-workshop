---
name: interactive-paper
description: Turn a published paper (PDF + supplements in papers/) into an interactive paper - a local HTML page listing the paper's key claims, the evidence and data behind each, and a log of questions asked and answered. Use when asked to make, build or update the interactive paper, or after any analysis that tests a claim from the paper.
---

# Interactive paper

Goal: one page (`paper.html` + `paper_data.js` in the project folder) that a reader can
open in a browser to see what the paper claims, how each claim was tested, and what we found.

## Build it

1. Read the paper PDF in `papers/` (main text, figure legends, Methods, Extended Data
   legends). Use `pdftotext` if available, otherwise Python (`pypdf`).
2. Extract **8-12 key claims**, one per main result. For each record:
   - `id` (C1, C2 ...), `claim` (one sentence, in the paper's terms), `figure` (e.g. "Fig. 1c, ED Fig. 2e")
   - `method` the paper used (test, n, unit of replication, threshold), quoted or paraphrased from Methods
   - `data`: which file could test it, or "not in workshop data". Look in **both** places:
     `minimal/` for the h5ads and bulk tables, and `papers/<paper>/supplement/` for the
     supplementary tables. The supplements are easy to forget and often carry the per-animal
     source data behind a bar chart, which makes an in vivo claim checkable when the figure
     looked like an image.
   - `status`: "not tested" to start
3. Add a `samples` section: for each dataset, n donors/mice/samples per group and what else
   differs between groups (study, tissue, enrichment). Read it from `obs`, not from the paper.
4. Write `paper_data.js` declaring exactly one global, `const PAPER = {...}`, with fields
   `title, doi, updated, summary, claims[], samples[], questions[]`.
5. Write `paper.html` that loads `paper_data.js` with `<script src>` and renders: a header,
   the claims table (colour-coded status), the samples table, and the questions log. No
   external libraries or CDN links (the page must work offline). Keep the HTML generic and
   put all content in the data file, so updates only touch `paper_data.js`.
6. Check it: `node -e "require('./paper_data.js')"` will not work for a `const`; instead run
   `node -e "const fs=require('fs');eval(fs.readFileSync('paper_data.js','utf8')+';console.log(PAPER.claims.length)')"`.

## Update it

After each analysis, update the claim's `status` ("reproduces", "partly", "does not",
"cannot test with this data"), add `our_result` (numbers with n), `files` (script + figure
paths) and `caveats`. Add each question asked to `questions[]` with `asked`, `found`,
`cannot_support`, `files`. Never upgrade a status without a result file to point to.
