import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import ButtonSpinner from "../../component/ButtonSpinner";
import { Alert, AlertDescription } from "../../component/tools/Alert";

import { useAdminSignupMutation } from "../../Redux/Slice/AuthSlice/AdminApiSlice";

const AdminSignupPage = () => {
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
                Join the Admin Team
              </h1>
              <p className="text-lg text-white/90 mb-12">
                Create your admin account to manage and oversee the MyDoshBox
                platform
              </p>
            </div>
          </div>

          {/* Bottom Security Notice */}
          <div className="relative z-10 pt-8 border-t border-white/20">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white/80">
                Admin accounts require email verification. All activities are
                logged and monitored for security.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Signup Form */}
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

            <AdminSignupForm />

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

const AdminSignupForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "default",
  });

  const navigate = useNavigate();
  const { adminInfo } = useSelector((state) => state.adminAuth);

  const [signup] = useAdminSignupMutation();

  useEffect(() => {
    if (adminInfo) navigate("/admin/dashboard");
  }, [navigate, adminInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Helper function to show alerts
  const showAlert = (message, variant = "default") => {
    setAlert({ show: true, message, variant });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirm_password
    ) {
      showAlert("Please fill in all required fields", "destructive");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showAlert("Please enter a valid email address", "destructive");
      return;
    }

    if (formData.password.length < 6) {
      showAlert("Password must be at least 6 characters long", "destructive");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      showAlert("Passwords do not match", "destructive");
      return;
    }

    setFormLoading(true);

    try {
      const res = await signup(formData).unwrap();

      if (res.status === "success") {
        showAlert(
          "Account created successfully! Please check your email to verify your account.",
          "success",
        );

        setTimeout(() => {
          navigate("/admin/login");
        }, 3000);
      } else {
        showAlert(res.message || "Signup failed", "destructive");
        setFormLoading(false);
      }
    } catch (err) {
      console.error("Admin signup error:", err);

      let errorMessage = "Signup failed. Please try again.";
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
            <User className="w-7 h-7 text-primary-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Create Admin Account
          </h2>
          <p className="text-gray-600">
            Enter your details to create your admin account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         placeholder-gray-400 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="John Doe"
                required
                disabled={formLoading}
              />
            </div>
          </div>

          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         placeholder-gray-400 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="johndoe"
                disabled={formLoading}
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
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

          {/* Phone Number Input */}
          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number{" "}
              <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         placeholder-gray-400 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="+1234567890"
                disabled={formLoading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         placeholder-gray-400 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter your password"
                required
                disabled={formLoading}
                autoComplete="new-password"
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

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         placeholder-gray-400 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Confirm your password"
                required
                disabled={formLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center
                         text-gray-400 hover:text-gray-600 transition-colors"
                disabled={formLoading}
              >
                {confirmPasswordVisible ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
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
                  Creating Account...
                </>
              ) : (
                <>
                  <User className="w-5 h-5 mr-3" />
                  Create Admin Account
                </>
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/admin/login"
                className="font-medium text-primary-500 hover:text-greenMain hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminSignupPage;
