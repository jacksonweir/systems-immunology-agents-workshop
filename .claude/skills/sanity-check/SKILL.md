---
name: sanity-check
description: Visual and numerical sanity checks on a dataset or a result before trusting it - cell and sample counts, marker genes per cell type, per-sample distributions, positive and negative controls. Use before any analysis of a new file, and after any result that looks surprising or too clean.
---

# Sanity check

Run these, save each plot to `results/check_<name>.png`, and summarise in 5 lines.

1. **What is in the file**: shape, `obs` columns, value counts of each categorical column,
   counts per donor x group. Is `X` integer counts?
2. **Cell types look like themselves**: dot plot of 2-3 known markers per cell type
   (e.g. IAFs: IL11, MMP3, CHI3L1; ADAMDEC1+: ADAMDEC1; activated macrophages: IL1B, FCN1).
   If a label does not express its markers, stop and say so.
3. **Positive control**: a result that must be true (e.g. IAF fraction higher in inflamed
   than non-inflamed tissue). If the positive control fails, do not interpret anything else.
4. **Negative control**: a comparison that should show nothing (e.g. a housekeeping gene, or
   shuffled group labels). It should come out null.
5. **One sample or one donor driving it?** Plot the result per donor/sample; recompute
   leaving out each donor in turn.
6. **Spatial data**: plot cell centroids for one section coloured by cell type or niche,
   and check that the tissue looks like tissue (crypts, muscle layers).
