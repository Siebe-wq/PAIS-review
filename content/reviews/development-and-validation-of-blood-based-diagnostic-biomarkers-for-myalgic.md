---
title: >-
  Development and validation of blood-based diagnostic biomarkers for Myalgic
  Encephalomyelitis/Chronic Fatigue Syndrome (ME/CFS) using EpiSwitch®
  3-dimensional genomic regulatory immuno-genetic profiling
authors: 'Hunter E, Alshaker H, Bundock O, et al.'
journal: Journal of Translational Medicine
year: 2025
doi: 10.1186/s12967-025-07203-w
conditions:
  - ME/CFS
studyType: 'Retrospective case-control, n=108 (47 ME/CFS, 61 controls)'
kind: paper
score: 4
verdict: >-
  An interesting DNA-folding signal, but cases and most controls came from
  different sources, so the 96% accuracy may partly reflect sample origin rather
  than disease.
confidence: moderate
importance: high
strengths:
  - Marker selection confined to the training set
  - Lab staff blinded to clinical status
  - Held-out validation set
  - Limitations partly acknowledged in the discussion
weaknesses:
  - Cases and most controls from different sources
  - Sample counts inconsistent across the paper
  - No case definition; PEM not assessed
  - Healthy controls only; no disease controls
  - Tiny validation set; wide confidence intervals
  - Pathway and therapy claims rest on gene proximity
context:
  - note: >-
      Oxford BioDynamics, which owns the EpiSwitch platform, co-authored and
      funded the study.
    source: >-
      https://www.sciencemediacentre.org/expert-reaction-to-study-of-blood-based-diagnostic-biomarkers-for-me-cfs/
  - note: >-
      In its June 2026 interim results, Oxford BioDynamics reported material
      uncertainty about its ability to continue as a going concern, and said it
      aims to make the ME/CFS test commercially available before the end of
      2026.
    source: >-
      https://www.investegate.co.uk/announcement/rns/oxford-biodynamics--obd/interim-results/9643173
  - note: >-
      In an August 2026 company blog post, the company's Chief Scientific
      Officer described a planned prospective study (EMERGE) of 840 participants
      across seven NHS sites. No trial registration or named funder was found at
      the time of review.
    source: >-
      https://intheloop.oxfordbiodynamics.com/blog/beyond-linear-dna-unlocking-the-mystery-of-me-cfs-through-3d-genomics
  - note: >-
      A published Letter to the Editor criticising the paper was co-written by
      an author affiliated with the Italian Scientific Society of Oxygen-Ozone
      Therapy, and it objects that the paper did not cite oxygen-ozone therapy
      studies.
    source: 'https://link.springer.com/article/10.1186/s12967-025-07397-z'
reviewedOn: '2026-09-16'
guideVersion: '0.2'
model: claude-opus-5
---
## Executive summary

The authors measured 3D DNA folding (chromosome conformations) in blood from 47 people with severe ME/CFS and 61 healthy controls. They trained a 200-marker machine-learning model and report 92% sensitivity and 98% specificity on a held-out set. They then map the markers to nearby genes and propose IL-2 signalling as a therapeutic target.

The headline result cannot yet be trusted as an estimate of diagnostic accuracy. All patient samples came from one biobank. Most control samples came from the company's own repository. A classifier can learn to tell the two sources apart instead of telling patients from healthy people. The paper also gives conflicting numbers for the training and validation sets. Patients were not defined by a named case definition, and PEM was not assessed. The mechanistic and therapeutic sections rest on assumptions the data do not test.

The study is best read as a hypothesis-generating pilot.

## Study design

This is a retrospective case-control study with a train/test split. The authors state that they split the data before any analysis and selected markers only within the training set. That is the right way to avoid the most common form of data leakage.

The assay measures DNA, not RNA. Blood is fixed with formaldehyde, cut with TaqI, and re-ligated, so that DNA regions lying close together are joined. The joined fragments are then read on an array of about 1 million probes. Each marker is a DNA loop, not a measure of gene expression.

