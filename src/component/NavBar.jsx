import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Shield } from "lucide-react";
import { logoutAdmin } from "../Redux/Slice/AuthSlice/adminAuthSlice";
import { useLogoutAdminMutation } from "../Redux/Slice/AuthSlice/AdminApiSlice";

function AdminNavbarSimple() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { adminInfo } = useSelector((state) => state.adminAuth);
  const [logoutApiCall] = useLogoutAdminMutation();

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(logoutAdmin());
      navigate("/admin/login");
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-greenMain rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MyDoshBox</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-500 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/admin/dashboard"
              className="text-gray-700 hover:text-primary-500 font-medium transition-colors"
            >
              Dashboard
            </Link>

            {!adminInfo ? (
              <>
                <Link
                  to="/admin/login"
                  className="text-gray-700 hover:text-primary-500 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/admin/signup"
                  className="px-4 py-2 bg-primary-500 text-white hover:bg-greenMain rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <span className="text-gray-700 font-medium">
                  {adminInfo.name || adminInfo.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbarSimple;
