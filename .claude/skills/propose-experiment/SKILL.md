---
name: propose-experiment
description: Turn a result or hypothesis into a concrete, testable experiment proposal with controls, readouts and expected outcomes. Use when asked to propose experiments, design a test of a hypothesis, or draft a project or pre-proposal aim.
---

# Propose an experiment

For each hypothesis, write (in `results/proposal_<name>.md`):

1. **Hypothesis** in one sentence, and the specific result(s) from our analysis that
   motivate it (with file paths and numbers).
2. **What already exists**: is it already tested in the paper (check the CRISPR screen
   supplement, the mouse knockouts) or in the literature (PMIDs retrieved, not recalled)?
3. **Experiment**: system (human primary fibroblasts, organoid co-culture, mouse DSS model,
   patient cohort), perturbation, readout, n and unit of replication, and timeline.
4. **Controls**: positive, negative, and the one that rules out the most likely alternative.
5. **Expected outcomes**: what result supports, what refutes, and what is uninterpretable.
6. **Cheapest first test**: what could be checked computationally in public data before
   any bench work, and whether we can do it now with `minimal/`.
7. **Biggest risk** to the experiment, in one line.

Rank proposals by (information gained) / (cost and time). Flag which ones are speculative.
