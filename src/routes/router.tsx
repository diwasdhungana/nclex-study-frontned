import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AuthGuard } from '@/guards/auth-guard';
import { GuestGuard } from '@/guards/guest-guard';
import { AuthLayout } from '@/layouts/auth';
import { AdminLayout, DashboardLayout, StudentLayout } from '@/layouts/dashboard';
import { LazyPage } from './lazy-page';
import { paths } from './paths';
import index from '@/pages/dashboard/admin/index';
import { AdminGuard } from '@/guards/admin-guard';
import { StudentGuard } from '@/guards/student-guard';
import { ArcherGuard } from '@/guards/archer-guard';
import { VideoGuard } from '@/guards/video-guard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={paths.dashboard.root} replace />,
  },
  {
    path: paths.auth.root,
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
    children: [
      {
        index: true,
        path: paths.auth.root,
        element: <Navigate to={paths.auth.login} replace />,
      },
      {
        path: paths.auth.login,
        element: LazyPage(() => import('@/pages/auth/login')),
      },
      {
        path: paths.auth.register,
        element: LazyPage(() => import('@/pages/auth/register')),
      },
      {
        path: paths.auth.forgotPassword,
        element: LazyPage(() => import('@/pages/auth/forgot-password')),
      },
      {
        path: paths.auth.otp,
        element: LazyPage(() => import('@/pages/auth/otp')),
      },
    ],
  },
  {
    path: paths.dashboard.root,
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        path: paths.dashboard.root,
        element: <Navigate to={paths.dashboard.home} replace />,
      },
      {
        path: paths.dashboard.home,
        element: LazyPage(() => import('@/pages/dashboard/(home)')),
      },
      {
        index: true,
        path: paths.dashboard.myProfile.root,
        element: LazyPage(() => import('@/pages/dashboard/(home)/my-profile/index')),
      },
      /* ---------------------------------- ADMIN ---------------------------------- */
      {
        path: paths.dashboard.admin.root,
        element: (
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        ),
        children: [
          {
            index: true,
            path: paths.dashboard.admin.root,
            element: LazyPage(() => import('@/pages/dashboard/admin/index')),
          },
          {
            path: paths.dashboard.admin.addQuestions.root,
            children: [
              {
                index: true,
                path: paths.dashboard.admin.addQuestions.root,
                element: LazyPage(() => import('@/pages/dashboard/admin/add-questions/index')),
              },
            ],
          },
          {
            path: paths.dashboard.admin.viewSubjectSystem.root,
            children: [
              {
                index: true,
                path: paths.dashboard.admin.viewSubjectSystem.root,
                element: LazyPage(
                  () => import('@/pages/dashboard/admin/systems-and-subjects/index')
                ),
              },
            ],
          },
          {
            path: paths.dashboard.admin.users.root,
            children: [
              {
                index: true,
                path: paths.dashboard.admin.users.root,
                element: LazyPage(() => import('@/pages/dashboard/admin/users/index')),
              },
            ],
          },
          {
            path: paths.dashboard.admin.video.root,
            children: [
              {
                index: true,
                element: LazyPage(() => import('@/pages/dashboard/admin/video/index')),
              },
              {
                path: paths.dashboard.admin.video.upload,
                element: LazyPage(() => import('@/pages/dashboard/admin/video/upload')),
              },
              {
                path: paths.dashboard.admin.video.edit,
                element: LazyPage(() => import('@/pages/dashboard/admin/video/upload')), // Reuse upload component
              },
            ],
          },
          {
            path: paths.dashboard.admin.viewQuestions.root,
            children: [
              {
                index: true,
                path: paths.dashboard.admin.viewQuestions.root,
                element: LazyPage(() => import('@/pages/dashboard/admin/view-questions/index')),
              },
              {
                index: true,
                path: paths.dashboard.admin.viewQuestions.viewSpecificQuestions,
                element: LazyPage(
                  () => import('@/pages/dashboard/admin/view-questions/Specific/index')
                ),
              },
            ],
          },
          {
            path: paths.dashboard.admin.groupQuesitons.root,
            children: [
              {
                index: true,
                path: paths.dashboard.admin.groupQuesitons.root,
                element: LazyPage(() => import('@/pages/dashboard/admin/group-questions/index')),
              },
            ],
          },
          {
            path: paths.dashboard.admin.timed.root,
            children: [
              {
                index: true,
                path: paths.dashboard.admin.timed.root,
                element: LazyPage(() => import('@/pages/dashboard/admin/archer/index')),
              },
              {
                index: true,
                path: paths.dashboard.admin.timed.addQuestion,
                element: LazyPage(() => import('@/pages/dashboard/admin/archer/add-questions')),
              },
              {
                index: true,
                path: paths.dashboard.admin.timed.viewQuestions.root,
                element: LazyPage(() => import('@/pages/dashboard/admin/archer/view-questions')),
              },
              {
                index: true,
                path: paths.dashboard.admin.timed.viewQuestions.viewSpecificQuestions,
                element: LazyPage(
                  () => import('@/pages/dashboard/admin/archer/view-questions/Specific/index')
                ),
              },
              {
                index: true,
                path: paths.dashboard.admin.timed.manageSets.root,
                element: LazyPage(() => import('@/pages/dashboard/admin/archer/manage-sets/index')),
              },
              {
                index: true,
                path: paths.dashboard.admin.timed.manageSets.specific,
                element: LazyPage(
                  () => import('@/pages/dashboard/admin/archer/manage-sets/specific/index')
                ),
              },
            ],
          },
        ],
      },
      {
        path: paths.dashboard.student.root,
        element: (
          <StudentGuard>
            <StudentLayout />
          </StudentGuard>
        ),

        children: [
          {
            index: true,
            path: paths.dashboard.student.root,
            element: LazyPage(() => import('@/pages/dashboard/student/index')),
          },
          {
            index: true,
            path: paths.dashboard.student.createTest.root,
            element: LazyPage(() => import('@/pages/dashboard/student/create-test')),
          },
          {
            index: true,
            path: paths.dashboard.student.activeTest.root,
            element: LazyPage(() => import('@/pages/dashboard/student/active-test')),
          },
          {
            index: true,
            path: paths.dashboard.student.attemptTest.root,
            element: LazyPage(() => import('@/pages/dashboard/student/attempt-test')),
          },
          {
            index: true,
            path: paths.dashboard.student.viewResults.root,
            element: LazyPage(() => import('@/pages/dashboard/student/view-results/index')),
          },
          {
            index: true,
            path: paths.dashboard.student.viewResults.viewSpecificResults,
            element: LazyPage(
              () => import('@/pages/dashboard/student/view-results/specific/index')
            ),
          },
          {
            path: paths.dashboard.student.timed.root,
            element: (
              <ArcherGuard>
                <StudentLayout />
              </ArcherGuard>
            ),
            children: [
              {
                index: true,
                path: paths.dashboard.student.timed.root,

                element: LazyPage(() => import('@/pages/dashboard/student/archer/index')),
              },
              {
                index: true,
                path: paths.dashboard.student.timed.createTest.root,
                element: LazyPage(() => import('@/pages/dashboard/student/archer/create-test')),
              },
              {
                index: true,
                path: paths.dashboard.student.timed.activeTest.root,
                element: LazyPage(() => import('@/pages/dashboard/student/archer/active-test')),
              },
              {
                index: true,
                path: paths.dashboard.student.timed.attemptTest.root,
                element: LazyPage(() => import('@/pages/dashboard/student/archer/attempt-test')),
              },
              {
                index: true,
                path: paths.dashboard.student.timed.viewResults.root,
                element: LazyPage(
                  () => import('@/pages/dashboard/student/archer/view-results/index')
                ),
              },
              {
                index: true,
                path: paths.dashboard.student.timed.viewResults.viewSpecificResults,
                element: LazyPage(
                  () => import('@/pages/dashboard/student/archer/view-results/specific/index')
                ),
              },
            ],
          },
          {
            path: paths.dashboard.student.video.root,
            element: (
              <VideoGuard>
                <StudentLayout />
              </VideoGuard>
            ),
            children: [
              {
                index: true,
                element: LazyPage(() => import('@/pages/dashboard/student/video/index')),
              },
            ],
          },
        ],
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
