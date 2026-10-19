---
title: "Long COVID manifests with T cell dysregulation, inflammation and an uncoordinated adaptive immune response to SARS-CoV-2"
authors: "Yin K, Peluso MJ, Luo X, Thomas R, Shin MG, Neidleman J, Andrew A, Young KC, Ma T, Hoh R, Anglin K, Huang B, Argueta U, Lopez M, Valdivieso D, Asare K, Deveau TM, Munter SE, Ibrahim R, Ständker L, Lu S, Goldberg SA, Lee SA, Lynch KL, Kelly JD, Martin JN, Münch J, Deeks SG, Henrich TJ, Roan NR"
journal: "Nature Immunology"
year: 2024
doi: "10.1038/s41590-023-01724-6"
url: "https://www.nature.com/articles/s41590-023-01724-6"
conditions: ["Long Covid"]
studyType: "Case-control, blood immune profiling, n=27 long COVID and 16 recovered, one time point at 8 months"
kind: paper
humanInput: none
reviewedOn: 2026-10-19
guideVersion: "0.8.1"
model: "claude-opus-5-5"
effort: "high"
draft: true
score: 5
verdict: "A handful of small immune differences, found among many null tests and in groups that differ in hospital stays, sex and weight, do not carry the title's claims of inflammation and an uncoordinated immune response."
confidence: "moderate"
importance: "moderate"
strengths:
  - "Confirmed infection, sampled before any vaccination"
  - "Key T cell findings rechecked with a second method"
  - "Null results reported in full; raw data public"
weaknesses:
  - "Few marginal hits among many uncorrected tests"
  - "Groups differ in hospital stays, sex, weight; no adjustment"
  - "'Uncoordinated' claim never directly tested"
  - "No severity, post-exertional malaise or ME/CFS status"
context:
  - note: "An earlier version was posted as a preprint on bioRxiv in February 2023."
    source: "https://doi.org/10.1101/2023.02.09.527892"
  - note: "The published peer review file shows the first submission was declined with an invitation to resubmit, after reviewers questioned whether the findings supported the conclusions."
    source: "https://doi.org/10.1038/s41590-023-01724-6"
guideNotes:
  - "Claims that a relationship differs between groups need a direct test of the difference, not one significant and one non-significant correlation"
  - "Antigen-specific cell analyses: check how many cells per person each percentage rests on"
  - "Antibody or immune differences in long COVID: check whether acute severity or hospitalisation differs between groups"
---

## Study design

This is a cross-sectional case-control study of blood samples. It compares 27 people with long COVID (LC) and 16 people who had fully recovered (R), all taken about 8 months after a first infection with severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2), the virus that causes COVID-19. The participants come from the Long-term Impact of Infection with Novel Coronavirus (LIINC) cohort in San Francisco, a prospective observational study (NCT04362150). Blood was drawn between 16 September 2020 and 6 April 2021, before anyone had been vaccinated or had a known reinfection. That timing is a real strength. It removes two confounders that make later long COVID immunology hard to read.

The same samples went through several assays:

- Mass cytometry (CyTOF), a method that measures about 40 proteins on each cell, on T cells at rest and after 6 hours of stimulation with SARS-CoV-2 peptides. Cells that made cytokines after stimulation were counted as SARS-CoV-2-specific.
- Conventional flow cytometry, on 25 LC and 15 R samples, to check some CyTOF findings.
- Antibodies against the receptor-binding domain (RBD) of the spike protein, on 26 LC and 15 R.
- Bulk RNA sequencing of peripheral blood mononuclear cells (PBMCs), on 23 LC and 13 R.
- Single-cell RNA sequencing (scRNA-seq), on 8 LC and 4 R, all female.
- Olink, an antibody-based panel that measures several hundred proteins in plasma, on 25 LC and 15 R.

A note on names. CD4+ T cells are helper T cells; CD8+ T cells are killer T cells. Names such as PD1, CTLA4, CXCR4, CXCR5, CCR6, CD38, HLA-DR (human leukocyte antigen DR) and Ki67 are proteins on or in immune cells, used to sort them into types. Names such as ALAS2, OR7D2, THEMIS, NUDT2, PPIE, HBB, HBD, CA1 and SLC4A1 are genes. IL-4, IL-5 and IL-6 are interleukins (IL), signalling proteins of the immune system.

