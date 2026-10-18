---
title: "Muscle abnormalities worsen after post-exertional malaise in long COVID"
authors: "Appelman B, Charlton BT, Goulding RP, Kerkhoff TJ, Breedveld EA, Noort W, Offringa C, Bloemers FW, van Weeghel M, Schomakers BV, Coelho P, Posthuma JJ, Aronica E, Wiersinga WJ, van Vugt M, Wüst RCI"
journal: "Nature Communications"
year: 2024
doi: "10.1038/s41467-023-44432-3"
url: "https://www.nature.com/articles/s41467-023-44432-3"
conditions: ["Long Covid"]
studyType: "Case-control with before-and-after exercise biopsies, n=25 patients and 21 controls, 2 weeks"
kind: paper
humanInput: none
reviewedOn: 2026-10-17
guideVersion: "0.8.1"
model: "claude-opus-5-5"
effort: "high"
score: 5
verdict: "Patients' muscle differed from that of recovered, more active controls at baseline, but the claim that abnormalities worsen after post-exertional malaise is mostly unsupported: most changes were shared with controls or never tested between groups."
confidence: "high"
importance: "high"
strengths:
  - "Controls did the same exercise test and biopsies"
  - "Confirmed infection, non-hospitalised, ill 6+ months"
  - "Solid mitochondrial function measurements"
  - "All source data and code public"
weaknesses:
  - "Muscle damage claims lack the between-group test"
  - "Tissue scoring yes/no, blinding to time point unclear"
  - "Controls far more active; inactivity not ruled out"
  - "No long COVID group without post-exertional malaise"
context:
  - note: "The registry gives a study start date of 3 January 2022 and a first submission date of 24 January 2022."
    source: "https://clinicaltrials.gov/study/NCT05225688"
  - note: "Two letters criticising the paper, by Ranque et al. and by Saris et al., were published in Nature Communications in February 2025, each with a reply from the authors."
    source: "https://doi.org/10.1038/s41467-025-56430-8"
  - note: "The Saris et al. letter and the authors' reply to it."
    source: "https://doi.org/10.1038/s41467-025-56427-3"
guideNotes:
  - "Before-and-after designs with an exercised control group: require the group-by-time interaction test for each claimed change"
  - "Repeat biopsies: check the time between them, whether they came from the same incision, and whether scorers were blinded to time point"
  - "Yes/no scoring of tissue samples of varying size: check whether sample size differed by group or time point"
---

## Study design

This is a prospective case-control study with a before-and-after element. It recruited 25 people with long COVID and post-exertional malaise (PEM), and 21 people who had fully recovered from a mild SARS-CoV-2 infection. Both groups followed the same two-week protocol:

- Day 1: blood sample (described as fasted in the supplement; the methods say participants arrived at least two hours after eating), a muscle biopsy from the thigh (vastus lateralis), and questionnaires.
- Day 7: a maximal incremental cycling test, a cardiopulmonary exercise test (CPET), used to measure fitness and to trigger PEM in the patients.
- Day 8: a second blood sample and a second biopsy, from the same roughly 2 cm skin cut, taken further down the muscle.
- Day 15: a third blood sample and questionnaires.

Everyone wore a hip step counter throughout.

The design has a real strength. The controls did the same exercise test and had the same two biopsies. So a change that appears in patients but not in controls can be attributed to something about the patients, not to the exercise or the repeat biopsy alone. The right statistical test for that question is the group-by-time interaction: did the change from day 1 to day 8 differ between groups? The paper's headline claim, that muscle abnormalities "worsen after post-exertional malaise", depends on that test. As shown below, it was significant for the mitochondrial enzyme measures, for T cells (where the change was smaller in patients) and for some unnamed metabolites. It was not reported for the necrosis and atrophy findings the abstract leads with, and it was absent for amyloid and for mitochondrial respiration.

The design cannot separate PEM from "being a long COVID patient doing a maximal test". There was no group of long COVID patients without PEM, and no group of deconditioned but otherwise healthy people. In a later reply to critics, the authors disagreed that this prevents linking the changes to PEM. They did accept that an activity-matched control group "would have improved the quality of the study" (see below).

