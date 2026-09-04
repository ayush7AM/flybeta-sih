/**
 * iGOT Karmayogi Course Catalog (Mock)
 * 
 * Realistic courses mapped to the 4-quadrant FRAC taxonomy
 * for the MoSPI capacity-building recommendation engine.
 */

const IGOT_CATALOG = [
  // ── Statistical ────────────────────────────────────────────────
  {
    identifier: 'igot_stat_001',
    name: 'Survey Design & Sampling Methodology for Official Statistics',
    description: 'Master multi-stage stratified sampling, estimation techniques, and survey quality assurance for NSS/PLFS operations. Covers design effect minimization and non-response adjustment.',
    competencies: ['comp_statistical'],
    duration: '20 hours',
    level: 'Intermediate',
    provider: 'iGOT Karmayogi',
    url: 'https://igotkarmayogi.gov.in/',
  },
  {
    identifier: 'igot_stat_002',
    name: 'National Accounts & GDP Estimation Framework',
    description: 'Understand India\'s GDP compilation methodology under the UN SNA framework. Covers value-added approach, base year revision, and sectoral disaggregation.',
    competencies: ['comp_statistical'],
    duration: '15 hours',
    level: 'Advanced',
    provider: 'iGOT Karmayogi',
    url: 'https://igotkarmayogi.gov.in/',
  },

  // ── Technical ──────────────────────────────────────────────────
  {
    identifier: 'igot_tech_001',
    name: 'Python & R for Statistical Computing',
    description: 'Build reproducible data pipelines for government statistical operations. Covers pandas, NumPy, R tidyverse, and automated report generation for CPI/IIP processing.',
    competencies: ['comp_technical'],
    duration: '25 hours',
    level: 'Intermediate',
    provider: 'iGOT Karmayogi',
    url: 'https://igotkarmayogi.gov.in/',
  },
  {
    identifier: 'igot_tech_002',
    name: 'GIS & Spatial Analytics for Census Operations',
    description: 'Master geospatial tools for enumeration block delineation, spatial sampling, and thematic mapping. Covers QGIS, ArcGIS Pro, and India\'s Village Boundary datasets.',
    competencies: ['comp_technical'],
    duration: '18 hours',
    level: 'Intermediate',
    provider: 'iGOT Karmayogi',
    url: 'https://igotkarmayogi.gov.in/',
  },
  {
    identifier: 'igot_tech_003',
    name: 'AI/ML Applications in Survey Data Quality',
    description: 'Apply machine learning techniques to detect outliers, impute missing values, and flag inconsistent responses in large-scale household surveys. Hands-on labs with scikit-learn.',
    competencies: ['comp_technical'],
    duration: '22 hours',
    level: 'Advanced',
    provider: 'iGOT Karmayogi',
    url: 'https://igotkarmayogi.gov.in/',
  },

  // ── Digital Governance ─────────────────────────────────────────
  {
    identifier: 'igot_dg_001',
    name: 'Cybersecurity & Data Privacy for Government Officials',
    description: 'Understand the IT Act 2000, DPDPA 2023, and CERT-In guidelines. Covers data classification, encryption standards, and secure handling of respondent micro-data.',
    competencies: ['comp_digital_governance'],
    duration: '12 hours',
    level: 'Beginner',
    provider: 'iGOT Karmayogi',
    url: 'https://igotkarmayogi.gov.in/',
  },
  {
    identifier: 'igot_dg_002',
    name: 'Gov-Cloud (MeghRaj) & DPI Systems Integration',
    description: 'Architect secure cloud deployments on NIC/MeghRaj infrastructure. Covers Aadhaar-based authentication, DigiLocker API integration, and gov-cloud compliance frameworks.',
    competencies: ['comp_digital_governance'],
    duration: '16 hours',
    level: 'Intermediate',
    provider: 'iGOT Karmayogi',
    url: 'https://igotkarmayogi.gov.in/',
  },

  // ── Behavioural ────────────────────────────────────────────────
  {
    identifier: 'igot_beh_001',
    name: 'Leadership & Change Management in Government',
    description: 'Develop leadership skills for driving digital transformation in statistical organizations. Covers stakeholder engagement, change management frameworks, and cross-divisional collaboration.',
    competencies: ['comp_behavioural'],
    duration: '10 hours',
    level: 'Beginner',
    provider: 'iGOT Karmayogi',
    url: 'https://igotkarmayogi.gov.in/',
  },
  {
    identifier: 'igot_beh_002',
    name: 'Ethics, Integrity & Statistical Communication',
    description: 'Build skills in ethical data reporting, methodological transparency, and effective presentation of statistical findings to policymakers and Parliament.',
    competencies: ['comp_behavioural'],
    duration: '8 hours',
    level: 'Beginner',
    provider: 'iGOT Karmayogi',
    url: 'https://igotkarmayogi.gov.in/',
  },
];

export default IGOT_CATALOG;
