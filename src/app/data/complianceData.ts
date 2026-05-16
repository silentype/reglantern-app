import type { Task } from '../components/TaskTableDynamic';

export type ComplianceFramework = {
  id: string;
  name: string;
  description: string;
  category: string;
  chapters: number;
};

export type ComplianceQuestion = {
  id: string;
  breadcrumb: string;
  text: string;
};

export type ComplianceChapter = {
  id: number;
  name: string;
  category: string;
  questions: ComplianceQuestion[];
};

export const FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'ftca',
    name: 'FTCA Deeming',
    description: 'Federal Tort Claims Act deeming application and site visit preparation',
    category: 'Federal',
    chapters: 30,
  },
  {
    id: 'ryan-white-c',
    name: 'Ryan White Part C',
    description: 'HIV/AIDS outpatient care and early intervention services review',
    category: 'Ryan White',
    chapters: 4,
  },
  {
    id: 'ryan-white-d',
    name: 'Ryan White Part D',
    description: 'HIV/AIDS services for women, infants, children, and youth',
    category: 'Ryan White',
    chapters: 4,
  },
  {
    id: 'hrsa-site-visit',
    name: 'HRSA Site Visit',
    description: 'Health Resources & Services Administration operational site review',
    category: 'Federal',
    chapters: 4,
  },
  {
    id: 'uds',
    name: 'UDS Reporting',
    description: 'Uniform Data System annual reporting compliance review',
    category: 'Reporting',
    chapters: 4,
  },
];

const DEFAULT_CHAPTERS: ComplianceChapter[] = [
  {
    id: 1,
    name: 'Chapter 1',
    category: 'clinical',
    questions: [
      { id: '1-1',  breadcrumb: 'Chapter 1 > Element a > Service Area Identification',  text: 'Does the health center clearly identify all service areas in their documentation?' },
      { id: '1-2',  breadcrumb: 'Chapter 1 > Element b > Patient Demographics',          text: 'Are patient demographics properly recorded and maintained?' },
      { id: '1-3',  breadcrumb: 'Chapter 1 > Element c > Service Delivery',              text: 'Is the service delivery model documented and approved?' },
      { id: '1-4',  breadcrumb: 'Chapter 1 > Element d > Quality Assurance',             text: 'Are quality assurance processes in place and documented?' },
      { id: '1-5',  breadcrumb: 'Chapter 1 > Element e > Staff Credentials',             text: 'Are all staff credentials verified and up to date?' },
      { id: '1-6',  breadcrumb: 'Chapter 1 > Element f > Facility Compliance',           text: 'Does the facility meet all regulatory compliance requirements?' },
      { id: '1-7',  breadcrumb: 'Chapter 1 > Element g > Accessibility',                 text: 'Are services accessible to patients with disabilities?' },
      { id: '1-8',  breadcrumb: 'Chapter 1 > Element h > Language Access',               text: 'Are language access services available for limited English proficient patients?' },
      { id: '1-9',  breadcrumb: 'Chapter 1 > Element i > Cultural Competency',           text: 'Are cultural competency training requirements met by all clinical staff?' },
      { id: '1-10', breadcrumb: 'Chapter 1 > Element j > Hours of Operation',            text: 'Are hours of operation adequate to meet patient demand?' },
      { id: '1-11', breadcrumb: 'Chapter 1 > Element k > Transportation',                text: 'Is transportation assistance available or referred for patients who need it?' },
      { id: '1-12', breadcrumb: 'Chapter 1 > Element l > Case Management',               text: 'Are case management services available for high-risk patients?' },
      { id: '1-13', breadcrumb: 'Chapter 1 > Element m > Patient Rights',                text: 'Are patient rights and responsibilities posted and distributed?' },
      { id: '1-14', breadcrumb: 'Chapter 1 > Element n > Grievance Policy',              text: 'Is there a formal patient grievance and complaint resolution policy?' },
      { id: '1-15', breadcrumb: 'Chapter 1 > Element o > Outreach',                      text: 'Are outreach and enrollment activities documented and tracked?' },
      { id: '1-16', breadcrumb: 'Chapter 1 > Element p > Health Disparities',            text: 'Are health disparity data collected and used to improve services?' },
      { id: '1-17', breadcrumb: 'Chapter 1 > Element q > PCMH Recognition',              text: 'Has the site pursued or maintained Patient-Centered Medical Home recognition?' },
      { id: '1-18', breadcrumb: 'Chapter 1 > Element r > Care Teams',                    text: 'Are team-based care models implemented across all clinical sites?' },
      { id: '1-19', breadcrumb: 'Chapter 1 > Element s > Continuity of Care',            text: 'Is continuity of care maintained when patients transition between providers?' },
      { id: '1-20', breadcrumb: 'Chapter 1 > Element t > Scope Expansion',               text: 'Are any proposed scope expansions documented and submitted for approval?' },
    ],
  },
  {
    id: 2,
    name: 'Chapter 2',
    category: 'fiscal',
    questions: [
      { id: '2-1', breadcrumb: 'Chapter 2 > Element a > Budget Planning', text: 'Is there a comprehensive budget planning process in place?' },
      { id: '2-2', breadcrumb: 'Chapter 2 > Element b > Financial Reporting', text: 'Are financial reports accurate and timely?' },
      { id: '2-3', breadcrumb: 'Chapter 2 > Element c > Audit Compliance', text: 'Does the organization comply with audit requirements?' },
      { id: '2-4', breadcrumb: 'Chapter 2 > Element d > Grant Management', text: 'Are grant funds properly managed and documented?' },
      { id: '2-5', breadcrumb: 'Chapter 2 > Element e > Revenue Cycle', text: 'Is the revenue cycle properly managed?' },
      { id: '2-6', breadcrumb: 'Chapter 2 > Element f > Cost Allocation', text: 'Are costs properly allocated across programs?' },
    ],
  },
  {
    id: 3,
    name: 'Chapter 3',
    category: 'governance',
    questions: [
      { id: '3-1', breadcrumb: 'Chapter 3 > Element a > Board Composition', text: 'Does the board meet composition requirements?' },
      { id: '3-2', breadcrumb: 'Chapter 3 > Element b > Meeting Minutes', text: 'Are meeting minutes properly documented?' },
      { id: '3-3', breadcrumb: 'Chapter 3 > Element c > Policy Review', text: 'Are policies reviewed and updated regularly?' },
      { id: '3-4', breadcrumb: 'Chapter 3 > Element d > Conflict of Interest', text: 'Are conflict of interest policies enforced?' },
      { id: '3-5', breadcrumb: 'Chapter 3 > Element e > Strategic Planning', text: 'Is there an active strategic planning process?' },
      { id: '3-6', breadcrumb: 'Chapter 3 > Element f > Bylaws Compliance', text: 'Does the organization comply with its bylaws?' },
    ],
  },
  {
    id: 4,
    name: 'Chapter 4',
    category: 'clinical',
    questions: [
      { id: '4-1', breadcrumb: 'Chapter 4 > Element a > Clinical Protocols', text: 'Are clinical protocols documented and followed?' },
      { id: '4-2', breadcrumb: 'Chapter 4 > Element b > Patient Care Standards', text: 'Are patient care standards maintained?' },
      { id: '4-3', breadcrumb: 'Chapter 4 > Element c > Medical Records', text: 'Are medical records properly maintained?' },
      { id: '4-4', breadcrumb: 'Chapter 4 > Element d > Infection Control', text: 'Are infection control procedures in place?' },
      { id: '4-5', breadcrumb: 'Chapter 4 > Element e > Emergency Preparedness', text: 'Is there an emergency preparedness plan?' },
      { id: '4-6', breadcrumb: 'Chapter 4 > Element f > Pharmacy Operations', text: 'Are pharmacy operations properly managed?' },
    ],
  },
];