The study is registered as NCT05225688. The registry gives a start date of 3 January 2022 and a first submission date of 24 January 2022. So it was registered about three weeks after it started. Two peer reviewers asked about registration. The authors first replied that "The trial was registered before the start of the study". When a later reviewer pointed out it seemed to have been registered after the start, they replied that it was registered "before the first participant completed the study procedure", and proposed adding "before completion of the first participant" to the methods. The published methods say only that the study was "registered at www.clinicaltrials.gov (NCT05225688)". The registry lists two primary outcomes: "skeletal muscle mitochondrial respiratory function" and "local and systemic inflammation markers after induction of post-exertional malaise". Histopathology (atrophy, necrosis) and amyloid-containing deposits are not registered outcomes. The registry also lists heart rate variability during PEM as a secondary outcome, which the paper does not report. The registry now includes an ME/CFS arm and an enrolment of 81. The authors told the peer reviewers that these were later amendments. I could not view the registry's version history (the page was blocked), so I could not check what the first version said.

## Sample selection

**Case definition.** Better than most long COVID studies. Patients met the World Health Organization definition of long COVID, were assessed by two clinicians, and had PEM according to the DePaul Symptom Questionnaire PEM subscale (DSQ-PEM). They had at least six months of symptoms and no symptoms before infection. Infection was confirmed by a nucleic acid test or serology. No one had been in hospital. This meets the guide's preferred standards for long COVID: confirmed infection, non-hospitalised, more than six months.

One data point conflicts with the six-month rule. In the source data file, patient 18 is listed at 60 days since the initial infection. That may be a data entry error, but it is not explained. The registry's own inclusion criterion was more than three months of symptoms, not six, and allowed PEM to be established "according to the DSQ-PEM questionnaire or 1:1 interview with post-covid physician". The paper reports only the stricter versions.

**PEM ascertainment after the test.** The paper says "All long COVID patients experienced post-exertional malaise following maximal exercise". It does not say what criterion was used to decide that. Self-rated fatigue severity rose from a median of 6 to 7 out of 10 on day 8 (p = 0.001). Cognitive symptom severity rose from 4 to 6 (p = 0.06). In the source data, 3 of 25 patients reported no increase in fatigue severity the day after the test. The Fatigue Severity Scale was not collected on day 8. Daily step counts did not fall in the week after the test: about 4,350 steps a day in week 1 and about 4,220 in week 2, by my calculation from the source data. That is surprising if PEM lasted up to a week, though patients may already have been at a minimum. The controls did not fill in the symptom questions in Table 2, which covers patients only. So the claim that controls had no PEM-like response rests on the Multidimensional Fatigue Inventory and on the authors' later statement that "none reported PEM symptoms".

**ME/CFS, orthostatic and mast cell status.** Not reported. The paper does not say how many patients met ME/CFS criteria. It reports no orthostatic testing for postural orthostatic tachycardia syndrome or orthostatic intolerance (POTS/OI), and does not mention mast cell activation syndrome (MCAS). The registry's exclusion list includes "symptomatic autonomic or distal neuropathy" and "severe psychiatric or mood disorders". The paper's methods list neither, and do not say how mental health was screened.

**Severity and representativeness.** Patients worked a median of 5 hours a week (36 before infection), walked about 4,350 steps a day, and could cycle to exhaustion and attend four visits. The authors call this "severe long COVID". By ME/CFS standards this is a mild-to-moderate, ambulatory group. Housebound and bedbound patients could not take part in this protocol, so the findings cannot be generalised to them. No functional scale was used, such as FUNCAP (a functional capacity questionnaire) or the Bell scale.

**Controls.** Age- and sex-matched people who had recovered from COVID. They were not matched for activity. They worked a median of 36 hours a week and walked about 7,000 steps a day. Step data exist for only 13 controls in week 1 and 10 in week 2 in the source data file, although the supplement legend says 15. The guide prefers sedentary or deconditioned controls. Here, the controls were fitter and more active: mean maximal oxygen uptake (V̇O2max) was about 36 versus 27 mL/kg/min. Their infection was more recent: median 142 versus 545 days since first infection. No disease control group was included.

## Outcome measures

Most outcomes are tissue or blood measures, which the guide counts as objective. But several depend on human scoring, and the detail matters.

**Exercise test (moderate risk of effort effects).** V̇O2max and peak power were lower in patients. The authors argue effort was maximal in both groups, because the share reaching a V̇O2 plateau was similar, the gas exchange threshold sat at a similar percentage of V̇O2max, and lactate, respiratory exchange ratio and heart rate criteria were met. That is reasonable. The gas exchange threshold, which was also lower in patients, does not depend on effort. No verification bout was done, for ethical reasons the authors explain.

