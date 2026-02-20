import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Percent,
  Shield,
  Activity,
  Package,
  RefreshCw,
  Wallet,
  XCircle,
} from "lucide-react";
import { useGetDashboardStatsQuery } from "../../Redux/Slice/AdminStatSlice/Adminstatsapislice";

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("year");
  const [lastUpdated, setLastUpdated] = useState(null);

  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetDashboardStatsQuery(timeRange, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (stats) {
      setLastUpdated(new Date());
    }
  }, [stats]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatTimeAgo = (time) => {
    if (!time) return "";
    if (typeof time === "string" && time.includes("ago")) return time;
    const date = new Date(time);
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const formatHoursAsDays = (hours) => {
    if (!hours) return "0 hours";
    if (hours < 24) return `${Math.round(hours)} hours`;
    const days = Math.round(hours / 24);
    return `${days} day${days > 1 ? "s" : ""}`;
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      transaction: { icon: CreditCard, color: "blue" },
      dispute: { icon: AlertTriangle, color: "red" },
      payout: { icon: DollarSign, color: "green" },
      user: { icon: Users, color: "purple" },
      mediator: { icon: Shield, color: "amber" },
    };
    return iconMap[type] || { icon: Activity, color: "gray" };
  };

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      error?.data?.message || error?.error || "Failed to fetch dashboard data";
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-red-50 p-8 rounded-xl max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-900 mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-red-700 mb-4">{errorMessage}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Safely extract financial fields with correct API field names
  const financial = stats?.data?.financial || stats?.financial || {};
  const overview = stats?.data?.overview || stats?.overview || {};
  const transactions = stats?.data?.transactions || stats?.transactions || {};
  const disputes = stats?.data?.disputes || stats?.disputes || {};
  const users = stats?.data?.users || stats?.users || {};
  const recentActivity =
    stats?.data?.recentActivity || stats?.recentActivity || [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time overview of MyDoshBox platform
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={refetch}
            disabled={isFetching}
            className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>

          <div className="flex space-x-2 bg-white border border-gray-300 rounded-lg p-1">
            {["today", "week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                disabled={isFetching}
                className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-all ${
                  timeRange === range
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                } disabled:opacity-50`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {overview.totalTransactions?.toLocaleString() || 0}
          </p>
          <p className="text-sm font-medium text-gray-700 mb-1">
            Total Transactions
          </p>
          <p className="text-xs text-gray-500">
            {timeRange === "today" ? "Today" : `Last ${timeRange}`}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-red-50">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            {overview.activeDisputes > 0 && (
              <span className="text-sm font-medium text-red-600">
                Needs Attention
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {overview.activeDisputes || 0}
          </p>
          <p className="text-sm font-medium text-gray-700 mb-1">
            Active Disputes
          </p>
          <p className="text-xs text-gray-500">Requiring attention</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-amber-50">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            {overview.pendingPayouts > 0 && (
              <span className="text-sm font-medium text-amber-600">
                {overview.pendingPayouts}
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {overview.pendingPayouts || 0}
          </p>
          <p className="text-sm font-medium text-gray-700 mb-1">
            Pending Payouts
          </p>
          <p className="text-xs text-gray-500">Awaiting processing</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            {overview.completedToday > 0 && (
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">
                  +{overview.completedToday}
                </span>
              </div>
            )}
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {overview.completedToday || 0}
          </p>
          <p className="text-sm font-medium text-gray-700 mb-1">
            Completed Today
          </p>
          <p className="text-xs text-gray-500">Successful transactions</p>
        </div>
      </div>

      {/* Financial & Transaction Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
            Financial Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Total Volume
                  </p>
                  <p className="text-xs text-gray-500">All transactions</p>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(financial.totalVolume)}
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Percent className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Commission Earned
                  </p>
                  <p className="text-xs text-gray-500">Platform fees</p>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(financial.commissionEarned)}
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Revenue Recognized
                  </p>
                  <p className="text-xs text-gray-500">Completed commissions</p>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(financial.revenueRecognized)}
              </p>
            </div>

            {/* FIX: use correct field names from API */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-amber-50 rounded-lg text-center">
                <Wallet className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-700 mb-1">
                  Pending
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(financial.pendingPayoutsAmount)}
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg text-center">
                <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-700 mb-1">
                  Completed
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(financial.completedPayoutsAmount)}
                </p>
              </div>

              <div className="p-3 bg-red-50 rounded-lg text-center">
                <XCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-700 mb-1">Failed</p>
                <p className="text-sm font-bold text-gray-900">
                  {financial.failedPayoutsCount || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-purple-600" />
            Transaction Status
          </h3>
          <div className="space-y-3">
            {[
              {
                label: "Processing",
                value: transactions.processing || 0,
                color: "bg-blue-500",
                bgColor: "bg-blue-50",
              },
              {
                label: "Awaiting Payment",
                value: transactions.awaitingPayment || 0,
                color: "bg-amber-500",
                bgColor: "bg-amber-50",
              },
              {
                label: "Payment Verified",
                value: transactions.paymentVerified || 0,
                color: "bg-cyan-500",
                bgColor: "bg-cyan-50",
              },
              {
                label: "In Transit",
                value: transactions.inTransit || 0,
                color: "bg-purple-500",
                bgColor: "bg-purple-50",
              },
              {
                label: "Completed",
                value: transactions.completed || 0,
                color: "bg-emerald-500",
                bgColor: "bg-emerald-50",
              },
              {
                label: "Cancelled",
                value: transactions.cancelled || 0,
                color: "bg-red-500",
                bgColor: "bg-red-50",
              },
            ].map((item, index) => {
              const total = Object.values(transactions).reduce(
                (a, b) => (a || 0) + (b || 0),
                0,
              );
              const percentage =
                total > 0 ? Math.round((item.value / total) * 100) : 0;

              return (
                <div key={index} className={`p-3 rounded-lg ${item.bgColor}`}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">
                      {item.label}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {item.value.toLocaleString()} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all duration-500 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User & Dispute Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-600" />
            User Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">
                {users.total?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Users</p>
            </div>

            <div className="text-center p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">
                {users.activeMediators?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Active Mediators</p>
            </div>

            <div className="text-center p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">
                {users.individual?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Individual Users</p>
            </div>

            <div className="text-center p-5 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
              <Users className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">
                {users.organizations?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Organizations</p>
            </div>
          </div>

          {users.newThisMonth > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-center">
                <span className="font-semibold text-blue-900">
                  {users.newThisMonth}
                </span>
                <span className="text-blue-700"> new users this month</span>
              </p>
            </div>
          )}
        </div>

        {/* Dispute Resolution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            Dispute Resolution
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Active Disputes
                </span>
                <p className="text-xs text-gray-500">Currently open</p>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {disputes.active || 0}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Resolved
                </span>
                <p className="text-xs text-gray-500">Successfully closed</p>
              </div>
              <span className="text-2xl font-bold text-emerald-600">
                {disputes.resolved || 0}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Escalated to Mediator
                </span>
                <p className="text-xs text-gray-500">Under mediation</p>
              </div>
              <span className="text-2xl font-bold text-amber-600">
                {disputes.escalated || 0}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Resolution Rate
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {disputes.resolutionRate || "0%"}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Avg. Time
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatHoursAsDays(disputes.avgResolutionTimeHours)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-gray-600" />
            Recent Activity
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Latest platform events and transactions
          </p>
        </div>

        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => {
              const { icon: Icon, color } = getActivityIcon(activity.type);

              return (
                <div
                  key={activity.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`p-2 rounded-lg bg-${color}-100`}>
                        <Icon className={`w-5 h-5 text-${color}-600`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 capitalize">
                            {activity.action.replace(/_/g, " ")}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-700`}
                          >
                            {activity.type}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 mt-1">
                          {activity.amount !== null && (
                            <p className="text-sm font-semibold text-gray-700">
                              {formatCurrency(activity.amount)}
                            </p>
                          )}
                          {activity.transaction_id && (
                            <p className="text-xs text-gray-500 font-mono truncate">
                              ID: {activity.transaction_id.slice(0, 8)}...
                            </p>
                          )}
                          {activity.vendor_name && (
                            <p className="text-xs text-gray-500">
                              {activity.vendor_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                      {activity.time}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-6 py-12 text-center">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
