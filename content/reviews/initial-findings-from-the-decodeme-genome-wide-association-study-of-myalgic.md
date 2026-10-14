---
title: >-
  Initial findings from the DecodeME genome-wide association study of myalgic
  encephalomyelitis/chronic fatigue syndrome
authors: >-
  DecodeME, Boutin T, Bretherick AD, Dibble JJ, Ewaoluwagbemiga E, Northwood E,
  Samms GL, Vitart V, Almelid Ø, Baker T, Clyde M, Connolly A, Garcia D, Kerr
  SM, Tripp C, Wolfe JC, Goold J, Hoyes G, Leary S, McGrath SJ, Milton J,
  Redshaw A, Wilson JM, Baxter H, Boobyer D, Dransfield C, Lamirel D, Lewis I,
  Muirhead N, Ponting E, Shepherd C, Turner A, Baby SV, Beentjes S, Ireland J,
  Khamseh A, McDowall E, Perry D, Slaughter J, Abner E, Boer CG, Finer S,
  Haapaniemi H, Ollila HM, Pollack B, Rosmalen J, Romppanen E, Saafi S, Saxena
  R, Sinnott-Armstrong N, Tervi A, Urpa L, Valliere J, van Heel DA, Chowdhury S,
  Devereux-Cooke A, Ponting CP
journal: medRxiv (preprint)
year: 2025
doi: 10.1101/2025.08.06.25333109
conditions:
  - ME/CFS
studyType: 'Case-control genome-wide association study, 15,579 cases vs 259,909 controls'
kind: paper
score: 6.5
verdict: >-
  A large, careful genetics study with probable real findings; no valid cohort
  yet exists to replicate them, and the framing outruns that.
confidence: moderate
importance: high
strengths:
  - 'Largest ME/CFS genetics study; 15,579 cases'
  - Analysis plan published before genotypes arrived
  - Case definition requires post-exertional malaise
  - 'Thorough, transparent genotype quality control'
  - Summary statistics publicly available
weaknesses:
  - Artefact risk rests on internal checks alone
  - 'Cases and controls genotyped apart, unequal checks'
  - Post-exertional malaise self-reported on one item
  - Exclusion criteria dropped mid-recruitment
  - Key genome-wide artefact checks unreported
  - Abstract and lay summary overstate findings
context:
  - note: >-
      In September 2026 a separate genome-wide association study from the same
      Edinburgh groups (Slaughter et al.) reported seven loci replicated in UK
      Biobank and/or All of Us; these loci were not seen in DecodeME, and
      DecodeME's loci did not replicate there.
    source: >-
      https://meassociation.org.uk/2026/09/research-medrxiv-preprint-seven-replicated-genomic-associations-of-me-cfs/
  - note: >-
      As of October 2026 the preprint has one version (posted 8 August 2025) and
      no journal publication.
    source: 'https://www.medrxiv.org/content/10.1101/2025.08.06.25333109v1'
  - note: >-
      DecodeME genotype data were reused in a PrecisionLife combinatorial
      analysis published in the Journal of Translational Medicine in April 2026.
    source: 'https://link.springer.com/article/10.1186/s12967-026-08167-1'
guideNotes:
  - >-
    Genetics: cases and controls genotyped separately (DNA source, era, batch)
    and unequal quality-control filters
  - 'Genetics: check whether discovery and replication analyses share controls'
  - 'Genetics: how to count loci found only in subsampled or stratified analyses'
  - 'Genetics: internal consistency (e.g. across sexes) is not replication'
  - 'Genetics: replication tables must report effect direction, not only p-values'
  - >-
    Genetics: absence of colocalisation is not evidence of distinct causal
    variants unless that hypothesis itself has high probability
  - >-
    Genetics: colocalisation in a sub-region chosen after inspection is
    exploratory
  - >-
    Genetics: replication in loosely defined biobank cases has unknown power;
    prefer genetic correlation and direction tests
  - >-
    Genetics: when no valid replication cohort exists, missing replication
    limits the claims but is not a design flaw; weight internal artefact checks
    more