**Near-infrared spectroscopy (NIRS).** A sensor on the skin estimates how much oxygen the muscle extracts. Data were usable for 16 patients and 18 controls. Lower deoxygenation in patients was read as lower oxygen extraction. A peer reviewer pointed out that this could partly reflect the lower work rate; the authors added an analysis against absolute power. The signal is indirect.

**Mitochondrial respiration (objective).** Measured in permeabilised muscle fibres in a respirometer, under high oxygen. This is a well-established lab method and the most robust measure in the paper. The high-oxygen condition means it measures the mitochondria's capacity, not what happens in the living muscle.

**Succinate dehydrogenase (SDH) activity (objective, with caveats).** SDH is an enzyme used as a marker of mitochondrial content. It was measured by light absorbance in stained sections, with fibres outlined by hand in ImageJ. The authors showed that at least 40 fibres are needed per sample for a stable estimate. That is good practice. Whether the person outlining fibres knew the group or time point is not stated.

**Histopathology (objective in principle, scored by people).** Atrophic fibres, necrosis, internal nuclei and regenerating fibres were scored on standard stained sections. Biopsy size varied, so each biopsy was scored only as positive or negative. The methods say two pathologists "blinded to the group allocation" scored atrophy and necrosis. In the later reply to Saris et al., the authors describe "a group-blinded pathologist" and a threshold of more than a normal number of atrophic fibres (2–4%). That threshold is not in the paper. Against the guide's histopathology checklist:

- No predefined, validated classification scheme is cited.
- No inter-rater agreement is reported.
- No automated morphology was used for these features.
- Blinding to time point (before or after exercise) is not stated. This matters most, because the headline claim is a before-and-after change.
- The immune cell markers were also scored only positive or negative. These are cluster of differentiation (CD) proteins on the cell surface: CD3 for T cells, CD68 for macrophages, CD20 for B cells. Who scored them, and whether they were blinded, is not stated.

Binary scoring of biopsies of varying size has a further problem. A bigger piece of tissue is more likely to contain at least one abnormal feature. The paper does not say whether biopsy size differed between groups or time points.

**Amyloid-containing deposits.** Thioflavin T is a dye that fluoresces when it binds amyloid-like protein structures. It is not specific to the fibrin "microclots" that the hypothesis being tested is about. Deposits were quantified after a "manual background correction". The units are not explained. Blinding is not stated. The pre-pandemic comparison biopsies are not described: how many, from whom, or whether they were processed alongside the study samples.

**SARS-CoV-2 nucleocapsid protein.** Stained with a commercial antibody; pre-pandemic biopsies were negative, which is a useful control. Nucleocapsid was found in "almost all" patients and controls. The authors read this as no difference between groups. It is also a striking result in itself: viral protein in nearly everyone's muscle, months after mild infection. It needs independent confirmation before much is built on it.

**Metabolomics.** A targeted method for polar metabolites (116 in muscle, 83 in blood). A peer reviewer questioned the description of how metabolites were identified; the authors clarified that identification relied on earlier work with reference standards and that this study used only the first-stage mass data. Raw data were deposited. This is adequate for a targeted panel.

**Blood markers.** Creatine kinase, a standard blood marker of muscle damage, did not rise significantly in either group. The patients' mean rose slightly, from about 102 to 113 U/L at day 8. The paper reports no increase in creatinine, and no "exacerbated" circulating mitochondrial DNA response in patients compared with controls. Cortisol did not differ.

## Bias

**Author preconceptions.** Several of the authors had earlier written, in a muscle journal, calling for detailed study of post-COVID pathophysiology (Kerkhoff et al. 2022, cited in the paper). The study's own framing (inducing PEM to find its muscle basis) assumes the muscle is a likely site. That is a legitimate hypothesis, not a flaw. It does mean the analysis choices that favour a positive finding deserve scrutiny: binary scoring, descriptive percentages in place of interaction tests, and language like "tended to".

**Funding.** Funders include the Patient-Led Research Collaborative for Long COVID, ZonMw's ME/CFS research programme, the 2022 Ramsay Grant Program, and university and hospital foundations. These are non-commercial. Patient-led funders have a reasonable interest in biological explanations, but there is no sign of influence over the analysis. The authors declare no competing interests.