There is one time point and one comparison group. No sample size was calculated in advance: "Samples were chosen based on the availability of specimens meeting our LC criteria." The study was not pre-registered as a separate analysis; the parent cohort is registered. "Data collection and analysis were not performed blind to the conditions of the experiments."

The design is exploratory. It can show differences between groups. It cannot show what causes them, or whether they cause symptoms. The authors say this themselves: "our study was for the most part descriptive."

## Sample selection

**Case definition.** People were classed as LC if they "consistently met a case definition for LC based on the presence or absence of at least one symptom attributable to COVID-19" at both the 4-month and 8-month visits. At each visit, an interviewer asked about 32 physical symptoms that were new or worse since COVID-19. So the bar for LC is one persistent symptom. In practice the LC group had many symptoms: a median of 4.5 at month 4 and 7 at month 8 (Supplementary Table 1). The recovered group had a median of zero at both visits. The paper selected people with "clear LC and non-LC clinical trajectories", which sharpens the contrast. It also means people whose symptoms came and went were left out, so the results may not apply to them.

**Infection confirmation.** LIINC enrols people with nucleic acid-confirmed infection, which is the strongest level in the guide. Two participants' samples came from a different study (CHIRP, the COVID-19 Host Immune Response Pathogenesis study), and the paper does not say how their infection was confirmed.

**Duration.** About 8 months at sampling, with symptoms at both 4 and 8 months. This meets the guide's preference for more than 6 months.

**Hospitalisation.** 7 of 27 LC participants (26%) and 2 of 16 recovered participants (12.5%) had been in hospital for COVID-19. Supplementary Table 3 shows that all 9 hospitalised participants needed oxygen except one. The guide prefers non-hospitalised cohorts. Here, about a quarter of the LC group had a severe acute illness, and the analyses do not separate them out.

**ME/CFS, orthostatic and mast cell status.** Not reported. The paper does not say whether anyone had post-exertional malaise (PEM), met criteria for myalgic encephalomyelitis/chronic fatigue syndrome (ME/CFS), or had postural orthostatic tachycardia syndrome or orthostatic intolerance (POTS/OI), or mast cell activation syndrome (MCAS). The text lists "fatigue, 'brain fog' and sleep disturbance" as typical symptoms, but gives no breakdown by symptom.

**Severity.** Not reported. There is no measure of function, such as FUNCAP (a functional capacity questionnaire) or the Bell scale, and no measure of work capacity. The symptom count is the only severity measure. So we do not know how ill the LC group was, or whether the immune findings track severity.

**Group differences.** The groups differ in several ways that could affect immune measures:

- Sex: 63% female in LC, 44% in R.
- Hospitalisation: 26% versus 12.5%, as above.
- Body mass index (BMI): significantly higher in LC (Extended Data Fig. 1e), roughly 31 versus 26 judging by the figure.
- Comorbidities: hypertension in 6 of 27 LC versus 1 of 16 R; lung disease in 6 of 27 versus 1 of 16; diabetes in 2 of 27 versus 1 of 16 (Extended Data Fig. 1d).
- Median age was similar: 46 and 45.5 years.

The methods say "Participants were deliberately not matched by age and sex, but we ensured that there was overlap in the groups." None of the group comparisons adjust for sex, BMI, hospitalisation or comorbidity. Sex enters in two places only: the cell clustering, where it is used to split results rather than adjust them, and the single-cell study, which was restricted to women.

**Controls.** People who recovered from COVID-19 are a sensible comparison for the question "what differs in those who did not recover?" There is no uninfected control group and no disease control group. So the study cannot say whether a finding is specific to long COVID, or would also appear in, for example, people with obesity, hypertension or a recent hospital stay.

**Missing samples.** Not every assay was done on every participant. The methods say "No samples were excluded from the analyses", but group sizes range from 27/16 for CyTOF to 23/13 for bulk RNA sequencing (and 8/4 for the deliberately selected single-cell set). The paper does not say why samples are missing. The peer review file explains it for flow cytometry only: it used the remaining aliquots, which existed for 25 LC and 15 R.