reviewedOn: '2026-10-14'
guideVersion: '0.5'
model: claude-opus-5-5
---
## Executive summary

DecodeME is the largest genome-wide association study (GWAS) of myalgic encephalomyelitis/chronic fatigue syndrome (ME/CFS) so far. A GWAS scans the whole genome for common DNA variants that are more frequent in people with a condition than in people without it. DecodeME compares 15,579 UK cases of European ancestry with 259,909 UK Biobank controls and reports eight genome-wide significant loci (regions of the genome).

The work is careful. The analysis plan was published before case genotypes arrived, quality control (QC) was extensive and well documented, and summary statistics are public. The six loci from the primary analysis are probably real associations with the DecodeME phenotype.

No cohort yet exists that could properly replicate these findings. That is not a fault of the study, but it limits what the study can show. It also means technical artefact must be ruled out by internal checks alone, and those checks are not complete. The biobank cohorts the authors used for replication have loose case definitions, report no effect directions, and may share controls with the discovery analysis. They can neither confirm nor refute single loci. One locus (near the gene RABGAP1L) does pass correction for multiple testing in one cohort, although the paper's text says none did. A sister study from the same group has since found loci that do not overlap with DecodeME's.

The findings are best read as strong but provisional. Phrases like "first robust evidence" and "firm biological foundation" claim more than that.

## Study design

This is a case-control GWAS. Cases were recruited directly through media and patient networks between September 2022 and January 2024. They completed a questionnaire and posted a saliva sample from home. Cases were genotyped in four batches by Thermo Fisher on the UK Biobank Axiom array. Controls are UK Biobank participants, genotyped on the same array about a decade earlier from blood. Missing genotypes were filled in statistically (imputation) for cases and controls together.

The Data Analysis Plan was published in March 2023 and updated in March 2024, before case genotypes were received. That is good practice and rare in this field.

Six GWAS were run: the primary analysis (GWAS-1), a version with fewer controls kept back for a future UK Biobank replication (GWAS-2), females only, males only, cases reporting infection at onset, and cases not reporting it.

## Sample selection

**Case definition.** Cases had to report a diagnosis of ME/CFS from a health professional. This was self-reported, not verified. They also had to meet questionnaire versions of the Institute of Medicine criteria or the Canadian Consensus Criteria. Both require post-exertional malaise (PEM). That is a real improvement on earlier ME/CFS genetics, which mostly relied on diagnosis codes or self-report alone.

The PEM measure itself is weak. It was a single self-report item: symptoms worsen after exertion, reduce activity, and "can be for over a day". There is no frequency or severity threshold, nothing on the delay in onset, and no validated instrument such as the PEM items of the DePaul Symptom Questionnaire (DSQ). This is better than the Fukuda criteria, which do not require PEM, but falls short of what "PEM required" usually means.

**Exclusions dropped during recruitment.** The Canadian Consensus Criteria exclude people whose symptoms are better explained by one of 25 conditions. DecodeME applied this at first. On 26 June 2023, on the advice of its Scientific Advisory Board, it dropped these exclusions. The stated reasons were to meet the recruitment target and to avoid excluding people of lower socioeconomic status. More than 7,800 extra participants were then asked for saliva. The authors planned a sensitivity analysis, but only to be run if a locus shared a genetic signal with a comorbid condition. None did, so it was not run. That trigger is too narrow. A direct check would be to rerun GWAS-1 on cases who were eligible before June 2023 and compare effect sizes.

**Who took part.** 84.5% of cases were female and 96.5% White. Most were in the "mild" or "moderate" impact categories of the National Institute for Health and Care Excellence (NICE), and 59.5% had been ill for at least ten years. About 63% reported an infection at onset. This was recalled, often many years later. Status for postural orthostatic tachycardia syndrome or other orthostatic intolerance, and for mast cell activation syndrome, is not reported. Under-representation of the most severely ill matters less for a GWAS than for a biomarker study, as long as cases are true cases.

