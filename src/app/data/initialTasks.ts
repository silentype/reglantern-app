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
    title: "Upload enrollment documentation and supporting patient records",
    completed: false,
    dueDate: "02/15/2026",
    assignedTo: { initials: "TF", name: "Tim Freeman" },
    healthCenter: "Mountain View Clinic",
    category: "Clinical",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' },
    comments: [
      { id: 'c1-1', user: { initials: 'TF', name: 'Tim Freeman' }, text: 'Files uploaded for patients 1–3. Still waiting on records from the coordinator for the remaining two.', timestamp: new Date('2026-05-15T10:00:00') },
      { id: 'c1-2', user: { initials: 'SM', name: 'Sarah Martinez' }, text: 'Coordinator confirmed they\'ll have the last two files over by Thursday.', timestamp: new Date('2026-05-16T14:00:00') },
      { id: 'c1-3', user: { initials: 'TF', name: 'Tim Freeman' }, text: 'All files are in. Marking the subtasks complete.', timestamp: new Date('2026-05-18T09:30:00') },
    ],
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
    title: "Complete staff compliance training",
    completed: false,
    attention: { type: 'needs', count: 1 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' },
    comments: [
      { id: 'c2-1', user: { initials: 'TF', name: 'Tim Freeman' }, text: 'Training portal is back up — everyone should be able to complete this now.', timestamp: new Date('2026-05-28T10:15:00') },
    ]
  },
  {
    id: 3,
    title: "Submit quarterly clinical report and enrollment documentation summary",
    completed: false,
    dueDate: "02/28/2026",
    assignedTo: { initials: "SM", name: "Sarah Martinez" },
    healthCenter: "Riverside Health Center",
    category: "Compliance",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' },
    comments: [
      { id: 'c3-1', user: { initials: 'SM', name: 'Sarah Martinez' }, text: 'Started pulling together the enrollment numbers. Q1 spreadsheet is almost ready.', timestamp: new Date('2026-05-20T09:00:00') },
      { id: 'c3-2', user: { initials: 'TF', name: 'Tim Freeman' }, text: 'Make sure the adverse event summary from March is included — the sponsor flagged that last cycle.', timestamp: new Date('2026-05-21T14:30:00') },
      { id: 'c3-3', user: { initials: 'SM', name: 'Sarah Martinez' }, text: 'Good catch, adding it now. Should have a draft ready by end of week.', timestamp: new Date('2026-05-22T11:00:00') },
      { id: 'c3-4', user: { initials: 'JD', name: 'John Davis' }, text: 'Can someone double-check the subtask 3 uploads? I see only one file made it through.', timestamp: new Date('2026-05-23T16:45:00') },
      { id: 'c3-5', user: { initials: 'TF', name: 'Tim Freeman' }, text: 'On it — looks like the second PDF exceeded the size limit. Will re-compress and re-upload.', timestamp: new Date('2026-05-24T08:30:00') },
      { id: 'c3-6', user: { initials: 'LW', name: 'Lisa Wang' }, text: 'Also flagging that the protocol deviations section needs the updated corrective action plan from April.', timestamp: new Date('2026-05-25T13:15:00') },
      { id: 'c3-7', user: { initials: 'SM', name: 'Sarah Martinez' }, text: 'Updated CAP attached. I think we\'re good to submit pending final review from Tim.', timestamp: new Date('2026-05-26T10:00:00') },
    ],
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
    title: "Update protocol documentation for the 2026 annual compliance review cycle",
    completed: false,
    dueDate: "02/20/2026",
    assignedTo: { initials: "LW", name: "Lisa Wang" },
    healthCenter: "Eastside Family Clinic",
    category: "Governance",
    attention: { type: 'missing', count: 2 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' },
    comments: [
      { id: 'c5-1', user: { initials: 'LW', name: 'Lisa Wang' }, text: 'Section 4.2 has a version conflict — I\'m waiting on the PI to confirm which amendment takes precedence.', timestamp: new Date('2026-05-18T11:00:00') },
      { id: 'c5-2', user: { initials: 'TF', name: 'Tim Freeman' }, text: 'PI confirmed — use Amendment 3 dated March 15. The earlier version is superseded.', timestamp: new Date('2026-05-19T09:30:00') },
    ]
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
    title: "Prepare site monitoring visit checklist and pre-visit staff readiness review",
    completed: false,
    dueDate: "03/01/2026",
    assignedTo: { initials: "RP", name: "Robert Park" },
    healthCenter: "Northgate Medical",
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' },
    comments: [
      { id: 'c7-1', user: { initials: 'RP', name: 'Robert Park' }, text: 'Checklist is drafted. Sending to staff for review before we finalize.', timestamp: new Date('2026-05-22T15:00:00') },
      { id: 'c7-2', user: { initials: 'AM', name: 'Angela Miller' }, text: 'Looks good overall. One note — the lab specimen section needs the updated SOP reference from February.', timestamp: new Date('2026-05-23T09:45:00') },
      { id: 'c7-3', user: { initials: 'RP', name: 'Robert Park' }, text: 'Fixed. Also added the new delegation log check that compliance requested last quarter.', timestamp: new Date('2026-05-24T13:30:00') },
      { id: 'c7-4', user: { initials: 'TF', name: 'Tim Freeman' }, text: 'Approved from my end. Let\'s lock this version and distribute to the team.', timestamp: new Date('2026-05-25T10:00:00') },
    ]
  },
  {
    id: 8,
    title: "Conduct patient safety assessment",
    completed: false,
    dueDate: "02/25/2026",
    assignedTo: { initials: "AM", name: "Angela Miller" },
    healthCenter: "Westwood Clinic",
    category: "Clinical",
    attention: { type: 'needs', count: 3 },
    taskType: 'system',
    createdBy: { initials: 'RL', name: 'Reglantern' },
    comments: [
      { id: 'c8-1', user: { initials: 'AM', name: 'Angela Miller' }, text: 'Three patient files are flagged for follow-up. Working through them now.', timestamp: new Date('2026-05-20T14:00:00') },
      { id: 'c8-2', user: { initials: 'TF', name: 'Tim Freeman' }, text: 'Patient #4 file looks incomplete — can you confirm whether the consent was re-executed after the protocol amendment?', timestamp: new Date('2026-05-21T11:30:00') },
      { id: 'c8-3', user: { initials: 'AM', name: 'Angela Miller' }, text: 'Confirmed — re-execution happened on 05/10. I\'ll upload the updated consent form today.', timestamp: new Date('2026-05-21T16:00:00') },
      { id: 'c8-4', user: { initials: 'JD', name: 'John Davis' }, text: 'Flagging patient #7 as well — their last safety visit was overdue by 3 days. Coordinator is aware.', timestamp: new Date('2026-05-23T09:00:00') },
    ]
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
    title: "Review and re-execute informed consent forms for all active participants",
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
    title: "Submit ethics committee application",
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
    title: "Update regulatory submissions",
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
    title: "Review protocol amendments",
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