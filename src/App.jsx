// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminDashboard from "./pages/Dashboard/AdminDashBoard";
import AddMediator from "./pages/AddUsersFormPage/AddMediator";
import GetAllMediators from "./pages/FetchAllInfo/AllMediatorsInfo";
import AdminLoginPage from "./pages/AuthPages/login";
import AdminSignupPage from "./pages/AuthPages/SignUp";
import AdminForgotPasswordPage from "./pages/AuthPages/ForgotPassword";
import AdminResetPasswordPage from "./pages/AuthPages/ResetPassword";
import AdminVerifyEmailPage from "./pages/AuthPages/VerifyEmail";
import MediatorsList from "./pages/Dashboard/MediatorsList";
import AddEditMediator from "./pages/Dashboard/AddEditMediator";
import DashboardLayout from "./component/layouts/DashboardLayout";
import PrivateRoute from "./component/PrivateRoute";
import HomePage from "./pages/HomePage";
import Navbar from "../src/component/NavBar";

// Protected Admin Route Component
const AdminRoute = ({ children }) => (
  <PrivateRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </PrivateRoute>
);

// Layout for auth pages (no sidebar)
const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">{children}</div>
);

// Layout for public pages (with Navbar)
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <div className="min-h-screen bg-gray-50">{children}</div>
  </>
);

function App() {
  return (
    <Router>
      {/* Only HomePage gets Navbar, other routes manage their own layout */}
      <Routes>
        {/* Home Page with Navbar */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />

        {/* Redirect /admin to dashboard */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* Public Auth Routes - No Navbar */}
        <Route
          path="/admin/login"
          element={
            <AuthLayout>
              <AdminLoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/admin/signup"
          element={
            <AuthLayout>
              <AdminSignupPage />
            </AuthLayout>
          }
        />
        <Route
          path="/admin/forgot-password"
          element={
            <AuthLayout>
              <AdminForgotPasswordPage />
            </AuthLayout>
          }
        />
        <Route
          path="/auth/admin/reset-password"
          element={
            <AuthLayout>
              <AdminResetPasswordPage />
            </AuthLayout>
          }
        />
        <Route
          path="/admin/verify-email"
          element={
            <AuthLayout>
              <AdminVerifyEmailPage />
            </AuthLayout>
          }
        />

        {/* Protected Admin Routes wrapped with DashboardLayout */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/mediators"
          element={
            <AdminRoute>
              <MediatorsList />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/mediators/add"
          element={
            <AdminRoute>
              <AddEditMediator />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/mediators/:id/edit"
          element={
            <AdminRoute>
              <AddEditMediator />
            </AdminRoute>
          }
        />

        {/* Legacy routes - redirect to new routes or wrap with layout */}
        <Route
          path="/add-mediators"
          element={
            <AdminRoute>
              <AddMediator />
            </AdminRoute>
          }
        />

        <Route
          path="/get-all-mediators"
          element={
            <AdminRoute>
              <GetAllMediators />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/getMeditors"
          element={<Navigate to="/admin/mediators" replace />}
        />

        <Route
          path="/admin/addMediator"
          element={<Navigate to="/admin/mediators/add" replace />}
        />

        {/* 404 Page with Navbar */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-6">Page not found</p>
                  <a
                    href="/"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    Go to Home
                  </a>
                </div>
              </div>
            </PublicLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
