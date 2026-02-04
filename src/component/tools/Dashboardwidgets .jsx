import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Clock,
  Calendar,
  Award,
  BarChart3,
} from "lucide-react";

// Comparison Card Component
export const ComparisonCard = ({
  title,
  current,
  previous,
  change,
  changePercentage,
  trend,
  formatValue,
  icon: Icon,
}) => {
  const isPositive = trend === "up";
  const isNeutral = trend === "neutral";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-blue-50">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
          )}
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-3xl font-bold text-gray-900">
            {formatValue ? formatValue(current) : current}
          </p>
          <p className="text-xs text-gray-500 mt-1">Current period</p>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Previous period</p>
            <p className="text-lg font-semibold text-gray-700">
              {formatValue ? formatValue(previous) : previous}
            </p>
          </div>

          <div
            className={`flex items-center space-x-1 ${
              isPositive
                ? "text-green-600"
                : isNeutral
                  ? "text-gray-600"
                  : "text-red-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-5 h-5" />
            ) : isNeutral ? (
              <Minus className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            <span className="text-lg font-bold">
              {changePercentage > 0 ? "+" : ""}
              {changePercentage.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Change</span>
          <span
            className={`font-semibold ${
              change > 0
                ? "text-green-600"
                : change < 0
                  ? "text-red-600"
                  : "text-gray-600"
            }`}
          >
            {change > 0 ? "+" : ""}
            {formatValue ? formatValue(change) : change}
          </span>
        </div>
      </div>
    </div>
  );
};

// Top Performers Card
export const TopPerformersCard = ({ title, data, type, icon: Icon }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        {Icon && <Icon className="w-5 h-5 mr-2 text-purple-600" />}
        {title}
      </h3>

      {data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0
                        ? "bg-yellow-400 text-yellow-900"
                        : index === 1
                          ? "bg-gray-300 text-gray-700"
                          : index === 2
                            ? "bg-orange-400 text-orange-900"
                            : "bg-blue-100 text-blue-700"
                    } font-bold text-sm`}
                  >
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  {type === "vendors" && (
                    <>
                      <p className="font-medium text-gray-900 truncate">
                        {item.vendorName || "Unknown Vendor"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {item._id}
                      </p>
                    </>
                  )}

                  {type === "mediators" && (
                    <>
                      <p className="font-medium text-gray-900 truncate">
                        {item.mediatorName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {item.mediatorEmail}
                      </p>
                    </>
                  )}

                  {type === "categories" && (
                    <>
                      <p className="font-medium text-gray-900 truncate capitalize">
                        {item._id || "Uncategorized"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.totalSales} sales
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="text-right ml-3">
                {type === "vendors" && (
                  <>
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(item.totalVolume)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.totalTransactions} txns
                    </p>
                  </>
                )}

                {type === "mediators" && (
                  <>
                    <p className="text-sm font-bold text-gray-900">
                      {item.disputesResolved} resolved
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.avgResolutionTime} days avg
                    </p>
                  </>
                )}

                {type === "categories" && (
                  <>
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(item.totalRevenue)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.avgPrice)} avg
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No data available</p>
        </div>
      )}
    </div>
  );
};

// Time Analytics Card
export const TimeAnalyticsCard = ({ title, data, type, icon: Icon }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          {Icon && <Icon className="w-5 h-5 mr-2 text-blue-600" />}
          {title}
        </h3>
        <div className="text-center py-8">
          <Icon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No data available</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.transactions || 0));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        {Icon && <Icon className="w-5 h-5 mr-2 text-blue-600" />}
        {title}
      </h3>

      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage =
            maxValue > 0 ? (item.transactions / maxValue) * 100 : 0;
          const label = type === "hours" ? item.hour : item.day;

          return (
            <div key={index}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">{label}</span>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">
                    {item.transactions} txns
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatCurrency(item.volume)}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Enhanced Metrics Card
export const EnhancedMetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  trend,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {trend && (
          <div
            className={`flex items-center space-x-1 ${
              trend > 0
                ? "text-green-600"
                : trend < 0
                  ? "text-red-600"
                  : "text-gray-600"
            }`}
          >
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : trend < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(trend).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
};

// Export all components
export default {
  ComparisonCard,
  TopPerformersCard,
  TimeAnalyticsCard,
  EnhancedMetricCard,
};