**Controls.** Controls are UK Biobank participants with ME/CFS self-reports and relevant diagnosis or primary-care codes removed. These are general-population controls, which is standard for a GWAS. The guide's advice on sedentary controls does not apply to inherited DNA variants.

## Bias

**Differential genotyping.** This is the largest technical risk in the design, and it carries extra weight because no external cohort can check for it. Cases and controls differ in DNA source (saliva against blood), genotyping date, laboratory batch and the software run that turned raw signals into genotype calls. Each of these can produce false differences in allele frequency.

The authors know this and took serious steps. They imputed cases and controls together. They recalled 4,700 UK Biobank samples to check that their calls matched UK Biobank's. They tested for plate and batch effects, inspected genotype clusters, compared control allele frequencies against the gnomAD reference database, and discarded associations without supporting nearby variants.

Some checks were applied unequally. The allele-frequency check against the imputation reference panel was applied to controls but not cases. Thresholds for Hardy-Weinberg equilibrium, a standard test for genotyping errors, differed between the groups. Cluster inspection focused on cases, and in controls it covered only one UK Biobank batch. Each choice has a stated reason. Together they mean cases and controls did not pass through identical filters.

Genomic inflation is low (the inflation factor λ is 1.003–1.066, where 1 means no inflation), which is reassuring. The LD score regression (LDSC) intercept is not reported. LDSC uses linkage disequilibrium (LD), the tendency of nearby variants to be inherited together, to separate real polygenic signal from artefact. In a study that cannot be externally replicated, this is the most important missing check.

**Participation bias.** Both groups are volunteers, but different kinds. Controls come from UK Biobank's healthy-volunteer cohort. Cases responded to a patient-led recruitment campaign. Willingness to take part in research is partly heritable. This could create weak genome-wide differences. It is unlikely to produce sharp single-locus signals.

**Author preconceptions.** The study was co-produced with patient charities, and several authors lead advocacy organisations. This is disclosed. Co-production clearly helped recruitment. Its influence is visible in the framing of the discussion and lay summary (see Interpretation and spin). It is not visible in the statistics, which followed the published plan.

## Statistical and methodological issues

**Six loci, or eight.** GWAS-1 found six loci. The other two come from secondary analyses. The locus near OLFM4 was significant in the infection-onset subgroup and in GWAS-2. The locus near TAOK3 and SUDS3 was significant only in GWAS-2. GWAS-2 uses the same cases as GWAS-1 with a subset of its controls, so it has less power. In GWAS-1 these two loci reached p = 1.2 × 10⁻⁷ and 1.6 × 10⁻⁷. A locus that crosses the threshold only when controls are removed is more likely a chance fluctuation near the threshold than a new finding. Six GWAS were run, all at the unadjusted genome-wide threshold of p < 5 × 10⁻⁸. The fair headline is six loci plus two candidates.

Several leads sit close to the threshold. The lead near FBXL4 is at 4.9 × 10⁻⁸, the chromosome 1 lead (chr1q25.1) at 2.6 × 10⁻⁸, and all three infection-subgroup leads lie between 2.6 and 5 × 10⁻⁸. Four leads are imputed insertions or deletions. The TAOK3 lead is a run of 13 Ts. Variants like these are harder to call than single-letter changes.

**External replication.** No existing cohort combines a large sample, genotypes and a case definition close to DecodeME's. So the absence of clean replication is a limit on the evidence, not a flaw in the study. The authors nonetheless presented two biobank meta-analyses as replication attempts and drew conclusions from them, so those analyses are assessed here.

- R-1 combined Lifelines (a Dutch cohort) and UK Biobank cases defined by fatigue and PEM-like questions, without requiring a diagnosis.
- R-2 combined six biobanks with cases defined by diagnosis codes.

