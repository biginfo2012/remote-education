import AuthRequired from "../utils/admin-auth-required";


export const adminRoutes = {
  path: '/admin',
  component: () => import('../views/admin/index'),
  redirect: '/admin/dashboard',
  beforeEnter: AuthRequired,
  children: [
    {
      path: 'dashboard',
      beforeEnter: AuthRequired,
      component: () => import('../views/admin/dashboard/dashboard')
    },
    {
      path: 'organization-management',
      component: () => import('../views/admin/organization-management/organization-management'),
      beforeEnter: AuthRequired,
    },
    {
      path: 'teacher-search',
      component: () => import('../views/admin/teacher-search/teacher-search'),
      beforeEnter: AuthRequired,
    },
    {
      path: 'student-search',
      component: () => import('../views/admin/student-search/student-search'),
      beforeEnter: AuthRequired,
    },
    {
      path: 'class-search',
      component: () => import('../views/admin/class-search/class-search'),
      beforeEnter: AuthRequired,
    },
    {
      path: 'message-search',
      component: () => import('../views/admin/message-search/message-search'),
      beforeEnter: AuthRequired,
    },
  ]

};
