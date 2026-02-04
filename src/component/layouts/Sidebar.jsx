import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Shield,
  Menu,
  X,
  Home,
  Bell,
} from "lucide-react";
import { logoutAdmin } from "../../Redux/Slice/AuthSlice/adminAuthSlice";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      badge: null,
    },
    {
      title: "Mediators",
      icon: Users,
      path: "/admin",
      badge: null,
      submenu: [
        { title: "All Mediators", path: "/admin/getMeditors" },
        { title: "Add Mediator", path: "/admin/addMediator" },
      ],
    },

    {
      title: "Notifications",
      icon: Bell,
      path: "/admin/notifications",
      badge: "3",
    },
  ];

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate("/admin/login");
  };

  // Check if a menu item is active
  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  // Check if a submenu item is active
  const isSubmenuActive = (submenuItems) => {
    return submenuItems?.some((item) => location.pathname === item.path);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col bg-white border-r border-gray-200
        shadow-lg lg:shadow-none h-screen
      `}
      >
        {/* Logo and Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-greenMain rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-greenMain bg-clip-text text-transparent">
              MyDoshBox
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {menuItems.map((item) => {
              const isItemActive =
                isActive(item.path) || isSubmenuActive(item.submenu);

              return (
                <div key={item.title} className="mb-1">
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group
                      ${
                        isItemActive
                          ? "bg-primary-50 text-primary-600"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon
                        className={`w-5 h-5 ${
                          isItemActive
                            ? "text-primary-600"
                            : "text-gray-500 group-hover:text-primary-600"
                        }`}
                      />
                      <span>{item.title}</span>
                    </div>
                    <div className="flex items-center">
                      {item.badge && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full mr-2">
                          {item.badge}
                        </span>
                      )}
                      {item.submenu && (
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isItemActive ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </div>
                  </Link>

                  {item.submenu && isItemActive && (
                    <div className="ml-9 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.path}
                          onClick={onClose}
                          className={`
                            flex items-center px-3 py-2 text-xs rounded-lg transition-colors
                            ${
                              location.pathname === subItem.path
                                ? "bg-primary-100 text-primary-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }
                          `}
                        >
                          <span className="truncate">{subItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
