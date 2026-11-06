/* paper_data.js — the interactive paper's content.
 * Built with the `interactive-paper` skill from papers/GLIS3_Nature2025/ (PDF +
 * 17 supplementary files) and from the obs tables of the h5ads in minimal/.
 * paper.html renders this; to update the page, edit this file only.
 * Every `data` field names a file that exists in this folder, or says it is not here.
 * Numbers under `measured` were read from the data, not from the paper.
 */
const PAPER = {
  title: "Bidirectional CRISPR screens decode a GLIS3-dependent fibrotic cell circuit",
  authors: "Pokatayev V, Jaiswal A, Shih AR, Segerstolpe Å, Li B, Creasey EA, Zhao Y, Lin C, Murphy S, Chou C-H, Graham DB, Xavier RJ",
  journal: "Nature (2025) \u2014 online; PubMed records the print issue as 2026 Feb, so a citation of 'Nature 2026' is not wrong. DOI and PMID below were retrieved from NCBI E-utilities on 2026-11-03, not recalled.",
  doi: "10.1038/s41586-025-09907-x",
  pmid: "41501466",
  updated: "2026-11-03",
  built_by: "interactive-paper skill, Module 1d",
  summary:
    "Integrated scRNA-seq and Xenium profiling of IBD intestine finds IL11-expressing " +
    "inflammation-associated fibroblasts (IAFs) expanded in inflamed CD and UC and sitting " +
    "in myeloid niches next to FCN1+IL1B+ activated macrophages. Macrophage TGF-β and IL-1β " +
    "induce fibroblast IL-11; bidirectional genome-wide CRISPR screens anchored on IL11 " +
    "nominate GLIS3 as the transcription factor that runs the IAF program. A GLIS3 signature " +
    "tracks UC severity in the PROTECT cohort, and fibroblast-specific Glis3 deletion " +
    "reduces collagen and mIAFs in chronic DSS colitis.",

  // ------------------------------------------------------------------ claims
  claims: [
    {
      id: "C1",
      claim: "In the human IBD scRNA-seq atlas, ADAMDEC1+ reparative fibroblasts decrease and IL11-expressing IAFs expand in inflamed CD and UC, while the other fibroblast types do not change in abundance.",
      figure: "Fig. 1b",
      page: "p. 2 of the PDF (sentence located and quoted back, Module 1e)",
      method: "scCODA (Bayesian Dirichlet-multinomial) with smooth muscle cells as the reference cell type, FDR < 20%. Unit of replication = sample. Fig. 1b legend: non-IBD 29, CD inflamed 28, CD non-inflamed 54, UC inflamed 25, UC non-inflamed 22 samples.",
      data: "minimal/human_ibd_atlas_fib_myeloid.h5ad (obs: disease, tissue_sample_status, celltype, donor_id, biosample_id, study, biosample_enriched_fraction)",
      testable: "yes, with a documented method change",
      measured:
        "donor_id gives almost exactly the paper's n: non-IBD 28, CD inflamed 28, CD non-inflamed 54, UC inflamed 25, UC non-inflamed 22. " +
        "biosample_id gives 335, because a donor contributes several enriched fractions (Epi / LP / Immune / Stroma / Whole). Restricted to the fibroblast compartment the n drops to 27 / 28 / 53 / 25 / 22: one non-IBD and one CD non-inflamed donor have myeloid cells but no fibroblasts at all. " +
        "IAF cells: 109 non-IBD, 722 CD-inflamed, 364 CD-non-inflamed, 1,891 UC-inflamed, 394 UC-non-inflamed (3,480 IAFs of 181,106 cells).",
      watch_out:
        "The file holds only the fibroblast + myeloid compartments (14 cell types, no smooth muscle cells), so the paper's scCODA reference is not in the data. Any test here is a proportion-within-fibroblasts test, which is a different question. Also check study: Smillie contributes most UC samples and Kong most CD samples, so disease and study are confounded.",
      our_result:
        "Proportion of each fibroblast type within each donor's own fibroblast compartment; unit = donor \u00d7 inflammation status; two-sided Mann-Whitney vs the 27 non-IBD donors, Benjamini-Hochberg over all 28 tests. " +
        "IAFs expand, in both diseases: median 0.0011 in non-IBD \u2192 0.059 in CD inflamed (n = 28, q = 0.009) and \u2192 0.126 in UC inflamed (n = 25, q = 7.5 \u00d7 10\u207b\u2075). " +
        "ADAMDEC1+ falls in UC inflamed: 0.582 \u2192 0.293 (n = 25, q = 2.0 \u00d7 10\u207b\u2074), but in CD inflamed only 0.582 \u2192 0.511, q = 0.35 \u2014 not significant. " +
        "None of the other five fibroblast types reaches q < 0.05 in any group, which supports the last part of the claim. " +
        "Direction is unchanged if donors with fewer than 20 fibroblasts are dropped (CD inflamed IAFs 0.091, UC inflamed 0.120, n = 24 / 24).",
      caveats:
        "Three things keep this at 'partly' rather than 'reproduces'. (1) The denominator is wrong on purpose: the paper measured composition against smooth muscle cells with scCODA, which is impossible here, so our effect sizes are not comparable to the paper's \u2014 only the directions are. " +
        "(2) The ADAMDEC1+ decrease in CD, which the paper states as part of the same result, is not significant in our test. " +
        "(3) Without the BH correction, WNT5B+ PTGIS-hi in CD inflamed (p = 0.048), RSPO3+ in UC inflamed (p = 0.032) and CCL19+ in UC non-inflamed (p = 0.030) would all read as changed, which would contradict the 'other types do not change' half of the claim. They do not survive correction. " +
        "Disease is also confounded with study (Smillie supplies most UC samples, Kong most CD), and that is not controlled for here.",
      files: ["scripts/08_c1_fibroblast_proportions.py", "results/C1_fig1b_fibroblast_proportions.png", "results/C1_per_donor_proportions.csv", "results/C1_stats.csv"],
      status: "partly"
    },
    {
      id: "C2",
      claim: "IAFs are defined by a specific gene program: IL11, CD82, PRRX1, CHI3L1, MMP1/MMP3, FAP, INHBA, CTHRC1, plus ECM genes (COL1A1, COL6A1, ABL2) and neutrophil-recruiting chemokines (CXCL1/2/3/5/6/8).",
      figure: "Fig. 1c, Fig. 1d; Extended Data Fig. 1d (pathways)",
      page: "p. 2 of the PDF (sentence located and quoted back, Module 1e)",
      method: "Pseudobulk scaled expression of IAF cell-specific genes. Selection: two-sided Wilcoxon signed-rank P < 0.05, log fold change > 3, expressed in >25% of IAFs and <10% of non-IAFs.",
      data: "minimal/human_ibd_atlas_fib_myeloid.h5ad — all of these genes are present (26,533 genes, raw counts in X).",
      testable: "yes",
      measured: "All 22 marker genes checked (IL11, GLIS3, CD82, PRRX1, CHI3L1, FAP, MMP2, MMP3, COL1A1, COL6A1, SERPINE1, …) are in var_names for this file.",
      watch_out: "Pseudobulk by donor, not by cell, or the 1,891 UC-inflamed IAF cells will dominate. The gene list in the figure is the output of the selection above, so re-deriving it with a different test will not give the same list.",
      our_result:
        "Two separate tests, both at the donor level (n = 41 donors with \u2265 10 IAFs and \u2265 10 other fibroblasts; 113 donors in the file). " +
        "(1) Taking the paper's list as given: IAFs are the highest of the 7 fibroblast subtypes for 31 of the 32 Fig. 1c CSGs, and 31 of 32 are also higher in IAFs by two-sided Wilcoxon signed-rank at P < 0.05. Median 34% of IAFs express a CSG against 4.9% of non-IAF fibroblasts. IL11 itself: 29.8% of IAFs vs 0.87% of other fibroblasts, log2FC 5.88, P = 6 \u00d7 10\u207b\u2076, up in 27/41 donors. " +
        "(2) Re-deriving the list from scratch with the paper's own four criteria returns 18 genes, 17 of which are in the paper's 32. The single extra is IGHG1, an immunoglobulin gene and almost certainly ambient contamination. " +
        "All 32 of the paper's genes clear the expression gate (>25% of IAFs, <10% of non-IAFs); 17 also clear log2FC > 3. " +
        "The 15 that miss fail on fold change alone and all sit at log2FC 2.36-3.00, immediately below the cut \u2014 our median across the 32 is 3.10, so the paper's threshold lands in the middle of its own list under our normalisation. " +
        "The order Fig. 1c prints the 32 genes in is a fold-change ranking, and we recover it: Spearman \u03c1 = 0.97 between the printed row order and our log2FC (P = 2 \u00d7 10\u207b\u00b2\u2070, n = 32 genes). " +
        "For Fig. 1d, IAFs are the top subtype for 17 of 28 genes, including COL1A1, ABL2 and all six neutrophil-recruiting chemokines named in the claim (CXCL1, CXCL2, CXCL3, CXCL5, CXCL6, CXCL8).",
      caveats:
        "COL6A1, named in the claim as an IAF ECM gene, is NOT IAF-specific here: IAFs rank 3rd of 7 (WNT5B+ NPY-hi is highest), log2FC 0.84, signed-rank P = 0.69, higher in only 22 of 41 donors. That is the one named gene the claim gets wrong in this data. " +
        "PTGS1 is the one CSG where IAFs are not top (rank 2 of 7, P = 0.07). " +
        "Most of the Fig. 1d collagens behave the same way \u2014 COL1A2, COL12A1, COL18A1, COL27A1 and MMP2 all peak in a different fibroblast subtype. Collagen is what fibroblasts do; it is not what makes an IAF an IAF. The chemokine half of Fig. 1d is far more IAF-specific than the ECM half. " +
        "CXCL8 has a large fold change (log2FC 4.5) but is higher in only 13 of 41 donors: a few donors carry it. Any per-gene claim here should be read with the donor count, which is in results/C2_gene_stats.csv. " +
        "'log fold change > 3' does not state a base. We used scanpy's convention (log2 of the ratio of de-logged means); a natural-log reading would be a 20-fold cut and returns only 6 genes. " +
        "'Non-IAFs' is also ambiguous. We used non-IAF FIBROBLASTS, since Fig. 1c's columns are the 7 fibroblast subtypes. Against all non-IAF cells in the file (including myeloid) 22 of the 32 clear log2FC > 3, but that combination returns 51 genes genome-wide, not 32. Neither reading reproduces the list exactly. " +
        "LY6H+ fibroblasts have \u2265 10 cells in only 4 donors, so that column of both heatmaps is thin.",
      files: ["scripts/11_c2_iaf_gene_program.py", "results/C2_fig1c_csg_heatmap.png", "results/C2_fig1d_ecm_chemokine_heatmap.png", "results/C2_denovo_selection.png", "results/C2_per_donor_markers.png", "results/C2_gene_stats.csv", "results/C2_denovo_csg_list.csv", "results/C2_pseudobulk_scaled.csv"],
      status: "reproduces, except COL6A1"
    },
    {
      id: "C3",
      claim: "Cell-neighbourhood analysis of the Xenium atlas (30 \u00b5m radius) defines 19 cellular niches of 5,298\u2013778,470 cells each; in CD and UC the mucosal epithelial niches (N5, N7, N11, N12, N16) are depleted and the lymphocyte (N2, N15) and myeloid (N1, N9, N14) niches are expanded.",
      figure: "Fig. 1e, Fig. 1f; Extended Data Fig. 2a\u2013d",
      page: "p. 3 of the PDF (sentence located and quoted back, Module 1e)",
      method: "scCODA with niche N3 as reference, FDR < 20%; chi-squared test (P < 0.05) for cell-type enrichment within niches. Colon and ileum analysed separately.",
      data: "minimal/human_ibd_xenium.h5ad (obs: niche, celltype, organ__ontology_label, donor_id, disease__ontology_label)",
      testable: "yes for the niche count, the sizes and the direction of the shifts; no for the 30 \u00b5m clustering itself, which is not re-derivable from this file",
      measured:
        "Exactly 19 niches, and the size range matches the paper to the cell: smallest n10 = 5,298, largest n9 = 778,470. " +
        "16 donors / 16 biosamples, 3,382,726 cells, 56 cell types. " +
        "Lineage composition of the ten named niches, from obs.celltype: n5 49% epithelial (+30% fibroblast), n7 85%, n11 95%, n12 97%, n16 83% epithelial; n2 88% and n15 88% lymphocyte; n14 83% myeloid (41% activated macrophages, 32% neutrophils). " +
        "But n1 is 60% lymphocyte and only 15% myeloid \u2014 its single commonest cell type is plasma B cells (22%) \u2014 and n9, the largest niche in the atlas at 23% of all cells, is 29% fibroblast / 19% endothelial-mural / 15% lymphocyte / 12% myeloid, with RSPO3+ fibroblasts top at 14%.",
      watch_out: "The niche labels in obs are lower-case (n1, n14), not N1/N14. Only 16 donors, so a 'significant' niche shift can rest on two or three sections. The large-bowel comparison is 4 CD and 6 UC against 3 non-IBD donors; the ileum is 2 CD against 1 non-IBD, which cannot be tested at all.",
      our_result:
        "Three separable sub-claims, tested separately (scripts/12_c3_niche_composition.py). " +
        "(1) Count and sizes: exact. 19 niches, 5,298 (n10) to 778,470 (n9), to the cell. " +
        "(2) Lineage labels: 8 of 10 agree, 2 do not \u2014 n1 and n9 are not myeloid-dominant in this file's own annotations (see Measured). " +
        "(3) Depleted / expanded: scCODA is not installed (it needs TensorFlow), so its reference-cell-type logic was reproduced directly \u2014 additive log-ratio of each niche to n3 per donor, Welch t, Benjamini-Hochberg over the 18 non-reference niches at FDR < 20%. Unit of replication = donor. " +
        "In UC vs non-IBD (n = 6 vs 3, large bowel) all ten named niches move the way the paper says AND all ten pass q < 0.20: n5 q = 0.067, n7 0.127, n11 0.120, n12 0.130, n16 0.191 down; n2 0.177, n15 0.177, n1 0.120, n9 0.120, n14 0.120 up. " +
        "In CD vs non-IBD (n = 4 vs 3) all ten move the right way but not one of them passes q < 0.20 \u2014 the best are n9 and n1 at q = 0.20 \u2014 so for CD this is a consistent direction with no statistical support at this n.",
      caveats:
        "Five reasons this is 'partly' and not 'reproduces'. " +
        "(1) Two of the paper's three 'myeloid' niches are not myeloid here. n1 is 60% lymphocyte / 15% myeloid and n9 is a mixed stromal niche (29% fibroblast); only n14 is actually myeloid-dominant (83%). The expansion is real either way, but 'the myeloid niches expand' is not what this annotation shows for n1 and n9. " +
        "(2) CD carries no statistical weight: 4 CD donors vs 3 controls, 0 of 10 niches at q < 0.20. The claim states CD and UC together as though equally supported; in this file only UC is. " +
        "(3) The direction of two CD shifts depends on the model. On the n3 log-ratio all 10 CD directions match; on raw mean proportions n11 (log2FC +0.42) and n16 (+0.07) go up, not down, so CD scores 8/10 instead of 10/10. Which number you report is a modelling choice, and the paper's scCODA is a third model again. " +
        "(4) The named list is not exhaustive. Two niches the claim never mentions also move in IBD at q < 0.20: n8 (97% lymphocyte, q = 0.050) up and n17 (64% endothelial-mural, q = 0.169) up. The largest unnamed move in the other direction, n6 (75% muscle, 21% of the atlas), does not pass (q = 0.28). " +
        "(5) n14 is absent from all three control sections and present in only 8 of 16 donors, 64% of it from one donor; n11 is 80% from one donor and n10 88%. Their fold changes are set by the pseudocount, not by the data, and a leave-one-donor-out would move them a long way. " +
        "Two further limits. The niche labels came with the file: the 30 \u00b5m neighbourhood clustering was not re-derived, so this tests the claim given the labels, not the labelling. And the ileum could not be tested \u2014 1 control vs 2 CD \u2014 where descriptively n5, n7, n11 and n16 are lower in both CD sections as claimed but n1 is markedly LOWER (0.075 control vs 0.018 and 0.030), the opposite of the claim.",
      files: ["scripts/12_c3_niche_composition.py", "results/C3_niche_composition.png", "results/C3_niche_sizes.csv", "results/C3_niche_identity.csv", "results/C3_niche_differential_abundance.csv", "results/C3_claimed_niche_scorecard.csv", "results/C3_per_donor_niche_proportions.csv", "results/C3_ileum_descriptive.csv", "results/C3_summary.json"],
      status: "partly"
    },
    {
      id: "C4",
      claim: "IAFs are statistically enriched in niches N1 and N14 in both colon and ileum; the cell type showing the strongest shared enrichment is the FCN1+IL1B+ activated macrophage (which the paper says resembles CD68+ infiltrated mucosal macrophages, rather than calling them CD68+), and N1/N14 localise to mucosa with active or chronic colitis.",
      figure: "Fig. 1f–i; Extended Data Fig. 2e–j",
      page: "p. 3 of the PDF (sentence located and quoted back, Module 1e)",
      method: "Chi-squared enrichment of cell-type proportion per niche; niches mapped onto pathologist-annotated histopathology regions (n = 16 patients).",
      data: "minimal/human_ibd_xenium.h5ad (obs: niche, celltype, histopathology, location, inflammation, ulceration, fibrosis; obsm['spatial'])",
      testable: "yes",
      measured:
        "obs.celltype contains 'IAFs' and 'Activated macrophages' as literal labels. " +
        "histopathology carries the right categories: AC 210,824 and CC 210,603 cells (active / chronic colitis), FMHP 209,813, LAgg 190,278, Granuloma 1,350, Unlabelled 413,646. " +
        "n14 is small and very unevenly distributed: 29,070 cells in total, of which donor 146685 contributes 18,615, 117237 5,277 and 158409 4,831 — 9 of 16 donors have 50 or fewer n14 cells.",
      watch_out: "This is the leave-one-donor-out claim of the paper. Three donors hold 99% of n14. Note also that ADAMDEC1 and MMP3 are NOT on the 480-gene panel, so the fibroblast labels here cannot be re-derived from those markers.",
      our_result:
        "Four separable sub-claims, tested with the paper's own test (scripts/15_c4_niche_enrichment.py): " +
        "chi-squared of independence on the niche \u00d7 cell-type table, per-cell-type P from standardized residuals, " +
        "Bonferroni over all 19 \u00d7 56 = 1,064 cells of the table, P < 0.05, colon and ileum separately. " +
        "obs gives the paper's own split exactly: 13 colonic donors (12 colon + 1 rectum, 2,322,117 cells) and 3 ileal (1,060,609 cells). " +
        "(1) IAFs enriched in n1 and n14 in both sites: REPRODUCES. IAF observed/expected = 6.43 (colon n1), 8.53 (colon n14), " +
        "11.02 (ileum n1), 23.40 (ileum n14); all four Bonferroni P < 0.05. It survives the donor-level test too: for n1, 13/13 " +
        "colon donors have \u2265100 n1 cells, median O/E 4.3, Wilcoxon signed-rank P = 0.0002, and all 3 ileal donors are 7.1\u201322.5. " +
        "Leave-one-donor-out never drops a site-level O/E below 4.6. " +
        "(2) Strongest SHARED enrichment = FCN1+IL1B+ activated macrophages: DOES NOT hold as written. Seven cell types are " +
        "enriched in all four site \u00d7 niche combinations. Ranked by the weakest of their four O/E values \u2014 the natural reading of " +
        "'shared' \u2014 activated macrophages come 4th (2.85), behind IAFs themselves (6.43), cycling macrophages (4.68) and " +
        "conventional type II DC (3.30). Their enrichment is almost entirely an n14 effect: O/E 35.2 colon and 89.4 ileum in n14, " +
        "but 2.85 and 5.97 in n1, where cycling B cells (7.2) and SPP1+ macrophages (7.0) in colon and cDC1 (11.4) in ileum rank above them. " +
        "Even inside colon n14, neutrophils are higher (41.6 vs 35.2). Rank them by the MEAN of the four instead and activated " +
        "macrophages do come first (33.4) \u2014 so the sentence is true of n14 and not of n1, and which answer you get depends on how " +
        "'shared' is defined. " +
        "(3) The FCN1+IL1B+ naming, and the CD68 hedge: SUPPORTED, and the hedge is the right one. Among all 56 cell types the " +
        "activated macrophage is rank 1 for IL1B (53.1% of its cells carry \u22651 transcript) and rank 2 for FCN1 (13.3%, behind " +
        "monocytes at 50.3%) \u2014 but only rank 7 for CD68 (29.9%), well below tissue-resident (72.0%) and SPP1+ (78.4%) macrophages. " +
        "In this data calling them CD68+ would be wrong; 'resemble CD68+ infiltrated mucosal macrophages' is the defensible phrasing. " +
        "(4) n1 and n14 localise to mucosa with active or chronic colitis: PARTLY. Over the 2,969,080 cells a pathologist annotated, " +
        "active colitis (AC) and chronic colitis (CC) together are 59.4% of n1 cells and 61.3% of n14 cells against 14.2% of all " +
        "annotated cells (O/E 4.2 and 4.3). But the two niches get there differently: n1 is enriched in AC (O/E 6.08) AND CC (2.29), " +
        "whereas n14 is enriched in AC (8.54) and DEPLETED in CC (0.10) \u2014 chronic colitis is where n14 is not. n14's other enriched " +
        "domain is submucosa (3.47), which is not mucosa, and n1's single highest O/E is granuloma (12.99, on only 1,350 cells). " +
        "Per donor: n1 is above chance in 9/9 donors with AC or CC annotated (median O/E 2.45, signed-rank P = 0.0020); only 3 donors " +
        "qualify for n14 (O/E 1.08, 5.13, 5.20).",
      caveats:
        "Six reasons this is 'partly'. " +
        "(1) n1 and n14 are not the only IAF niches. n10 is enriched just as strongly (O/E 8.70 colon, 9.75 ileum, both Bonferroni " +
        "P < 0.05) and the paper never mentions it. n10 is the lymphoid-aggregate niche (LAgg O/E 12.85). The sentence reads as a " +
        "complete list and is not one. " +
        "(2) The chi-squared is over cells, not donors. With 3.38M cells \u03c7\u00b2 is 13.3M on 990 d.f. in colon, so 'statistically " +
        "enriched' is close to automatic; it is the O/E size and the per-donor agreement that carry the result, not the P value. " +
        "(3) n14 cannot be tested at the donor level at all. Only 4 of 16 donors have \u2265100 n14 cells (2 colon, 2 ileum), and one " +
        "colon donor holds 18,615 of the 29,070 n14 cells. Its colon O/E ranges 4.64\u201329.16 across leave-one-donor-out. " +
        "(4) 'In both colon and ileum' rests on 3 ileal donors, 2 of them CD. The ileal numbers are the largest in the table and the " +
        "least supported. " +
        "(5) The labels came with the file. The 30 \u00b5m neighbourhood k-means was not re-derived, so this tests the claim given the " +
        "niche and cell-type labels, not the labelling. " +
        "(6) The marker check is transcript detection on a 480-gene Xenium panel with the deposited segmentation; 13% FCN1+ is a " +
        "cluster-level statement about a sparse assay, not a statement that 87% of these cells lack FCN1 protein.",
      figures: [
        { src: "results/C4_01_iaf_oe_by_niche.png",
          caption: "IAF enrichment in all 19 niches, colon and ileum separately. n1 and n14 are enriched as claimed \u2014 and so is n10, which the paper does not mention." },
        { src: "results/C4_02_celltype_oe_heatmap.png",
          caption: "Every cell type enriched in n1 or n14, in all four site \u00d7 niche combinations. Activated macrophages are extreme in n14 (O/E 35 colon, 89 ileum) and ordinary in n1 (2.9, 6.0)." },
        { src: "results/C4_03_shared_enrichment_rank.png",
          caption: "The claim turns on what 'shared' means: by the weakest of the four values activated macrophages rank 4th; by the mean of the four they rank 1st." },
        { src: "results/C4_04_macrophage_markers.png",
          caption: "FCN1, IL1B and CD68 detection across the myeloid cell types. IL1B and FCN1 single out the activated macrophage; CD68 does not, which is why the paper writes 'resemble CD68+'." },
        { src: "results/C4_05_niche_histopathology.png",
          caption: "Every niche against the pathologist's domains. n1 is enriched in AC, CC and granuloma; n14 in AC and submucosa, and depleted in CC." },
        { src: "results/C4_06_per_donor_robustness.png",
          caption: "The same enrichment with donor as the replicate. n1 holds in 12 of 13 colon donors and all 3 ileal; n14 has only 4 donors with enough cells to look at." },
        { src: "results/C4_07_accc_per_donor.png",
          caption: "Per donor, the active + chronic colitis share of n1 and n14 cells against that donor's own baseline. Above 1 in every donor that qualifies." },
      ],
      files: ["scripts/15_c4_niche_enrichment.py", "results/C4_celltype_niche_enrichment.csv", "results/C4_iaf_oe_by_niche.csv", "results/C4_shared_enrichment_n1_n14.csv", "results/C4_marker_expression_by_celltype.csv", "results/C4_niche_histopathology_enrichment.csv", "results/C4_per_donor_n1_n14.csv", "results/C4_per_donor_histopathology.csv", "results/C4_leave_one_donor_out.csv"],
      status: "partly"
    },
    {
      id: "C5",
      claim: "IL-11 drives fibrosis in vivo: chronic DSS raises colonic collagen, hydroxyproline and Col1a1/Col5a1/Col5a2/Col6a1 in Il11^f/f mice, and all are reduced in tamoxifen-treated Il11^f/f;cre mice, with similar weight loss and inflammation scores in both genotypes.",
      figure: "Fig. 2a–d; Extended Data Fig. 3d,e",
      page: "p. 3 of the PDF (sentence located and quoted back, Module 1e)",
      method: "Masson's trichrome collagen % of tissue area, hydroxyproline/total protein, qPCR normalised to Eef2, colon length. Two-way ANOVA with Tukey. n mice: Il11^f/f-water 10, Il11^f/f;cre-water 14, Il11^f/f-DSS 17, Il11^f/f;cre-DSS 10.",
      data: "NOT in minimal/. Per-animal source data ARE in papers/GLIS3_Nature2025/supplement/41586_2025_9907_MOESM8_ESM.xlsx (sheets 'Fig. 2a', 'Fig. 2b', 'Fig. 2c', 'Fig. 2d') and MOESM12 (Ext. Fig. 3b/3d/3e/3k).",
      testable: "yes, from the supplement — not from the h5ads",
      measured: "MOESM8 sheet 'Fig. 2a' first column header is 'Tissue collagen %'; the four sheets map to Fig. 2a–d.",
      watch_out: "This looks like an image-only claim but the numbers behind every bar are in the spreadsheet. Re-run the ANOVA on those rows rather than reading the bars.",
      status: "not tested"
    },
    {
      id: "C6",
      claim: "Mouse IAFs (mIAFs) from DSS colitis are the cross-species counterpart of human IAFs: of ten PDGFRA+ fibroblast clusters, mIAFs show the strongest enrichment for the human IAF signature and for anti-TNF resistance genes, and specifically co-express Il11 and the mNeonGreen reporter.",
      figure: "Fig. 2g, Fig. 2h; Extended Data Fig. 3f–j",
      page: "p. 3 of the PDF (sentence located and quoted back, Module 1e)",
      method: "Gene-signature scoring of human fibroblast signatures across mouse fibroblast clusters; pseudobulk scaled expression of Il11 and mNeonGreen by treatment group.",
      data: "minimal/mouse_pdgfra_scrnaseq.h5ad (obs: Sample, Treatment, Replicate, CellType_L1)",
      testable: "yes, with a caveat on n",
      measured:
        "41,256 cells, exactly 10 CellType_L1 fibroblast types, 1,059 mIAFs. " +
        "But there are only 5 samples, not 6: acute_DSS1/2/3 (n = 3) and chronic_DSS1 and chronic_DSS3 (n = 2). chronic_DSS2 is absent from the file. " +
        "mIAFs per sample: chronic_DSS1 455, chronic_DSS3 193, acute_DSS1 167, acute_DSS2 151, acute_DSS3 93.",
      watch_out: "n = 2 chronic mice. Any acute-vs-chronic comparison at the mouse level has two points on one side. Chi3l1, Fcn1 and Il11ra are not in this file's var_names, so a human IAF signature has to be mapped gene by gene and the misses reported.",
      status: "not tested"
    },
    {
      id: "C7",
      claim: "An activated-macrophage \u2192 IAF circuit: among immune senders, activated macrophages relay the strongest signal to IAFs and IAFs are their top recipients; in CD and UC but not non-IBD the two cell types co-occupy niches of active and chronic colitis, and IAF IL11 expression rises with proximity to activated macrophages.",
      figure: "Fig. 2i, Fig. 2k, Fig. 2l; Fig. 2j (mouse immunofluorescence)",
      page: "p. 3 of the PDF (sentence located and quoted back, Module 1e); Methods p. 15, \"Inference of cell communication network on the basis of spatial constraints\"",
      method:
        "Fig. 2i: CellPhoneDB v5.0, DEG method, run separately for CD and UC on the scRNA-seq atlas. " +
        "Per cell type the input is the genes significantly UP in inflamed tissue vs the matching controls " +
        "(pseudobulk per patient, decoupler + pydeseq2, 10x chemistry as a covariate, FDR < 0.05 for UC and FDR < 0.1 for CD); " +
        "IAFs are the exception \u2014 because IAFs are nearly absent from controls their input genes come from pseudobulk DE of " +
        "IAFs vs non-IAF fibroblasts. cellphonedb's expression threshold was relaxed to \"> 5% of the cells of that cell type\". " +
        "A sender\u2013receiver pair is kept only if both cell types are significantly enriched in a shared Xenium niche " +
        "(chi-squared test of independence on the cell type \u00d7 niche table, Bonferroni-corrected standardized residuals, P < 0.05). " +
        "Edge weight = sum of the significant ligand\u2013receptor interaction scores; stromal cells were dropped from the drawn graph. " +
        "Fig. 2k is a spatial projection (a picture, no statistic). Fig. 2l is a dot plot of IAF IL11 against distance to the nearest activated macrophage.",
      data:
        "minimal/human_ibd_atlas_fib_myeloid.h5ad for the ligand\u2013receptor half (transcriptome-wide, but only the fibroblast + myeloid slice) " +
        "and minimal/human_ibd_xenium.h5ad for the niches and the distances \u2014 IL11 IS on the 480-gene panel, obsm['spatial'] has centroids, " +
        "and both cell labels exist in obs.celltype.",
      testable: "yes, in all three parts, with a documented method change in each",
      measured:
        "IL11, IL1B, TGFB1, FCN1, OSM, TNF, GLIS3, FAP are all on the human Xenium panel. IL11RA, ADAMDEC1, MMP3, PRRX1, CD82, COL6A1 and PTGFR are not. " +
        "IL11 is sharply IAF-specific in the Xenium: 18.8% of 11,708 IAFs carry \u2265 1 IL11 transcript, against 2.2% for the next cell type (IL6-hi) and 1.2% for activated macrophages. " +
        "Xenium coordinates restart for each donor (two donors share each of the 8 slides), so every spatial step has to be done one donor at a time. " +
        "The atlas slice contains 7 myeloid cell types and no T cells, B cells, epithelium, monocytes, neutrophils or SPP1+ macrophages.",
      watch_out:
        "IL11RA is not on the panel, so the receptor half of the circuit cannot be shown in this data. " +
        "Distance-to-macrophage is strongly confounded by local cell density AND by transcript depth: median total_counts in an IAF falls from 129 in the nearest distance bin to 45 in the farthest, " +
        "so a raw count of IL11 would show a gradient even if IL11 per transcript were flat. Compare against a shuffled-label null and against distance to a different immune cell type.",
      our_result:
        "Three separate tests, one per clause. " +
        "(1) Fig. 2i, strongest immune sender to IAFs: YES. Activated macrophages rank 1st in CD (summed interaction score 192) and in UC (178), " +
        "ahead of cDC1 (88 / 84), cDC2 (82 / 78) and MHCII-hi macrophages (67 / 65); the spatial constraint removes LYVE1-hi, C1Q-hi and mast cells, " +
        "which share no enriched niche with IAFs. They also rank 1st on the number of significant interactions (88 in CD, 64 in UC). " +
        "(2) Fig. 2i, IAFs as top recipient: NO. Of 14 receivers IAFs rank 7th in both CD and UC \u2014 LYVE1-hi macrophages (382 / 360), " +
        "cDC1, cDC2, C1Q-hi and MHCII-hi macrophages all score higher. IAFs are the top FIBROBLAST recipient (CD 192 vs WNT5B+ PTGIS-hi 173 and ADAMDEC1+ 173; UC 178 vs ADAMDEC1+ 150). " +
        "(3) Fig. 2k, the niches: N1 and N14 are the active/chronic-colitis niches, as in Fig. 1g\u2013i (N1 O/E 5.7 for active colitis, 2.1 for chronic, 12.1 for granuloma; N14 O/E 8.3 for active colitis). " +
        "IAFs and activated macrophages are both significantly enriched there \u2014 but in all three groups, non-IBD included (every Bonferroni P < 1e-60). " +
        "What separates the groups is abundance, not enrichment: median per donor, % of cells in N1/N14 = 3.3 (CD), 13.3 (UC), 0.54 (non-IBD); " +
        "IAFs per 1,000 cells 2.1 / 4.3 / 0.46; activated macrophages per 1,000 cells 5.9 / 8.0 / 0.74; share of a donor's IAFs that sit in N1/N14 51% / 58% / 8%. " +
        "Direct co-occupancy (fraction of IAFs with an activated macrophage within 30 \u00b5m, 16 donors): median 0.41 CD, 0.46 UC, 0.12 non-IBD. " +
        "(4) Fig. 2l, IL11 vs proximity: the picture reproduces, the statistic does not. Pooled over 11,708 IAFs the share that are IL11+ falls " +
        "29.9% \u2192 22.2% \u2192 16.2% \u2192 15.0% \u2192 4.2% across the <10, 10\u201325, 25\u201350, 50\u2013100 and \u2265100 \u00b5m bins. " +
        "At the donor level (16 donors, 13 with \u2265 50 IAFs and \u2265 30 activated macrophages) the median Spearman rho between log distance and IL11 per 100 transcripts is \u22120.026, " +
        "negative in 8 of 13 donors, Wilcoxon signed-rank P = 0.14. Controlling for local cell density and transcript depth in a per-donor logistic regression: " +
        "median beta(log distance) = \u22120.41, negative in 7 of 10 donors, P = 0.065.",
      caveats:
        "Status is 'partly' for four reasons, and the first is the biggest. " +
        "(1) The receiver ranking contradicts the paper: IAFs are 7th of 14, not 1st. Our receiver set is not the paper's \u2014 the atlas file is only the " +
        "fibroblast + myeloid slice, so T cells, B cells and epithelium are absent, and the paper dropped stromal cells from its drawn graph. The honest statement " +
        "is that IAFs are the top fibroblast recipient in this file, not the top recipient overall. " +
        "(2) 'Among immune senders' means among 7 myeloid types here; the paper's Fig. 2i panel includes lymphocytes we do not have. The result is also fragile: " +
        "without the niche constraint LYVE1-hi macrophages overtake activated macrophages in CD (204 vs 192), though not in UC (172 vs 178). " +
        "(3) 'But not non-IBD' does not hold as stated. The pathologist annotated ZERO active- or chronic-colitis cells in the 4 non-IBD (diverticulitis) donors, " +
        "so the histopathology version of the sentence is true by construction. At the niche level IAFs and activated macrophages are significantly enriched in N1 and N14 in non-IBD too, " +
        "and against a within-donor permuted-label null the spatial clustering is if anything STRONGER in non-IBD (median log2 enrichment 3.08, vs 1.99 CD and 1.80 UC; " +
        "UC vs non-IBD P = 0.019 in that direction) \u2014 because in inflamed tissue activated macrophages are everywhere, which raises the null. " +
        "The disease difference is in absolute abundance, which is a weaker claim than the sentence makes. " +
        "(4) The IL11 gradient is largely a depth and density effect and is not specific. Median total_counts per IAF drops 129 \u2192 45 and local cell density 68 \u2192 34 " +
        "across the same distance bins; normalising for depth shrinks the gradient from 29.9%\u21924.2% positive to 0.50\u21920.10 counts per 100 transcripts. " +
        "The donor-level trend is carried by 3 of 16 donors (117237 rho \u22120.33, 158409 \u22120.29, 153425 \u22120.11) and does not reach P < 0.05. " +
        "Crucially, distance to MAST CELLS gives the same median rho (\u22120.038) as distance to activated macrophages (\u22120.026), so this data cannot show the association is specific to activated macrophages. " +
        "Two further limits that are nobody's fault: IL11RA is off the panel, so the receiving half of the circuit is untestable here, and n14 is 99% from 3 of 16 donors.",
      files: [
        "scripts/20_c7_communication_network.py", "scripts/21_c7_niche_cooccupancy.py", "scripts/22_c7_il11_distance.py",
        "results/C7_communication.png", "results/C7_niches.png", "results/C7_cooccupancy.png", "results/C7_il11_distance.png",
        "results/C7_senders_to_IAF.csv", "results/C7_receivers_from_AM.csv", "results/C7_AM_to_IAF_pairs.csv",
        "results/C7_niche_enrichment_by_disease.csv", "results/C7_per_donor_cooccupancy.csv",
        "results/C7_il11_distance_bins.csv", "results/C7_il11_distance_per_donor.csv"
      ],
      status: "partly"
    },
    {
      id: "C8",
      claim: "Proinflammatory (not inflammation-resolving) macrophages are sufficient to induce fibroblast IL-11; TGF-β and IL-1β are the responsible ligands, are each required in co-culture, and act synergistically rather than additively.",
      figure: "Fig. 2m; Extended Data Fig. 4e, Extended Data Fig. 5a–d",
      page: "pp. 4-5 of the PDF (sentence located and quoted back, Module 1e)",
      method: "Co-culture of polarised human monocyte-derived macrophages with colonic fibroblasts, IL-11 ELISA at 24 h after agonist removal; receptor/ligand knockouts in each partner. n: fibroblasts only 4, fibroblasts + macrophages 2, fibroblasts + polarised macrophages 3 cell lines.",
      data: "NOT in minimal/. Source data in papers/GLIS3_Nature2025/supplement/41586_2025_9907_MOESM13_ESM.xlsx (Ext. Fig. 4e, 'Secreted IL-11 (pg/mL)') and 41586_2025_9907_MOESM14_ESM.xlsx (Ext. Fig. 5a–d, 'Fibroblast knockout'). The 35 candidate agonists and their concentrations are in 41586_2025_9907_MOESM6_ESM.xlsx (Supplementary Data 4).",
      testable: "yes, from the supplement",
      measured: "MOESM13 has one sheet 'Ext. Fig. 4e' with a 'Secreted IL-11 (pg/mL)' column; MOESM14 has sheets Ext. Fig. 5a–5d.",
      watch_out: "n = 2–4 cell lines. 'Synergistic rather than additive' is a specific statistical claim — check whether the supplement's numbers support an interaction term, not just a bigger bar.",
      status: "not tested"
    },
    {
      id: "C9",
      claim: "Parallel genome-wide CRISPR knockout and activation screens anchored on an IL11-mNeonGreen reporter yield 61 shared hits, including TGFBR1, TGFBR2, SMAD3, IRAK2, MAPK1, RELA and IL11 itself.",
      figure: "Fig. 3a–c; Supplementary Data 2",
      page: "p. 5 of the PDF (sentence located and quoted back, Module 1e)",
      method: "Sorting of the top and bottom 15% of IL11-mNG expressers after TGF-β + IL-1β, gRNA sequencing, one-sided hypergeometric test with FDR correction; hits intersected across the two screens.",
      data: "papers/GLIS3_Nature2025/supplement/41586_2025_9907_MOESM4_ESM.xlsx (Supplementary Data 2). Not in minimal/.",
      testable: "yes — the whole screen is in the spreadsheet",
      measured: "MOESM4 columns: CRISPRko gene, STARS score KO, Avg. STARS score KO, p-value, meanLogFC, CRISPRa gene, STARS score A … — i.e. both screens side by side with per-gene p values.",
      watch_out: "Re-deriving '61 shared hits' needs the paper's exact thresholds; the Methods, not the figure, carry them. If your count differs, report both numbers and the threshold you used.",
      status: "not tested"
    },
    {
      id: "C10",
      claim: "GLIS3 is the top-ranked screen hit correlating with the high-IL11 subclusters (6 and 10) of TGF-β + IL-1β-stimulated fibroblasts (P = 1.6 × 10⁻¹³ and 3.9 × 10⁻⁹), its knockout lowers and its activation raises IL-11, and it controls >150 effector genes including IL11, LIF, FAP, MMP2, PTGFR, SERPINE1 and COL6A1/COL6A3.",
      figure: "Fig. 3e–h; Fig. 4a; Extended Data Fig. 6b–g, 7a",
      page: "p. 5 of the PDF (sentence located and quoted back, Module 1e)",
      method: "scRNA-seq time course of stimulated primary fibroblasts; correlation of subcluster-high genes with shared screen hits; RNA-seq of GLIS3 CRISPRko and CRISPRa fibroblasts, Benjamini-Hochberg-adjusted Wald P < 0.05, n = 3 per condition.",
      data: "minimal/fibroblast_stim_timecourse.h5ad for the time course (obs: hours, leiden, Timepoint2). minimal/tables/GSE250515_salmon.merged.gene_counts.tsv.gz and _gene_tpm.tsv.gz for the GLIS3 KO/CRISPRa bulk RNA-seq.",
      testable: "yes",
      measured:
        "12,291 cells, 8 libraries, 2 per timepoint: 0 h 3,602 cells, 6 h 3,961, 12 h 2,767, 24 h 1,961. obs.leiden has 13 clusters (0–12), so the paper's clusters 6 and 10 both exist. " +
        "IL11 and GLIS3 are present; ADAMDEC1 and OSM are not.",
      watch_out: "n = 2 libraries per timepoint, and they are libraries, not donors — this cannot support a donor-level claim. The leiden labels in the file may not be the paper's subcluster numbering; check that cluster 6 is actually the IL11-high one before assuming.",
      status: "not tested"
    },
    {
      id: "C11",
      claim: "GLIS3 ChIP-seq in stimulated fibroblasts gives 1,291 bound peaks (15.2% within −1 kb to +100 bp of a TSS, 40.4% intragenic); 30.3% gain enrichment after TGF-β + IL-1β, GLIS3 binds upstream of the IL11 TSS, and the peaks are enriched for FOSL1 (FRA1) and TEAD1/TEAD3 motifs whose binding depends on GLIS3.",
      figure: "Fig. 4b–f; Extended Data Fig. 7b–f",
      page: "pp. 5-6 of the PDF (sentence located and quoted back, Module 1e)",
      method: "ChIP-seq of GLIS3-3xFlag knock-in fibroblasts ± 24 h stimulation; gene-ontology on the gained peaks (one-sided hypergeometric, BH-adjusted); motif analysis; ChIP-qPCR of FOSL1 and TEAD1 in control vs GLIS3 CRISPRko, n = 4 cell lines.",
      data: "minimal/tables/GSE250514_FLAG.consensus_peaks.bed.gz and .annotatePeaks.txt.gz (+ .boolean. and .featureCounts.). ChIP-qPCR source data: papers/GLIS3_Nature2025/supplement/41586_2025_9907_MOESM10_ESM.xlsx (Fig. 4f, 'FOSL1-target genes').",
      testable: "yes — peak count and TSS/intragenic fractions are directly countable",
      measured: "Four GSE250514 peak files are present in minimal/tables/ (bed, annotatePeaks, boolean, featureCounts).",
      watch_out: "'1,291 peaks' depends on the consensus-peak calling; the deposited consensus file may not have exactly that many rows. Report the number you count and say which file you counted.",
      status: "not tested"
    },
    {
      id: "C12",
      claim: "A GLIS3 signature scored on bulk RNA-seq of rectal biopsies from the PROTECT paediatric UC cohort rises with disease severity (n = 226, one-sided ordinal probit regression on Mayo score, P < 0.001), and deconvolution links severity to higher inferred IAF and activated-macrophage fractions.",
      figure: "Fig. 4g, Fig. 4h",
      page: "p. 7 of the PDF (sentence located and quoted back, Module 1e)",
      method: "Signature built from GLIS3-perturbed RNA-seq + activated ChIP peaks + IAF-specific transcripts, scored by ssGSEA, refined to 50 genes; CIBERSORT deconvolution; ordinal probit regression of Mayo score on ssGSEA score and cell proportions.",
      data: "minimal/tables/GSE109142_PROTECT_counts.tsv.gz (226 samples, merged counts).",
      testable: "partly — the counts are here, the Mayo scores are not",
      measured: "The counts file is present (26 MB gzipped). The sample-level clinical metadata (Mayo score) is not in minimal/ and is not in the GLIS3 paper's supplements; it has to come from the GSE109142 series matrix.",
      watch_out: "Without the Mayo scores this claim cannot be tested as stated. Say that rather than substituting a different severity proxy. The 50-gene refined signature is in Fig. 4h and would have to be read off the figure.",
      status: "not tested"
    },
    {
      id: "C13",
      claim: "Fibroblast-specific Glis3 deletion (Pdgfra-Cre) alleviates chronic DSS colitis: less colonic collagen, hydroxyproline and collagen gene expression, lower histopathology scores, less weight loss and longer colons; spatially, DSS-treated Glis3^f/f;cre colons have fewer mIAFs and fewer co-localised activated macrophages and neutrophils, with lower Il11, Glis3 signature, Il1b, Osm and Tnf.",
      figure: "Fig. 5a–j; Extended Data Fig. 8a–c",
      page: "pp. 8-9 of the PDF (sentence located and quoted back, Module 1e)",
      method: "Two-way ANOVA with Tukey on distinct biological replicates. Collagen n mice: Glis3^f/f-water 18, Glis3^f/f;cre-water 21, Glis3^f/f-DSS 20, Glis3^f/f;cre-DSS 15. Xenium: n = 3 mice per condition (4 conditions).",
      data: "minimal/mouse_glis3ko_xenium.h5ad for Fig. 5f–j (obs: genotype, treatment, celltype, donor_id, compartment; obsm['spatial']). Per-animal source data for Fig. 5a–d in papers/GLIS3_Nature2025/supplement/41586_2025_9907_MOESM11_ESM.xlsx, and Ext. Fig. 8b weights in 41586_2025_9907_MOESM17_ESM.xlsx.",
      testable: "yes, both halves",
      measured:
        "12 mice, exactly 3 per genotype × treatment group, 1,990,636 cells, labels 'mIAFs' and 'Activated macrophages' present. " +
        "mIAFs per mouse show the direction of the claim but with very large WT spread: WT-DSS 695 / 7,572 / 3,522 vs KO-DSS 468 / 297 / 372; water groups are flat (WT 76/101/123, KO 95/58/108). " +
        "Il11, Glis3, Il1b, Tgfb1, Osm, Tnf, Mmp2, Col1a1 are on the mouse panel; Chi3l1, Fcn1 and Serpine1 are not.",
      watch_out:
        "Two of three WT-DSS mice carry the effect (7,572 and 3,522 mIAFs against 695). With n = 3 per group a Mann-Whitney cannot reach P < 0.05, so whatever test gives a small P is being run on cells, not mice. Also: this file has 1,990,636 cells but the paper's figure reports 2,792,913 (see minimal/README.md); the deposited data do not say why.",
      status: "not tested"
    }
  ],

  // ----------------------------------------------------------------- samples
  // Read from obs with scripts/06_profile_h5ads.py and scripts/07_sample_level_counts.py,
  // not from the paper.
  samples: [
    {
      dataset: "human_ibd_atlas_fib_myeloid.h5ad",
      what: "Human IBD scRNA-seq atlas, fibroblast + myeloid compartments only",
      size: "181,106 cells × 26,533 genes",
      replicates: "114 donors / 335 biosamples",
      groups: "non-IBD 28 donors (29,698 cells) · CD inflamed 28 donors (28,849) · CD non-inflamed 54 donors (83,051) · UC inflamed 25 donors (20,893) · UC non-inflamed 22 donors (18,615)",
      also_differs:
        "Four pooled studies, confounded with disease: Kong contributes 148 CD and 24 non-IBD biosamples, Smillie 82 UC and 44 non-IBD, Friedrich 11 UC and 4 non-IBD, Martin 22 CD. " +
        "Three chemistries (10x 3' v1/v2/v3). Five enrichment fractions (LP 97,563 cells, Whole 59,053, Stroma 10,557, Immune 7,615, Epi 6,318) — 'Stroma' only exists for UC and non-IBD. " +
        "Three organs (Colon 93,442, Ileum 74,952, SmallBowel 12,712). No smooth muscle cells in the file.",
      note: "The paper's Fig. 1b n (29/28/54/25/22) matches obs.donor_id, not obs.biosample_id. One non-IBD donor is missing here (28 vs 29)."
    },
    {
      dataset: "human_ibd_xenium.h5ad",
      what: "Human intestine Xenium, 480-gene panel, all cells",
      size: "3,382,726 cells × 480 genes",
      replicates: "16 donors = 16 biosamples, on 8 slides",
      groups: "Crohn's colitis 6 donors (colon 4, ileum 2; 1,326,589 cells) · ulcerative colitis 6 donors (colon 5, rectum 1; 1,100,840) · non-IBD diverticulitis 4 donors (colon 3, ileum 1; 955,297)",
      also_differs:
        "Six locations (sigmoid colon 6 donors, terminal ileum 3, right colon 3, left colon 2, transverse colon 1, rectum 1). " +
        "Inflammation, ulceration and fibrosis grades are NaN for 1,863,332 / 1,863,332 / 1,262,525 cells respectively — i.e. the non-IBD sections are ungraded. " +
        "56 cell types, 19 niches, 9 histopathology labels.",
      note: "The paper describes 3 ileal and 3 colonic CD samples; obs gives 2 ileal and 4 colonic CD donors. One UC sample is labelled rectum rather than colon. Worth checking which is right before quoting either."
    },
    {
      dataset: "mouse_pdgfra_scrnaseq.h5ad",
      what: "Mouse colon PDGFRA+ fibroblasts, acute vs chronic DSS",
      size: "41,256 cells × 22,313 genes",
      replicates: "5 mice",
      groups: "Acute DSS 3 mice (27,162 cells) · Chronic DSS 2 mice (14,094 cells)",
      also_differs: "No water-treated control group in this file. 10 fibroblast types; 1,059 mIAFs in total.",
      note: "chronic_DSS2 is absent. obs.Replicate has three levels but obs.Sample has five — use Sample."
    },
    {
      dataset: "mouse_glis3ko_xenium.h5ad",
      what: "Mouse colon Xenium, fibroblast Glis3 KO vs WT × chronic DSS vs water",
      size: "1,990,636 cells × 480 genes",
      replicates: "12 mice, 3 per group, on 4 slides",
      groups: "WT-water 3 · WT-DSS 3 · KO-water 3 · KO-DSS 3 (donor_id encodes both, e.g. 'WT2-DSS')",
      also_differs: "Four compartments (epi 1,147,923 · stroma 394,463 · fib 259,834 · immune 188,416); 55 cell types. All mice co-housed per the Methods.",
      note: "Cell numbers per mouse range 120,098–217,373, so proportions, not counts. The paper's figure reports 2,792,913 cells for this experiment; this file has 1,990,636."
    },
    {
      dataset: "fibroblast_stim_timecourse.h5ad",
      what: "Primary human colon fibroblasts + TGF-β and IL-1β, 0/6/12/24 h",
      size: "12,291 cells × 20,465 genes",
      replicates: "8 libraries, 2 per timepoint",
      groups: "0 h 3,602 cells (2 libraries) · 6 h 3,961 (2) · 12 h 2,767 (2) · 24 h 1,961 (2)",
      also_differs: "obs has no donor or cell-line column, so the two libraries per timepoint cannot be assigned to donors from this file alone.",
      note: "obs.leiden / obs.clusters have 13 levels (0–12). Do not assume they are the paper's subcluster numbers."
    },
    {
      dataset: "crohns_stromal_scrnaseq.h5ad",
      what: "Crohn's paper: sorted stromal cells from full-thickness bowel",
      size: "26,727 cells × 17,592 genes",
      replicates: "7 donors / 13 biosamples",
      groups: "All 7 donors are Crohn disease — there is no non-IBD control group in this file. Small intestine 18,762 cells, large intestine 7,965.",
      also_differs: "Two sort gates (CD31+THY1+PDPN+ 19,626 cells vs CD31−THY1+PDPN+ 7,101), 4 male / 3 female donors, ages 23–66.",
      note: "'Inflammatory fibroblasts' = 3,103 cells, but 2,536 of them (82%) come from a single donor (donor 8). FCN1 and OSM are not in this file."
    },
    {
      dataset: "crohns_xenium5k_shared_genes.h5ad",
      what: "Crohn's paper: Xenium 5k, restricted to the 291 genes shared with the GLIS3 panel",
      size: "2,131,098 cells × 291 genes",
      replicates: "7 donors / 16 biosamples, all female, all Crohn disease, all small intestine",
      groups: "From obs.inflammation_status: affected 480,174 cells, adjacent 165,947 — and blank for 1,484,977 cells (69.7%).",
      also_differs: "Three segmentation methods (interior stain 1,705,088 · boundary stain 354,259 · nucleus expansion 71,751) — these differ between samples and will bias per-cell counts.",
      note: "The missing inflammation_status is recoverable from obs.biosample_id, whose names end in _inf / _nor / _affected / _adjacent (e.g. '0054433__GI9676_CD_inf'). GLIS3, MMP3, CHI3L1, ADAMDEC1 and COL1A1 are NOT among the 291 genes."
    }
  ],

  // --------------------------------------------------------------- questions
  questions: [
    {
      asked: "Which of the paper's 13 key claims can actually be tested with the files in this folder?",
      found:
        "10 of 13 can be tested from minimal/ or from the paper's own supplements. C5 (IL-11 KO fibrosis) and C8 (macrophage co-culture) are not in the h5ads at all but their per-animal and per-well numbers are in MOESM8/12/13/14. C9 (the CRISPR screen) is entirely in MOESM4.",
      cannot_support:
        "C12 (PROTECT severity) cannot be tested as stated: minimal/tables/ has the 226-sample count matrix but not the Mayo scores. " +
        "C1 cannot be tested with the paper's method: the atlas file has no smooth muscle cells, which were scCODA's reference.",
      files: ["scripts/06_profile_h5ads.py", "scripts/07_sample_level_counts.py", "results/dataset_profiles.json"]
    },
    {
      asked: "Where would a result in this paper be most fragile to one donor or one mouse?",
      found:
        "Three places, all visible before any analysis. (1) Niche n14 in the human Xenium: 29,070 cells, of which 3 of 16 donors hold about 99%. " +
        "(2) mIAFs in the mouse Glis3 Xenium: WT-DSS mice have 695, 7,572 and 3,522 mIAFs — an order of magnitude apart — against KO-DSS 468, 297, 372. " +
        "(3) 'Inflammatory fibroblasts' in the Crohn's stromal data: 2,536 of 3,103 cells come from donor 8.",
      cannot_support:
        "None of these says the paper is wrong; they say which figures need a leave-one-out before they are quoted. With n = 3 mice per group, a P value below 0.05 is being computed on cells, not on mice.",
      files: ["scripts/07_sample_level_counts.py"]
    },
    {
      asked: "Replicate C4: are IAFs enriched in n1 and n14 in both colon and ileum, is the FCN1+IL1B+ activated macrophage the strongest shared cell type of those niches, and do n1/n14 sit in mucosa with active or chronic colitis?",
      found:
        "Enrichment: yes, and it survives a donor-level test for n1 (IAF O/E 6.4 colon n1, 8.5 colon n14, 11.0 ileum n1, 23.4 ileum n14; " +
        "13/13 colon donors, signed-rank P = 0.0002 for n1). Strongest shared cell type: no \u2014 activated macrophages are 4th by the " +
        "weakest of the four O/E values and only 1st if you average, because their enrichment is an n14 effect (O/E 35\u201389) and not an " +
        "n1 one (2.9\u20136.0). CD68: the paper's hedge is correct \u2014 these cells rank 1st of 56 for IL1B and 2nd for FCN1 but 7th for CD68. " +
        "Histopathology: n1 is enriched in both active and chronic colitis; n14 is enriched in active colitis and depleted in chronic " +
        "colitis (O/E 0.10) and also enriched in submucosa.",
      cannot_support:
        "Nothing about whether the niches themselves are real: the 30 \u00b5m k-means labels came with the file and were not re-derived. " +
        "Nothing donor-level about n14 \u2014 only 4 of 16 donors have \u2265100 n14 cells. Nothing about the ileum beyond 3 donors. " +
        "And nothing about protein: FCN1/IL1B/CD68 here are Xenium transcript detections, so 'CD68-negative' is not shown, only " +
        "'CD68 is not what distinguishes them'.",
      files: ["scripts/15_c4_niche_enrichment.py", "results/C4_03_shared_enrichment_rank.png", "results/C4_05_niche_histopathology.png"]
    },
    {
      asked: "Replicate C7: do activated macrophages send the strongest immune signal to IAFs and receive it back, do the two cell types share the active/chronic colitis niches only in CD and UC, and does IAF IL11 rise with closeness to an activated macrophage?",
      found:
        "Sender half: yes. Rebuilding the paper's spatially constrained cellphonedb DEG network on the atlas slice puts activated macrophages first among immune senders to IAFs in both CD (score 192) and UC (178), by score and by number of significant interactions. " +
        "Niches: N1 and N14 are the active/chronic-colitis niches and both cell types are strongly enriched there. " +
        "IL11 vs distance: the pooled dot plot reproduces \u2014 29.9% of IAFs within 10 \u00b5m of an activated macrophage carry an IL11 transcript, against 4.2% beyond 100 \u00b5m.",
      cannot_support:
        "Three things the sentence asserts that this data does not support. (1) IAFs are NOT the top recipient of activated macrophages \u2014 7th of 14, behind five myeloid types; they are only the top fibroblast recipient, and our receiver set is missing the lymphocytes and epithelium the paper had. " +
        "(2) 'But not non-IBD' fails: the 4 non-IBD donors have zero pathologist-annotated colitis, so that half is circular, and at the niche level the co-occupancy is present in non-IBD too \u2014 against a permuted-label null it is stronger there (log2 3.08 vs 1.99 CD, 1.80 UC). Only the absolute abundance separates the groups. " +
        "(3) The IL11 gradient does not survive the right unit of replication or a specificity check: donor-level Spearman rho median \u22120.026, P = 0.14 (13 donors), carried by 3 donors; median total_counts per IAF falls 129\u219245 across the same bins; and distance to mast cells gives the same rho. " +
        "IL11RA is not on the panel, so the receptor side of the circuit cannot be shown at all.",
      files: ["scripts/20_c7_communication_network.py", "scripts/21_c7_niche_cooccupancy.py", "scripts/22_c7_il11_distance.py", "results/C7_communication.png", "results/C7_il11_distance.png", "results/C7_niches.png"]
    }
  ],

  // ------------------------------------------------------------- supplements
  supplement_map: [
    ["MOESM1 / MOESM2 (PDF)", "Supplementary Information and Reporting Summary"],
    ["MOESM3", "Supplementary Data 1 — patient metadata (PubID, Diagnosis, Gender, Age at diagnosis)"],
    ["MOESM4", "Supplementary Data 2 — the full bidirectional CRISPR screen: CRISPRko and CRISPRa gene, STARS score, p-value, meanLogFC"],
    ["MOESM5", "Supplementary Data 3 — Xenium panels (human + mouse) and marker→cell-type tables"],
    ["MOESM6", "Supplementary Data 4 — the 35 candidate agonists, concentrations, vendors"],
    ["MOESM7", "Supplementary Data 5 — qPCR primers, gRNA sequences, HDR templates"],
    ["MOESM8", "Source data Fig. 2a–d (collagen %, hydroxyproline, qPCR, colon length) — per mouse"],
    ["MOESM9", "Source data Fig. 3g,h (IL-11mNG MFI; co-culture IL-11)"],
    ["MOESM10", "Source data Fig. 4f (FOSL1 / TEAD1 ChIP-qPCR)"],
    ["MOESM11", "Source data Fig. 5a–d (Glis3 KO collagen, hydroxyproline, qPCR, colon length) — per mouse"],
    ["MOESM12", "Source data Ext. Fig. 3b, 3d, 3e, 3k"],
    ["MOESM13", "Source data Ext. Fig. 4e (secreted IL-11, pg/mL, by agonist)"],
    ["MOESM14", "Source data Ext. Fig. 5a–d (fibroblast and macrophage knockouts)"],
    ["MOESM15", "Source data Ext. Fig. 6d–g (nuclear GLIS3 MFI)"],
    ["MOESM16", "Source data Ext. Fig. 7a–d (collagen 6 MFI)"],
    ["MOESM17", "Source data Ext. Fig. 8b (weight curves)"]
  ]
};
if (typeof module !== "undefined") { module.exports = PAPER; }
