import React, { useState } from "react";
import { Calendar, X } from "lucide-react";

const AdvancedDateRangeFilter = ({ onFilterChange, currentTimeRange }) => {
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customDates, setCustomDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [filterType, setFilterType] = useState("preset"); // 'preset' or 'custom'

  // Preset time ranges
  const presetRanges = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "week", label: "This Week" },
    { value: "lastWeek", label: "Last Week" },
    { value: "month", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
    { value: "lastYear", label: "Last Year" },
    { value: "last7days", label: "Last 7 Days" },
    { value: "last30days", label: "Last 30 Days" },
    { value: "last90days", label: "Last 90 Days" },
  ];

  // Handle preset range selection
  const handlePresetSelect = (range) => {
    setFilterType("preset");
    setShowCustomRange(false);
    onFilterChange({ type: "preset", value: range });
  };

  // Handle custom date range
  const handleCustomDateChange = (field, value) => {
    const newDates = { ...customDates, [field]: value };
    setCustomDates(newDates);

    // Only trigger filter if both dates are selected
    if (newDates.startDate && newDates.endDate) {
      onFilterChange({
        type: "custom",
        startDate: newDates.startDate,
        endDate: newDates.endDate,
      });
    }
  };

  // Apply custom date range
  const applyCustomRange = () => {
    if (customDates.startDate && customDates.endDate) {
      setFilterType("custom");
      onFilterChange({
        type: "custom",
        startDate: customDates.startDate,
        endDate: customDates.endDate,
      });
      setShowCustomRange(false);
    }
  };

  // Clear custom range
  const clearCustomRange = () => {
    setCustomDates({ startDate: "", endDate: "" });
    setFilterType("preset");
    handlePresetSelect("today");
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        {/* Preset Range Selector */}
        <div className="flex space-x-2 bg-white border border-gray-300 rounded-lg p-1">
          {presetRanges.slice(0, 4).map((range) => (
            <button
              key={range.value}
              onClick={() => handlePresetSelect(range.value)}
              className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-all ${
                currentTimeRange === range.value && filterType === "preset"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Custom Date Range Button */}
        <button
          onClick={() => setShowCustomRange(!showCustomRange)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
            filterType === "custom"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Custom Range</span>
        </button>

        {/* Clear Filter (if custom range is active) */}
        {filterType === "custom" && (
          <button
            onClick={clearCustomRange}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            title="Clear custom range"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Custom Date Range Panel */}
      {showCustomRange && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 w-[500px]">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">
              Select Custom Date Range
            </h4>

            {/* Quick Select Presets */}
            <div>
              <p className="text-xs text-gray-600 mb-2">Quick Select:</p>
              <div className="grid grid-cols-3 gap-2">
                {presetRanges.slice(4).map((range) => (
                  <button
                    key={range.value}
                    onClick={() => {
                      handlePresetSelect(range.value);
                      setShowCustomRange(false);
                    }}
                    className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-600 mb-3">Custom Date Range:</p>
              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customDates.startDate}
                    onChange={(e) =>
                      handleCustomDateChange("startDate", e.target.value)
                    }
                    max={customDates.endDate || getTodayDate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customDates.endDate}
                    onChange={(e) =>
                      handleCustomDateChange("endDate", e.target.value)
                    }
                    min={customDates.startDate}
                    max={getTodayDate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowCustomRange(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyCustomRange}
                disabled={!customDates.startDate || !customDates.endDate}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>

            {/* Date Range Summary */}
            {customDates.startDate && customDates.endDate && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-900">
                  <span className="font-semibold">Selected Range: </span>
                  {new Date(customDates.startDate).toLocaleDateString()} -{" "}
                  {new Date(customDates.endDate).toLocaleDateString()}
                  {" ("}
                  {Math.ceil(
                    (new Date(customDates.endDate) -
                      new Date(customDates.startDate)) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  days)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedDateRangeFilter;
