import { Task } from '../components/TaskTableDynamic';

/**
 * Initial task data for the application
 * Separated from main App component to improve readability and maintainability
 * Mix of system tasks (created by Reglantern, have upload functionality) and 
 * custom tasks (created by users, no upload functionality)
 */
export const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "Upload and verify all required enrollment documentation for patient records",
    completed: false,
    dueDate: "02/15/2026",
    assignedTo: { initials: "TF", name: "Tim Freeman" },
    healthCenter: "Mountain View Clinic",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' },
    subtasks: [
      {
        id: 'subtask-1-1',
        title: 'Safety Data Report',
        description: 'This is the sub task description',
        uploadedFiles: [
          {
            id: 'file-1',
            name: 'Filename.pdf',
            size: 1500000,
            category: '3.1 - Service Area Reps-Analysis'
          },
          {
            id: 'file-2',
            name: 'Filename.pdf',
            size: 800000,
            category: '3.1 - Service Area Reps-Analysis'
          }
        ]
      },
      {
        id: 'subtask-1-2',
        title: 'Enrollment Progress Report',
        description: 'This is the sub task description',
        uploadedFiles: [],
        notApplicable: true
      },
      {
        id: 'subtask-1-3',
        title: 'Protocol Deviations Summary',
        description: 'This is the sub task description',
        uploadedFiles: []
      },
      {
        id: 'subtask-1-4',
        title: 'Data Quality Metrics',
        description: 'This is the sub task description',
        uploadedFiles: []
      },
      {
        id: 'subtask-1-5',
        title: 'Patient Files',
        description: 'This is the sub task description',
        uploadedFiles: []
      }
    ]
  },
  {
    id: 2,
    title: "Complete comprehensive compliance training module for all new staff members including safety protocols, data privacy regulations, and institutional policies while ensuring understanding of Good Clinical Practice guidelines, HIPAA requirements, protocol-specific procedures, emergency response protocols, and proper documentation standards with follow-up assessments and competency verification for all participants",
    completed: false,
    attention: { type: 'needs', count: 1 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 3,
    title: "Submit quarterly clinical report to regulatory authorities with detailed analysis of patient outcomes, adverse events, and study protocol adherence metrics including comprehensive statistical analysis, safety data review, enrollment progress updates, protocol deviations documentation, data quality metrics, and recommendations for ongoing study management with supporting appendices and source documentation",
    completed: false,
    dueDate: "02/28/2026",
    assignedTo: { initials: "SM", name: "Sarah Martinez" },
    healthCenter: "Riverside Health Center",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' },
    subtasks: [
      {
        id: 'subtask-3-1',
        title: 'Safety Data Report',
        description: 'Upload quarterly safety data analysis including all adverse events, serious adverse events, and safety monitoring reports.',
        uploadedFiles: []
      },
      {
        id: 'subtask-3-2',
        title: 'Enrollment Progress Report',
        description: 'Upload enrollment statistics, screening logs, and recruitment milestone documents for the quarter.',
        uploadedFiles: [
          {
            id: 'file-4',
            name: 'Q1_2026_Enrollment_Statistics.pdf',
            size: 2200000,
            category: '2.1 - Enrollment Reports'
          }
        ]
      },
      {
        id: 'subtask-3-3',
        title: 'Protocol Deviations Summary',
        description: 'Upload summary of all protocol deviations identified during the quarter with corrective action plans.',
        uploadedFiles: []
      },
      {
        id: 'subtask-3-4',
        title: 'Data Quality Metrics',
        description: 'Upload data quality reports including query rates, data completeness metrics, and audit findings.',
        uploadedFiles: []
      }
    ]
  },
  {
    id: 4,
    title: "Schedule IRB review meeting",
    completed: false,
    dueDate: "03/05/2026",
    assignedTo: { initials: "JD", name: "John Davis" },
    healthCenter: "Central Medical Plaza",
    attention: { type: 'needs', count: 1 },
    taskType: 'custom',
    createdBy: { initials: 'SM', name: 'Sarah Martinez' }
  },
  {
    id: 5,
    title: "Update protocol documentation and ensure version control is maintained across all study sites with proper tracking and approval workflows",
    completed: false,
    dueDate: "02/20/2026",
    assignedTo: { initials: "LW", name: "Lisa Wang" },
    healthCenter: "Eastside Family Clinic",
    attention: { type: 'missing', count: 2 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 6,
    title: "Verify data entry for Trial 2023-A",
    completed: true,
    dueDate: "02/10/2026",
    assignedTo: { initials: "TF", name: "Tim Freeman" },
    healthCenter: "Test Health Center",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 7,
    title: "Prepare comprehensive site monitoring visit checklist with all required documentation including regulatory binders, training logs, consent forms, and adverse event reports for complete audit readiness while ensuring all essential documents are current, properly filed, organized according to regulatory standards, and easily accessible for inspection by monitoring personnel, quality assurance teams, and regulatory authorities during scheduled and unscheduled site visits with comprehensive indexing and version control procedures in place",
    completed: false,
    dueDate: "03/01/2026",
    assignedTo: { initials: "RP", name: "Robert Park" },
    healthCenter: "Northgate Medical",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 8,
    title: "Conduct patient safety assessment and comprehensive risk evaluation including monitoring of vital signs, laboratory values, adverse event documentation, and coordination with clinical staff for immediate intervention protocols while maintaining detailed records of all safety observations, implementing appropriate risk mitigation strategies, coordinating with medical monitors and principal investigators, documenting all communications with regulatory authorities, and ensuring timely reporting of all serious adverse events and protocol deviations in accordance with ICH-GCP guidelines and institutional safety reporting requirements",
    completed: false,
    dueDate: "02/25/2026",
    assignedTo: { initials: "AM", name: "Angela Miller" },
    healthCenter: "Westwood Clinic",
    attention: { type: 'needs', count: 3 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 9,
    title: "Archive old study materials",
    completed: true,
    dueDate: "01/30/2026",
    assignedTo: { initials: "DK", name: "David Kim" },
    healthCenter: "Southside Practice",
    taskType: 'custom',
    createdBy: { initials: 'TF', name: 'Tim Freeman' }
  },
  {
    id: 10,
    title: "Review informed consent forms and verify that all participants have received proper explanation of study procedures, risks, benefits, and voluntary participation rights in accordance with ethical guidelines while ensuring comprehension through teach-back methods, documenting all questions and answers provided, maintaining current versions of all consent documents with proper version control, obtaining appropriate signatures and witness attestations, and providing copies to all participants with multilingual translations available as needed for non-English speaking populations in compliance with institutional IRB requirements and federal regulations",
    completed: false,
    dueDate: "03/10/2026",
    healthCenter: "Harbor View Health",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 11,
    title: "Finalize budget amendments",
    completed: false,
    assignedTo: { initials: "EC", name: "Emma Chen" },
    attention: { type: 'missing', count: 1 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 12,
    title: "Submit ethics committee application with complete study protocol, investigator brochures, informed consent documents, recruitment materials, and detailed budget justification for multi-site clinical trial approval while coordinating with all participating institutions, preparing comprehensive responses to anticipated ethics committee questions, assembling complete regulatory packages including CVs and medical licenses for all study personnel, ensuring compliance with local and international ethical standards, preparing statistical analysis plans and data safety monitoring board charter documents, and coordinating submission timelines across multiple jurisdictions with varying regulatory requirements and review processes",
    completed: false,
    dueDate: "02/18/2026",
    assignedTo: { initials: "MG", name: "Michael Garcia" },
    healthCenter: "Downtown Medical Center",
    attention: { type: 'missing', count: 3 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 13,
    title: "Coordinate lab specimen collection",
    completed: false,
    dueDate: "03/15/2026",
    assignedTo: { initials: "SM", name: "Sarah Martinez" },
    healthCenter: "Mountain View Clinic",
    taskType: 'custom',
    createdBy: { initials: 'JD', name: 'John Davis' }
  },
  {
    id: 14,
    title: "Review adverse event reports",
    completed: true,
    dueDate: "02/12/2026",
    assignedTo: { initials: "JD", name: "John Davis" },
    healthCenter: "Riverside Health Center",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 15,
    title: "Update regulatory submissions and coordinate with compliance team to ensure all documentation meets current FDA guidelines and international regulatory standards for multi-regional clinical trial applications while preparing detailed responses to regulatory queries, maintaining comprehensive submission tracking systems, coordinating with external consultants and regulatory affairs specialists, ensuring consistency across all submission documents including investigator brochures, clinical study reports, and supporting safety data, managing version control for all regulatory documents across multiple health authorities, preparing briefing materials for regulatory meetings and teleconferences, and establishing clear communication protocols between study sponsors, contract research organizations, and regulatory agencies to facilitate efficient review processes",
    completed: false,
    dueDate: "03/20/2026",
    assignedTo: { initials: "LW", name: "Lisa Wang" },
    healthCenter: "Central Medical Plaza",
    attention: { type: 'needs', count: 2 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 16,
    title: "Complete study drug accountability",
    completed: false,
    dueDate: "02/28/2026",
    assignedTo: { initials: "TF", name: "Tim Freeman" },
    healthCenter: "Eastside Family Clinic",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 17,
    title: "Prepare monitoring report",
    completed: false,
    dueDate: "03/08/2026",
    assignedTo: { initials: "RP", name: "Robert Park" },
    healthCenter: "Test Health Center",
    attention: { type: 'missing', count: 1 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 18,
    title: "Conduct site initiation visit",
    completed: true,
    dueDate: "02/05/2026",
    assignedTo: { initials: "AM", name: "Angela Miller" },
    healthCenter: "Northgate Medical",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 19,
    title: "Review protocol amendments and assess impact on ongoing study operations including subject enrollment, data collection procedures, informed consent modifications, and potential need for ethics committee re-approval",
    completed: false,
    dueDate: "03/12/2026",
    assignedTo: { initials: "DK", name: "David Kim" },
    healthCenter: "Westwood Clinic",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 20,
    title: "Submit progress report to sponsor",
    completed: false,
    dueDate: "03/18/2026",
    assignedTo: { initials: "EC", name: "Emma Chen" },
    healthCenter: "Southside Practice",
    attention: { type: 'needs', count: 1 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 21,
    title: "Schedule investigator meeting",
    completed: false,
    dueDate: "03/22/2026",
    assignedTo: { initials: "MG", name: "Michael Garcia" },
    healthCenter: "Harbor View Health",
    taskType: 'custom',
    createdBy: { initials: 'AM', name: 'Angela Miller' }
  },
  {
    id: 22,
    title: "Update training logs",
    completed: true,
    dueDate: "02/08/2026",
    assignedTo: { initials: "SM", name: "Sarah Martinez" },
    healthCenter: "Downtown Medical Center",
    taskType: 'custom',
    createdBy: { initials: 'TF', name: 'Tim Freeman' }
  },
  {
    id: 23,
    title: "Review source document verification",
    completed: false,
    dueDate: "03/25/2026",
    assignedTo: { initials: "JD", name: "John Davis" },
    healthCenter: "Mountain View Clinic",
    attention: { type: 'missing', count: 2 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 24,
    title: "Prepare close-out documentation",
    completed: false,
    dueDate: "04/01/2026",
    assignedTo: { initials: "LW", name: "Lisa Wang" },
    healthCenter: "Riverside Health Center",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 25,
    title: "Submit annual continuing review",
    completed: false,
    dueDate: "03/28/2026",
    assignedTo: { initials: "TF", name: "Tim Freeman" },
    healthCenter: "Central Medical Plaza",
    attention: { type: 'needs', count: 3 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 26,
    title: "Coordinate patient recruitment",
    completed: true,
    dueDate: "02/01/2026",
    assignedTo: { initials: "RP", name: "Robert Park" },
    healthCenter: "Eastside Family Clinic",
    taskType: 'custom',
    createdBy: { initials: 'LW', name: 'Lisa Wang' }
  },
  {
    id: 27,
    title: "Review case report forms",
    completed: false,
    dueDate: "03/30/2026",
    assignedTo: { initials: "AM", name: "Angela Miller" },
    healthCenter: "Test Health Center",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 28,
    title: "Update essential documents binder",
    completed: false,
    dueDate: "04/05/2026",
    assignedTo: { initials: "DK", name: "David Kim" },
    healthCenter: "Northgate Medical",
    attention: { type: 'missing', count: 1 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 29,
    title: "Conduct quality assurance audit",
    completed: false,
    dueDate: "04/10/2026",
    assignedTo: { initials: "EC", name: "Emma Chen" },
    healthCenter: "Westwood Clinic",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 30,
    title: "Prepare investigator brochure updates",
    completed: true,
    dueDate: "01/28/2026",
    assignedTo: { initials: "MG", name: "Michael Garcia" },
    healthCenter: "Southside Practice",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 31,
    title: "Review informed consent process",
    completed: false,
    dueDate: "04/12/2026",
    assignedTo: { initials: "SM", name: "Sarah Martinez" },
    healthCenter: "Harbor View Health",
    attention: { type: 'needs', count: 2 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 32,
    title: "Submit safety reports",
    completed: false,
    dueDate: "04/15/2026",
    assignedTo: { initials: "JD", name: "John Davis" },
    healthCenter: "Downtown Medical Center",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 33,
    title: "Coordinate site audit preparation",
    completed: false,
    dueDate: "04/18/2026",
    assignedTo: { initials: "LW", name: "Lisa Wang" },
    healthCenter: "Mountain View Clinic",
    attention: { type: 'missing', count: 3 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  },
  {
    id: 34,
    title: "Update delegation log",
    completed: true,
    dueDate: "02/03/2026",
    assignedTo: { initials: "TF", name: "Tim Freeman" },
    healthCenter: "Riverside Health Center",
    taskType: 'custom',
    createdBy: { initials: 'DK', name: 'David Kim' }
  },
  {
    id: 35,
    title: "Review laboratory certifications",
    completed: false,
    dueDate: "04/20/2026",
    assignedTo: { initials: "RP", name: "Robert Park" },
    healthCenter: "Central Medical Plaza",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' }
  }
];