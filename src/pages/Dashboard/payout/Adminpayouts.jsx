import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  CreditCard,
  Ban,
  Loader,
  Wallet,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  FileText,
  Printer,
} from "lucide-react";
import { useGetAllPayoutsQuery } from "../../../Redux/Slice/AdminTransactionSlice/adminTransactionsApiSlice";
import { useNavigate } from "react-router-dom";

const AdminPayouts = () => {
  const navigate = useNavigate();

  // Filter states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch payouts with filters
  const {
    data: payoutsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllPayoutsQuery(
    {
      page,
      limit,
      status: status || undefined,
      search: search || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy,
      sortOrder,
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );

  // Search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Format Naira currency
  const formatNaira = (amount) => {
    if (!amount && amount !== 0) return "₦0.00";

    return `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get payout status badge
  const getPayoutStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
        label: "Pending",
        bg: "bg-amber-500",
      },
      processing: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Loader,
        label: "Processing",
        bg: "bg-blue-500",
      },
      completed: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle,
        label: "Completed",
        bg: "bg-green-500",
      },
      failed: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
        label: "Failed",
        bg: "bg-red-500",
      },
      manual_payout_required: {
        color: "bg-orange-50 text-orange-700 border-orange-200",
        icon: AlertTriangle,
        label: "Manual Required",
        bg: "bg-orange-500",
      },
      manual_payout_processing: {
        color: "bg-purple-50 text-purple-700 border-purple-200",
        icon: Loader,
        label: "Manual Processing",
        bg: "bg-purple-500",
      },
      manual_payout_completed: {
        color: "bg-teal-50 text-teal-700 border-teal-200",
        icon: CheckCircle,
        label: "Manual Completed",
        bg: "bg-teal-500",
      },
      cancelled: {
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: Ban,
        label: "Cancelled",
        bg: "bg-gray-500",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  // Handle filter clear
  const handleClearFilters = () => {
    setStatus("");
    setSearchInput("");
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // Handle view payout details
  const handleViewPayout = (payoutId) => {
    navigate(`/admin/transactions/payouts/${payoutId}`);
  };

  // Status filter options
  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
    { value: "manual_payout_required", label: "Manual Required" },
    { value: "manual_payout_processing", label: "Manual Processing" },
    { value: "manual_payout_completed", label: "Manual Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Calculate summary stats
  const calculateSummary = () => {
    if (!payoutsData?.payouts)
      return {
        totalAmount: 0,
        pendingAmount: 0,
        completedAmount: 0,
        failedAmount: 0,
      };

    return payoutsData.payouts.reduce(
      (acc, payout) => {
        const amount = payout.payout_amount || 0;
        acc.totalAmount += amount;

        if (
          payout.payout_status === "pending" ||
          payout.payout_status === "manual_payout_required"
        ) {
          acc.pendingAmount += amount;
        } else if (
          payout.payout_status === "completed" ||
          payout.payout_status === "manual_payout_completed"
        ) {
          acc.completedAmount += amount;
        } else if (payout.payout_status === "failed") {
          acc.failedAmount += amount;
        }

        return acc;
      },
      { totalAmount: 0, pendingAmount: 0, completedAmount: 0, failedAmount: 0 },
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <p className="text-gray-600 text-lg">Loading payouts...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    const errorMessage =
      error?.data?.message || error?.error || "Failed to fetch payouts";

    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-red-50 p-8 rounded-2xl max-w-md border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-red-900 mb-2">
            Error Loading Payouts
          </h3>
          <p className="text-red-700 mb-6">{errorMessage}</p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const payouts = payoutsData?.payouts || [];
  const pagination = payoutsData?.pagination || {};
  const activeFiltersCount = [status, search, startDate, endDate].filter(
    Boolean,
  ).length;
  const summary = calculateSummary();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Payouts
            </h1>
            <p className="text-gray-600 mt-1">
              Manage vendor payouts and manual processing
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm hover:shadow"
              title="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 ${isFetching ? "animate-spin" : ""}`}
              />
            </button>

            <button
              onClick={() => {
                /* Export functionality */
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-sm hover:shadow font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <Wallet className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatNaira(summary.totalAmount)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Payout Amount</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                {
                  payouts.filter(
                    (p) =>
                      p.payout_status === "pending" ||
                      p.payout_status === "manual_payout_required",
                  ).length
                }
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatNaira(summary.pendingAmount)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Pending Payouts</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                Completed
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatNaira(summary.completedAmount)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Completed Payouts</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
                {payouts.filter((p) => p.payout_status === "failed").length}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatNaira(summary.failedAmount)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Failed Payouts</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by transaction ID, vendor email, vendor name..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[200px]">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Toggle Advanced Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                showFilters
                  ? "bg-primary-50 border-primary-300 text-primary-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Advanced Filters</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-5 pt-5 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payouts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payouts.length > 0 ? (
                  payouts.map((payout) => (
                    <tr
                      key={payout._id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {payout.transaction_id?.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {payout.vendor_name || "N/A"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {payout.vendor_email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">
                          {formatNaira(payout.payout_amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700 capitalize">
                            {payout.payout_method?.replace("_", " ") || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPayoutStatusBadge(payout.payout_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payout.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewPayout(payout._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-medium"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <Wallet className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">
                          No payouts found
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Try adjusting your filters or search criteria
                        </p>
                        {activeFiltersCount > 0 && (
                          <button
                            onClick={handleClearFilters}
                            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{(page - 1) * limit + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(page * limit, pagination.total)}
                  </span>{" "}
                  of <span className="font-medium">{pagination.total}</span>{" "}
                  results
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination.hasPrevPage}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center space-x-1">
                    {[...Array(pagination.totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        (pageNum >= page - 1 && pageNum <= page + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${
                              page === pageNum
                                ? "bg-primary-600 text-white"
                                : "bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (pageNum === page - 2 || pageNum === page + 2) {
                        return (
                          <span key={pageNum} className="px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
                    disabled={!pagination.hasNextPage}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPayouts;
