import { lazy } from 'react';
import { Navigate, Outlet, RouteObject, useRoutes } from 'react-router-dom';

// Layouts & Wrappers
import ProtectedAuthRoute from '@/components/ProtectedItems/ProtectedAuthRoute';
import ProtectedInAppRoute from '@/components/ProtectedItems/ProtectedInAppRoute';
import GuestRoute from '@/components/routes/guest-route';
import RootLayout from '@/layouts';
import OnboardingRoute from './components/ProtectedItems/OnboardingRoute';
import UserSubscription from './features/user-profile-private/UserSubscription';

const AuthenLayout = lazy(() => import('@/layouts/featLayouts/AuthenLayout'));
const InAppLayout = lazy(() => import('@/layouts/InAppLayout'));
const AILayout = lazy(() => import('@/layouts/featLayouts/ImageToolsLayout'));
const Dashboard = lazy(() => import('./features/app-dashboard/Dashboard'));
const EditUser = lazy(() => import('./features/edit-user/EditUserPage'));
const OnboardingProfile = lazy(() => import('./pages/Onboarding'));
const RequireOnboard = lazy(
  () => import('./components/ProtectedItems/RequireOnboard'),
);

// Lazy imports for pages/features
const LandingPage = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/Authentication/Login'));
const SignUp = lazy(() => import('@/pages/Authentication/SignUp'));
const ForgotPassword = lazy(
  () => import('@/pages/Authentication/ForgotPassword'),
);
const AccountActivation = lazy(
  () => import('@/pages/Authentication/Activation'),
);
const AuthAction = lazy(() => import('@/pages/Authentication/HandleCallback'));
const Explore = lazy(() => import('@/features/explore'));
const BrowseBlogs = lazy(() => import('@/features/browse-blogs/BrowseBlogs'));
const BlogDetails = lazy(() => import('@/features/blog-details/BlogDetails'));
const Search = lazy(() => import('@/pages/Search'));
const Post = lazy(() => import('@/features/post'));
const EditPost = lazy(() => import('@/features/post-management/EditPost'));
const UploadPost = lazy(() => import('@/features/post-management/UploadPost'));
const Collection = lazy(() => import('@/features/collection'));
const UserProfile = lazy(
  () => import('@/features/user-profile-private/UserProfile'),
);
const DocumentDashboard = lazy(
  () => import('@/features/user-writing/DocumentDashboard'),
);
const MyWriting = lazy(() => import('@/features/user-writing/MyWriting'));
const ArtGeneration = lazy(() => import('@/features/gen-art/ArtGenAI'));
const ImageEditor = lazy(() => import('@/features/edit-image/EditImage'));

const SocialLinksPage = lazy(
  () =>
    import('@/features/media-automation/social-links/routes/SocialLinksPage'),
);
const ProjectsPage = lazy(
  () => import('@/features/media-automation/projects/routes/ProjectsPage'),
);
const ProjectDashboardPage = lazy(
  () =>
    import('@/features/media-automation/projects/routes/ProjectDashboardPage'),
);
const ProjectEditorPage = lazy(
  () => import('@/features/media-automation/projects/routes/ProjectEditorPage'),
);

const AutoPostEditorPage = lazy(
  () =>
    import('@/features/media-automation/auto-posts/routes/AutoPostEditorPage'),
);

const routeConfig: RouteObject[] = [
  {
    element: (
      <RootLayout>
        <Outlet />
      </RootLayout>
    ),
    children: [
      // Landing
      { index: true, element: <LandingPage /> },
      // Public Auth
      {
        element: (
          <AuthenLayout>
            <Outlet />
          </AuthenLayout>
        ),
        children: [
          {
            path: '/login',
            element: (
              <GuestRoute>
                <Login />
              </GuestRoute>
            ),
          },
          { path: '/signup', element: <SignUp /> },
          { path: '/forgot-password', element: <ForgotPassword /> },
          { path: '/auth', element: <AuthAction /> },
        ],
      },
      // Private Auth
      {
        element: (
          <ProtectedAuthRoute>
            <AuthenLayout>
              <Outlet />
            </AuthenLayout>
          </ProtectedAuthRoute>
        ),
        children: [
          { path: '/activate-account/:token', element: <AccountActivation /> },
        ],
      },
      {
        path: '/onboarding',
        element: (
          <ProtectedAuthRoute>
            <OnboardingRoute>
              <InAppLayout>
                <OnboardingProfile />
              </InAppLayout>
            </OnboardingRoute>
          </ProtectedAuthRoute>
        ),
      },
      // In-App Public
      {
        element: (
          <RequireOnboard>
            <InAppLayout>
              <Outlet />
            </InAppLayout>
          </RequireOnboard>
        ),
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/explore', element: <Explore /> },
          { path: '/posts/:postId', element: <Post /> },
          { path: '/blogs', element: <BrowseBlogs /> },
          { path: '/blogs/:blogId', element: <BlogDetails /> },
          { path: '/search', element: <Search /> },
        ],
      },
      // In-App Private
      {
        element: (
          <RequireOnboard>
            <ProtectedInAppRoute>
              <InAppLayout>
                <Outlet />
              </InAppLayout>
            </ProtectedInAppRoute>
          </RequireOnboard>
        ),
        children: [
          { path: '/edit-user', element: <EditUser /> },
          { path: '/post/:postId/edit', element: <EditPost /> },
          { path: '/posts/new', element: <UploadPost /> },
          { path: '/collections', element: <Collection /> },
          { path: '/docs', element: <DocumentDashboard /> },
          { path: '/app-subscription', element: <UserSubscription /> },
          { path: '/:username', element: <UserProfile /> },

          { path: '/auto/social-links', element: <SocialLinksPage /> },
          {
            path: '/auto/projects',
            element: <Outlet />,
            children: [
              { index: true, element: <ProjectsPage /> },
              { path: 'new', element: <ProjectEditorPage /> },
              {
                path: ':projectId',
                element: <Outlet />,
                children: [
                  { path: 'details', element: <ProjectDashboardPage /> },
                  { path: 'edit', element: <ProjectEditorPage /> },
                  {
                    path: 'posts',
                    element: <Outlet />,
                    children: [
                      { path: 'new', element: <AutoPostEditorPage /> },
                      { path: ':postId/edit', element: <AutoPostEditorPage /> },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      // In-App AI Private
      {
        element: (
          <RequireOnboard>
            <ProtectedInAppRoute>
              <AILayout>
                <Outlet />
              </AILayout>
            </ProtectedInAppRoute>
          </RequireOnboard>
        ),
        children: [
          { path: '/image/tool/editor', element: <ImageEditor /> },
          { path: '/image/tool/text-to-image', element: <ArtGeneration /> },
        ],
      },
      // No layout routes
      {
        element: (
          <RequireOnboard>
            <ProtectedInAppRoute>
              <Outlet />
            </ProtectedInAppRoute>
          </RequireOnboard>
        ),
        children: [{ path: '/docs/:blogId', element: <MyWriting /> }],
      },
      // Catch-all -> redirect
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];

export function AppRoutes() {
  return useRoutes(routeConfig);
}