The paper is inconsistent about which blood fraction was used. The abstract and introduction refer to PBMCs. The methods describe whole blood collected in EDTA tubes and frozen. Whole blood contains many neutrophils, so differences in cell-type mix could drive part of the signal.

## Sample selection

**Cases.** The inclusion criteria are only age 20–80 and "severe CFS – housebound". No case definition is named. The samples came from the London School of Hygiene & Tropical Medicine biobank. The UK ME/CFS Biobank's published protocol recruits using CDC-1994 and/or Canadian Consensus Criteria, so PEM may not have been required for every case. This matters because the guide treats Fukuda-only cases as unacceptable. PEM status at the time of the blood draw is not reported. Illness duration, POTS/OI and MCAS status are not reported either. Severity is described only as "housebound", with no validated scale such as Bell or FUNCAP.

**Controls.** Only 20 controls came from the same biobank. The other 41 came from the Oxford BioDynamics repository. This is the central problem of the paper. Differences in collection, transport, freezing time and storage between two sources can change a DNA-crosslinking assay. The authors corrected for processing batch using ComBat, but that does not remove confounding between sample source and diagnosis. When batch and group are unbalanced, ComBat can even exaggerate group differences.

The control criteria also include "reasonable exercise tolerance" and "preferably" a history of glandular fever or COVID. The first makes the controls a poor match for housebound patients: inactivity, sleep, medication and stress could all shift blood-cell epigenetics. The second is vague, and the paper does not say how many controls met it or how infection was confirmed.

There are no disease controls, which the authors acknowledge. Without them, the test cannot show it detects ME/CFS rather than chronic illness in general.

## Outcome measures

The outcome is classification accuracy against clinical diagnosis. The assay itself is objective in the sense that participants cannot influence it by effort. But "objective" does not mean free from bias. The reference standard is poorly defined, and pre-analytical handling differs between the groups.

## Bias

The largest risk is spectrum and source bias. Severe, housebound patients from one biobank were compared with active, healthy volunteers mostly from another source. This is the easiest possible comparison, and it inflates accuracy relative to real clinical use.

The paper does not report which sources contributed to the validation set. If the 41 company-repository controls are over-represented there, the validation result could largely reflect sample origin.

Laboratory staff were blinded to clinical status, which is good. Blinding does not help, however, if the confound travels with the sample.

The company that owns the platform funded and co-authored the work and intends to sell the test. That does not make the result wrong. It does make independent replication essential.

## Statistical and methodological issues

**Sample counts do not add up.**
- The methods say the validation set was 19 cases and 41 controls.
- The results say 24 ME/CFS and 45 control samples were set aside.
- The split is described as 80:20, but the training set is given as n = 39. That leaves 69 of 108 for testing, closer to 36:64.
- The methods refer to validation on "independent external datasets", and the conclusion says the model was "validated across independent cohorts". Only one validation set is reported.

A validation group of exactly 41 controls would match the size of the company repository. If the methods version is correct, the validation set may consist almost entirely of controls from a different source than the cases.

**Precision is low.** The reported performance corresponds to about 22/24 cases and 44/45 controls. Wilson 95% intervals are roughly 74–98% for sensitivity and 88–99.6% for specificity. The paper reports point estimates only.

**Overfitting risk.** About 39 training samples were used to select 200 features from roughly 1 million probes, followed by XGBoost with grid-searched hyperparameters. Selecting features only in the training set limits leakage. It does not remove the instability that comes from so few samples.

**Misused power calculation.** The authors claim the study "achieves >90% power" based on the observed effect sizes. Power computed from observed results adds no information.

**Data availability.** Data are available only on request through the company contact form. The model is proprietary. No one outside the company can check whether the classifier also separates control samples by source.

## Biological plausibility

A DNA-folding signal in blood cells is plausible in principle. But the biological interpretation is weakly supported.

