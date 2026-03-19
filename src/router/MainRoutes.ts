const MainRoutes = {
  path: '/dashboard',
  meta: {
    requiresAuth: true
  },
  redirect: '/dashboard',
  component: () => import('@/layouts/dashboard/DashboardLayout.vue'),
  children: [
    {
      name: 'Dashboard v2',
      path: '/dashboard',
      component: () => import('@/views/dashboards/employee/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      name: 'Default',
      path: '/dashboard',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
    },
    {
      name: 'Dashboard v2',
      path: '/dashboard/v2',
      component: () => import('@/views/dashboards/employee/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      name: 'Landingpage',
      path: '/v2',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
    },
    {
      name: 'Starter',
      path: '/starter',
      component: () => import('@/views/StarterPage.vue')
    },
    {
      name: 'Typography',
      path: '/utils/typography',
      component: () => import('@/views/utilities/typography/TypographyPage.vue')
    },
    {
      name: 'Colors',
      path: '/utils/colors',
      component: () => import('@/views/utilities/colors/ColorPage.vue')
    },
    {
      name: 'Shadows',
      path: '/utils/shadows',
      component: () => import('@/views/utilities/shadows/ShadowPage.vue')
    },

  ]
};

export default MainRoutes;