const FTCA_EXTRA_CHAPTERS: ComplianceChapter[] = [
  {
    id: 5,
    name: 'Chapter 5',
    category: 'clinical',
    questions: [
      { id: '5-1', breadcrumb: 'Chapter 5 > Element a > Preventive Care', text: 'Are preventive care services offered and documented?' },
      { id: '5-2', breadcrumb: 'Chapter 5 > Element b > Chronic Disease Management', text: 'Is chronic disease management tracked and reported?' },
      { id: '5-3', breadcrumb: 'Chapter 5 > Element c > Referral Processes', text: 'Are referral processes documented and tracked?' },
      { id: '5-4', breadcrumb: 'Chapter 5 > Element d > Patient Education', text: 'Is patient education provided and documented?' },
      { id: '5-5', breadcrumb: 'Chapter 5 > Element e > Care Coordination', text: 'Is care coordination in place for complex patients?' },
    ],
  },
  {
    id: 6,
    name: 'Chapter 6',
    category: 'fiscal',
    questions: [
      { id: '6-1', breadcrumb: 'Chapter 6 > Element a > Sliding Fee Scale', text: 'Is a sliding fee discount program implemented correctly?' },
      { id: '6-2', breadcrumb: 'Chapter 6 > Element b > Fee Schedule', text: 'Is the fee schedule current and publicly available?' },
      { id: '6-3', breadcrumb: 'Chapter 6 > Element c > Eligibility Screening', text: 'Are patients screened for eligibility appropriately?' },
      { id: '6-4', breadcrumb: 'Chapter 6 > Element d > Collections Policy', text: 'Is the collections policy compliant with HRSA requirements?' },
      { id: '6-5', breadcrumb: 'Chapter 6 > Element e > Billing Practices', text: 'Are billing practices accurate and properly documented?' },
    ],
  },
  {
    id: 7,
    name: 'Chapter 7',
    category: 'governance',
    questions: [
      { id: '7-1', breadcrumb: 'Chapter 7 > Element a > CEO Oversight', text: 'Does the board exercise appropriate oversight of the CEO?' },
      { id: '7-2', breadcrumb: 'Chapter 7 > Element b > Executive Compensation', text: 'Is executive compensation reviewed and approved by the board?' },
      { id: '7-3', breadcrumb: 'Chapter 7 > Element c > Financial Oversight', text: 'Does the board review financial statements regularly?' },
      { id: '7-4', breadcrumb: 'Chapter 7 > Element d > Audit Committee', text: 'Is there a functioning audit committee?' },
      { id: '7-5', breadcrumb: 'Chapter 7 > Element e > Board Training', text: 'Do board members receive orientation and ongoing training?' },
    ],
  },
  {
    id: 8,
    name: 'Chapter 8',
    category: 'clinical',
    questions: [
      { id: '8-1', breadcrumb: 'Chapter 8 > Element a > Behavioral Health', text: 'Are behavioral health services integrated into primary care?' },
      { id: '8-2', breadcrumb: 'Chapter 8 > Element b > Substance Use', text: 'Are substance use disorder services available or referred?' },
      { id: '8-3', breadcrumb: 'Chapter 8 > Element c > Mental Health Screening', text: 'Is mental health screening conducted at appropriate intervals?' },
      { id: '8-4', breadcrumb: 'Chapter 8 > Element d > Crisis Intervention', text: 'Is there a documented crisis intervention protocol?' },
      { id: '8-5', breadcrumb: 'Chapter 8 > Element e > Telehealth', text: 'Are telehealth services offered and properly documented?' },
    ],
  },
  {
    id: 9,
    name: 'Chapter 9',
    category: 'fiscal',
    questions: [
      { id: '9-1', breadcrumb: 'Chapter 9 > Element a > Medicaid Billing', text: 'Are Medicaid encounters billed accurately and timely?' },
      { id: '9-2', breadcrumb: 'Chapter 9 > Element b > Medicare Compliance', text: 'Are Medicare billing requirements met?' },
      { id: '9-3', breadcrumb: 'Chapter 9 > Element c > FQHC PPS', text: 'Is the FQHC Prospective Payment System applied correctly?' },
      { id: '9-4', breadcrumb: 'Chapter 9 > Element d > Third-Party Billing', text: 'Are third-party billing systems functioning correctly?' },
      { id: '9-5', breadcrumb: 'Chapter 9 > Element e > Denial Management', text: 'Is there a process for managing and appealing claim denials?' },
    ],
  },
  {
    id: 10,
    name: 'Chapter 10',
    category: 'governance',
    questions: [
      { id: '10-1', breadcrumb: 'Chapter 10 > Element a > Patient Majority', text: 'Do patients comprise a majority of the board?' },
      { id: '10-2', breadcrumb: 'Chapter 10 > Element b > Patient Recruitment', text: 'Is there a documented process for recruiting patient board members?' },
      { id: '10-3', breadcrumb: 'Chapter 10 > Element c > Patient Engagement', text: 'Are patient board members actively engaged in governance?' },
      { id: '10-4', breadcrumb: 'Chapter 10 > Element d > Patient Representation', text: 'Do patient board members represent the service area population?' },
    ],
  },
  {
    id: 11,
    name: 'Chapter 11',
    category: 'clinical',
    questions: [
      { id: '11-1', breadcrumb: 'Chapter 11 > Element a > Dental Services', text: 'Are dental services provided or formally arranged?' },
      { id: '11-2', breadcrumb: 'Chapter 11 > Element b > Vision Services', text: 'Are vision services available to patients?' },
      { id: '11-3', breadcrumb: 'Chapter 11 > Element c > Pharmacy Services', text: 'Are pharmacy services accessible to all patients?' },
      { id: '11-4', breadcrumb: 'Chapter 11 > Element d > Enabling Services', text: 'Are enabling services (translation, transportation) documented?' },
      { id: '11-5', breadcrumb: 'Chapter 11 > Element e > Health Education', text: 'Is health education programming in place?' },
    ],
  },
  {
    id: 12,
    name: 'Chapter 12',
    category: 'fiscal',
    questions: [
      { id: '12-1', breadcrumb: 'Chapter 12 > Element a > Internal Controls', text: 'Are adequate internal financial controls in place?' },
      { id: '12-2', breadcrumb: 'Chapter 12 > Element b > Segregation of Duties', text: 'Is there proper segregation of duties in financial processes?' },
      { id: '12-3', breadcrumb: 'Chapter 12 > Element c > Cash Management', text: 'Are cash handling procedures documented and followed?' },
      { id: '12-4', breadcrumb: 'Chapter 12 > Element d > Accounts Receivable', text: 'Is accounts receivable aging tracked and managed?' },
      { id: '12-5', breadcrumb: 'Chapter 12 > Element e > Budget Variance', text: 'Are budget variances reviewed and explained regularly?' },
    ],
  },
  {
    id: 13,
    name: 'Chapter 13',
    category: 'clinical',
    questions: [
      { id: '13-1', breadcrumb: 'Chapter 13 > Element a > Quality Improvement', text: 'Is there a formal quality improvement program in place?' },
      { id: '13-2', breadcrumb: 'Chapter 13 > Element b > Clinical Outcomes', text: 'Are clinical outcome measures tracked against UDS benchmarks?' },
      { id: '13-3', breadcrumb: 'Chapter 13 > Element c > Patient Satisfaction', text: 'Are patient satisfaction surveys conducted and reviewed?' },
      { id: '13-4', breadcrumb: 'Chapter 13 > Element d > QI Committee', text: 'Does a QI committee meet regularly with documented minutes?' },
      { id: '13-5', breadcrumb: 'Chapter 13 > Element e > PDSA Cycles', text: 'Are Plan-Do-Study-Act cycles used for improvement initiatives?' },
    ],
  },
  {
    id: 14,
    name: 'Chapter 14',
    category: 'governance',
    questions: [
      { id: '14-1', breadcrumb: 'Chapter 14 > Element a > Annual Budget Approval', text: 'Does the board approve the annual budget?' },
      { id: '14-2', breadcrumb: 'Chapter 14 > Element b > Long-Range Financial Plan', text: 'Is there a board-approved long-range financial plan?' },
      { id: '14-3', breadcrumb: 'Chapter 14 > Element c > Capital Expenditures', text: 'Does the board approve major capital expenditures?' },
      { id: '14-4', breadcrumb: 'Chapter 14 > Element d > Reserve Policy', text: 'Is there a documented reserve fund policy?' },
    ],
  },
  {
    id: 15,
    name: 'Chapter 15',
    category: 'clinical',
    questions: [
      { id: '15-1', breadcrumb: 'Chapter 15 > Element a > After-Hours Coverage', text: 'Is after-hours coverage available and documented?' },
      { id: '15-2', breadcrumb: 'Chapter 15 > Element b > On-Call Protocol', text: 'Is there a documented on-call protocol for patients?' },
      { id: '15-3', breadcrumb: 'Chapter 15 > Element c > Hospital Admissions', text: 'Are hospital admission and discharge processes tracked?' },
      { id: '15-4', breadcrumb: 'Chapter 15 > Element d > ED Utilization', text: 'Is emergency department utilization monitored?' },
      { id: '15-5', breadcrumb: 'Chapter 15 > Element e > 24/7 Access', text: 'Can patients reach a provider 24 hours a day, 7 days a week?' },
    ],
  },
  {
    id: 16,
    name: 'Chapter 16',
    category: 'fiscal',
    questions: [
      { id: '16-1', breadcrumb: 'Chapter 16 > Element a > Section 330 Compliance', text: 'Are Section 330 grant requirements being met?' },
      { id: '16-2', breadcrumb: 'Chapter 16 > Element b > Federal Financial Report', text: 'Are Federal Financial Reports submitted accurately and on time?' },
      { id: '16-3', breadcrumb: 'Chapter 16 > Element c > Scope of Project', text: 'Does the current scope of project match the approved notice of award?' },
      { id: '16-4', breadcrumb: 'Chapter 16 > Element d > Grant Amendments', text: 'Are scope changes properly documented and approved?' },
    ],
  },
  {
    id: 17,
    name: 'Chapter 17',
    category: 'governance',
    questions: [
      { id: '17-1', breadcrumb: 'Chapter 17 > Element a > Strategic Plan', text: 'Does the organization have a current board-approved strategic plan?' },
      { id: '17-2', breadcrumb: 'Chapter 17 > Element b > Strategic Goals', text: 'Are strategic goals tracked and reported to the board?' },
      { id: '17-3', breadcrumb: 'Chapter 17 > Element c > Community Needs Assessment', text: 'Has a community needs assessment been conducted recently?' },
      { id: '17-4', breadcrumb: 'Chapter 17 > Element d > Plan Alignment', text: 'Does the operational plan align with the strategic plan?' },
    ],
  },
  {
    id: 18,
    name: 'Chapter 18',
    category: 'clinical',
    questions: [
      { id: '18-1', breadcrumb: 'Chapter 18 > Element a > Credentialing', text: 'Are all clinical staff credentialed and privileged appropriately?' },
      { id: '18-2', breadcrumb: 'Chapter 18 > Element b > Peer Review', text: 'Is a peer review process in place and documented?' },
      { id: '18-3', breadcrumb: 'Chapter 18 > Element c > Malpractice Coverage', text: 'Are FTCA coverage requirements met for all eligible providers?' },
      { id: '18-4', breadcrumb: 'Chapter 18 > Element d > Scope of Practice', text: 'Are provider scope of practice documents current and on file?' },
      { id: '18-5', breadcrumb: 'Chapter 18 > Element e > Continuing Education', text: 'Are continuing education requirements tracked and met?' },
    ],
  },
  {
    id: 19,
    name: 'Chapter 19',
    category: 'fiscal',
    questions: [
      { id: '19-1', breadcrumb: 'Chapter 19 > Element a > 340B Program', text: 'Is the 340B drug pricing program being used appropriately?' },
      { id: '19-2', breadcrumb: 'Chapter 19 > Element b > 340B Eligibility', text: 'Are 340B eligibility requirements maintained and documented?' },
      { id: '19-3', breadcrumb: 'Chapter 19 > Element c > Drug Diversion Prevention', text: 'Are drug diversion prevention policies in place?' },
      { id: '19-4', breadcrumb: 'Chapter 19 > Element d > Contract Pharmacies', text: 'Are contract pharmacy arrangements properly documented?' },
    ],
  },
  {
    id: 20,
    name: 'Chapter 20',
    category: 'governance',
    questions: [
      { id: '20-1', breadcrumb: 'Chapter 20 > Element a > HR Policies', text: 'Are HR policies documented and consistently applied?' },
      { id: '20-2', breadcrumb: 'Chapter 20 > Element b > Staff Turnover', text: 'Is staff turnover tracked and addressed by leadership?' },
      { id: '20-3', breadcrumb: 'Chapter 20 > Element c > Performance Reviews', text: 'Are annual performance reviews conducted for all staff?' },
      { id: '20-4', breadcrumb: 'Chapter 20 > Element d > Whistleblower Policy', text: 'Is there a documented whistleblower protection policy?' },
    ],
  },
  {
    id: 21,
    name: 'Chapter 21',
    category: 'clinical',
    questions: [
      { id: '21-1', breadcrumb: 'Chapter 21 > Element a > Health IT Systems', text: 'Are certified electronic health record systems in use?' },
      { id: '21-2', breadcrumb: 'Chapter 21 > Element b > Data Security', text: 'Are patient data security protocols compliant with HIPAA?' },
      { id: '21-3', breadcrumb: 'Chapter 21 > Element c > Data Backup', text: 'Are data backup and recovery procedures documented and tested?' },
      { id: '21-4', breadcrumb: 'Chapter 21 > Element d > EHR Training', text: 'Are staff trained on EHR use and data entry standards?' },
      { id: '21-5', breadcrumb: 'Chapter 21 > Element e > Meaningful Use', text: 'Are applicable meaningful use requirements being met?' },
    ],
  },
  {
    id: 22,
    name: 'Chapter 22',
    category: 'fiscal',
    questions: [
      { id: '22-1', breadcrumb: 'Chapter 22 > Element a > Single Audit', text: 'Is a Single Audit conducted when federal expenditure thresholds are met?' },
      { id: '22-2', breadcrumb: 'Chapter 22 > Element b > Audit Findings', text: 'Are prior audit findings remediated with documented corrective action?' },
      { id: '22-3', breadcrumb: 'Chapter 22 > Element c > Management Letter', text: 'Are management letter comments addressed in a timely manner?' },
      { id: '22-4', breadcrumb: 'Chapter 22 > Element d > Auditor Independence', text: 'Is auditor independence maintained and documented?' },
    ],
  },
  {
    id: 23,
    name: 'Chapter 23',
    category: 'clinical',
    questions: [
      { id: '23-1', breadcrumb: 'Chapter 23 > Element a > CLIA Compliance', text: 'Are CLIA requirements met for all laboratory services?' },
      { id: '23-2', breadcrumb: 'Chapter 23 > Element b > Lab Quality Control', text: 'Is lab quality control documented and reviewed?' },
      { id: '23-3', breadcrumb: 'Chapter 23 > Element c > Point-of-Care Testing', text: 'Are point-of-care testing procedures properly documented?' },
      { id: '23-4', breadcrumb: 'Chapter 23 > Element d > Lab Safety', text: 'Are lab safety protocols in place and followed?' },
    ],
  },
  {
    id: 24,
    name: 'Chapter 24',
    category: 'governance',
    questions: [
      { id: '24-1', breadcrumb: 'Chapter 24 > Element a > Risk Management', text: 'Is there a formal risk management program in place?' },
      { id: '24-2', breadcrumb: 'Chapter 24 > Element b > Insurance Coverage', text: 'Are adequate liability insurance coverages maintained?' },
      { id: '24-3', breadcrumb: 'Chapter 24 > Element c > Incident Reporting', text: 'Is there a documented incident reporting and review process?' },
      { id: '24-4', breadcrumb: 'Chapter 24 > Element d > Compliance Program', text: 'Is there a formal corporate compliance program in place?' },
      { id: '24-5', breadcrumb: 'Chapter 24 > Element e > Compliance Officer', text: 'Is a compliance officer designated with appropriate authority?' },
    ],
  },
  {
    id: 25,
    name: 'Chapter 25',
    category: 'clinical',
    questions: [
      { id: '25-1', breadcrumb: 'Chapter 25 > Element a > Patient Rights', text: 'Are patient rights policies documented and communicated?' },
      { id: '25-2', breadcrumb: 'Chapter 25 > Element b > Grievance Process', text: 'Is there a formal patient grievance process in place?' },
      { id: '25-3', breadcrumb: 'Chapter 25 > Element c > Language Access', text: 'Are language access services available to all patients?' },
      { id: '25-4', breadcrumb: 'Chapter 25 > Element d > Disability Access', text: 'Are facilities and services accessible to patients with disabilities?' },
      { id: '25-5', breadcrumb: 'Chapter 25 > Element e > Cultural Competency', text: 'Is cultural competency training provided to all staff?' },
    ],
  },
  {
    id: 26,
    name: 'Chapter 26',
    category: 'fiscal',
    questions: [
      { id: '26-1', breadcrumb: 'Chapter 26 > Element a > Procurement', text: 'Are procurement policies consistent with federal requirements?' },
      { id: '26-2', breadcrumb: 'Chapter 26 > Element b > Vendor Management', text: 'Are vendor contracts reviewed and properly executed?' },
      { id: '26-3', breadcrumb: 'Chapter 26 > Element c > Conflict of Interest', text: 'Are financial conflict of interest policies enforced for staff?' },
      { id: '26-4', breadcrumb: 'Chapter 26 > Element d > Asset Management', text: 'Are fixed assets inventoried and depreciated appropriately?' },
    ],
  },
  {
    id: 27,
    name: 'Chapter 27',
    category: 'clinical',
    questions: [
      { id: '27-1', breadcrumb: 'Chapter 27 > Element a > Immunization Registry', text: 'Is the organization participating in the state immunization registry?' },
      { id: '27-2', breadcrumb: 'Chapter 27 > Element b > Reportable Diseases', text: 'Are reportable disease requirements met and documented?' },
      { id: '27-3', breadcrumb: 'Chapter 27 > Element c > Public Health Liaison', text: 'Is there a designated public health liaison role?' },
      { id: '27-4', breadcrumb: 'Chapter 27 > Element d > Outbreak Preparedness', text: 'Is there an outbreak preparedness and response plan?' },
    ],
  },
  {
    id: 28,
    name: 'Chapter 28',
    category: 'governance',
    questions: [
      { id: '28-1', breadcrumb: 'Chapter 28 > Element a > Board Self-Assessment', text: 'Does the board conduct annual self-assessments?' },
      { id: '28-2', breadcrumb: 'Chapter 28 > Element b > CEO Evaluation', text: 'Is the CEO formally evaluated by the board annually?' },
      { id: '28-3', breadcrumb: 'Chapter 28 > Element c > Board Succession', text: 'Is there a board succession and recruitment plan?' },
      { id: '28-4', breadcrumb: 'Chapter 28 > Element d > Committee Structure', text: 'Are board committees properly constituted with documented charters?' },
    ],
  },
  {
    id: 29,
    name: 'Chapter 29',
    category: 'clinical',
    questions: [
      { id: '29-1', breadcrumb: 'Chapter 29 > Element a > School-Based Services', text: 'If applicable, are school-based service requirements met?' },
      { id: '29-2', breadcrumb: 'Chapter 29 > Element b > Mobile Unit Compliance', text: 'If applicable, are mobile unit compliance requirements met?' },
      { id: '29-3', breadcrumb: 'Chapter 29 > Element c > Satellite Site Standards', text: 'Do all satellite sites meet the same standards as the main site?' },
      { id: '29-4', breadcrumb: 'Chapter 29 > Element d > Site Visits', text: 'Are internal site visits conducted at all delivery locations?' },
    ],
  },
  {
    id: 30,
    name: 'Chapter 30',
    category: 'fiscal',
    questions: [
      { id: '30-1', breadcrumb: 'Chapter 30 > Element a > Financial Sustainability', text: 'Does the organization demonstrate a path to financial sustainability?' },
      { id: '30-2', breadcrumb: 'Chapter 30 > Element b > Diversified Revenue', text: 'Are revenue sources appropriately diversified?' },
      { id: '30-3', breadcrumb: 'Chapter 30 > Element c > Days Cash on Hand', text: 'Does the organization maintain adequate days cash on hand?' },
      { id: '30-4', breadcrumb: 'Chapter 30 > Element d > Capital Planning', text: 'Is there a capital improvement plan aligned with the strategic plan?' },
      { id: '30-5', breadcrumb: 'Chapter 30 > Element e > Financial Dashboard', text: 'Does leadership use a financial dashboard with key indicators?' },
    ],
  },
];

