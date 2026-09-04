/**
 * FRAC Diagnostic Question Bank
 * 12 MCQs — 3 per official MoSPI competency quadrant
 * Aligned to MoSPI capacity-building requirements (SIH 26101)
 * 
 * Tags use the official 4-quadrant taxonomy from competencyTaxonomy.js
 */

import { COMPETENCY_META } from './competencyTaxonomy';

const DIAGNOSTIC_QUESTIONS = [
  // ═══════════════════════════════════════════════════════════════
  // QUADRANT 1: Statistical (comp_statistical)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "stat_01",
    question_text:
      "The National Sample Survey (NSS) generates terabytes of micro-data per round. Which approach is most appropriate for processing unit-level NSS records at scale while preserving sampling weights?",
    options: [
      "Load the full dataset into a single Excel workbook and apply pivot tables",
      "Use a distributed computing framework like Apache Spark with weighted aggregation UDFs",
      "Randomly sample 1% of records and extrapolate results to the full population",
      "Convert all records to PDF format for archival before analysis",
    ],
    correct_answer:
      "Use a distributed computing framework like Apache Spark with weighted aggregation UDFs",
    frac_competency_tag: "comp_statistical",
  },
  {
    id: "stat_02",
    question_text:
      "India's GDP estimation follows which primary methodology as recommended by the UN System of National Accounts (SNA)?",
    options: [
      "Expenditure approach only, summing all household spending",
      "Production (value-added) approach at basic prices with adjustments for taxes and subsidies",
      "Income approach only, summing all wages and profits",
      "Trade balance approach, subtracting imports from exports",
    ],
    correct_answer:
      "Production (value-added) approach at basic prices with adjustments for taxes and subsidies",
    frac_competency_tag: "comp_statistical",
  },
  {
    id: "stat_03",
    question_text:
      "When designing a multi-stage stratified random sample for the Periodic Labour Force Survey (PLFS), which factor is MOST critical for minimizing design effect?",
    options: [
      "Maximizing the number of households per Primary Sampling Unit (PSU)",
      "Using systematic random sampling at every stage",
      "Maximizing the number of PSUs while keeping the per-PSU sample size small",
      "Replacing non-responding households with the nearest neighbour",
    ],
    correct_answer:
      "Maximizing the number of PSUs while keeping the per-PSU sample size small",
    frac_competency_tag: "comp_statistical",
  },

  // ═══════════════════════════════════════════════════════════════
  // QUADRANT 2: Technical (comp_technical)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "tech_01",
    question_text:
      "A district statistical office needs to automate monthly CPI data processing. Which tool combination is most suitable for building a reproducible statistical pipeline?",
    options: [
      "Microsoft Word macros with manual copy-paste into Excel",
      "Python (pandas + NumPy) with scheduled scripts and version-controlled notebooks",
      "A single large SQL query with no documentation",
      "Outsourcing all data processing to a third-party vendor",
    ],
    correct_answer:
      "Python (pandas + NumPy) with scheduled scripts and version-controlled notebooks",
    frac_competency_tag: "comp_technical",
  },
  {
    id: "tech_02",
    question_text:
      "You need to create a choropleth map showing district-wise poverty ratios using Census and SECC data. Which approach is most appropriate?",
    options: [
      "Plot data on Google Maps using manual pin drops",
      "Use QGIS/ArcGIS with shapefiles from the Survey of India, joining poverty data by district code",
      "Create a table in Excel and colour-code cells manually",
      "Take screenshots of existing maps and annotate them in Paint",
    ],
    correct_answer:
      "Use QGIS/ArcGIS with shapefiles from the Survey of India, joining poverty data by district code",
    frac_competency_tag: "comp_technical",
  },
  {
    id: "tech_03",
    question_text:
      "An AI/ML model trained to detect outliers in Annual Survey of Industries (ASI) data shows 95% training accuracy but only 40% accuracy on new data. What is the most likely issue?",
    options: [
      "The model needs more complex architecture (deeper neural network)",
      "The model is overfitting — it memorized training data rather than learning generalizable patterns",
      "The test data is corrupt and should be discarded",
      "AI models cannot be applied to survey data",
    ],
    correct_answer:
      "The model is overfitting — it memorized training data rather than learning generalizable patterns",
    frac_competency_tag: "comp_technical",
  },

  // ═══════════════════════════════════════════════════════════════
  // QUADRANT 3: Digital Governance (comp_digital_governance)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "dg_01",
    question_text:
      "Under the Information Technology Act, 2000 and the Digital Personal Data Protection Act (DPDPA) 2023, which practice is MANDATORY when collecting respondent data in government surveys?",
    options: [
      "Publishing all individual respondent data on the ministry website for transparency",
      "Obtaining informed consent, implementing data minimization, and ensuring purpose limitation",
      "Collecting as much personal data as possible for future use cases",
      "Storing data indefinitely without any retention policy",
    ],
    correct_answer:
      "Obtaining informed consent, implementing data minimization, and ensuring purpose limitation",
    frac_competency_tag: "comp_digital_governance",
  },
  {
    id: "dg_02",
    question_text:
      "A government statistical database hosted on MeghRaj (GI Cloud) requires secure access. Which mechanism aligns with NIC and CERT-In cybersecurity guidelines?",
    options: [
      "Single shared password for all department staff posted on the intranet",
      "Multi-Factor Authentication (MFA) with role-based access control (RBAC) and audit logging",
      "No authentication — data should be freely accessible to all government employees",
      "Email-based login with no password requirement",
    ],
    correct_answer:
      "Multi-Factor Authentication (MFA) with role-based access control (RBAC) and audit logging",
    frac_competency_tag: "comp_digital_governance",
  },
  {
    id: "dg_03",
    question_text:
      "The Digital Public Infrastructure (DPI) stack in India includes several core platforms. Which of the following is NOT part of India's DPI ecosystem?",
    options: [
      "Aadhaar (unique digital identity)",
      "UPI (Unified Payments Interface)",
      "DigiLocker (document verification)",
      "Microsoft Azure Government Cloud",
    ],
    correct_answer: "Microsoft Azure Government Cloud",
    frac_competency_tag: "comp_digital_governance",
  },

  // ═══════════════════════════════════════════════════════════════
  // QUADRANT 4: Behavioural (comp_behavioural)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "beh_01",
    question_text:
      "You are leading a cross-divisional team (NSO + DPD + FOD) to implement a new digital data collection system. Multiple divisions resist the change. What is the most effective leadership approach?",
    options: [
      "Issue a mandatory directive and penalize non-compliance",
      "Engage stakeholders early with pilot demonstrations, address concerns, and create change champions in each division",
      "Implement the system without informing the teams until launch day",
      "Abandon the initiative because of resistance",
    ],
    correct_answer:
      "Engage stakeholders early with pilot demonstrations, address concerns, and create change champions in each division",
    frac_competency_tag: "comp_behavioural",
  },
  {
    id: "beh_02",
    question_text:
      "While preparing a statistical report for the Cabinet Secretariat, you discover that the data methodology has a limitation that could affect interpretation. What is the most ethical course of action?",
    options: [
      "Omit the limitation to avoid complicating the narrative",
      "Clearly document the methodological limitation in the report with its potential impact on findings",
      "Modify the data to eliminate the limitation's effect",
      "Delay the report indefinitely until the limitation is resolved",
    ],
    correct_answer:
      "Clearly document the methodological limitation in the report with its potential impact on findings",
    frac_competency_tag: "comp_behavioural",
  },
  {
    id: "beh_03",
    question_text:
      "A large-scale survey project is falling behind schedule due to field enumeration delays. As the project manager, which approach best demonstrates project management competency?",
    options: [
      "Reduce the sample size to meet the deadline without informing stakeholders",
      "Reassess the critical path, reallocate field resources, communicate revised timelines to stakeholders, and implement daily progress tracking",
      "Blame the field staff and demand overtime without additional resources",
      "Wait until the deadline passes and then report the delay",
    ],
    correct_answer:
      "Reassess the critical path, reallocate field resources, communicate revised timelines to stakeholders, and implement daily progress tracking",
    frac_competency_tag: "comp_behavioural",
  },
];

export default DIAGNOSTIC_QUESTIONS;

// Re-export COMPETENCY_META from the taxonomy file for backward compatibility
export { COMPETENCY_META } from './competencyTaxonomy';
