---
name: reproduce-claim
description: Reproduce one quantitative result or figure from the paper using the workshop data. Use when asked to reproduce, replicate, check or test a specific claim, figure panel or number from the paper.
---

# Reproduce a claim

1. **Restate the claim** in one sentence and quote the paper's method for it: statistical
   test, n, unit of replication, threshold (from Methods or the figure legend, with page).
2. **Find the data**: which file and which `obs` columns. Open with `backed="r"` and print
   the relevant columns' value counts before any analysis.
3. **Count samples per group** at the paper's unit of replication (donor / biosample / mouse),
   and compare with the n the paper reports. Report any mismatch and the likely reason.
4. **Say how our method differs** from the paper's if we cannot use the exact method (for
   example scCODA with SMC reference vs proportions within fibroblasts). Choose a test at
   the sample level, not the cell level, unless the paper itself tests cells.
5. **Write the script** to `scripts/NN_<short_name>.py`, run it, save a table to
   `results/` and one figure that shows the per-sample values (points, not just bars).
6. **Verdict**: "reproduces", "partly", "does not", or "cannot test". Give the paper's number
   next to ours, with n. List what could make our version wrong.
7. Update the interactive paper (skill: interactive-paper) and commit.
