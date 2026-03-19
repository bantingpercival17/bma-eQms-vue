// Helper function
export const appendRoute = (prop: string, name: string, path: string, metaName: string, importComponent: () => Promise<any>) => {
    return {
        path,
        name: `${prop}${name}`,
        meta: {
            auth: true,
            name: metaName,
            user: 'admin'
        },
        component: importComponent
    };
};

// Define the routes for admin
export const adminRoute = (prop: string) => [
    appendRoute(prop, '.default', 'dashboard', 'Dashboard', () => import('@/views/dashboards/employee/Dashboard.vue')),
    appendRoute(prop, '.dashboard', 'dashboard', 'Dashboard', () => import('@/views/dashboards/employee/Dashboard.vue')),
    appendRoute(prop, '.dashboard-v2', 'dashboard/v2', 'Dashboard', () => import('@/views/dashboards/employee/Dashboard.vue')),
    appendRoute(prop, 'procedure', '/qms/process-forms', 'Procedure', () => import('@/views/qms/Procedure.vue')),
    appendRoute(
        prop,
        'version-control',
        '/qms/version-logs',
        'Version Control',
        () => import('@/views/qms/VersionControl.vue')
    ),
    appendRoute(
        prop,
        'account-list',
        '/manage/accounts',
        'Account List',
        () => import('@/views/account-management/AccountManagement.vue')
    ),
    appendRoute(
        prop,
        'approval-workflow',
        '/qms/approval-workflow',
        'Approval Workflow',
        () => import('@/views/qms/ApprovalWorkflow.vue')
    ),
    appendRoute(
        prop,
        'create-amendments',
        '/qms/approval-workflow/create',
        'Create Amendments',
        () => import('@/views/qms/workflow/components/CreateNewProcedure.vue')
    ),
    appendRoute(
        prop,
        'view-amendments',
        '/qms/approval-workflow/view/:data',
        'View Amendments',
        () => import('@/views/qms/workflow/components/ViewAmendments.vue')
    ),
    appendRoute(
        prop,
        'risk-management',
        '/risk/risk-management',
        'Risk Management',
        () => import('@/views/risk-management/RiskManagement.vue')
    ),
    appendRoute(
        prop,
        'add-risk-assessment',
        '/risk/risk-management/create-new',
        'Add Risk Assessment',
        () => import('@/views/risk-management/AddRiskAssessment.vue')
    ),
    appendRoute(
        prop,
        'view-risk-assessment',
        '/risk/risk-management/view/:riskId',
        'View Risk Assessment',
        () => import('@/views/risk-management/ViewRiskAssessment.vue')
    ),
    appendRoute(
        prop,
        'quality-objective',
        '/quality-objectives/monitoring',
        'Quality Objectives',
        () => import('@/views/quality-objectives/QualityObjective.vue')
    ),
    appendRoute(
        prop,
        'view-quality-objective',
        '/quality-objectives/monitoring/view/:objective',
        'View Quality Objectives',
        () => import('@/views/quality-objectives/ViewQualityObjective.vue')
    ),
];
// Parent route
const EmployeeRoutes = {
    path: '/',
    redirect: '/dashboard',
    name: 'admin-layout',
    meta: {
        requiresAuth: true
    },
    component: () => import('@/layouts/dashboard/DashboardLayout.vue'),
    children: adminRoute('employee-layout')
};

export default EmployeeRoutes;

