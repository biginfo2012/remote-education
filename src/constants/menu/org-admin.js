const data = [
  {
    id: "base-info",
    icon: "icofont-site-map",
    label: "menu.base-info",
    to: "/org-admin/base-info",
    newWindow: false,
    permissionId: 65,
    subs: [
      {
        id: 'base-info-*-organization-presentation',
        icon: "simple-icon-docs",
        label: "menu.organization-presentation",
        to: "/org-admin/base-info/organization-presentation",
        newWindow: false,
        permissionId: 73,
      },
      {
        id: 'base-info-*-student-management',
        icon: "simple-icon-folder",
        label: "menu.student-management",
        to: "/org-admin/base-info/student-management",
        newWindow: false,
        permissionId: 84,
      },
      {
        id: 'base-info-*-teacher-management',
        icon: "simple-icon-grid",
        label: "menu.teacher-management",
        to: "/org-admin/base-info/teacher-management",
        newWindow: false,
        permissionId: 91,
      },
      {
        id: 'base-info-*-course-management',
        icon: "simple-icon-settings",
        label: "menu.course-management",
        to: "/org-admin/base-info/course-management",
        newWindow: false,
        permissionId: 98,
      },
      {
        id: 'base-info-*-field-management',
        icon: "simple-icon-screen-desktop",
        label: "menu.field-management",
        to: "/org-admin/base-info/field-management",
        newWindow: false,
        permissionId: 163,
      },
    ]
  },

  {
    id: "class-management",
    icon: "icofont-location-pin",
    label: "menu.class-management",
    to: "/org-admin/class-management",
    newWindow: false,
    permissionId: 50,
    subs:null
  },
  {
    id: "message-management",
    icon: "icofont-gears",
    label: "menu.message-management",
    to: "/org-admin/message-management",
    newWindow: false,
    permissionId: 57,
    subs:[
      {
        id: 'message-management-*-message-history',
        icon: "icofont-caret-right",
        label: "menu.message-history",
        to: "/org-admin/message-management/message-history",
        newWindow: false,
        permissionId: 164,
      },
      {
        id: 'message-management-*-message-schedule',
        icon: "icofont-caret-right",
        label: "menu.message-schedule",
        to: "/org-admin/message-management/message-schedule",
        newWindow: false,
        permissionId: 165,
      },
    ]
  },
  {
    id: "signin-report",
    icon: "icofont-gears",
    label: "menu.signin-report",
    to: "/org-admin/signin-report",
    newWindow: false,
    permissionId: 57,
    subs:null
  },

];

export default data;
