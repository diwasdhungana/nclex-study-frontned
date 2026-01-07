import { root } from 'postcss';

export const paths = {
  auth: {
    root: '/auth',
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    otp: '/auth/otp',
    terms: '/auth/terms',
    privacy: '/auth/privacy',
  },

  dashboard: {
    root: '/dashboard',
    home: '/dashboard/home',
    myProfile: {
      root: '/dashboard/my-profile',
    },
    admin: {
      root: '/dashboard/admin',
      addQuestions: {
        root: '/dashboard/admin/add-questions',
      },
      viewQuestions: {
        root: '/dashboard/admin/view-questions/',
        viewSpecificQuestions: '/dashboard/admin/view-questions/:questionId',
      },
      viewSubjectSystem: {
        root: '/dashboard/admin/subjects-systems',
      },
      groupQuesitons: {
        root: '/dashboard/admin/group-questions',
      },
      timed: {
        root: '/dashboard/admin/timed',
        addQuestion: '/dashboard/admin/timed/add-question',
        viewQuestions: {
          root: '/dashboard/admin/timed/view-questions',
          viewSpecificQuestions: '/dashboard/admin/timed/view-questions/:questionId',
        },
        manageSets: {
          root: '/dashboard/admin/timed/manage-sets',
          specific: '/dashboard/admin/timed/manage-sets/:setId',
        },
      },
      users: {
        root: '/dashboard/admin/users',
      },
      video: {
        root: '/dashboard/admin/video',
        upload: '/dashboard/admin/video/upload',
        edit: '/dashboard/admin/video/:id',
      },
    },
    student: {
      root: '/dashboard/student',
      createTest: {
        root: '/dashboard/student/create-test',
      },
      activeTest: {
        root: '/dashboard/student/active-test',
      },
      attemptTest: {
        root: '/dashboard/student/test',
      },
      viewResults: {
        root: '/dashboard/student/view-results',
        viewSpecificResults: '/dashboard/student/view-results/:resultId',
      },
      timed: {
        root: '/dashboard/student/timed',
        createTest: {
          root: '/dashboard/student/timed/create-test',
        },
        activeTest: {
          root: '/dashboard/student/timed/active-test',
        },
        attemptTest: {
          root: '/dashboard/student/timed/test',
        },
        viewResults: {
          root: '/dashboard/student/timed/view-results',
          viewSpecificResults: '/dashboard/student/timed/view-results/:testId',
        },
      },
      video: {
        root: '/dashboard/student/video',
        view: '/dashboard/student/video/:id',
        player: '/dashboard/student/video/player/:id',
      },
    },
  },
};