## Outcome measures

All outcomes are laboratory measures on blood. By the guide's scale they are objective: participants cannot influence them by trying harder. But several depend on choices the analyst makes, and analysis was not blinded.

**Gating.** Most of the T cell findings come from manual gating, where the analyst draws boundaries around cell populations on plots. The peer review file shows this mattered. A reviewer questioned the T follicular helper (TFH) cell gate. When the authors applied a stricter gate, the difference between groups went from p = 0.0373 to p = 0.066. The paper now shows both gates: the looser one, renamed "peripheral TFH" (pTFH), and the stricter one, labelled TFH, which is not significant (Fig. 1g).

**SARS-CoV-2-specific T cells.** These were identified by cytokine production after a 6-hour peptide stimulation, using criteria set out in the methods. The number of such cells per person was small: "a median of 163 cells (134 for CD4+ T cells and 29 for CD8+ T cells)". So when the paper reports the percentage of SARS-CoV-2-specific CD8+ T cells that carry the markers PD1 and CTLA4, that percentage is often based on about 30 cells. Percentages from so few cells are noisy. Fig. 3c shows many recovered participants at zero. Reviewer 1 raised this point ("Unclear if the relatively low absolute numbers of specific T cells captured is sufficient to permit robust phenotypic analyses"). No minimum cell count for including a person in these analyses is reported.

**Cryopreservation.** All cells were frozen and thawed before analysis. That affects some surface markers. A reviewer asked whether CD62L recovers after thawing; this does not change the main findings, but it adds noise.

**Olink.** The methods say only that the assay "was performed per manufacturer's protocol". They do not say what statistical test was used to compare groups, or whether any protein passed a correction for multiple testing. The data visualisation methods say the network used the "25 proteins with the lowest P values", so p-values were computed, but none for individual proteins are given in the text or figures. The raw data are on Dryad, but the download needs a login, so I could not check them.

**Bulk RNA sequencing.** The methods say it was done on PBMCs. The Fig. 5a legend says "whole blood". The paper does not resolve this. It matters for the hemoglobin finding below.

## Bias

**Selection.** The groups were chosen from a larger cohort for having consistent trajectories and stored samples from before vaccination. This is reasonable. It also means the selection was not random, and the selected groups differ in sex, BMI, comorbidity and hospitalisation.

**Unblinded analysis.** Gating and the choice of which subsets and marker combinations to show were done with knowledge of group. The TFH gate example above shows that these choices can move a result across p = 0.05.

**Author framing.** The discussion leans toward one interpretation. The summary says that exhaustion markers on SARS-CoV-2-specific CD8+ T cells are "consistent with ongoing stimulation by viral antigens", and that higher antibody levels further support "a potential persistent reservoir". The paper does not discuss that higher antibodies and more activated T cells are also expected after a more severe acute infection, and that the LC group had twice the hospitalisation rate. Reviewer 3 also pointed out that PD1 and CTLA4 mark activated T cells as well as exhausted ones. The published abstract still says "exhausted SARS-CoV-2-specific CD8+ T cells".

**Funding and interests.** Funded by the Sandler Foundation, private donors and the US National Institute of Allergy and Infectious Diseases. Three authors report industry consulting or grants "outside the submitted work". I see no conflict that bears on these findings.

## Statistical and methodological issues

**Multiple comparisons.** This is the main problem. The study ran a very large number of group comparisons:

- 9 CD4+ T cell subsets, in total and SARS-CoV-2-specific cells (Fig. 1g,h).
- The same kind of subsets for CD8+ T cells (Extended Data Fig. 3).
- Every CyTOF marker, in four cell groups (Extended Data Figs. 4 and 5; corrected within this set).
- Activation markers (Extended Data Fig. 6).
- Cell clusters, overall and by sex (Extended Data Fig. 7).
- Several pairs of chemokine receptors and checkpoint markers (Figs. 2 and 3).
- Cytokine production patterns (Fig. 1d–f, Extended Data Fig. 2).
- Correlations within each group (Figs. 2e,f and 4b,c).
- Several hundred plasma proteins.

