export type WorkflowType = 'Draft' | 'Output';

export interface Workflow {
  id: number;
  title: string;
  type: WorkflowType;
  steps: string;
  description: string;
}

// Curated unique lists (no duplicates). Counts per request:
// Draft: 14, Output: 15

export const draftItems: Workflow[] = [
  { id: 1, title: 'Draft an S-1 Filing', type: 'Draft', steps: '5 steps', description: 'Create SEC registration statement for IPO' },
  { id: 2, title: 'Draft S-1 Risk Factors', type: 'Draft', steps: '4 steps', description: 'Create comprehensive risk factors section for S-1' },
  { id: 3, title: 'Draft board resolutions', type: 'Draft', steps: '6 steps', description: 'Create corporate board meeting resolutions' },
  { id: 4, title: 'Draft employment agreements', type: 'Draft', steps: '7 steps', description: 'Create executive employment contracts' },
  { id: 5, title: 'Draft legal opinion memorandum', type: 'Draft', steps: '8 steps', description: 'Prepare detailed legal analysis memo' },
  { id: 6, title: 'Draft real estate purchase agreement', type: 'Draft', steps: '9 steps', description: 'Create property acquisition contracts' },
  { id: 7, title: 'Draft NDA for vendor engagement', type: 'Draft', steps: '4 steps', description: 'Prepare non-disclosure agreement for vendors' },
  { id: 8, title: 'Draft engagement letter', type: 'Draft', steps: '5 steps', description: 'Prepare client engagement letter' },
  { id: 9, title: 'Draft board meeting minutes', type: 'Draft', steps: '4 steps', description: 'Prepare formal meeting minutes' },
  { id: 10, title: 'Draft asset purchase agreement', type: 'Draft', steps: '8 steps', description: 'Prepare APA core terms' },
  { id: 11, title: 'Draft services agreement', type: 'Draft', steps: '6 steps', description: 'Prepare master services agreement' },
  { id: 12, title: 'Draft loan agreement', type: 'Draft', steps: '7 steps', description: 'Prepare commercial loan agreement' },
  { id: 13, title: 'Draft lease agreement', type: 'Draft', steps: '6 steps', description: 'Prepare commercial lease' },
  { id: 14, title: 'Draft operating agreement', type: 'Draft', steps: '7 steps', description: 'Prepare LLC operating agreement' },
];

export const outputItems: Workflow[] = [
  { id: 101, title: 'Generate post-closing timeline', type: 'Output', steps: '2 steps', description: 'Develop comprehensive closing schedules' },
  { id: 102, title: 'Generate closing checklist', type: 'Output', steps: '3 steps', description: 'Create comprehensive transaction closing lists' },
  { id: 103, title: 'Schedule critical deadlines', type: 'Output', steps: '2 steps', description: 'Track and manage important dates' },
  { id: 104, title: 'Generate risk assessment matrix', type: 'Output', steps: '3 steps', description: 'Create comprehensive risk analysis' },
  { id: 105, title: 'Generate investment analysis', type: 'Output', steps: '5 steps', description: 'Create detailed investment summaries' },
  { id: 106, title: 'Generate due diligence list', type: 'Output', steps: '3 steps', description: 'Produce initial diligence request list' },
  { id: 107, title: 'Generate summary term sheet', type: 'Output', steps: '4 steps', description: 'Summarize principal deal terms' },
  { id: 108, title: 'Generate cap table', type: 'Output', steps: '3 steps', description: 'Create capitalization table summary' },
  { id: 109, title: 'Generate filing calendar', type: 'Output', steps: '2 steps', description: 'Build recurring filing calendar' },
  { id: 110, title: 'Generate deliverables tracker', type: 'Output', steps: '3 steps', description: 'Track deal deliverables and owners' },
  { id: 111, title: 'Generate project plan', type: 'Output', steps: '4 steps', description: 'Create phased implementation plan' },
  { id: 112, title: 'Generate closing indices', type: 'Output', steps: '3 steps', description: 'Create signature and document indices' },
  { id: 113, title: 'Generate execution package', type: 'Output', steps: '4 steps', description: 'Bundle docs for execution' },
  { id: 114, title: 'Generate correspondence log', type: 'Output', steps: '2 steps', description: 'Create external communications log' },
];



export const workflows: Workflow[] = [...draftItems, ...outputItems];


