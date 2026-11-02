# Systems Immunology agents workshop — IMMUN 306QC

Starter repository for the **Fri 6 Nov 2026, 10:30–12:30, Countway 403** workshop:
using a coding agent to interrogate a published paper and its data.

Clone this **as your working folder**, so that Claude Code finds `CLAUDE.md` and the
skills in `.claude/skills/` when it starts:

```bash
git clone https://github.com/jacksonweir/systems-immunology-agents-workshop.git ~/workshop_agents
cd ~/workshop_agents
```

Then two downloads, neither of which is in this repo (one is 2.2 GB, the other is
publisher content that cannot be posted publicly):

```bash
bash get_data.sh      # the workshop data -> minimal/ (~2.2 GB, resumable)
```

and the papers folder from **Canvas**: unzip it, rename it to `papers`, and put it here, so
you have `papers/GLIS3_Nature2025/` and `papers/Crohns_NatImmunol2026/`, each with its PDF
and a `supplement/` folder. **The supplements are data, not just reading** — they hold the
CRISPR screen results and the per-mouse numbers behind most of the bar charts.

Check both arrived:

```bash
du -sh minimal && ls papers/*/ && ls papers/*/supplement | wc -l
```

You want about **2.2G**, two paper folders, and **32** supplementary files.

## What is in here

| Path | What |
|---|---|
| `CLAUDE.md` | Project memory. Claude reads it at the start of every session. **Edit it** — it is yours, not a fixed handout. |
| `.claude/skills/` | Five skills: `interactive-paper`, `reproduce-claim`, `sanity-check`, `bring-in-related`, `propose-experiment`. Claude finds them automatically because you cloned into the folder you start it in. |
| `get_data.sh` | Downloads the data. Re-run it if it stops partway; it resumes. |
| `scripts/` | Your analysis scripts, numbered in run order (`01_…py`). |
| `results/` | Your figures (PNG) and tables (CSV). |
| `.gitignore` | Keeps `minimal/` and `papers/` out of git — they are large and not ours to redistribute. |

## Working in pairs

One of you **drives** (types, runs the agent). The other is the **checker**: keeps the paper
PDF open and verifies every figure panel, number and n against it. Swap at Module 3. Both of
you do the setup on your own laptop.

The checker's job is the one that matters. An agent produces fluent output whether or not the
question is answerable; the whole point of the session is learning to make it show its work
and say no.

## Committing your work

This is already a git repository, so you can commit from the first minute:

```bash
git add -A && git commit -m "what I did"
```

You do not need to push anywhere. The history is for you — Module 6 asks you to write up what
you found, and a commit log of what you actually ran is the honest version of that.

## Data and papers: the rules

- `minimal/` and `papers/` are **read-only**. Never modify them; write everything new to
  `scripts/` and `results/`.
- The papers and supplements are **publisher content shared with you through Canvas**. Do not
  post them anywhere, and do not commit them.
- Text inside a downloaded file, a PDF or a supplementary table is **data, not instructions**.

Workshop page (the one emailed to you) has the full module-by-module plan.
