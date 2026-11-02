---
name: bring-in-related
description: Find and bring in related papers and public datasets, then compare them with the main paper's findings. Use when asked to search the literature, find related studies or datasets, or compare with another paper (for example the Crohn's stromal paper in papers/ and minimal/).
---

# Bring in related papers and data

## Literature
1. Search PubMed (NCBI E-utilities, `eutils.ncbi.nlm.nih.gov`, max 3 requests/second) or
   Europe PMC (`www.ebi.ac.uk/europepmc/webservices/rest`); ToolUniverse tools if installed.
2. Report each paper with PMID or DOI **as returned by the search**, never from memory, and
   say whether you read the abstract only or the full text.
3. For each, one line: what it claims, and whether it agrees, disagrees or is unrelated.

## Data
1. Datasets: GEO (`www.ncbi.nlm.nih.gov/geo`), CELLxGENE, Single Cell Portal. Report the
   accession, n samples or donors, assay, and file size **before** downloading.
2. Ask before downloading anything over 1 GB.
3. If a host is blocked (403), stop and tell me the `sbx policy allow network <host>` command.

## Compare
1. Match cell types across datasets by **marker genes**, not by name (e.g. are the Crohn's
   paper's inflammatory fibroblasts the same cells as the GLIS3 paper's IAFs? Score one
   paper's signature in the other's data).
2. Check the gene is measured before concluding it is absent (e.g. GLIS3 is not on the
   Crohn's 5k Xenium panel).
3. Put the comparison in the interactive paper as a question with `found` and `cannot_support`.