**Peer review.** One reviewer called the study "amazing and extremely important" and urged the authors to be "braver" in the discussion, calling it "one of the greatest proof that LC [long COVID] is a real disease". Another raised the multiple comparisons and the activity difference between groups. The authors added a limitations paragraph in response. Peer review did not ask for interaction tests on the histology.

**Title change.** The peer review file shows the submitted title was "Muscle Abnormalities Contribute to Post-Exertional Malaise in Long COVID". The published title is "Muscle abnormalities worsen after post-exertional malaise in long COVID". The change removes a causal claim, which is to the authors' credit. The new title still claims a worsening that the analysis does not show for most measures.

**Detection bias.** If histology scorers were not blinded to time point, their expectation that post-exercise biopsies would look worse could have inflated the post-exercise counts in both groups. This is the most likely bias in the histology results. It cannot be ruled out from what is reported.

## Statistical and methodological issues

**Which findings are PEM-specific?** This is the central question. A finding is specific to the patients' response to exercise only if the change from day 1 to day 8 differs between groups. Going through the paper's own figures:

- Oxidative phosphorylation capacity (the main registered outcome): lower in patients at baseline. It fell after exercise in both groups, with no reported interaction. By my calculation from the source data, it fell about 19% in patients and 13% in controls. Not PEM-specific.
- SDH activity: a significant interaction. It fell about 14% in patients and rose about 10% in controls, by my calculation. The supplement reports a significant interaction for SDH multiplied by fibre size too. This is the clearest support for the headline. Note that the control group's rise also drives the interaction. A 10% rise in an enzyme marker a day after a single test is not expected physiologically. It suggests measurement or sampling variation between biopsy sites, which may also account for part of the patients' fall.
- Amyloid-containing deposits: higher in patients at baseline. In the paper's words, they "increased similarly in both groups" after exercise. Not PEM-specific. The abstract nonetheless lists them among the abnormalities that "worsen after induction of post-exertional malaise".
- Atrophic fibres: more common in patients (group p < 0.001). Increased after exercise "in both groups". No interaction test reported. Source data: 11 of 24 patients and 0 of 21 controls before; 19 of 25 patients and 6 of 21 controls after.
- Necrosis: the legend gives group p = 0.09, which is not significant. No interaction test is reported. Source data: 2 of 24 patients and 0 of 21 controls before; 9 of 25 patients and 2 of 21 controls after. The results text nonetheless says atrophy and necrosis "increased significantly after exercise, indicating an exacerbated tissue damage response". The abstract calls this "severe exercise-induced myopathy". As a rough check, I compared how many people newly scored positive for necrosis among those negative at baseline (8 of 22 patients versus 2 of 21 controls); a Fisher exact test gives p = 0.07. That is suggestive, not established.
- Internal nuclei: more common in patients, but "did not increase during post-exertional malaise".
- Regenerating fibres: increased in both groups, no group difference. The authors attribute this to the first biopsy.
- Immune cells: CD68 macrophages increased similarly in both groups. CD3 T cells were absent in all controls at baseline and present in 4 of 24 patients; after exercise they were present in 11 of 21 controls and 12 of 25 patients. The authors call this a "blunted" T-cell response in patients. That reading depends on a post-hoc test of binary data.
- Muscle and blood metabolites: tricarboxylic acid (TCA) cycle metabolites, part of the main energy pathway in mitochondria, were lower in patients but "did not change during post-exertional malaise". Many other changes are described as "tended to".

So of the abnormalities the abstract says "worsen after induction of post-exertional malaise": the mitochondrial enzyme (SDH, and SDH multiplied by fibre size, reported in the supplement) has a significant interaction. Some metabolites are marked in the figures as having a significant interaction, but the text does not name them. The T-cell finding implies a significant interaction, but in the direction of a smaller response in patients. Amyloid clearly did not differ in change between groups. The muscle damage claims (necrosis, atrophy) rest on descriptive percentages and a group term, with no interaction reported.

**The binary histology analysis.** The methods say binary longitudinal data were analysed by "logistic regression with 'time' as a covariate". This does not appear to account for the same person being measured twice, and the interaction term is not reported for most outcomes. With 21–25 people per group and binary outcomes, the study has little power to detect an interaction even if one exists. That cuts both ways: a null interaction is not proof of no difference, but the positive claim is not demonstrated either.