- The markers were assigned to the three nearest protein-coding genes. No RNA or protein was measured, so it is unknown whether these genes are actually affected.
- Gene sets drawn from blood cells will tend to look immune-related. STRING networks favour well-connected hubs such as IL-2 and TNF regardless of disease.
- The overlap with rituximab and glatiramer acetate networks is expected for any immune gene list. The phase III rituximab trial in ME/CFS was negative.
- Hierarchical clustering always produces clusters. The 18/29 split is not evidence of a treatment-responsive subgroup. Relating it to earlier rituximab response rates is not a test.

The paper does not address how its findings relate to the defining features of PEM: its many different triggers, its delayed onset, or its typical duration. That is acceptable for a diagnostic paper, but it limits the mechanistic claims.

The table of 12 candidate therapies, including methotrexate, azathioprine, mycophenolate and tofacitinib, is derived from literature on IL-2 and CD4 suppression. None of it is supported by data in this study, and some of these drugs carry serious risks.

## Interpretation and spin

The framing goes well beyond what a 108-person pilot can support.

- Performance is called "remarkable", and the model is called "a robust five-step train/test predictive model".
- The authors claim the whole-genome approach avoided "data overfitting at the development stage".
- They state that their study "benefits from a larger cohort" than previous studies. Some earlier biomarker studies were larger.
- The conclusion says the model was "validated across independent cohorts", but one small held-out set is reported.
- They suggest chromatin architecture "may be a more stable and disease-specific marker", although no disease controls were tested.

The discussion does acknowledge several limitations: no disease controls, severe patients only, and overlapping biobank sources. These caveats are not reflected in the abstract or the conclusion. The accompanying university press release described the test as "revolutionary", and the company presents it as reliably identifying ME/CFS.

## What this demonstrates

A 200-marker DNA-folding classifier separated a small group of severe, housebound ME/CFS patients from mostly healthy, active controls in a held-out set. Some of that separation may be due to disease. Some may be due to differences in sample source, handling, activity level or blood cell composition. The study cannot tell these apart.

It does not show that the test works in mild or moderate patients. It does not show that it distinguishes ME/CFS from other illnesses. It does not show that IL-2 or any other pathway is involved in the disease.

## Critical missing elements

- A named case definition requiring PEM, with PEM status recorded at the blood draw.
- Cases and controls collected and processed under the same protocol at the same sites.
- A breakdown of sample source within the training and validation sets.
- A check of whether the classifier can predict sample source among controls alone.
- Sedentary or deconditioned controls, and disease controls (for example MS, depression and other causes of fatigue).
- Mild and moderate patients.
- A clear, consistent account of sample flow.
- Confidence intervals for all accuracy estimates.
- Gene expression or cell-composition data to support the pathway claims.
- Open data, or an independent lab testing a locked model.

## Recommendations

**For the authors:**
- Publish a correction that reconciles the sample counts.
- Report the source of every sample in each set.
- Share de-identified array data with independent analysts.

**For the planned prospective study:**
- Pre-register it and lock the model before testing.
- Collect all groups identically at the same sites.
- Include patients referred with unexplained fatigue who turn out to have other conditions.
- Stratify results by severity.
- Define in advance how Long COVID patients who meet ME/CFS criteria will be classified.

**For clinicians and patients:** do not use this test for diagnosis until it has been independently validated. Do not act on the therapy suggestions in the paper.

## Final assessment

The score is 4. The worst domain, the confounding between sample source and diagnosis, sets the ceiling. The design cannot separate a disease signal from a sample-origin artefact.

What prevents a higher score:
- The source confound.
- Internally inconsistent sample counts.
- The absence of a case definition and of PEM assessment.
- Healthy, active controls only.
- A validation set too small for precise estimates.

What prevents a lower score:
- Features were selected within the training set only.
- Laboratory staff were blinded.
- A held-out set was used.
- The discussion acknowledges several key limitations.
- Nothing in the data contradicts the possibility of a real signal.

Confidence is moderate. I did not examine the supplementary tables or Table 1 in detail. The paper does not say which sources fed the validation set, so the size of the confound cannot be judged from the publication.

A well-designed prospective study with a locked model could quickly show whether the signal is real. If it holds up, this would be important.
