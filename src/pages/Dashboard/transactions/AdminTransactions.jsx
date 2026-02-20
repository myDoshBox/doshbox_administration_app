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
  Package,
  Truck,
  CreditCard,
  Wallet,
  TrendingUp,
  Users,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  FileText,
  Printer,
  Ban,
  Loader,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { useGetAllTransactionsQuery } from "../../../Redux/Slice/AdminTransactionSlice/adminTransactionsApiSlice";
import { useNavigate } from "react-router-dom";

const AdminTransactions = () => {
  const navigate = useNavigate();

  // Filter states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch transactions with filters
  const {
    data: transactionsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllTransactionsQuery(
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

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Clock,
        label: "Processing",
        bg: "bg-blue-500",
      },
      awaiting_payment: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: CreditCard,
        label: "Awaiting Payment",
        bg: "bg-amber-500",
      },
      payment_verified: {
        color: "bg-cyan-50 text-cyan-700 border-cyan-200",
        icon: CheckCircle,
        label: "Payment Verified",
        bg: "bg-cyan-500",
      },
      awaiting_shipping: {
        color: "bg-purple-50 text-purple-700 border-purple-200",
        icon: Package,
        label: "Awaiting Shipping",
        bg: "bg-purple-500",
      },
      in_transit: {
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        icon: Truck,
        label: "In Transit",
        bg: "bg-indigo-500",
      },
      completed: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle,
        label: "Completed",
        bg: "bg-green-500",
      },
      cancelled: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
        label: "Cancelled",
        bg: "bg-red-500",
      },
      declined: {
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: XCircle,
        label: "Declined",
        bg: "bg-gray-500",
      },
      inDispute: {
        color: "bg-rose-50 text-rose-700 border-rose-200",
        icon: AlertTriangle,
        label: "In Dispute",
        bg: "bg-rose-500",
      },
    };

    const config = statusConfig[status] || statusConfig.processing;
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

  // Handle view transaction
  const handleViewTransaction = (transactionId) => {
    navigate(`/admin/transactions/${transactionId}`);
  };

  // Status filter options
  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "processing", label: "Processing" },
    { value: "awaiting_payment", label: "Awaiting Payment" },
    { value: "payment_verified", label: "Payment Verified" },
    { value: "awaiting_shipping", label: "Awaiting Shipping" },
    { value: "in_transit", label: "In Transit" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "declined", label: "Declined" },
    { value: "inDispute", label: "In Dispute" },
  ];

  // Calculate summary stats
  const calculateSummary = () => {
    if (!transactionsData?.transactions)
      return {
        totalAmount: 0,
        completedAmount: 0,
        pendingAmount: 0,
        avgAmount: 0,
      };

    const transactions = transactionsData.transactions;
    const totalAmount = transactions.reduce(
      (sum, t) => sum + (t.transaction_total || 0),
      0,
    );
    const completedAmount = transactions
      .filter((t) => t.transaction_status === "completed")
      .reduce((sum, t) => sum + (t.transaction_total || 0), 0);
    const pendingAmount = transactions
      .filter((t) =>
        [
          "processing",
          "awaiting_payment",
          "awaiting_shipping",
          "in_transit",
        ].includes(t.transaction_status),
      )
      .reduce((sum, t) => sum + (t.transaction_total || 0), 0);
    const avgAmount =
      transactions.length > 0 ? totalAmount / transactions.length : 0;

    return {
      totalAmount,
      completedAmount,
      pendingAmount,
      avgAmount,
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <p className="text-gray-600 text-lg">Loading transactions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    const errorMessage =
      error?.data?.message || error?.error || "Failed to fetch transactions";

    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-red-50 p-8 rounded-2xl max-w-md border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-red-900 mb-2">
            Error Loading Transactions
          </h3>
          <p className="text-red-700 mb-6">{errorMessage}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const transactions = transactionsData?.transactions || [];
  const pagination = transactionsData?.pagination || {};
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
              Transactions
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor all platform transactions
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
                <ShoppingBag className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {pagination.total?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Transactions</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                Volume
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatNaira(summary.totalAmount)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Total Transaction Volume
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                Average
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatNaira(summary.avgAmount)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Average Transaction Value
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {
                transactions.filter(
                  (t) =>
                    t.transaction_status !== "completed" &&
                    t.transaction_status !== "cancelled",
                ).length
              }
            </p>
            <p className="text-sm text-gray-600 mt-1">Active Transactions</p>
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
                placeholder="Search by transaction ID, buyer email, vendor name..."
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
            <div className="mt-5 pt-5 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split("-");
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="transaction_total-desc">Highest Amount</option>
                  <option value="transaction_total-asc">Lowest Amount</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Buyer / Vendor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
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
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {transaction.transaction_id?.slice(0, 8)}...
                          </span>
                          <span className="text-xs text-gray-500 mt-1 capitalize">
                            {transaction.transaction_type?.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {transaction.buyer_email}
                          </span>
                          <span className="text-xs text-gray-500">
                            <span className="text-gray-400">→</span>{" "}
                            {transaction.vendor_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">
                            {formatNaira(transaction.transaction_total)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {transaction.products?.length || 0} item(s)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.transaction_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() =>
                            handleViewTransaction(transaction.transaction_id)
                          }
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
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <Package className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">
                          No transactions found
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

export default AdminTransactions;