**Multiple comparisons.** The paper tests dozens of outcomes across exercise, histology, respiration, two metabolomes and blood markers. Correction was applied only within metabolite pathways and within post-hoc tests. Several reported findings sit close to p = 0.05: the share of type IIx (fast, glycolytic) fibres (p = 0.036), the power-for-fibre-size intercept (p = 0.045), the capillary-to-fibre correlation in patients (p = 0.048), CD3 (p = 0.046) and CD68 (p = 0.03). Capillary ratio at p = 0.08 is described as "a trend". A peer reviewer raised the multiple comparisons; the authors added a statement that replication is needed. Most of these individual results could be chance. The pattern across them is more persuasive than any one of them.

**Labelling.** The results text refers to Figure 5E for macrophages and 5F for T cells; the legend has them the other way round. This is minor.

**Openness.** Source data for every figure, the R code, and the raw metabolomics data are public. This is good practice, uncommon in the field, and it made the checks above possible.

## Biological plausibility

**Baseline findings.** Lower V̇O2max, lower mitochondrial respiration, more fast-fatiguing fibres and lower TCA metabolites are consistent with other long COVID muscle studies the authors cite (Hejbøl 2022 on myopathy, Colosio 2023 on peripheral limitation). They are also consistent with deconditioning. The patients walked about 40% fewer steps than controls, and worked a median of 5 hours a week during the study, having been ill for a median of 545 days. Detraining lowers mitochondrial capacity, shifts metabolism away from oxidative pathways and can increase the share of fast fibres.

The authors argue against deconditioning. Their main points are: fibre size and capillary density did not differ, while bed rest causes rapid atrophy and capillary loss; SDH (mitochondrial content) did not differ while respiration did; and in a later step-count-matched subgroup, V̇O2max was still 24% lower in patients. These are fair arguments, but they compare an ambulatory group with strict bed rest, which is a much stronger stimulus. The step-matched subgroup is small and its size is not given in the reply. The paper's statement that "the observed abnormalities are not reflective of physical inactivity" goes further than either the data or the authors' later wording, which was that "deconditioning itself does not fully explain symptoms". An activity-matched control group would answer this. The study did not have one.

**The one-day changes.** Saris et al., a group working in mitochondrial and neuromuscular disease, argued in a published letter that true fibre atrophy and regeneration cannot develop within one day. The authors replied that Hikida and colleagues saw atrophic fibres one day after a marathon. A marathon is a very different stimulus from 8–12 minutes of cycling, which involves little of the lengthening contraction that damages muscle. The rise in atrophic fibres in controls (0 of 21 to 6 of 21) after a short cycling test supports Saris et al.'s point: something other than new atrophy is changing between biopsies. Candidates include the different biopsy site, the effect of the first biopsy, or scoring that was not blinded to time point. That same factor could produce much of the rise in patients.

**Necrosis without creatine kinase.** The legend describes "large areas of necrotic fibers" in 36% of patients after exercise, and the abstract says "severe" myopathy. Yet creatine kinase did not rise significantly at 1 day or 1 week. Focal necrosis in a small biopsy can occur without a measurable blood rise. But "severe exercise-induced myopathy" with no blood marker of muscle damage is a stretch.

**The guide's theory questions.** The paper does not offer a full theory of PEM, and the conclusion is phrased as "key characteristics" rather than a cause. Still, the discussion says these findings "explain the symptomatology of post-exertional malaise". The guide asks how a hypothesis handles four things:

- PEM can be triggered by cognitive, emotional, orthostatic and sensory stress, not only by exercise. Muscle changes after cycling cannot explain that.
- The same picture follows disparate triggers, including muscle symptoms when the muscles were not used. Not addressed.
- The typical delay before onset. Not addressed; there is only one post-exercise biopsy, at 24 hours.
- The typical duration. Not addressed.

**Natural experiment.** Inflammatory myopathies and mitochondrial myopathies cause exercise intolerance and muscle damage after exertion. Ranque et al. make this point in their letter. Neither condition typically produces the multi-system, delayed PEM seen in long COVID and ME/CFS. So muscle damage alone is unlikely to be sufficient. It could still be part of the picture, or a consequence.

**Microclot hypothesis.** The paper finds more amyloid-containing deposits in patients, located outside capillaries, and no sign of tissue hypoxia. It concludes that PEM "cannot be explained by the hypothesis that these deposits block vessel perfusion". That is a reasonable negative finding, within the limits of a static stain that cannot measure blood flow, as the authors acknowledge.