Some families of tests were corrected. The per-marker comparisons in Extended Data Figs. 4 and 5 used "multiple correction by Sidak adjustment", and found nothing. The clustering analysis and the gene expression analyses used Benjamini–Hochberg correction. But the T cell subset comparisons and marker-pair comparisons that carry the main positive findings (Figs. 1–3) used unadjusted two-sided t-tests, with nothing to account for how many were run. The methods say only "Where appropriate, P values were corrected for multiple testing (across three pairwise comparisons)".

Against that background, the positive CyTOF findings are a short list, nearly all at p < 0.05 (one star) rather than lower. Central memory T cells (TCM) were the only subset at p < 0.01. Most comparisons were null, and the authors report those nulls, which is to their credit (the editor asked for this). Total SARS-CoV-2-specific T cell frequency did not differ. Polyfunctional cells did not differ. All CD8+ T cell subsets were similar. No CyTOF marker was significantly differentially expressed. Activation markers (CD38, HLA-DR, Ki67) did not differ. Overall cluster frequencies did not differ. When most of a large set of tests is null and the positives sit just under p = 0.05, some of the positives are likely to be false.

**The flow cytometry check.** The strongest support for any T cell finding is that conventional flow cytometry, on nearly the same samples, also found more CXCR4+CXCR5+, CXCR5+CCR6+ and CXCR4+CCR6+ cells among total CD4+ T cells in LC, and more PD1+CTLA4+ SARS-CoV-2-specific CD8+ T cells (Extended Data Fig. 8c,d). This was requested by the reviewers. It is a real check against a CyTOF artefact. It is not an independent cohort: the same people, the same blood draw, the same selection. So it rules out an instrument problem, not a chance difference between these 43 people.

**Influential points.** Reviewer 2 wrote that "the majority of significant differences are driven by a few patient samples, sometimes 1-2 samples". In their reply, the authors showed that removing a single outlier participant moved one of the CXCR4+CXCR5+ CD4+ T cell results to p = 0.0589 (a related CXCR5+CCR6+ result stayed significant). They kept the outlier, which is the correct choice, since removing points by eye is not legitimate. But the exchange shows how fragile that result is. Fig. 4a (antibody levels) has two LC values far above the rest. Student's t-tests on data like these are sensitive to single points; a rank-based test or a log transformation would have been a useful check, and none is reported. Separately, Fig. 5a shows that the ALAS2 result in the bulk RNA data (tested with a different method) rests on a few high values, two of them extreme.

**"Differences in significance" as evidence.** The headline claim of an "uncoordinated" adaptive response rests on correlations. In recovered people, antibody levels correlated with SARS-CoV-2-specific CD4+ T cells (r = 0.53, p = 0.042), pTFH cells (r = 0.75, p = 0.0014) and CD8+ T cells (r = 0.78, p = 0.0007). In LC people they did not (Fig. 4c). A significant correlation in one group and a non-significant one in the other is not, by itself, evidence that the correlations differ. That needs a direct test of the difference, such as an interaction term, which is not reported. The recovered correlations come from 15 people, and in Fig. 4c they look driven by a few people with the highest antibody and T cell values. The LC correlations include the two people with very high antibody levels. The same pattern of reasoning is used for most of the pTFH correlations in Fig. 2e,f (in one panel the recovered correlation is also significant) and for the Treg correlation in Fig. 4b.

**Sex subgroups.** The abstract reports "sex-specific perturbations in cytolytic subsets". This comes from a cell clustering analysis where no cluster differed between LC and R overall. Splitting by sex gave four results at p between 0.023 and 0.047 (Extended Data Fig. 7b,f), in groups of 7 to 17 people. In the peer review exchange, the authors agreed that "the effects are subtle" and noted the "relatively high FDR values", where FDR is the false discovery rate. The methods say these p-values were adjusted with the Benjamini–Hochberg method, though the figure itself does not say so. Subgroup findings at this level, without an overall effect, are hypothesis-generating at most.

