// src/routes.tsx
import { lazy } from "react";
import { Navigate, RouteObject, useRoutes, Outlet } from "react-router-dom";

// Layouts & Wrappers
import RootLayout from "@/layouts";
import ProtectedAuthRoute from "@/components/ProtectedItems/ProtectedAuthRoute";
import ProtectedInAppRoute from "@/components/ProtectedItems/ProtectedInAppRoute";
import GuestRoute from "@/components/routes/guest-route";
import OnboardingRoute from "./components/ProtectedItems/OnboardingRoute";

const AuthenLayout = lazy(() => import("@/layouts/featLayouts/AuthenLayout"));
const InAppLayout = lazy(() => import("@/layouts/InAppLayout"));
const AILayout = lazy(() => import("@/layouts/featLayouts/ImageToolsLayout"));
const Dashboard = lazy(() => import("./features/app-dashboard/Dashboard"));
const EditUser = lazy(() => import("./features/edit-user/EditUserPage"));
const OnboardingProfile = lazy(() => import("./pages/Onboarding"));
const RequireOnboard = lazy(
  () => import("./components/ProtectedItems/RequireOnboard"),
);
// Lazy imports for pages/features
const LandingPage = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Authentication/Login"));
const SignUp = lazy(() => import("@/pages/Authentication/SignUp"));
const ForgotPassword = lazy(
  () => import("@/pages/Authentication/ForgotPassword"),
);
const AccountActivation = lazy(
  () => import("@/pages/Authentication/Activation"),
);
const AuthAction = lazy(() => import("@/pages/Authentication/HandleCallback"));
const Explore = lazy(() => import("@/features/explore"));
const BrowseBlogs = lazy(() => import("@/features/browse-blogs/BrowseBlogs"));
const BlogDetails = lazy(() => import("@/features/blog-details/BlogDetails"));
const Search = lazy(() => import("@/pages/Search"));
const Post = lazy(() => import("@/features/post"));
const EditPost = lazy(() => import("@/features/post-management/EditPost"));
const UploadPost = lazy(() => import("@/features/post-management/UploadPost"));
const Collection = lazy(() => import("@/features/collection"));
const UserProfile = lazy(
  () => import("@/features/user-profile-private/UserProfile"),
);
const DocumentDashboard = lazy(
  () => import("@/features/user-writing/DocumentDashboard"),
);
const MyWriting = lazy(() => import("@/features/user-writing/MyWriting"));
const ArtGeneration = lazy(() => import("@/features/gen-art/ArtGenAI"));
const ImageEditor = lazy(() => import("@/features/edit-image/EditImage"));

/**
 * Flat route tree using useRoutes
 */
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
            path: "/login",
            element: (
              <GuestRoute>
                <Login />
              </GuestRoute>
            ),
          },
          { path: "/signup", element: <SignUp /> },
          { path: "/forgot-password", element: <ForgotPassword /> },
          { path: "/auth", element: <AuthAction /> },
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
          { path: "/activate-account/:token", element: <AccountActivation /> },
        ],
      },
      {
        path: "/onboarding",
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
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/explore", element: <Explore /> },
          { path: "/posts/:postId", element: <Post /> },
          { path: "/blogs", element: <BrowseBlogs /> },
          { path: "/blogs/:blogId", element: <BlogDetails /> },
          { path: "/search", element: <Search /> },
        ],
      },
      // In-App Private
      {
        element: (
          <RequireOnboard>
            {" "}
            {/* ⬅️ block until onboarding done */}
            <ProtectedInAppRoute>
              <InAppLayout>
                <Outlet />
              </InAppLayout>
            </ProtectedInAppRoute>
          </RequireOnboard>
        ),
        children: [
          { path: "/:username", element: <UserProfile /> },
          { path: "/edit-user", element: <EditUser /> },
          { path: "/post/:postId/edit", element: <EditPost /> },
          { path: "/posts/new", element: <UploadPost /> },
          { path: "/collections", element: <Collection /> },
          { path: "/docs", element: <DocumentDashboard /> },
        ],
      },
      // In-App AI Private
      {
        element: (
          <ProtectedInAppRoute>
            <AILayout>
              <Outlet />
            </AILayout>
          </ProtectedInAppRoute>
        ),
        children: [
          { path: "/image/tool/editor", element: <ImageEditor /> },
          { path: "/image/tool/text-to-image", element: <ArtGeneration /> },
        ],
      },
      // In-App Text Editor Private
      {
        element: (
          <ProtectedInAppRoute>
            <Outlet />
          </ProtectedInAppRoute>
        ),
        children: [{ path: "/docs/:blogId", element: <MyWriting /> }],
      },
      // Catch-all -> redirect
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
];

/**
 * Hook to render the routes
 */
export function AppRoutes() {
  return useRoutes(routeConfig);
}
