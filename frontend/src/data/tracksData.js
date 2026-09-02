export const MOSPI_TRACKS = [
  {
    id: "mospi-ts-01",
    title: "Big Data & Modern Statistics",
    tagline: "High-throughput data wrangling for National Sample Surveys & CPI indices.",
    description: "Master modern statistical computing, moving beyond manual tabulations to distributed data processing for National Accounts, price indices, and large-scale demographic surveys.",
    frac_competency_tag: "comp_big_data_analytics",
    level: "Intermediate",
    duration: "18 Hours",
    modulesCount: 4,
    modules: [
      { id: "mod-01-1", title: "Automated CPI & Index Calculation", duration: "4 Hours", description: "Batch data extraction and automated weighted index computation." },
      { id: "mod-01-2", title: "NSS Large-Scale Sample Wrangling", duration: "5 Hours", description: "Cleaning, harmonizing, and structuring microdata from NSS rounds." },
      { id: "mod-01-3", title: "Predictive Economic Indicators", duration: "5 Hours", description: "Time-series forecasting models applied to monthly macroeconomic metrics." },
      { id: "mod-01-4", title: "Official Data Quality Assurance", duration: "4 Hours", description: "Statistical validation rules and automated error checking frameworks." }
    ]
  },
  {
    id: "mospi-ts-02",
    title: "AI & ML in Official Statistics",
    tagline: "Anomaly detection, automated imputation, and LLMs for policy analysis.",
    description: "Leverage machine learning workflows to identify anomalies in field surveys, auto-impute missing values, and extract structured metrics from raw government reports.",
    frac_competency_tag: "comp_ai_ml_statistics",
    level: "Advanced",
    duration: "22 Hours",
    modulesCount: 4,
    modules: [
      { id: "mod-02-1", title: "Survey Anomaly & Outlier Detection", duration: "6 Hours", description: "Unsupervised clustering and isolation forests to detect enumerator skew." },
      { id: "mod-02-2", title: "Intelligent Missing-Value Imputation", duration: "5 Hours", description: "Machine learning algorithms for unbiased demographic data imputation." },
      { id: "mod-02-3", title: "NLP for Policy Document Parsing", duration: "6 Hours", description: "Extracting key socioeconomic indicators from unstructured ministry reports." },
      { id: "mod-02-4", title: "AI-Ready Data Standardization", duration: "5 Hours", description: "Harmonizing legacy state and national datasets into standardized schemas." }
    ]
  },
  {
    id: "mospi-ts-03",
    title: "GIS & Spatial Analytics",
    tagline: "Geospatial mapping and boundary-level analysis for official data.",
    description: "Integrate geographic information systems into official statistics to visualize spatial disparities, geo-tag economic census establishments, and analyze satellite data.",
    frac_competency_tag: "comp_gis_spatial",
    level: "Foundational",
    duration: "14 Hours",
    modulesCount: 3,
    modules: [
      { id: "mod-03-1", title: "Geo-tagging & Economic Census Mapping", duration: "5 Hours", description: "Spatial referencing and verification of enterprise surveys." },
      { id: "mod-03-2", title: "Remote Sensing & Agricultural Metrics", duration: "5 Hours", description: "Using satellite imagery for acreage and crop yield estimation." },
      { id: "mod-03-3", title: "Thematic Choropleth Mapping", duration: "4 Hours", description: "Generating district-level indicator maps for policy dissemination." }
    ]
  },
  {
    id: "mospi-ts-04",
    title: "Cloud Infrastructure for Gov Data",
    tagline: "Scalable pipelines, secure data lakes, and dissemination portals.",
    description: "Architect secure, compliant cloud systems for storing, accessing, and disseminating massive public and restricted national data registries.",
    frac_competency_tag: "comp_cloud_infrastructure",
    level: "Intermediate",
    duration: "16 Hours",
    modulesCount: 3,
    modules: [
      { id: "mod-04-1", title: "Secure Gov-Cloud & Data Lake Architecture", duration: "6 Hours", description: "Designing role-based, encrypted repositories for official microdata." },
      { id: "mod-04-2", title: "High-Availability Dissemination APIs", duration: "5 Hours", description: "Building public APIs for real-time statistical indicator queries." },
      { id: "mod-04-3", title: "Compliance, Privacy & Auditing", duration: "5 Hours", description: "Implementing data masking, anonymization, and audit logs." }
    ]
  }
];