The text says that no association replicated in R-1 after Bonferroni correction across 22 tests. Table S3 contradicts this. The chr1q25.1 lead (rs12071663, near RABGAP1L) has R-1 p = 0.0018. The corrected threshold for 22 tests is 0.0023, so it passes. Two further genome-wide loci came close: CA10 (p = 0.005) and OLFM4 (p = 0.0067). FBXL4 had p = 0.034. The locus near BTN2A2 (p = 0.38) and the locus near CCPG1 (p = 0.85) showed nothing. The strongest locus, near ARFGEF2, and the TAOK3 locus had no usable stand-in variants in R-1, so they were not tested there. In R-2, none of the seven testable genome-wide loci reached p < 0.05.

Three problems limit what these results mean.

1. **No effect directions.** Table S3 reports only p-values. A small p-value with the effect in the opposite direction is not replication. Readers cannot check this.
2. **Possible shared controls.** R-1's UK Biobank arm used 195,103 controls. GWAS-1 used 259,909 UK Biobank controls. There may not be enough suitably genotyped Europeans in UK Biobank for these groups to be fully separate. The paper does not say. Shared controls make discovery and replication statistics correlated, pushing replication results toward the same direction. GWAS-2 was built to avoid this, but R-1 was compared against GWAS-1.
3. **Loose case definitions.** Lifelines cases needed one DSQ PEM item at "about half the time" and "moderate" severity, with no diagnosis. UK Biobank cases needed three questions on persistent, exertion-related fatigue. R-2 used diagnosis codes, which the authors' own earlier work describes as inaccurate. If only a fraction of these "cases" have ME/CFS, true effects shrink roughly in proportion, and power falls steeply. For a true log-odds ratio of 0.06–0.08, the chance of passing correction in R-1 or R-2 is near certain if all cases are true cases. It falls to about 40% if half are, and to about 5–9% if 30% are. The true fraction is unknown. (The main text says Lifelines cases were clinically diagnosed. The Supplementary Methods say they were not necessarily diagnosed. The two descriptions conflict.)

This cuts both ways. Null results in loosely defined cohorts are weak evidence against DecodeME's loci. Nominal hits in cohorts made up largely of people with general fatigue are weak evidence that the loci are specific to ME/CFS. The paper counts R-1's nominal hits as support and explains R-2's nulls by poor case definition. The same weak phenotype cannot be strong enough to support the findings and too weak to challenge them. The honest reading is that these cohorts cannot settle single loci either way.

Partial substitutes for replication exist and do not need a perfect cohort: genome-wide genetic correlation with the biobank phenotypes, and tests of effect direction across all tested variants. Neither is reported.

**Internal "replication".** Two of three loci found in females reached p < 0.05/3 in males. This shows the signals are not specific to one sex. It is not replication, because it shares the same pipeline, the same control source and any genotyping artefact. No locus shows a sex difference (all p > 0.06, Table S2).

**Infection-onset effect.** At OLFM4, the effect size (β) is 0.095 ± 0.017 with infection at onset against 0.034 ± 0.022 without. A simple difference test gives z ≈ 2.2, p ≈ 0.03. That is nominal, on the locus that defined the subgroup, and the paper reports no formal test of the difference. The absence of hits in the no-infection subgroup mostly reflects its smaller size (5,841 cases).

**Genetic correlations not reported.** The Methods say LDSC was used to estimate genetic correlations with other traits. No results appear. Genome-wide correlations with depression, anxiety, fibromyalgia, chronic pain and the R-1 and R-2 phenotypes are the most informative test of the paper's claims. They use the whole genome rather than eight loci, so they are much less affected by small or diluted case groups.

**Depression colocalisation.** Colocalisation asks whether two traits that are both associated with a region share the same causal variant. Three of the eight regions had earlier links to depression phenotypes (Table S8).

- At chr1q25.1, the probability that ME/CFS and "feeling miserable" have different causal variants is 0.99. This supports the authors.
- At chr13q14.3 (major depression) and chr20q13.13 (depression), the most likely outcome (probability about 0.6) is that the depression study shows no clear signal in the region at all. A shared causal variant still has a probability of about 0.2 (0.21 and 0.19). These two results are inconclusive, not evidence of separate genetics.