export const CHAPTERS_BY_FRAMEWORK: Record<string, ComplianceChapter[]> = {
  ftca: [...DEFAULT_CHAPTERS, ...FTCA_EXTRA_CHAPTERS],
  'ryan-white-c': DEFAULT_CHAPTERS,
  'ryan-white-d': DEFAULT_CHAPTERS,
  'hrsa-site-visit': DEFAULT_CHAPTERS,
  uds: DEFAULT_CHAPTERS,
};

export const INITIAL_CHAPTER_TASKS: Record<number, Task[]> = {
  1: [
    {
      id: 10001,
      title: 'Service Area Documentation',
      completed: false,
      status: 'Complete',
      dueDate: '2026-04-15',
      assignedTo: { initials: 'TF', name: 'Tim Freeman' },
      healthCenter: 'Main Campus',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [
        {
          patientId: 1,
          patientName: 'Service Area Documentation',
          uploadedFiles: [
            { id: 'doc-1', name: 'Service_Area_Map.pdf', size: 2048576, category: 'Documentation' },
            { id: 'doc-2', name: 'Coverage_Report.pdf', size: 1536000, category: 'Reports' },
          ],
        },
      ],
      subtasks: [
        {
          id: 'sub-1',
          title: 'Service Area Documentation',
          description: 'Upload documentation for service area identification',
          uploadedFiles: [
            { id: 'doc-1', name: 'Service_Area_Map.pdf', size: 2048576, category: 'Documentation' },
            { id: 'doc-2', name: 'Coverage_Report.pdf', size: 1536000, category: 'Reports' },
          ],
        },
      ],
    },
    {
      id: 10002,
      title: 'Patient Demographics Report',
      completed: false,
      status: 'In Progress',
      dueDate: '2026-04-20',
      assignedTo: { initials: 'SK', name: 'Sarah Kim' },
      healthCenter: 'East Side Clinic',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [
        {
          patientId: 1,
          patientName: 'Patient Demographics',
          uploadedFiles: [
            { id: 'doc-3', name: 'Demographics_2026.xlsx', size: 3145728, category: 'Reports' },
          ],
        },
      ],
      subtasks: [
        {
          id: 'sub-2',
          title: 'Patient Demographics Report',
          description: 'Upload patient demographics data and analysis',
          uploadedFiles: [
            { id: 'doc-3', name: 'Demographics_2026.xlsx', size: 3145728, category: 'Reports' },
          ],
        },
      ],
    },
    {
      id: 10003,
      title: 'Quality Assurance Manual',
      completed: false,
      status: 'Not Started',
      dueDate: '2026-04-25',
      assignedTo: { initials: 'MJ', name: 'Michael Johnson' },
      healthCenter: 'West Valley Center',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [],
      subtasks: [
        {
          id: 'sub-3',
          title: 'Quality Assurance Manual',
          description: 'Upload QA manual and procedures',
          uploadedFiles: [],
        },
      ],
    },
    {
      id: 10004,
      title: 'Staff Credentials Verification',
      completed: false,
      status: 'In Progress',
      dueDate: '2026-04-18',
      assignedTo: { initials: 'EM', name: 'Emily Martinez' },
      healthCenter: 'North Campus',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [
        {
          patientId: 1,
          patientName: 'Staff Credentials',
          uploadedFiles: [
            { id: 'doc-4', name: 'License_Verification.pdf', size: 1024000, category: 'Credentials' },
            { id: 'doc-5', name: 'Training_Certificates.pdf', size: 2560000, category: 'Credentials' },
            { id: 'doc-6', name: 'Background_Checks.pdf', size: 1800000, category: 'Credentials' },
          ],
        },
      ],
      subtasks: [
        {
          id: 'sub-4',
          title: 'Staff Credentials Verification',
          description: 'Upload staff credential verification documents',
          uploadedFiles: [
            { id: 'doc-4', name: 'License_Verification.pdf', size: 1024000, category: 'Credentials' },
            { id: 'doc-5', name: 'Training_Certificates.pdf', size: 2560000, category: 'Credentials' },
            { id: 'doc-6', name: 'Background_Checks.pdf', size: 1800000, category: 'Credentials' },
          ],
        },
      ],
    },
  ],
  2: [
    {
      id: 20001,
      title: 'Budget Documentation',
      completed: false,
      status: 'Complete',
      dueDate: '2026-04-12',
      assignedTo: { initials: 'EM', name: 'Emily Martinez' },
      healthCenter: 'Main Campus',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [
        {
          patientId: 1,
          patientName: 'Budget Documentation',
          uploadedFiles: [
            { id: 'doc-7', name: 'Annual_Budget_2026.xlsx', size: 2500000, category: 'Financial' },
          ],
        },
      ],
      subtasks: [
        {
          id: 'sub-5',
          title: 'Budget Documentation',
          description: 'Upload annual budget and supporting documentation',
          uploadedFiles: [
            { id: 'doc-7', name: 'Annual_Budget_2026.xlsx', size: 2500000, category: 'Financial' },
          ],
        },
      ],
    },
    {
      id: 20002,
      title: 'Financial Reports',
      completed: false,
      status: 'In Progress',
      dueDate: '2026-04-18',
      assignedTo: { initials: 'MJ', name: 'Michael Johnson' },
      healthCenter: 'Main Campus',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [
        {
          patientId: 2,
          patientName: 'Financial Reports',
          uploadedFiles: [
            { id: 'doc-11', name: 'Q1_Financial_Report_2026.pdf', size: 1800000, category: 'Financial' },
          ],
        },
      ],
      subtasks: [
        {
          id: 'sub-6',
          title: 'Financial Reports',
          description: 'Upload quarterly financial reports',
          uploadedFiles: [
            { id: 'doc-11', name: 'Q1_Financial_Report_2026.pdf', size: 1800000, category: 'Financial' },
          ],
        },
      ],
    },
    {
      id: 20003,
      title: 'Grant Management Files',
      completed: false,
      status: 'Not Started',
      dueDate: '2026-04-22',
      assignedTo: { initials: 'SK', name: 'Sarah Kim' },
      healthCenter: 'Main Campus',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [
        {
          patientId: 3,
          patientName: 'Grant Management Files',
          uploadedFiles: [
            { id: 'doc-12', name: 'Grant_Award_Letter_2026.pdf', size: 1200000, category: 'Financial' },
          ],
        },
      ],
      subtasks: [
        {
          id: 'sub-7',
          title: 'Grant Management Files',
          description: 'Upload grant documentation and tracking reports',
          uploadedFiles: [
            { id: 'doc-12', name: 'Grant_Award_Letter_2026.pdf', size: 1200000, category: 'Financial' },
          ],
        },
      ],
    },
  ],
  3: [
    {
      id: 30001,
      title: 'Board Meeting Minutes',
      completed: false,
      status: 'Complete',
      dueDate: '2026-04-10',
      assignedTo: { initials: 'TF', name: 'Tim Freeman' },
      healthCenter: 'Main Campus',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [
        {
          patientId: 1,
          patientName: 'Board Meeting Minutes',
          uploadedFiles: [
            { id: 'doc-8', name: 'Board_Minutes_Q1_2026.pdf', size: 1200000, category: 'Governance' },
            { id: 'doc-9', name: 'Board_Minutes_Q2_2026.pdf', size: 1300000, category: 'Governance' },
          ],
        },
      ],
      subtasks: [
        {
          id: 'sub-8',
          title: 'Board Meeting Minutes',
          description: 'Upload board meeting minutes for the current year',
          uploadedFiles: [
            { id: 'doc-8', name: 'Board_Minutes_Q1_2026.pdf', size: 1200000, category: 'Governance' },
            { id: 'doc-9', name: 'Board_Minutes_Q2_2026.pdf', size: 1300000, category: 'Governance' },
          ],
        },
      ],
    },
    {
      id: 30002,
      title: 'Policy Documents',
      completed: false,
      status: 'In Progress',
      dueDate: '2026-04-16',
      assignedTo: { initials: 'EM', name: 'Emily Martinez' },
      healthCenter: 'Main Campus',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [
        {
          patientId: 1,
          patientName: 'Policy Documents',
          uploadedFiles: [
            { id: 'doc-10', name: 'Policy_Manual_2026.pdf', size: 3000000, category: 'Governance' },
          ],
        },
      ],
      subtasks: [
        {
          id: 'sub-9',
          title: 'Policy Documents',
          description: 'Upload updated policy manual and procedures',
          uploadedFiles: [
            { id: 'doc-10', name: 'Policy_Manual_2026.pdf', size: 3000000, category: 'Governance' },
          ],
        },
      ],
    },
    {
      id: 30003,
      title: 'Strategic Plan',
      completed: false,
      status: 'Not Started',
      dueDate: '2026-04-28',
      assignedTo: { initials: 'SK', name: 'Sarah Kim' },
      healthCenter: 'Main Campus',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [],
      subtasks: [
        {
          id: 'sub-10',
          title: 'Strategic Plan',
          description: 'Upload current strategic plan and implementation timeline',
          uploadedFiles: [],
        },
      ],
    },
  ],
  4: [
    {
      id: 40001,
      title: 'Clinical Protocols',
      completed: false,
      status: 'In Progress',
      dueDate: '2026-04-14',
      assignedTo: { initials: 'MJ', name: 'Michael Johnson' },
      healthCenter: 'Main Campus',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [
        {
          patientId: 1,
          patientName: 'Clinical Protocols',
          uploadedFiles: [
            { id: 'doc-11', name: 'Clinical_Protocols_2026.pdf', size: 2800000, category: 'Clinical' },
          ],
        },
      ],
      subtasks: [
        {
          id: 'sub-11',
          title: 'Clinical Protocols',
          description: 'Upload clinical protocols and guidelines',
          uploadedFiles: [
            { id: 'doc-11', name: 'Clinical_Protocols_2026.pdf', size: 2800000, category: 'Clinical' },
          ],
        },
      ],
    },
    {
      id: 40002,
      title: 'Medical Records Compliance',
      completed: false,
      status: 'Complete',
      dueDate: '2026-04-11',
      assignedTo: { initials: 'SK', name: 'Sarah Kim' },
      healthCenter: 'Main Campus',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [
        {
          patientId: 1,
          patientName: 'Medical Records',
          uploadedFiles: [
            { id: 'doc-12', name: 'Records_Audit_Report.pdf', size: 1500000, category: 'Clinical' },
          ],
        },
      ],
      subtasks: [
        {
          id: 'sub-12',
          title: 'Medical Records Compliance',
          description: 'Upload medical records compliance documentation',
          uploadedFiles: [
            { id: 'doc-12', name: 'Records_Audit_Report.pdf', size: 1500000, category: 'Clinical' },
          ],
        },
      ],
    },
    {
      id: 40003,
      title: 'Infection Control Procedures',
      completed: false,
      status: 'Not Started',
      dueDate: '2026-04-24',
      assignedTo: { initials: 'EM', name: 'Emily Martinez' },
      healthCenter: 'Main Campus',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [],
      subtasks: [
        {
          id: 'sub-13',
          title: 'Infection Control Procedures',
          description: 'Upload infection control policies and training materials',
          uploadedFiles: [],
        },
      ],
    },
  ],
};