**Viral persistence.** Nucleocapsid protein in almost all participants, with no difference between groups, does not support viral persistence in muscle as the driver of PEM. The finding that recovered controls also carry it is interesting and unexpected. It should be confirmed with a second method.

## Interpretation and spin

The abstract says: "local and systemic metabolic disturbances, severe exercise-induced myopathy and tissue infiltration of amyloid-containing deposits in skeletal muscles of patients with long COVID worsen after induction of post-exertional malaise."

Against the paper's own results:

- Metabolic disturbances: TCA metabolites "did not change during post-exertional malaise". Oxidative phosphorylation fell in both groups. SDH alone shows a group difference in change.
- Amyloid-containing deposits: "increased similarly in both groups after the induction of post-exertional malaise". This is the paper's own sentence, and it does not support "worsen after PEM" as a patient-specific effect.
- Severe myopathy: necrosis group p = 0.09, no interaction test, no creatine kinase rise.

The conclusion says these features are "key characteristics of post-exertional malaise" and that they "explain the symptomatology of post-exertional malaise in long COVID". The design, without a no-PEM patient group, cannot show they are characteristics of PEM rather than of these long COVID patients. The authors later wrote, in reply to Saris et al., that some of the histology differences "were already different in the pre-PEM biopsies" and "this cannot be associated with our PEM induction". That is a fair concession, and it is at odds with the abstract.

The paper is careful elsewhere. It states that the study "is observational in nature, and therefore we cannot establish causality" and that results "require replication". It makes no treatment recommendations, and the authors resisted a reviewer's push to speculate on therapies. The negative findings on microclots in capillaries, viral protein and circulating mitochondrial DNA are reported plainly.

**On the published critiques.** Two letters were published in Nature Communications in February 2025 with author replies. Ranque et al. (17 authors from France, the United Kingdom, Italy, Denmark and Norway, whose affiliations include internal medicine, neurology, psychiatry, functional disorders, tropical medicine and primary care) argued that deconditioning and the lack of a long COVID group without PEM undermine the PEM link. Those two points are valid and match this review. Other parts of their letter are less accurate. They give the control group's activity as 8,000 steps a day; the source data show about 7,000. They say "none [of the symptoms] indicative of muscle pathology changed", but self-rated fatigue rose significantly, though muscle or joint pain did not (p = 0.276). Their alternative explanation, based on altered interoception and "effort preference", is not tested by this study either. Saris et al.'s point about the one-day time course is the strongest specific objection to the histology claims. Ranque et al. were partly concerned with how the paper was reported in the media, as implying that exercise is harmful. Saris et al. worried it "could now be interpreted" that way. The paper itself makes no such claim.

## What the study actually demonstrates, and what it does not

**It shows, with reasonable confidence:**

- In ambulatory, non-hospitalised long COVID patients with PEM, V̇O2max, peak power and the gas exchange threshold were lower than in recovered, more active controls.
- Mitochondrial respiration in muscle fibres was lower in patients at baseline.
- Patients had more fast, glycolytic (type IIx) fibres and lower TCA metabolites.
- More patients had abnormal histology at baseline (atrophic fibres, internal nuclei, some immune cells).
- More amyloid-containing deposits in patients' muscle, outside capillaries, with no sign of tissue hypoxia.
- No group difference in muscle nucleocapsid protein, creatine kinase, circulating mitochondrial DNA or cortisol.
- Mitochondrial enzyme activity (SDH) fell after exercise in patients and not in controls.

**It does not show:**

- That the baseline differences are due to long COVID rather than deconditioning.
- That any of these changes are specific to PEM, as opposed to long COVID.
- That exercise causes severe muscle damage in long COVID. The necrosis and atrophy changes lack a reported interaction test, rose in controls too, and were not accompanied by a creatine kinase rise.
- That amyloid deposits worsen with PEM more than with exercise in general.
- That the muscle changes explain PEM symptoms. No analysis links the size of muscle changes to the size of symptom worsening.

## Critical missing elements

