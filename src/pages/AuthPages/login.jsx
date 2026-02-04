import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Users,
} from "lucide-react";
import ButtonSpinner from "../../component/ButtonSpinner";
import { Alert, AlertDescription } from "../../component/tools/Alert";

// Import your hooks and actions
import { useAdminLoginMutation } from "../../Redux/Slice/AuthSlice/AdminApiSlice";
import {
  setAdminCredentials,
  logoutAdmin,
} from "../../Redux/Slice/AuthSlice/adminAuthSlice";

const AdminLoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left Panel - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 via-greenMain to-greenMain text-white p-8 lg:p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>

          {/* Top Logo/Brand */}
          <div className="relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">MyDoshBox</h1>
                <p className="text-white/80 text-sm">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="relative z-10 max-w-md mx-auto text-center flex-1 flex flex-col justify-center">
            <div className="mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/15 rounded-2xl backdrop-blur-sm mb-8">
                <Shield className="w-10 h-10" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Welcome Back, Admin
              </h1>
              <p className="text-lg text-white/90 mb-12">
                Secure access to manage your MyDoshBox platform with confidence
                and control
              </p>
            </div>
          </div>

          {/* Bottom Security Notice */}
          <div className="relative z-10 pt-8 border-t border-white/20">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white/80">
                Secure access for authorized personnel only. All activities are
                logged and monitored.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-greenMain rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-greenMain bg-clip-text text-transparent">
                    MyDoshBox
                  </h1>
                  <p className="text-sm text-gray-500">Admin Portal</p>
                </div>
              </div>
            </div>

            <AdminLoginForm />

            {/* Mobile Footer */}
            <div className="lg:hidden mt-12 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} MyDoshBox. All rights reserved.
                <span className="mx-2">•</span>
                <Link
                  to="/privacy"
                  className="text-primary-500 hover:text-greenMain hover:underline"
                >
                  Privacy
                </Link>
                <span className="mx-2">•</span>
                <Link
                  to="/terms"
                  className="text-primary-500 hover:text-greenMain hover:underline"
                >
                  Terms
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminLoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [admin, setAdmin] = useState({ email: "", password: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "default",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login] = useAdminLoginMutation();
  const { adminInfo } = useSelector((state) => state.adminAuth);

  //   useEffect(() => {
  //     if (adminInfo) navigate("/admin/dashboard");
  //   }, [navigate, adminInfo]);

  useEffect(() => {
    const wasRedirected = sessionStorage.getItem("admin_auth_redirect");
    if (!wasRedirected) dispatch(logoutAdmin());
    sessionStorage.removeItem("admin_auth_redirect");

    const savedEmail = localStorage.getItem("admin_remember_email");
    if (savedEmail) {
      setAdmin((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleRememberMe = (e) => {
    const checked = e.target.checked;
    setRememberMe(checked);
    if (!checked) {
      localStorage.removeItem("admin_remember_email");
    }
  };

  // Helper function to show alerts
  const showAlert = (message, variant = "default") => {
    setAlert({ show: true, message, variant });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admin.email || !admin.password) {
      showAlert("Please fill in all fields", "destructive");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(admin.email)) {
      showAlert("Please enter a valid email address", "destructive");
      return;
    }

    setFormLoading(true);

    try {
      const res = await login({ ...admin }).unwrap();

      if (res.status !== "success") {
        showAlert(res.message || "Login failed", "destructive");
        setFormLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem("admin_remember_email", admin.email);
      }

      dispatch(
        setAdminCredentials({
          admin: res.admin,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          token: res.token,
        }),
      );

      showAlert("Welcome back! Redirecting to dashboard...", "success");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Admin login error:", err);

      let errorMessage = "Login failed. Please try again.";
      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.error) {
        errorMessage = err.error;
      }

      showAlert(errorMessage, "destructive");
      setFormLoading(false);
    }
  };

  return (
    <>
      {/* Alert Component */}
      {alert.show && (
        <Alert
          variant={alert.variant}
          show={alert.show}
          onClose={() => setAlert({ ...alert, show: false })}
          autoClose={true}
          autoCloseTime={5000}
        >
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-50 rounded-xl mb-4 border border-gray-100">
            <Lock className="w-7 h-7 text-primary-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Admin Sign In
          </h2>
          <p className="text-gray-600">
            Enter your credentials to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={admin.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         placeholder-gray-400 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="admin@mydoshbox.com"
                required
                disabled={formLoading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Link
                to="/admin/forgot-password"
                className="text-sm font-medium text-primary-500 hover:text-greenMain hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={admin.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         placeholder-gray-400 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter your password"
                required
                disabled={formLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center
                         text-gray-400 hover:text-gray-600 transition-colors"
                disabled={formLoading}
              >
                {passwordVisible ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMe}
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded
                       disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={formLoading}
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me on this device
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={formLoading}
              className="w-full flex items-center justify-center px-6 py-3.5 border border-transparent 
                       text-base font-medium rounded-xl text-white bg-primary-500 hover:bg-greenMain
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg 
                       transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {formLoading ? (
                <>
                  <ButtonSpinner className="mr-3 text-white" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-3" />
                  Sign In
                </>
              )}
            </button>
          </div>

          {/* Back to Home */}
          <div className="text-center pt-4 border-t border-gray-200">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline"
            >
              ← Back to MyDoshBox Home
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminLoginPage;
