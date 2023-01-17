import AuthRequired from "../utils/admin-auth-required";


export const orgRoutes = {
  path: '/org-admin',
  component: () => import('../views/org-admin/index'),
  redirect: '/org-admin/base-info/organization-presentation',
  beforeEnter: AuthRequired,
  children: [
    {
      path: 'base-info',
      beforeEnter: AuthRequired,
      component: () => import('../views/org-admin/base-info/index'),
      redirect: '/org-admin/base-info/organization-presentation',
      children: [
        {
          path: 'organization-presentation',
          beforeEnter: AuthRequired,
          component: () => import('../views/org-admin/base-info/organization-presentation')
        },
        {
          path: 'student-management',
          beforeEnter: AuthRequired,
          component: () => import('../views/org-admin/base-info/student-management')
        },
        {
          path: 'teacher-management',
          beforeEnter: AuthRequired,
          component: () => import('../views/org-admin/base-info/teacher-management')
        },
        {
          path: 'course-management',
          beforeEnter: AuthRequired,
          component: () => import('../views/org-admin/base-info/course-management')
        },
        {
          path: 'field-management',
          beforeEnter: AuthRequired,
          component: () => import('../views/org-admin/base-info/field-management')
        },
      ]
    },
    {
      path: 'class-management',
      beforeEnter: AuthRequired,
      component: () => import('../views/org-admin/class-management/index'),
    },
    {
      path: 'message-management',
      beforeEnter: AuthRequired,
      component: () => import('../views/org-admin/message-management/index'),
      redirect: '/org-admin/message-management/message-history',
      children: [
        {
          path: 'message-history',
          beforeEnter: AuthRequired,
          component: () => import('../views/org-admin/message-management/message-history')
        },
        {
          path: 'message-schedule',
          beforeEnter: AuthRequired,
          component: () => import('../views/org-admin/message-management/message-schedule')
        }
      ]
    },
    {
      path: 'signin-report',
      beforeEnter: AuthRequired,
      component: () => import('../views/org-admin/signin-report/signin-report'),
    },
  ]

};
