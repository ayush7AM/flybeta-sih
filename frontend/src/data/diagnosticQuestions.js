/**
 * FRAC Diagnostic Question Bank
 * 12 MCQs — 3 per competency domain
 * Aligned to MoSPI capacity-building requirements (SIH 26101)
 */

const DIAGNOSTIC_QUESTIONS = [
  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 1: Big Data & Modern Statistics (comp_big_data_analytics)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "bd_01",
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
    frac_competency_tag: "comp_big_data_analytics",
  },
  {
    id: "bd_02",
    question_text:
      "A district-level statistical office receives daily price data from 300+ market centres for the Consumer Price Index (CPI). What is the most reliable strategy for handling missing or delayed market reports?",
    options: [
      "Exclude the missing market entirely from the index calculation",
      "Apply statistical imputation methods such as last-observation-carried-forward (LOCF) combined with seasonal adjustment",
      "Wait indefinitely until all 300 markets report before computing the index",
      "Replace all missing values with the national average price",
    ],
    correct_answer:
      "Apply statistical imputation methods such as last-observation-carried-forward (LOCF) combined with seasonal adjustment",
    frac_competency_tag: "comp_big_data_analytics",
  },
  {
    id: "bd_03",
    question_text:
      "When designing a data pipeline to ingest Annual Survey of Industries (ASI) returns submitted in multiple regional formats (CSV, XML, scanned forms), which architecture pattern best ensures data quality?",
    options: [
      "Directly load all files into a single SQL table without validation",
      "Implement an ELT (Extract-Load-Transform) pipeline with schema validation, deduplication, and automated anomaly detection at the staging layer",
      "Manually review each submission and re-type the data into a spreadsheet",
      "Reject all submissions that are not in CSV format",
    ],
    correct_answer:
      "Implement an ELT (Extract-Load-Transform) pipeline with schema validation, deduplication, and automated anomaly detection at the staging layer",
    frac_competency_tag: "comp_big_data_analytics",
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 2: AI & ML in Official Statistics (comp_ai_ml_statistics)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ai_01",
    question_text:
      "MoSPI wants to use machine learning to auto-classify economic activities reported in free-text fields of the Economic Census into NIC (National Industrial Classification) codes. Which approach is most suitable?",
    options: [
      "Use a rule-based regex matcher that searches for exact keyword matches",
      "Train a supervised text classification model (e.g., fine-tuned BERT) on historically labelled NIC-coded records",
      "Ask each enumerator to manually assign the NIC code during field collection",
      "Apply K-means clustering on the raw text without any labelled data",
    ],
    correct_answer:
      "Train a supervised text classification model (e.g., fine-tuned BERT) on historically labelled NIC-coded records",
    frac_competency_tag: "comp_ai_ml_statistics",
  },
  {
    id: "ai_02",
    question_text:
      "A pilot project uses satellite imagery to estimate crop acreage for the Agriculture Census. The model achieves 95% accuracy on training data but only 60% on new district images. What is the most likely issue?",
    options: [
      "The satellite images are too high-resolution for the model to process",
      "The model is overfitting to the training region and lacks generalization — more diverse training data and regularization are needed",
      "The model needs to be converted from Python to Java for better performance",
      "60% accuracy is acceptable for government use and no further action is needed",
    ],
    correct_answer:
      "The model is overfitting to the training region and lacks generalization — more diverse training data and regularization are needed",
    frac_competency_tag: "comp_ai_ml_statistics",
  },
  {
    id: "ai_03",
    question_text:
      "When deploying an AI model that predicts GDP nowcasts from high-frequency indicators (GST collections, e-way bills), what is the most critical governance requirement for MoSPI?",
    options: [
      "The model should be a black-box deep neural network to maximize accuracy",
      "Model explainability, version control, and an audit trail so that published estimates can be reproduced and justified to Parliament",
      "The model should only run on a single analyst's laptop for security",
      "Accuracy is irrelevant as long as the model runs faster than the previous method",
    ],
    correct_answer:
      "Model explainability, version control, and an audit trail so that published estimates can be reproduced and justified to Parliament",
    frac_competency_tag: "comp_ai_ml_statistics",
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 3: GIS & Spatial Analytics (comp_gis_spatial)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "gis_01",
    question_text:
      "For the upcoming Census, MoSPI plans to digitize Enumeration Block (EB) boundaries. What is the most appropriate spatial data format and coordinate reference system for India-wide census mapping?",
    options: [
      "Store boundaries as JPEG images georeferenced with Google Maps screenshots",
      "Use GeoJSON or Shapefile format with WGS 84 (EPSG:4326) or Everest/India-specific projected CRS for area calculations",
      "Use plain CSV files with latitude and longitude columns only, no polygon support",
      "Store all boundaries as descriptive text (e.g., 'North of the river, east of the highway')",
    ],
    correct_answer:
      "Use GeoJSON or Shapefile format with WGS 84 (EPSG:4326) or Everest/India-specific projected CRS for area calculations",
    frac_competency_tag: "comp_gis_spatial",
  },
  {
    id: "gis_02",
    question_text:
      "A state statistical bureau wants to create a poverty heat map by overlaying BPL (Below Poverty Line) household data with SECC (Socio-Economic Caste Census) records at the village level. What is the key technical challenge?",
    options: [
      "Converting the data to a pie chart format",
      "Spatial join accuracy — matching household records to the correct village polygon requires geocoded addresses or a reliable location code (LGD code) linkage",
      "Choosing the right colour palette for the map",
      "Poverty data cannot be displayed on maps due to privacy laws",
    ],
    correct_answer:
      "Spatial join accuracy — matching household records to the correct village polygon requires geocoded addresses or a reliable location code (LGD code) linkage",
    frac_competency_tag: "comp_gis_spatial",
  },
  {
    id: "gis_03",
    question_text:
      "MoSPI is building a national dashboard that displays district-wise IIP (Index of Industrial Production) on an interactive map. Which technology stack is most appropriate for serving this to thousands of concurrent government users?",
    options: [
      "Embed a static screenshot of a desktop GIS application in the dashboard",
      "Use a tile-server (e.g., GeoServer or Mapbox) with vector tiles, served via a CDN, and rendered client-side with a library like Leaflet or Mapbox GL JS",
      "Email individual PDF maps to each user on request",
      "Use a single Google My Maps link shared across all departments",
    ],
    correct_answer:
      "Use a tile-server (e.g., GeoServer or Mapbox) with vector tiles, served via a CDN, and rendered client-side with a library like Leaflet or Mapbox GL JS",
    frac_competency_tag: "comp_gis_spatial",
  },

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN 4: Cloud Infrastructure for Gov Data (comp_cloud_infrastructure)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "cloud_01",
    question_text:
      "MoSPI is migrating its on-premise data warehouse to the MeghRaj (GI Cloud) platform. Which data residency and compliance requirement is most critical?",
    options: [
      "All data must be stored on personal USB drives for portability",
      "Data must reside within Indian sovereign territory, comply with MeitY cloud guidelines, and be encrypted at rest and in transit",
      "Any international cloud provider (US/EU region) can be used without restrictions for government data",
      "Data residency requirements only apply to defence data, not statistical data",
    ],
    correct_answer:
      "Data must reside within Indian sovereign territory, comply with MeitY cloud guidelines, and be encrypted at rest and in transit",
    frac_competency_tag: "comp_cloud_infrastructure",
  },
  {
    id: "cloud_02",
    question_text:
      "During the decennial Census, data submission volumes spike 100x for 3 months and then drop to near-zero. Which cloud architecture pattern is most cost-effective for handling this?",
    options: [
      "Provision permanent high-capacity servers that run year-round at full capacity",
      "Use auto-scaling compute groups (e.g., Kubernetes HPA or serverless functions) that scale up during peak Census months and scale down automatically after",
      "Process all Census data manually on desktop computers in field offices",
      "Delay Census data processing until the following year when servers are free",
    ],
    correct_answer:
      "Use auto-scaling compute groups (e.g., Kubernetes HPA or serverless functions) that scale up during peak Census months and scale down automatically after",
    frac_competency_tag: "comp_cloud_infrastructure",
  },
  {
    id: "cloud_03",
    question_text:
      "A MoSPI data lake stores sensitive household survey micro-data alongside publicly available aggregate statistics. What is the best practice for access control?",
    options: [
      "Give all employees full admin access to simplify operations",
      "Implement role-based access control (RBAC) with data classification tiers — public aggregates are open, while unit-level micro-data requires MFA and is restricted to authorized statistical officers only",
      "Store all data in a single unencrypted S3 bucket with a public URL",
      "Access control is unnecessary because government data is not valuable to attackers",
    ],
    correct_answer:
      "Implement role-based access control (RBAC) with data classification tiers — public aggregates are open, while unit-level micro-data requires MFA and is restricted to authorized statistical officers only",
    frac_competency_tag: "comp_cloud_infrastructure",
  },
];

export default DIAGNOSTIC_QUESTIONS;

/**
 * FRAC Competency Tag Metadata
 * Used for display labels and domain colors in the results screen
 */
export const COMPETENCY_META = {
  comp_big_data_analytics: {
    label: "Big Data & Modern Statistics",
    color: "#2563EB",
    icon: "📊",
  },
  comp_ai_ml_statistics: {
    label: "AI & ML in Official Statistics",
    color: "#7C3AED",
    icon: "🤖",
  },
  comp_gis_spatial: {
    label: "GIS & Spatial Analytics",
    color: "#059669",
    icon: "🗺️",
  },
  comp_cloud_infrastructure: {
    label: "Cloud Infrastructure for Gov Data",
    color: "#EA580C",
    icon: "☁️",
  },
};