**scRNA-seq selection.** The single-cell study used 8 LC women, chosen from among those with the highest OR7D2 or ALAS2 levels in the bulk data, and 4 randomly chosen recovered women. Choosing the LC samples for their extreme values and then comparing them with random controls makes differences more likely. With 4 controls, the comparison has very little power and the results are fragile. Only three genes passed the stricter threshold (THEMIS, NUDT2 and PPIE).

**No adjustment for confounders.** None of the comparisons adjust for sex, BMI, hospitalisation or comorbidity. With 43 people, adjustment would be limited, but it was not attempted even as a sensitivity analysis, for example by dropping the 9 hospitalised people.

## Biological plausibility

**Higher antibody levels.** Antibodies against the spike RBD were 2.3 times higher in LC. Higher anti-SARS-CoV-2 antibodies in long COVID have been reported elsewhere. Klein et al. (Nature, 2023, 275 participants) reported "exaggerated humoral responses directed against SARS-CoV-2" in long COVID. So this finding fits. But the most direct explanation in this cohort is acute severity: antibody levels after infection are generally higher after more severe illness, and the LC group had twice the hospitalisation rate. The paper does not test whether the difference survives without the hospitalised participants. Persistent virus is one possible explanation; it is not the only one, and these data cannot separate them.

**Exhaustion markers.** PD1 and CTLA4 on SARS-CoV-2-specific CD8+ T cells fit chronic antigen exposure. They also fit recent activation. The study did not measure TOX (thymocyte selection-associated high mobility group box protein), a transcription factor more specific to exhaustion; the authors list this as a limitation. Total CD8+ T cells did not show the difference, and acute activation markers did not differ. So the finding is limited to a small population of about 30 cells per person.

**Chemokine receptors.** More CD4+ T cells carrying CXCR4, CXCR5 and CCR6 is a reasonably consistent finding in this paper, seen by two methods. Its meaning is uncertain. Reviewer 3 noted that CXCR4 is widely expressed on T cells, and that these are "not classic tissue-homing receptors". The paper's description of them as cells "poised to migrate to inflamed tissues" is an interpretation, not a measurement.

**ALAS2 and hemoglobin genes.** The bulk RNA module that went up in LC (ALAS2, HBB, HBA1, HBA2, HBD, CA1, SLC4A1) is the gene signature of red blood cell precursors. In PBMC preparations this signal often comes from red cell or reticulocyte contamination, which varies with sample handling. It can also reflect real changes in red cell production. The paper interprets it as "the involvement of heme biosynthesis and immune dysregulation in LC" without considering contamination. The PBMCs versus whole blood inconsistency in the paper makes this harder to judge.

**OR7D2.** An odorant receptor gene with no clear role in blood cells. It was significant after correction, but driven by a subset of LC participants. Without replication, its meaning is unknown.

**IL-6 in CD4+ T cells.** Found "only in a small subset (14%)" of LC participants, using a relaxed detection threshold set for this sub-analysis. CD4+ T cells do not usually make IL-6. Reviewer 3 suggested this could be background staining and asked for confirmation by another method. The authors replied that it was not seen in controls. That is weak evidence for a result at very low frequency, found with a threshold relaxed for a sub-analysis.

**Inflammation.** The title and abstract say LC "manifests with ... inflammation" and "systemic inflammation". The evidence is the Olink panel, with no reported statistics, and the T cell findings. Acute activation markers did not differ, and no standard inflammatory marker such as C-reactive protein is reported. "Systemic inflammation" is stronger than the data shown.

**What would the hypothesis predict elsewhere?** If long COVID were driven by a persistent viral reservoir causing ongoing T cell stimulation, one would expect the differences to grow with symptom severity, to be stronger in non-hospitalised people once acute severity is accounted for, and to be found in tissue. None of that is tested here.

## Interpretation and spin

The title states three findings as facts about long COVID: "T cell dysregulation, inflammation and an uncoordinated adaptive immune response". Each is weaker in the data:

- "T cell dysregulation": a handful of subset differences at p < 0.05 among many null comparisons, mostly in the 9 CD4+ subsets and a few marker pairs.
- "Inflammation": an Olink heatmap without reported statistics, and no difference in activation markers.
- "Uncoordinated adaptive immune response": correlations present in 15 recovered people and absent in 26 LC people, without a test that the correlations differ.