**CA10 and chronic pain.** Across the whole region on chromosome 17 (chr17q22), colocalisation favours *different* causal variants for ME/CFS and multisite chronic pain (probability 0.70 for different variants, 0.30 for a shared one). The shared-variant result the abstract relies on (probability 0.93) comes from a 90-variant sub-window chosen after seeing the region's complex association pattern. Splitting the region has a reason, because the method assumes one causal variant per region. A method that allows several signals would be the principled fix. As it stands this is exploratory.

**Human leukocyte antigen (HLA).** The association with the immune-gene variant HLA-DQA1*05:01 is flagged by the authors as unverified, because HLA types were imputed separately for cases and controls. Table S11 adds a further reason for caution. The reported p = 1.4 × 10⁻¹⁰ comes from the most significant of three processing pipelines. The two pipelines matched to UK Biobank's method give 1.7 × 10⁻⁸ and 2.6 × 10⁻⁵.

**Heritability.** The share of liability explained by common variants is estimated at 0.095. The assumed population prevalence, on which this depends, is not given in the main text.

## Biological plausibility

Genes were assigned to loci by checking whether the ME/CFS signal matches signals that change gene activity in tissue samples from the Genotype-Tissue Expression project (GTEx). That is a reasonable first step but weak evidence for which gene is causal. Fine-mapping has not been done. The proposed mechanisms rest mostly on single studies of each gene's function, with the direction of effect often taken from one tissue. Examples are RABGAP1L reducing defence against infection, BTN2A2 impairing T-cell responses, and SUDS3 suppressing microglial inflammation. The paper calls these candidates in the results section. The abstract and lay summary are less careful.

Enrichment in brain tissue (13 of 54 GTEx tissues) is real but not specific. Most behavioural, psychiatric, pain and fatigue-related traits show the same pattern. It does not separate ME/CFS from depression, chronic pain or general ill health.

The guide's four questions about PEM (multiple triggers, same clinical picture, delayed onset, duration) do not apply directly. Nothing in a GWAS addresses them, and the paper does not claim to.

## Interpretation and spin

The results section is mostly measured. The discussion, lay summary and publicity are not. The core problem is that findings which cannot yet be externally checked are presented as settled.

- Discussion: the results "now place ME/CFS research on a firm biological foundation". No locus has been checked in a valid independent cohort and none is fine-mapped.
- Discussion: DecodeME provides "the first robust evidence that genetic variation contributes to the risk of developing ME/CFS". Family studies already showed heritability. "Robust" does not fit loci that are, for now, provisional.
- Discussion: "We achieved replication within our study." This refers to consistency between sexes in the same dataset.
- Discussion: "These stringent criteria will have prevented the cohort being diluted." Exclusion criteria were dropped part-way through recruitment.
- Lay summary: "None are related to depression or anxiety." This holds clearly for one of three depression-linked loci.
- Lay summary: "ME/CFS is partly caused by genes related to the immune and nervous systems." Association near a gene is not causation through that gene.
- Abstract: "The ME/CFS association near CA10 colocalises with a known association to multisite chronic pain." This holds only in a sub-window chosen after inspection.
- Press release quote attributed to the lead author: the results "speak the language of ME/CFS".

The abstract reports the R-1 results as associations at p < 0.05, which is accurate. A reader could easily take it as replication.

## What this demonstrates

- Six loci are associated with the DecodeME phenotype. They are probably real within this cohort.
- The locus near RABGAP1L passes correction for multiple testing in a loosely defined external cohort, direction not reported.
- The share of liability explained by common variants is modest, about 9.5%.
- No locus shows a sex difference. Common variants outside the sex chromosomes do not explain the female bias.
- A large, consented, recontactable cohort with genotypes now exists. That has value apart from the headline findings.

It does not yet show that these loci hold in an independent ME/CFS cohort, which genes are causal, whether the loci are specific to ME/CFS rather than to fatigue or chronic pain more broadly, or that immune or neural pathways cause ME/CFS. Some of these gaps reflect the absence of a suitable comparison cohort rather than anything the study did wrong.

