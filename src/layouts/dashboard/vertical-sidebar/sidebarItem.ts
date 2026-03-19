export interface menu {
  header?: string;
  title?: string;
  icon?: string;
  to?: string;
  divider?: boolean;
  getURL?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

let sidebarItem: menu[] = [
  { header: 'Dashboard' },
  {
    title: 'Dashboard',
    icon: 'home-trend', // Keep as is, it's a good general dashboard icon
    to: '/dashboard/v2'
  },
  { header: 'QMS' },
  {
    title: 'Process and Forms',
    icon: 'custom-folder-file', // Represents a repository of processes and forms
    to: '/qms/process-forms' // Updated path for clarity
  },
  {
    title: 'Version Control Logs',
    icon: 'custom-git-history', // Represents versioning and history
    to: '/qms/version-logs' // Updated path for clarity
  },
  {
    title: 'Approval Workflow',
    icon: 'custom-flow-check', // Represents a workflow with approval/completion
    to: '/qms/approval-workflow' // Updated path for clarity
  },
  { header: 'Reports' },
  {
    title: 'Submission',
    icon: 'custom-upload-document', // Represents submitting documents/reports
    to: '/reports/submission' // Updated path for clarity
  },
  {
    title: 'Track My Submission', // Renamed from 'Register' for clarity based on previous discussion
    icon: 'custom-list-status', // Represents tracking or status of items
    to: '/reports/track-submission' // Updated path for clarity
  },
  { header: 'Quality Objectives' }, // New header based on previous discussion
  {
    title: 'Monitoring',
    icon: 'custom-target-chart', // Represents objectives and monitoring progress
    to: '/quality-objectives/monitoring' // New path
  },
  { header: 'Risk Management' }, // New header based on previous discussion
  {
    title: 'Assessment & Mitigation',
    icon: 'custom-shield-risk', // Represents risk and mitigation
    to: '/risk/risk-management' // New path
  },
 /*  { header: 'Others' },
  {
    title: 'Sample Page',
    icon: 'custom-sample', // Keep as is
    to: '/starter'
  }, */
];
const userData = localStorage.getItem('user');
const storedProfile = userData ? JSON.parse(userData) : null;
const isAdmin = storedProfile.roleID
if (isAdmin === 1) {
  sidebarItem.push(
    { header: 'Account Management' },
    {
      title: 'Account',
      icon: 'custom-sample',
      to: '/manage/accounts'
    },
    {
      title: 'Roles',
      icon: 'custom-sample',
      to: '/account'
    },
    {
      title: 'Departments',
      icon: 'custom-sample',
      to: '/account1'
    }
  )

}
export default sidebarItem;
