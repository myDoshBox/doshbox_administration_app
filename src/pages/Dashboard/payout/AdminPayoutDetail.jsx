import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  User,
  FileText,
  Calendar,
  AlertCircle,
  Send,
  Ban,
  Loader,
  Wallet,
  Copy,
  ExternalLink,
  Mail,
  Phone,
  Building2,
  Hash,
  Banknote,
  Receipt,
  History,
  Shield,
  Globe,
} from "lucide-react";
import {
  useGetPayoutByIdQuery,
  useProcessManualPayoutMutation,
} from "../../../Redux/Slice/AdminTransactionSlice/adminTransactionsApiSlice";

const AdminPayoutDetail = () => {
  const { payoutId } = useParams();
  const navigate = useNavigate();
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processingNotes, setProcessingNotes] = useState("");
  const [copied, setCopied] = useState(false);

  // Fetch payout details
  const {
    data: payoutData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetPayoutByIdQuery(payoutId, {
    skip: !payoutId,
    refetchOnMountOrArgChange: true,
  });

  // Process manual payout mutation
  const [
    processManualPayout,
    {
      isLoading: isProcessing,
      isSuccess: isProcessed,
      isError: isProcessError,
      error: processError,
    },
  ] = useProcessManualPayoutMutation();

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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Format relative time
  const formatRelativeTime = (date) => {
    if (!date) return "";

    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return formatDate(date);
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get status badge
  const getStatusBadge = (status, size = "default") => {
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

    const sizeClasses =
      size === "large" ? "px-4 py-2 text-sm" : "px-2.5 py-1 text-xs";

    return (
      <span
        className={`inline-flex items-center ${sizeClasses} rounded-full font-medium border ${config.color}`}
      >
        <Icon
          className={`${size === "large" ? "w-4 h-4 mr-2" : "w-3 h-3 mr-1"}`}
        />
        {config.label}
      </span>
    );
  };

  // Handle process manual payout
  const handleProcessPayout = async () => {
    try {
      await processManualPayout({ payoutId, notes: processingNotes }).unwrap();
      setShowProcessModal(false);
      setProcessingNotes("");
      refetch();
    } catch (err) {
      console.error("Failed to process payout:", err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <p className="text-gray-600 text-lg">Loading payout details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    const errorMessage =
      error?.data?.message || error?.error || "Failed to fetch payout details";

    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-red-50 p-8 rounded-2xl max-w-md border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-red-900 mb-2">
            Error Loading Payout
          </h3>
          <p className="text-red-700 mb-6">{errorMessage}</p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => navigate("/admin/payouts")}
              className="px-6 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
            >
              Back to Payouts
            </button>
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const payout = payoutData?.data || payoutData || {};
  const canProcessManually = payout.payout_status === "manual_payout_required";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              a
              className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm hover:shadow"
              title="Back to Payouts"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Payout Details
                </h1>
                {getStatusBadge(payout.payout_status, "large")}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-500 text-sm font-mono">
                  ID: {payout._id?.slice(0, 16)}...
                </p>
                <button
                  onClick={() => copyToClipboard(payout._id)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Copy ID"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
                {copied && (
                  <span className="text-xs text-green-600">Copied!</span>
                )}
              </div>
            </div>
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
          </div>
        </div>

        {/* Status Alerts */}
        {isProcessed && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
            <div className="p-1 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-green-900">
                Payout Processed Successfully
              </h4>
              <p className="text-sm text-green-700 mt-1">
                The manual payout has been processed and completed.
              </p>
            </div>
          </div>
        )}

        {isProcessError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
            <div className="p-1 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-semibold text-red-900">Processing Failed</h4>
              <p className="text-sm text-red-700 mt-1">
                {processError?.data?.message ||
                  "Failed to process manual payout"}
              </p>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payout Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Wallet className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Payout Summary
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Payout Amount</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNaira(payout.payout_amount)}
                  </p>
                  {payout.transaction?.transaction_total && (
                    <p className="text-xs text-gray-500 mt-1">
                      Transaction Total:{" "}
                      {formatNaira(payout.transaction.transaction_total)}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary-600" />
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {payout.payout_method?.replace(/_/g, " ") || "N/A"}
                    </p>
                  </div>
                  {payout.transfer_reference && (
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      Ref: {payout.transfer_reference}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Created</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      {formatDate(payout.created_at)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatRelativeTime(payout.created_at)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      {formatDate(payout.updated_at)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatRelativeTime(payout.updated_at)}
                  </p>
                </div>
              </div>

              {payout.transfer_reference && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        Transfer Reference:
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(payout.transfer_reference)}
                      className="p-1 hover:bg-blue-100 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                  <p className="text-blue-900 font-mono text-sm mt-1 break-all">
                    {payout.transfer_reference}
                  </p>
                </div>
              )}
            </div>

            {/* Vendor Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Vendor Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Vendor Name</p>
                    <p className="text-base font-semibold text-gray-900">
                      {payout.vendor_name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-900">
                        {payout.vendor_email || "N/A"}
                      </p>
                    </div>
                  </div>

                  {payout.vendor_phone && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-900">
                          {payout.vendor_phone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <p className="text-sm font-mono text-gray-900">
                        {payout.transaction_id || "N/A"}
                      </p>
                    </div>
                  </div>

                  {payout.transaction && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Transaction Details
                      </p>
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/transactions/${payout.transaction_id}`,
                          )
                        }
                        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                      >
                        View Transaction
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Failure Information */}
            {payout.payout_failed && (
              <div className="bg-red-50 rounded-xl border border-red-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-lg font-bold text-red-900">
                    Failure Details
                  </h2>
                </div>

                <div className="bg-white bg-opacity-50 rounded-lg p-4">
                  <p className="text-sm text-red-600 mb-1">Failure Reason</p>
                  <p className="text-red-900">
                    {payout.payout_failure_reason || "No reason provided"}
                  </p>
                </div>
              </div>
            )}

            {/* Manual Payout Information */}
            {payout.manual_payout_reason && (
              <div className="bg-orange-50 rounded-xl border border-orange-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-lg font-bold text-orange-900">
                    Manual Payout Required
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-white bg-opacity-50 rounded-lg p-4">
                    <p className="text-sm text-orange-600 mb-1">Reason</p>
                    <p className="text-orange-900">
                      {payout.manual_payout_reason}
                    </p>
                  </div>

                  {payout.manual_payout_notes && (
                    <div className="bg-white bg-opacity-50 rounded-lg p-4">
                      <p className="text-sm text-orange-600 mb-1">
                        Processing Notes
                      </p>
                      <p className="text-orange-900">
                        {payout.manual_payout_notes}
                      </p>
                    </div>
                  )}

                  {payout.manual_payout_processed_at && (
                    <div className="bg-white bg-opacity-50 rounded-lg p-4">
                      <p className="text-sm text-orange-600 mb-1">
                        Processed At
                      </p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <p className="text-orange-900">
                          {formatDate(payout.manual_payout_processed_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions & Timeline */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-primary-600 rounded-full"></div>
                Quick Actions
              </h2>

              <div className="space-y-3">
                {payout.transaction_id && (
                  <button
                    onClick={() =>
                      navigate(`/admin/transactions/${payout.transaction_id}`)
                    }
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-all font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Transaction</span>
                  </button>
                )}

                <button
                  onClick={() => refetch()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh Data</span>
                </button>

                {canProcessManually && (
                  <button
                    onClick={() => setShowProcessModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all font-medium shadow-sm hover:shadow"
                  >
                    <Send className="w-4 h-4" />
                    <span>Process Manually</span>
                  </button>
                )}
              </div>
            </div>

            {/* Payout Timeline Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-primary-600 rounded-full"></div>
                Timeline
              </h2>

              <div className="space-y-4">
                {payout.created_at && (
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="absolute top-8 left-4 w-0.5 h-12 bg-gray-200"></div>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium text-gray-900">
                        Payout Created
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(payout.created_at)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatRelativeTime(payout.created_at)}
                      </p>
                    </div>
                  </div>
                )}

                {payout.manual_payout_processing_started_at && (
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Loader className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="absolute top-8 left-4 w-0.5 h-12 bg-gray-200"></div>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium text-gray-900">
                        Manual Processing Started
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(payout.manual_payout_processing_started_at)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatRelativeTime(
                          payout.manual_payout_processing_started_at,
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {payout.manual_payout_processed_at && (
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium text-gray-900">
                        Processing Completed
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(payout.manual_payout_processed_at)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatRelativeTime(payout.manual_payout_processed_at)}
                      </p>
                    </div>
                  </div>
                )}

                {payout.payout_failed && payout.payout_failure_reason && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium text-gray-900">
                        Payout Failed
                      </p>
                      <p className="text-xs text-gray-500">
                        {payout.payout_failure_reason}
                      </p>
                    </div>
                  </div>
                )}

                {!payout.created_at &&
                  !payout.manual_payout_processed_at &&
                  !payout.payout_failed && (
                    <div className="text-center py-8">
                      <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        No timeline events available
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Metadata Card */}
            {(payout.metadata || payout.payment_provider) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary-600 rounded-full"></div>
                  Additional Information
                </h2>

                <div className="space-y-3">
                  {payout.payment_provider && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Payment Provider
                      </p>
                      <p className="text-sm text-gray-900 capitalize">
                        {payout.payment_provider}
                      </p>
                    </div>
                  )}

                  {payout.metadata &&
                    Object.keys(payout.metadata).length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Metadata</p>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          {Object.entries(payout.metadata).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between text-xs"
                              >
                                <span className="text-gray-600">{key}:</span>
                                <span className="text-gray-900 font-mono">
                                  {String(value)}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Process Manual Payout Modal */}
      {showProcessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Send className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Process Manual Payout
                </h3>
                <p className="text-sm text-gray-600">
                  Confirm manual payout processing
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processing Notes{" "}
                <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                value={processingNotes}
                onChange={(e) => setProcessingNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Add any notes about this manual payout processing..."
              />
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <h4 className="font-medium text-orange-800 mb-2">
                Payout Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-orange-700">Amount:</span>
                  <span className="font-bold text-orange-900">
                    {formatNaira(payout.payout_amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Vendor:</span>
                  <span className="text-orange-900">{payout.vendor_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Method:</span>
                  <span className="text-orange-900 capitalize">
                    {payout.payout_method?.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowProcessModal(false);
                  setProcessingNotes("");
                }}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessPayout}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Process Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayoutDetail;
