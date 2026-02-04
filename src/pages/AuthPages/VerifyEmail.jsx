import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Shield, CheckCircle, XCircle, Mail } from "lucide-react";
import ButtonSpinner from "../../component/ButtonSpinner";
import { Alert, AlertDescription } from "../../component/tools/Alert";

import {
  useVerifyAdminEmailMutation,
  useResendAdminVerificationMutation,
} from "../../Redux/Slice/AuthSlice/AdminApiSlice";

const AdminVerifyEmailPage = () => {
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
                <Mail className="w-10 h-10" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Email Verification
              </h1>
              <p className="text-lg text-white/90 mb-12">
                Verifying your email ensures secure access to your admin account
              </p>
            </div>
          </div>

          {/* Bottom Security Notice */}
          <div className="relative z-10 pt-8 border-t border-white/20">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white/80">
                Email verification helps us keep your admin account secure and
                prevents unauthorized access.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Verification Status */}
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

            <AdminVerifyEmailContent />

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

const AdminVerifyEmailContent = () => {
  const [verificationStatus, setVerificationStatus] = useState("loading"); // loading, success, error
  const [formLoading, setFormLoading] = useState(false);
  const [resendEmail, setResendEmail] = useState("");

  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "default",
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [verifyEmail] = useVerifyAdminEmailMutation();
  const [resendVerification] = useResendAdminVerificationMutation();

  // Helper function to show alerts
  const showAlert = (message, variant = "default") => {
    setAlert({ show: true, message, variant });
  };

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setVerificationStatus("error");
        return;
      }

      try {
        const res = await verifyEmail(token).unwrap();

        if (res.status === "success") {
          setVerificationStatus("success");
          showAlert("Email verified successfully!", "success");

          setTimeout(() => {
            navigate("/admin/login");
          }, 3000);
        } else {
          setVerificationStatus("error");
          showAlert(res.message || "Email verification failed", "destructive");
        }
      } catch (err) {
        console.error("Email verification error:", err);
        setVerificationStatus("error");

        let errorMessage = "Email verification failed. Please try again.";
        if (err?.data?.message) {
          errorMessage = err.data.message;
        } else if (err?.error) {
          errorMessage = err.error;
        }

        showAlert(errorMessage, "destructive");
      }
    };

    verifyEmailToken();
  }, [token, verifyEmail, navigate]);

  const handleResendVerification = async (e) => {
    e.preventDefault();

    if (!resendEmail) {
      showAlert("Please enter your email address", "destructive");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resendEmail)) {
      showAlert("Please enter a valid email address", "destructive");
      return;
    }

    setFormLoading(true);

    try {
      const res = await resendVerification(resendEmail).unwrap();

      if (res.status === "success") {
        showAlert(
          "Verification email sent! Please check your inbox.",
          "success",
        );
        setResendEmail("");
      } else {
        showAlert(
          res.message || "Failed to resend verification email",
          "destructive",
        );
      }
      setFormLoading(false);
    } catch (err) {
      console.error("Resend verification error:", err);

      let errorMessage =
        "Failed to resend verification email. Please try again.";
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
        {/* Loading State */}
        {verificationStatus === "loading" && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-6">
              <ButtonSpinner className="text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Your Email
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        )}

        {/* Success State */}
        {verificationStatus === "success" && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your admin account has been verified. You can now sign in.
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent 
                       text-base font-medium rounded-xl text-white bg-primary-500 hover:bg-greenMain
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 
                       shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Go to Sign In
            </Link>
          </div>
        )}

        {/* Error State */}
        {verificationStatus === "error" && (
          <>
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-6">
                The verification link is invalid or has expired. Please request
                a new verification email.
              </p>
            </div>

            {/* Resend Verification Form */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Resend Verification Email
              </h3>
              <form onSubmit={handleResendVerification} className="space-y-4">
                <div>
                  <label
                    htmlFor="resendEmail"
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
                      id="resendEmail"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                               placeholder-gray-400 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="admin@mydoshbox.com"
                      required
                      disabled={formLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent 
                           text-base font-medium rounded-xl text-white bg-primary-500 hover:bg-greenMain
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 
                           disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg 
                           transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {formLoading ? (
                    <>
                      <ButtonSpinner className="mr-3 text-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-3" />
                      Resend Verification Email
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Back to Login */}
            <div className="text-center pt-6 border-t border-gray-200 mt-6">
              <Link
                to="/admin/login"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline"
              >
                ← Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminVerifyEmailPage;
