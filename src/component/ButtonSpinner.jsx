// components/Common/ButtonSpinner.jsx
import React from "react";
import { Loader2 } from "lucide-react";

export const ButtonSpinner = ({ size = "sm", className = "" }) => (
  <Loader2
    className={`animate-spin ${size === "sm" ? "w-4 h-4" : "w-5 h-5"} ${className}`}
  />
);

export default ButtonSpinner;