## Critical missing elements

- The LDSC intercept, and genetic correlations with depression, anxiety, chronic pain, fibromyalgia and the R-1 and R-2 phenotypes.
- Effect directions and per-cohort results for R-1 and R-2.
- A statement on whether GWAS-1 and R-1 share controls, and replication run against GWAS-2 instead.
- A sensitivity analysis restricted to cases recruited under the original exclusion criteria.
- A formal test of the difference between infection and no-infection onset.
- The planned independent UK Biobank replication (GWAS-3 and GWAS-4), described in August 2025 as coming "in due course".
- Reconciliation with the loci from Slaughter et al. (2026).

## Context beyond the paper

In September 2026 a separate GWAS from the same Edinburgh groups (Slaughter et al.) used UK Biobank cases defined by several lines of evidence. It reported seven loci replicated in UK Biobank and/or All of Us. These were not seen in DecodeME, and the DecodeME associations tested there did not replicate. The lead author suggested differences in how and when people were diagnosed, and in severity. That is one possible explanation. Artefact in one or both studies is another. Neither has been ruled out. The Slaughter cohort is small (1,268 cases), so it is not a strong test of DecodeME either.

The preprint has not been published in a journal after 14 months. DecodeME genotype data have already been reused in a published combinatorial analysis, so downstream work is building on loci that are not yet externally confirmed.

## Recommendations

For readers: treat the six primary loci as strong but provisional leads, not as established ME/CFS genes. Treat the proposed immune and neural mechanisms as hypotheses. Do not cite this paper as showing that ME/CFS is an immune or neurological disease.

For the authors, several analyses would settle much of this using data they already hold:

1. **The LDSC intercept.** This is the main internal check against artefact in a study that cannot be externally replicated.
2. **Genetic correlation** between DecodeME and the R-1 and R-2 summary statistics. A high correlation would support the idea that the cohorts share genetics but have noisy labels. A low one would mean the biobank phenotypes are a different trait.
3. **Direction tests**: check whether replication effects point the same way as discovery effects across all tested variants.
4. **Dose-response**: check whether effects shrink more in cohorts with looser case definitions.
5. **Two-way comparison with Slaughter et al.** using matched phenotypes. If PEM-defined UK Biobank cases replicate DecodeME's loci and not the reverse, that favours phenotype differences. If neither replicates the other, artefact becomes a serious concern.

For the field: a properly phenotyped replication cohort, with PEM measured by a validated instrument and genotyped in the same way as the cases it is compared with, is what would turn these leads into established findings.

## Final assessment

**Score: 6.5.** The core claim, that these loci are associated with ME/CFS as defined in this cohort, holds with specific caveats. The framing claims more than that.

What prevents a higher score:
- Without a valid replication cohort, artefact must be excluded internally. Cases and controls differ in DNA source and genotyping era, some quality checks were applied unequally, and the LDSC intercept is not reported.
- Genome-wide genetic correlations and effect directions in the replication cohorts are not reported, although both were within reach.
- Two of the eight loci come from secondary, partly overlapping analyses.
- The depression and chronic-pain claims in the abstract and lay summary are only partly supported by the authors' own tables.
- The discussion presents provisional findings as robust.

What prevents a lower score:
- The analysis plan was published before genotypes arrived.
- The sample is very large, and the case definition requires PEM, even if weakly measured.
- Quality control was unusually thorough and transparent, and genomic inflation is low.
- Effects are consistent across sexes, and one locus passes correction for multiple testing in an external cohort.
- Summary statistics are public.
- The results section is mostly careful.

The lack of external replication is not counted against the study as a design flaw. No suitable cohort exists. It limits what the study can show, which is why its claims should have been framed as provisional. Framed that way, the paper would sit around 7.

Confidence is moderate. Effect directions in the replication cohorts, whether discovery and replication share controls, the LDSC intercept and genome-wide genetic correlations are all unreported. Any of these could move the assessment.
