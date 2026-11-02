#!/usr/bin/env bash
# Download the workshop data set (~2.2 GB) into minimal/.
#
#   bash get_data.sh
#
# Safe to re-run: curl resumes part-downloaded files (-C -) and skips nothing, so if the
# connection drops, run it again. It prints FAILED for any file that did not arrive.
set -u
cd "$(dirname "$0")"

B=https://storage.googleapis.com/systems-immunology-workshop-data/minimal

FILES=(
  README.md
  human_ibd_atlas_fib_myeloid.h5ad
  fibroblast_stim_timecourse.h5ad
  human_ibd_xenium.h5ad
  mouse_glis3ko_xenium.h5ad
  mouse_pdgfra_scrnaseq.h5ad
  crohns_stromal_scrnaseq.h5ad
  crohns_xenium5k_shared_genes.h5ad
  tables/GSE109142_PROTECT_counts.tsv.gz
  tables/GSE250514_FLAG.consensus_peaks.annotatePeaks.txt.gz
  tables/GSE250514_FLAG.consensus_peaks.bed.gz
  tables/GSE250514_FLAG.consensus_peaks.boolean.annotatePeaks.txt.gz
  tables/GSE250514_FLAG.consensus_peaks.featureCounts.txt.gz
  tables/GSE250515_salmon.merged.gene_counts.tsv.gz
  tables/GSE250515_salmon.merged.gene_tpm.tsv.gz
  tables/GSE307518_bulkATAC_peak_counts.tsv.gz
  tables/GSE307519_processed_bulkRNAseq_cytokine_epigenetic_treatments.csv.gz
  tables/GSE307526_processed_bulkRNAseq_cytokine_stimulations.csv.gz
  tables/GSE307635_bulk_atac_bedcov_matrix_filtered.tsv.gz
)

fail=0
for f in "${FILES[@]}"; do
  curl -fL --retry 5 -C - --create-dirs -o "minimal/$f" "$B/$f" || { echo "FAILED: $f"; fail=1; }
done

echo
du -sh minimal
n=$(find minimal -type f | wc -l | tr -d ' ')
echo "$n files in minimal/ (expected 19)"
if [ "$fail" = "0" ] && [ "$n" = "19" ]; then
  echo "OK - data complete. Next: put the papers from Canvas in papers/."
else
  echo "NOT COMPLETE - re-run this script; it resumes where it stopped."
  exit 1
fi
