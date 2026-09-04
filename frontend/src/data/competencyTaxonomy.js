/**
 * MoSPI FRAC Competency Taxonomy
 * ──────────────────────────────────────────────────────────────────
 * Single source of truth for the 4-quadrant competency architecture
 * mandated by the MoSPI Framework of Roles, Activities & Competencies.
 *
 * Every component that references FRAC tags MUST import from here.
 */

// ── The four official MoSPI FRAC quadrants ──────────────────────────

export const COMPETENCY_TAGS = {
  STATISTICAL: 'comp_statistical',
  TECHNICAL: 'comp_technical',
  DIGITAL_GOVERNANCE: 'comp_digital_governance',
  BEHAVIOURAL: 'comp_behavioural',
};

// ── Metadata: labels, colors, icons, sub-skills ─────────────────────

export const COMPETENCY_META = {
  [COMPETENCY_TAGS.STATISTICAL]: {
    label: 'Statistical',
    shortLabel: 'Statistical',
    color: '#2563EB',
    icon: '📊',
    subSkills: [
      'Survey Design & Methodology',
      'Sampling Techniques',
      'National Accounts & GDP',
      'Price & Labour Statistics',
      'SDG Indicator Frameworks',
    ],
  },
  [COMPETENCY_TAGS.TECHNICAL]: {
    label: 'Technical',
    shortLabel: 'Technical',
    color: '#7C3AED',
    icon: '💻',
    subSkills: [
      'Python / R Programming',
      'SQL / Stata / SPSS / SAS',
      'GIS & Spatial Mapping',
      'AI/ML & API Integration',
      'Data Pipeline Engineering',
    ],
  },
  [COMPETENCY_TAGS.DIGITAL_GOVERNANCE]: {
    label: 'Digital Governance',
    shortLabel: 'Digital Gov.',
    color: '#059669',
    icon: '🔐',
    subSkills: [
      'Cybersecurity Fundamentals',
      'Data Privacy & IT Act Compliance',
      'Digital Signatures & eAuth',
      'Gov-Cloud & MeghRaj',
      'DPI Systems (Aadhaar, DigiLocker)',
    ],
  },
  [COMPETENCY_TAGS.BEHAVIOURAL]: {
    label: 'Behavioural',
    shortLabel: 'Behavioural',
    color: '#EA580C',
    icon: '🧠',
    subSkills: [
      'Leadership & Decision Making',
      'Communication & Presentation',
      'Project Management',
      'Ethics & Integrity',
      'Change Management',
    ],
  },
};

// ── Target Competency Framework by Designation ──────────────────────
// These are the "expected" scores for each designation.
// The gap = target - actual diagnostic score.

export const TARGET_FRAMEWORK = {
  'Junior Statistical Officer (JSO)': {
    [COMPETENCY_TAGS.STATISTICAL]: 60,
    [COMPETENCY_TAGS.TECHNICAL]: 50,
    [COMPETENCY_TAGS.DIGITAL_GOVERNANCE]: 40,
    [COMPETENCY_TAGS.BEHAVIOURAL]: 40,
  },
  'Senior Statistical Officer (SSO)': {
    [COMPETENCY_TAGS.STATISTICAL]: 75,
    [COMPETENCY_TAGS.TECHNICAL]: 65,
    [COMPETENCY_TAGS.DIGITAL_GOVERNANCE]: 55,
    [COMPETENCY_TAGS.BEHAVIOURAL]: 55,
  },
  'Assistant Director': {
    [COMPETENCY_TAGS.STATISTICAL]: 80,
    [COMPETENCY_TAGS.TECHNICAL]: 70,
    [COMPETENCY_TAGS.DIGITAL_GOVERNANCE]: 65,
    [COMPETENCY_TAGS.BEHAVIOURAL]: 65,
  },
  'Deputy Director': {
    [COMPETENCY_TAGS.STATISTICAL]: 85,
    [COMPETENCY_TAGS.TECHNICAL]: 75,
    [COMPETENCY_TAGS.DIGITAL_GOVERNANCE]: 70,
    [COMPETENCY_TAGS.BEHAVIOURAL]: 75,
  },
  'Joint Director': {
    [COMPETENCY_TAGS.STATISTICAL]: 85,
    [COMPETENCY_TAGS.TECHNICAL]: 70,
    [COMPETENCY_TAGS.DIGITAL_GOVERNANCE]: 75,
    [COMPETENCY_TAGS.BEHAVIOURAL]: 80,
  },
  'Director': {
    [COMPETENCY_TAGS.STATISTICAL]: 90,
    [COMPETENCY_TAGS.TECHNICAL]: 70,
    [COMPETENCY_TAGS.DIGITAL_GOVERNANCE]: 80,
    [COMPETENCY_TAGS.BEHAVIOURAL]: 85,
  },
  'Deputy Director General': {
    [COMPETENCY_TAGS.STATISTICAL]: 90,
    [COMPETENCY_TAGS.TECHNICAL]: 65,
    [COMPETENCY_TAGS.DIGITAL_GOVERNANCE]: 85,
    [COMPETENCY_TAGS.BEHAVIOURAL]: 90,
  },
  'Additional Director General': {
    [COMPETENCY_TAGS.STATISTICAL]: 90,
    [COMPETENCY_TAGS.TECHNICAL]: 60,
    [COMPETENCY_TAGS.DIGITAL_GOVERNANCE]: 85,
    [COMPETENCY_TAGS.BEHAVIOURAL]: 95,
  },
  'Director General': {
    [COMPETENCY_TAGS.STATISTICAL]: 90,
    [COMPETENCY_TAGS.TECHNICAL]: 55,
    [COMPETENCY_TAGS.DIGITAL_GOVERNANCE]: 90,
    [COMPETENCY_TAGS.BEHAVIOURAL]: 95,
  },
};

// ── Helper: ordered list of all tag keys ────────────────────────────
export const ALL_TAGS = Object.values(COMPETENCY_TAGS);
