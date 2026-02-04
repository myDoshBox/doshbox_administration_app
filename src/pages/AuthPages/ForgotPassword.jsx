import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Shield, AlertCircle, ArrowLeft } from "lucide-react";
import ButtonSpinner from "../../component/ButtonSpinner";
import { Alert, AlertDescription } from "../../component/tools/Alert";

import { useForgotAdminPasswordMutation } from "../../Redux/Slice/AuthSlice/AdminApiSlice";

const AdminForgotPasswordPage = () => {
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
                Password Recovery
              </h1>
              <p className="text-lg text-white/90 mb-12">
                We'll send you a secure link to reset your admin password
              </p>
            </div>
          </div>

          {/* Bottom Security Notice */}
          <div className="relative z-10 pt-8 border-t border-white/20">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white/80">
                Password reset links expire after 10 minutes for security
                purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Forgot Password Form */}
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

            <AdminForgotPasswordForm />

            {/* Mobile Footer */}
            <div className="lg:hidden mt-12 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} MyDoshBox. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "default",
  });

  const navigate = useNavigate();
  const [forgotPassword] = useForgotAdminPasswordMutation();

  // Helper function to show alerts
  const showAlert = (message, variant = "default") => {
    setAlert({ show: true, message, variant });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showAlert("Please enter your email address", "destructive");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("Please enter a valid email address", "destructive");
      return;
    }

    setFormLoading(true);

    try {
      const res = await forgotPassword(email).unwrap();

      if (res.status === "success") {
        showAlert(
          "Password reset link sent! Please check your email.",
          "success",
        );

        setTimeout(() => {
          navigate("/admin/login");
        }, 3000);
      } else {
        showAlert(res.message || "Failed to send reset link", "destructive");
        setFormLoading(false);
      }
    } catch (err) {
      console.error("Forgot password error:", err);

      let errorMessage = "Failed to send reset link. Please try again.";
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
            <Mail className="w-7 h-7 text-primary-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h2>
          <p className="text-gray-600">
            Enter your email and we'll send you a password reset link
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-3" />
                  Send Reset Link
                </>
              )}
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center pt-4 border-t border-gray-200">
            <Link
              to="/admin/login"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminForgotPasswordPage;