The text overstates in several places:

- The results say "Total CD4+ TCM, pTFH, TFH and Treg cell subsets were more frequent in LC". The summary says "We found higher proportions of CD4+ TCM cells, TFH cells and Treg cells". But Fig. 1g shows TFH at p = 0.066, labelled as such. That stricter gate was added after a reviewer called the original one too generous; the authors kept the original as pTFH for comparison with their earlier studies.
- The text uses TN for naive T cells and TEM for effector memory T cells. It says "females with LC had relatively low frequencies of resting CD4+ and CD8+ TN cells ... and high frequencies of terminally differentiated CD4+ and CD8+ TEM cells". For CD4+ effector memory cells (cluster A4) in women, Extended Data Fig. 7b shows p = 0.20. The significant A4 result was lower frequency in LC men (p = 0.023), which is the opposite direction from the claim.
- Fig. 2b and Fig. 3b show pooled histograms of marker levels, and the text says CXCR4, CXCR5, CCR6, PD1 and CTLA4 "were expressed higher" in LC. Yet the paper also says "no markers were significantly differentially expressed between LC and R individuals" when expression was tested per person (Extended Data Figs. 4 and 5). The histograms appear to show cells from each group as a whole, and they are not a statistical test. The supported findings are the percentages of cells with marker pairs (Figs. 2c,d and 3c).
- The limitations say "the rigor with which participants were characterized mitigates the limitations of the small sample size". Careful selection reduces some confounders. It does not reduce the chance of false positives from small groups and many tests.
- Some claims were softened during review. For example, the authors removed a statement that LC was linked to hospitalisation. Reviewer 1 wrote in the first round that "the authors generously emphasize" the findings, and that "the reported differences, although intriguing, would appear to be somewhat modest". The title did not change.

The paper is fair in places. It reports the null findings in full, names the small sample size and the descriptive nature as limitations, and says some findings "were driven by small subsets of LC individuals" and "will require validation in larger cohorts".

## What the study demonstrates, and what it does not

It shows, in this group of 43 people sampled before vaccination:

- Antibodies against the spike RBD were higher in LC on average, with two very high LC values.
- More CD4+ T cells carrying CXCR5 together with CXCR4 or CCR6. In total CD4+ T cells this was seen by two methods on the same samples; in SARS-CoV-2-specific cells, by mass cytometry only.
- A higher share of PD1+CTLA4+ cells among a small number of SARS-CoV-2-specific CD8+ T cells, seen by two methods.
- Higher CD4+ TCM, pTFH and regulatory T cell (Treg) percentages, with unadjusted p-values.
- Two genes higher in bulk RNA, one of them part of a red blood cell signature.
- Many measures that did not differ.

It does not show:

- That these differences are caused by long COVID rather than by the higher rate of hospitalisation, female sex, higher BMI or more comorbidities in the LC group.
- That they are specific to long COVID, since there is no disease control group.
- That the adaptive response is "uncoordinated", since the difference between correlations was not tested.
- That the CD8+ T cells are exhausted rather than activated.
- That there is systemic inflammation.
- That any finding relates to symptom type or severity, or to PEM or ME/CFS.
- That any of it replicates in another cohort.

## Critical missing elements

- A sensitivity analysis without the 9 hospitalised participants, or adjusted for hospitalisation, sex and BMI.
- A formal test of the difference between correlations (interaction test) for the "uncoordinated" claim.
- The statistical method and adjusted p-values for the Olink proteins.
- Correction for multiple testing across the T cell subset and marker-pair comparisons, or at least a count of how many tests were done.
- A minimum cell count for the SARS-CoV-2-specific CD8+ T cell analyses.
- Severity and functional measures, and PEM, ME/CFS, POTS/OI and MCAS status.
- Any link between immune measures and symptoms within the LC group.
- An independent replication cohort.
- A clear statement of whether bulk RNA came from PBMCs or whole blood, and a check of red cell contamination.

## Recommendations

