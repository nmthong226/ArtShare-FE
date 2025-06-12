// src/routes.tsx
import { lazy } from "react";
import { Navigate, RouteObject, useRoutes, Outlet } from "react-router-dom";

// Layouts & Wrappers
import RootLayout from "@/layouts";
import AuthenLayout from "@/layouts/featLayouts/AuthenLayout";
import InAppLayout from "@/layouts/InAppLayout";
import AILayout from "@/layouts/featLayouts/ImageToolsLayout";
import ProtectedAuthRoute from "@/components/ProtectedItems/ProtectedAuthRoute";
import ProtectedInAppRoute from "@/components/ProtectedItems/ProtectedInAppRoute";
import GuestRoute from "@/components/routes/guest-route";
import EditUser from "./features/edit-user/EditUserPage";
import OnboardingProfile from "./pages/Onboarding";

import Dashboard from "./features/app-dashboard/Dashboard";
import OnboardingRoute from "./components/ProtectedItems/OnboardingRoute";
import RequireOnboard from "./components/ProtectedItems/RequireOnboard";
import LinkSocial from "./features/media-automation/LinkSocial";
import AutomationProject from "./features/media-automation/AutomationProject";
import AutoPostCreation from "./features/media-automation/AutoPostCreation";
import AutomationLayout from "./layouts/featLayouts/AutomationLayout";
import AutoProjectCreation from "./features/media-automation/AutoProjectCreation";
import AutomationProjectDetails from "./features/media-automation/AutomationProjectDetails";

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
          { path: "/auto/link-social", element: <LinkSocial /> },
          { path: "/auto/my-projects", element: <AutomationProject /> },
          { path: "/auto/my-projects/new", element: <AutoProjectCreation /> },
          { path: "/auto/:slug/details", element: <AutomationProjectDetails /> },
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
          { path: "/edit-user", element: <EditUser /> },
          { path: "/post/:postId/edit", element: <EditPost /> },
          { path: "/posts/new", element: <UploadPost /> },
          { path: "/collections", element: <Collection /> },
          { path: "/docs", element: <DocumentDashboard /> },
          // { path: "/auto/link-social", element: <LinkSocial /> },
          // { path: "/auto/my-projects", element: <AutomationProject /> },
          // { path: "/auto/my-projects/new", element: <AutoProjectCreation /> },
          // { path: "/auto/:slug/details", element: <AutomationProjectDetails /> },
          { path: "/:username", element: <UserProfile /> }, // <== last
        ]
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
          { path: "/image/tool/editor", element: <ImageEditor /> },
          { path: "/image/tool/text-to-image", element: <ArtGeneration /> },
        ],
      },
      {
        element: (
          <RequireOnboard>
            <ProtectedInAppRoute>
              <AutomationLayout>
                <Outlet />
              </AutomationLayout>
            </ProtectedInAppRoute>
          </RequireOnboard>
        ),
        children: [
          { path: "/auto/:slug/posts/new", element: <AutoPostCreation /> },
          { path: "/auto/:slug/posts/:id", element: <AutoPostCreation /> }
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
        children: [
          { path: "/docs/:blogId", element: <MyWriting /> },
        ]
      },
      // Catch-all -> redirect
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
];

export function AppRoutes() {
  return useRoutes(routeConfig);
}