- Group-by-time interaction tests for every histology outcome, using a model that accounts for repeated measures in the same person.
- Blinding of histology, amyloid and immune scoring to time point, and inter-rater agreement.
- A predefined scoring scheme for histopathology, with thresholds stated in the paper.
- A long COVID group without PEM, and an activity-matched or deconditioned control group.
- A pre-specified criterion for PEM after the test, and symptom data from controls on the same scale.
- Any correlation between muscle changes and symptom worsening within patients.
- ME/CFS criteria status, orthostatic testing for POTS/OI, and MCAS status.
- A description of the pre-pandemic control biopsies.
- Biopsy size by group and time point.
- Reporting of the registered secondary outcome (heart rate variability), and a clear statement of when the study was registered relative to its start.

## Recommendations

**For patients and clinicians.** This study supports the view that long COVID with PEM involves measurable differences in muscle, including lower mitochondrial capacity. It does not show that a single maximal exercise test causes severe muscle damage. Neither does it show that exercise is safe; it was not designed to test treatment. Its participants could walk and cycle, so it says little about housebound patients.

**For researchers.** Repeat the design with a long COVID group without PEM and an activity-matched control group. Blind histology scoring to time point and report inter-rater agreement. Pre-specify the interaction test as the primary analysis. Add a second post-exercise time point (for example 48–72 hours) to capture PEM's delay. Link muscle changes to symptom change within patients. The ME/CFS arm the registry lists will be a useful test of whether these findings generalise.

**For readers of the abstract.** Read "worsen after post-exertional malaise" as "changed after a maximal exercise test, in some measures more in patients than controls". For the muscle damage and amyloid findings, no difference between groups in the change was shown.

## Final assessment

This is an ambitious, carefully executed and openly reported study. It did something few studies have attempted: biopsies before and after exertion in patients with PEM, with controls who went through the same protocol. The case definition is good, infection was confirmed, the respirometry is solid, and the source data and code are public. The baseline differences between groups are real, though confounded by fitness and activity.

The headline claim is much weaker than stated. The abstract and title say abnormalities "worsen after PEM". For the main registered outcome, oxidative phosphorylation, the change was similar in both groups. For amyloid, the paper itself says the change was similar. For the histology that gives the abstract its word "severe", necrosis was not significant and no interaction test is reported, scoring was binary, blinding to time point is not stated, controls changed too, and creatine kinase did not rise. The mitochondrial enzyme result carries the claim statistically, but its interaction is partly driven by an unexplained rise in controls. The T-cell interaction points to a smaller response in patients, not a worse one. Without a long COVID group lacking PEM, no change can be tied to PEM itself.

**What prevents a higher score.** The paper's central claim rests mostly on descriptive histology without the test that would support it, scored in a way that is open to detection bias. Baseline differences cannot be separated from deconditioning. Many outcomes were tested with little correction. Registration came about three weeks after the start date, and the histology and amyloid outcomes were not registered.

**What prevents a lower score.** The design includes an exercised, twice-biopsied control group. That makes the problems visible rather than hidden: the paper's own data show which changes were shared. The objective measures, especially respirometry and the exercise test, are well done. The paper reports its negative findings plainly and does not make treatment claims. Full openness of data allows readers to check everything. The baseline muscle findings are a genuine contribution, consistent with other studies, even if their cause is open.

## Executive summary

This study took thigh muscle biopsies from 25 people with long COVID and post-exertional malaise (the worsening of symptoms after effort) and 21 people who had recovered from COVID. Biopsies were taken before and the day after a maximal cycling test. Everyone had confirmed infection, no one had been in hospital, and patients had been ill for at least six months. The data and code are public.

At baseline, patients were less fit and their muscle mitochondria (the parts of cells that make energy) worked less well. They also had more fast-tiring muscle fibres and more abnormal-looking tissue. These differences are real, but the patients were also much less active than the controls, so the study cannot say how much is caused by long COVID and how much by inactivity.

The title says muscle abnormalities "worsen after" post-exertional malaise. Most of the data do not show that. The main registered measure of mitochondrial function fell in both groups to a similar degree. Amyloid-containing deposits, by the paper's own account, "increased similarly in both groups". The "severe" muscle damage rests on yes-or-no scoring of tissue samples, without the statistical test that compares the change between groups. Necrosis was not statistically significant, the controls' samples changed too, and a standard blood marker of muscle damage did not rise. A mitochondrial enzyme was the clearest measure that changed differently between groups. There was no group of long COVID patients without post-exertional malaise, so nothing can be tied to post-exertional malaise specifically.

A careful, pioneering study with genuine baseline findings, whose headline claim goes well beyond its evidence.

Grade: 5 / 10.