**For readers and patients.** Treat this as an early, exploratory immune profile of a small group. The most consistent findings are higher antibody levels and more CXCR5-positive CD4+ T cells in long COVID. These fit with some other studies. They do not by themselves show a viral reservoir, and they may partly reflect a more severe first infection. The paper does not tell you anything about ME/CFS or PEM specifically.

**For researchers.** The pre-vaccination samples are valuable, and the public data (CyTOF files on Dryad, RNA data in the Gene Expression Omnibus) allow reanalysis. Useful next steps are: re-run the main comparisons excluding hospitalised participants; test the correlation differences directly; publish the Olink statistics; and test the specific findings (PD1+CTLA4+ SARS-CoV-2-specific CD8+ T cells, CXCR5+ CD4+ subsets, ALAS2) in a larger cohort with severity measures and a disease control group.

**For people citing this paper.** Cite it for higher anti-spike antibodies and a few T cell subset differences in a small, pre-vaccination cohort. Do not cite it as showing that long COVID is caused by T cell exhaustion, a persistent reservoir or systemic inflammation.

## Final assessment

This is a careful laboratory study with a well-chosen set of samples and an unusually open record. Its strengths are real. Infection was confirmed. Samples were taken before vaccination or reinfection. Groups were picked for consistent trajectories over 4 and 8 months. The CyTOF reagents were validated. Several assays were run on the same samples, and the key T cell findings were rechecked by flow cytometry. Null findings are reported in full. The raw data are public, and the peer review file is published.

The problem is the distance between the data and the claims. Most comparisons were null. The positive ones are a handful of unadjusted results near p = 0.05, from 27 versus 16 people, in groups that differ in sex, BMI, comorbidity and hospitalisation, with no adjustment. The flagship claim of an "uncoordinated" response rests on comparing a significant correlation with a non-significant one. "Inflammation" rests on a protein panel with no reported statistics. In two places the text states a finding that its own figure does not support (TFH; CD4+ effector memory cells in women).

**What prevents a higher score.** Many tests behind the main T cell findings, uncorrected, with few and marginal positives. Unadjusted confounding by hospitalisation, sex and BMI, which is especially relevant to the antibody finding. No direct test for the "uncoordinated" claim. No Olink statistics. Small cell counts behind the exhaustion finding. No severity measures and no ME/CFS, PEM, POTS/OI or MCAS status. No replication. A title and abstract that state as findings what the data only suggest.

**What prevents a lower score.** The design is not incapable of answering its question, and the data do not contradict the claims. The sample is small but well characterised, with confirmed infection and pre-vaccination sampling. Several findings were confirmed with a second method. The antibody finding fits other studies. The authors report their nulls, name the main limitations and make the data available. As a hypothesis-generating profile, it is useful.

The main claim, as stated in the title, is weaker than the paper presents it. What the data support is a set of modest, unreplicated differences that are worth testing in a larger cohort.

## Executive summary

This study compared blood from 27 people with long COVID and 16 people who had fully recovered, about 8 months after a first, test-confirmed COVID-19 infection. All samples were taken before vaccination or reinfection, which is a real strength. The team ran several detailed laboratory tests on the same samples, published the raw data and reported the many measures that showed no difference.

The paper's title says long COVID shows "T cell dysregulation, inflammation and an uncoordinated adaptive immune response". The data support something smaller. Most comparisons found no difference. The few that did were mostly just under the usual significance line, and the tests behind them were not corrected for how many were run. The long COVID group had more women, higher body weight, more high blood pressure and lung disease, and twice the rate of hospital stays during the first infection. None of the analyses account for this. That matters most for the higher antibody levels, which are also expected after a more severe first infection. The claim of an "uncoordinated" response rests on links between antibodies and T cells being significant in one group but not the other, which is not the same as showing the groups differ. "Inflammation" rests on a protein panel for which no statistics are given. In two places the text states a finding that its own figure shows was not significant.

The most solid findings are higher antibodies against the virus and more of certain helper T cells in long COVID. The helper T cell finding was rechecked with a second method on the same samples. Nothing is reported on post-exertional malaise, ME/CFS, severity or daily function. Treat this as an early, small, exploratory profile that needs testing in a larger group with better-matched controls.

Grade: 5 / 10.
