import { lazy, Suspense, ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const OTPVerifyPage = lazy(() => import('@/pages/OTPVerifyPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const PlannerPage = lazy(() => import('@/pages/PlannerPage'));
const HabitsPage = lazy(() => import('@/pages/HabitsPage'));
const GoalsPage = lazy(() => import('@/pages/GoalsPage'));
const ExpensesPage = lazy(() => import('@/pages/ExpensesPage'));
const LearningPage = lazy(() => import('@/pages/LearningPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const PageLoader = () => (
  <div className="p-6 space-y-6 max-w-7xl mx-auto">
    <Skeleton className="h-10 w-64 rounded-xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
    <Skeleton className="h-96 rounded-2xl" />
  </div>
);

const withSuspense = (Component: ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const routes = [
  { path: '/', element: withSuspense(LandingPage) },
  { path: '/privacy-policy', element: withSuspense(PrivacyPolicyPage) },
  { path: '/terms', element: withSuspense(TermsPage) },
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: withSuspense(LoginPage) },
      { path: '/register', element: withSuspense(RegisterPage) },
      { path: '/verify-email', element: withSuspense(OTPVerifyPage) },
      { path: '/forgot-password', element: withSuspense(ForgotPasswordPage) },
      { path: '/reset-password', element: withSuspense(ResetPasswordPage) },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: withSuspense(DashboardPage) },
          { path: '/planner', element: withSuspense(PlannerPage) },
          { path: '/habits', element: withSuspense(HabitsPage) },
          { path: '/goals', element: withSuspense(GoalsPage) },
          { path: '/expenses', element: withSuspense(ExpensesPage) },
          { path: '/learning', element: withSuspense(LearningPage) },
          { path: '/analytics', element: withSuspense(AnalyticsPage) },
          { path: '/settings', element: withSuspense(SettingsPage) },
          { path: '/profile', element: withSuspense(ProfilePage) },
        ],
      },
    ],
  },
  { path: '/404', element: withSuspense(NotFoundPage) },
  { path: '*', element: <Navigate to="/404" replace /> },
];
