/**
 * NSSTA TPAC Training Programme Calendar (Mock)
 * 
 * Institutional training programmes from the National Statistical
 * Systems Training Academy, mapped to the 4-quadrant FRAC taxonomy
 * and designation eligibility.
 */

const NSSTA_TPAC = [
  {
    id: 'nssta_001',
    program_name: 'Advanced Survey Methodology & National Accounts',
    target_designations: ['Senior Statistical Officer (SSO)', 'Assistant Director', 'Deputy Director'],
    associated_competencies: ['comp_statistical'],
    dates: '14 Oct – 18 Oct 2026',
    mode: 'In-Person (NSSTA Greater Noida)',
    duration: '5 days',
    capacity: 30,
    nomination_deadline: '25 Sep 2026',
  },
  {
    id: 'nssta_002',
    program_name: 'Python, R & AI/ML for Statistical Officers',
    target_designations: ['Junior Statistical Officer (JSO)', 'Senior Statistical Officer (SSO)', 'Assistant Director'],
    associated_competencies: ['comp_technical'],
    dates: '04 Nov – 08 Nov 2026',
    mode: 'Hybrid',
    duration: '5 days',
    capacity: 40,
    nomination_deadline: '15 Oct 2026',
  },
  {
    id: 'nssta_003',
    program_name: 'Cybersecurity, Data Privacy & Gov-Cloud Compliance',
    target_designations: ['Assistant Director', 'Deputy Director', 'Joint Director', 'Director'],
    associated_competencies: ['comp_digital_governance'],
    dates: '18 Nov – 22 Nov 2026',
    mode: 'In-Person (NSSTA Greater Noida)',
    duration: '5 days',
    capacity: 25,
    nomination_deadline: '30 Oct 2026',
  },
  {
    id: 'nssta_004',
    program_name: 'Leadership & Change Management for Senior Officers',
    target_designations: ['Deputy Director', 'Joint Director', 'Director', 'Deputy Director General'],
    associated_competencies: ['comp_behavioural'],
    dates: '02 Dec – 06 Dec 2026',
    mode: 'In-Person (NSSTA Greater Noida)',
    duration: '5 days',
    capacity: 20,
    nomination_deadline: '12 Nov 2026',
  },
  {
    id: 'nssta_005',
    program_name: 'Integrated Competency Building (All 4 Quadrants)',
    target_designations: ['Junior Statistical Officer (JSO)', 'Senior Statistical Officer (SSO)'],
    associated_competencies: ['comp_statistical', 'comp_technical', 'comp_digital_governance', 'comp_behavioural'],
    dates: '06 Jan – 17 Jan 2027',
    mode: 'In-Person (NSSTA Greater Noida)',
    duration: '10 days',
    capacity: 50,
    nomination_deadline: '15 Dec 2026',
  },
  {
    id: 'nssta_006',
    program_name: 'Digital Governance & Strategic Leadership for Senior Management',
    target_designations: ['Deputy Director', 'Joint Director', 'Director', 'Deputy Director General', 'Additional Director General', 'Director General'],
    associated_competencies: ['comp_digital_governance', 'comp_behavioural'],
    dates: '20 Jan – 24 Jan 2027',
    mode: 'Hybrid',
    duration: '5 days',
    capacity: 25,
    nomination_deadline: '31 Dec 2026',
  },
];

export default NSSTA_TPAC;
