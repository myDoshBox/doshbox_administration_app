import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

export const AlertDescription = ({ children, className = "" }) => (
  <div className={`text-sm ${className}`}>{children}</div>
);

export const Alert = ({
  children,
  variant = "default",
  className = "",
  show: initialShow = true,
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
}) => {
  const [show, setShow] = useState(initialShow);

  useEffect(() => {
    setShow(initialShow);
  }, [initialShow]);

  useEffect(() => {
    let timeoutId;
    if (show && autoClose) {
      timeoutId = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [show, autoClose, autoCloseTime]);

  const handleClose = () => {
    setShow(false);
    if (onClose) {
      onClose();
    }
  };

  if (!show) return null;

  // Variant-based styles using YOUR existing Tailwind colors
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          container: "bg-colour border-white text-white",
          icon: (
            <FaCheckCircle className="mr-2 text-greenMain text-xl flex-shrink-0" />
          ),
          closeButton: "text-greenMain hover:text-green-800",
          ariaLabel: "Success",
        };
      case "destructive":
        return {
          container: "bg-red-50 border-red-200 text-red-800",
          icon: (
            <FaTimesCircle className="mr-2 text-Blud text-xl flex-shrink-0" />
          ),
          closeButton: "text-Blud hover:text-red-800",
          ariaLabel: "Error",
        };
      case "warning":
        return {
          container: "bg-yellow-600 border-yellow-200 text-yellow-800",
          icon: (
            <FaExclamationTriangle className="mr-2 text-yellow-600 text-xl flex-shrink-0" />
          ),
          closeButton: "text-yellow-600 hover:text-yellow-800",
          ariaLabel: "Warning",
        };
      case "info":
        return {
          container: "bg-blue-50 border-blue-200 text-blue-800",
          icon: (
            <FaInfoCircle className="mr-2 text-textClr text-xl flex-shrink-0" />
          ),
          closeButton: "text-textClr hover:text-blue-800",
          ariaLabel: "Info",
        };
      case "primary":
        return {
          container: "bg-primary-50 border-primary-200 text-primary-700",
          icon: (
            <FaInfoCircle className="mr-2 text-primary-500 text-xl flex-shrink-0" />
          ),
          closeButton: "text-primary-500 hover:text-primary-700",
          ariaLabel: "Information",
        };
      default:
        return {
          container: "bg-gray-50 border-gray-200 text-gray-800",
          icon: null,
          closeButton: "text-gray-500 hover:text-gray-700",
          ariaLabel: "Notification",
        };
    }
  };

  const { container, icon, closeButton, ariaLabel } = getVariantStyles();

  return (
    <div
      className={`
        fixed top-5 right-5 min-w-[320px] max-w-[480px] z-[1050]
        border rounded-lg shadow-lg backdrop-blur-sm
        animate-slide-in-right
        ${container}
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center flex-grow">
          {icon && <span aria-label={ariaLabel}>{icon}</span>}
          <div className="flex-grow font-medium">{children}</div>
        </div>
        <button
          onClick={handleClose}
          className={`p-1 ml-2 flex-shrink-0 
                     transition-colors duration-200 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 rounded ${closeButton}`}
          aria-label="Close alert"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Alert;
