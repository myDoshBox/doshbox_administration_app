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
  Package,
  Truck,
  ShoppingBag,
  Copy,
  ExternalLink,
  History,
  UserCheck,
  UserX,
  DollarSign,
  Scale,
} from "lucide-react";

import { useGetTransactionByIdQuery } from "../../../Redux/Slice/AdminTransactionSlice/adminTransactionsApiSlice";

// ─── Tab config ─
const TABS = [
  { id: "details", label: "Transaction Details", Icon: FileText },
  { id: "products", label: "Products", Icon: Package },
  { id: "shipping", label: "Shipping", Icon: Truck },
  { id: "payout", label: "Payout & Analytics", Icon: DollarSign },
];

const AdminTransactionDetail = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const {
    data: transactionData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetTransactionByIdQuery(transactionId, {
    skip: !transactionId,
    refetchOnMountOrArgChange: true,
  });

  // Extract data flexibly
  let transaction = null;
  let payout = null;
  let analytics = null;

  if (transactionData) {
    if (transactionData.data) {
      transaction = transactionData.data.transaction;
      payout = transactionData.data.payout;
      analytics = transactionData.data.analytics;
    } else if (transactionData.transaction) {
      transaction = transactionData.transaction;
      payout = transactionData.payout;
      analytics = transactionData.analytics;
    } else if (transactionData._id || transactionData.transaction_id) {
      transaction = transactionData;
    } else if (Array.isArray(transactionData) && transactionData.length > 0) {
      transaction = transactionData[0];
    }
  }

  // ── Helpers functions
  const formatNaira = (amount) => {
    if (!amount && amount !== 0) return "₦0.00";
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

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

  const formatRelativeTime = (date) => {
    if (!date) return "";
    const diffMs = Date.now() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status, size = "default") => {
    const cfg = {
      processing: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        Icon: Clock,
        label: "Processing",
      },
      awaiting_payment: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        Icon: CreditCard,
        label: "Awaiting Payment",
      },
      payment_verified: {
        color: "bg-cyan-50 text-cyan-700 border-cyan-200",
        Icon: CheckCircle,
        label: "Payment Verified",
      },
      awaiting_shipping: {
        color: "bg-purple-50 text-purple-700 border-purple-200",
        Icon: Package,
        label: "Awaiting Shipping",
      },
      in_transit: {
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        Icon: Truck,
        label: "In Transit",
      },
      completed: {
        color: "bg-green-50 text-green-700 border-green-200",
        Icon: CheckCircle,
        label: "Completed",
      },
      cancelled: {
        color: "bg-red-50 text-red-700 border-red-200",
        Icon: XCircle,
        label: "Cancelled",
      },
      declined: {
        color: "bg-gray-50 text-gray-700 border-gray-200",
        Icon: XCircle,
        label: "Declined",
      },
      inDispute: {
        color: "bg-rose-50 text-rose-700 border-rose-200",
        Icon: AlertTriangle,
        label: "In Dispute",
      },
    };
    const { color, Icon: StatusIcon, label } = cfg[status] || cfg.processing;
    const sizeClass =
      size === "large" ? "px-4 py-2 text-sm" : "px-2.5 py-1 text-xs";
    const iconClass = size === "large" ? "w-4 h-4 mr-2" : "w-3 h-3 mr-1";
    return (
      <span
        className={`inline-flex items-center ${sizeClass} rounded-full font-medium border ${color}`}
      >
        <StatusIcon className={iconClass} />
        {label}
      </span>
    );
  };

  const getConfirmationBadge = (confirmed, type = "buyer") => {
    if (confirmed)
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          <UserCheck className="w-3 h-3 mr-1" />
          {type === "buyer" ? "Buyer Confirmed" : "Seller Confirmed"}
        </span>
      );
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
        <UserX className="w-3 h-3 mr-1" />
        {type === "buyer" ? "Awaiting Buyer" : "Awaiting Seller"}
      </span>
    );
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            Loading transaction details...
          </p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-red-50 p-8 rounded-2xl max-w-md border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-red-900 mb-2">
            Error Loading Transaction
          </h3>
          <p className="text-red-700 mb-6">
            {error?.data?.message || error?.error || "Failed to fetch"}
          </p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => navigate("/admin/transactions")}
              className="px-6 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 font-medium"
            >
              Back
            </button>
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );

  if (!transaction)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-gray-50 p-8 rounded-2xl max-w-md">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Transaction Not Found
          </h3>
          <button
            onClick={() => navigate("/admin/transactions")}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium"
          >
            Back
          </button>
        </div>
      </div>
    );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/transactions/all")}
              className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Transaction Details
                </h1>
                {getStatusBadge(transaction.transaction_status, "large")}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-500 text-sm font-mono">
                  ID: {transaction.transaction_id}
                </p>
                <button
                  onClick={() => copyToClipboard(transaction.transaction_id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
                {copied && (
                  <span className="text-xs text-green-600 font-medium">
                    Copied!
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 shadow-sm self-start md:self-auto"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* ── TAB BAR ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tab buttons row */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {TABS.map(({ id, label, Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`
                    relative flex items-center gap-2 px-5 py-4 text-sm font-medium
                    whitespace-nowrap transition-colors focus:outline-none
                    focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500
                    ${
                      isActive
                        ? "text-primary-700 bg-primary-50"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary-600" : "text-gray-400"}`}
                  />
                  {label}
                  {/* Active underline indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Tab content (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* ── DETAILS TAB ── */}
            {activeTab === "details" && (
              <>
                {/* Transaction Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <ShoppingBag className="w-5 h-5 text-primary-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Transaction Summary
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">
                        Transaction Total
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatNaira(transaction.transaction_total)}
                      </p>
                      {transaction.sum_total && (
                        <p className="text-xs text-gray-500 mt-1">
                          Subtotal: {formatNaira(transaction.sum_total)}
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">
                        Transaction Type
                      </p>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary-600" />
                        <p className="text-lg font-semibold text-gray-900 capitalize">
                          {transaction.transaction_type?.replace(/_/g, " ") ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Created</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-900">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(transaction.createdAt)}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-900">
                          {formatDate(transaction.updatedAt)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(transaction.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {transaction.payment_verified_at && (
                    <div className="mt-4 p-3 bg-cyan-50 rounded-lg border border-cyan-100 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-cyan-700">
                        Payment Verified:
                      </span>
                      <span className="text-sm text-cyan-900">
                        {formatDate(transaction.payment_verified_at)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Parties */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Parties Involved
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-700">
                          Buyer
                        </p>
                        {getConfirmationBadge(
                          transaction.buyer_confirm_status,
                          "buyer",
                        )}
                      </div>
                      <p className="text-base font-semibold text-gray-900">
                        {transaction.buyer_email}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-700">
                          Seller
                        </p>
                        {getConfirmationBadge(
                          transaction.seller_confirmed,
                          "seller",
                        )}
                      </div>
                      <p className="text-base font-semibold text-gray-900">
                        {transaction.vendor_name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {transaction.vendor_email}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── PRODUCTS TAB ── */}
            {activeTab === "products" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Products</h2>
                  {transaction.products?.length > 0 && (
                    <span className="ml-auto text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {transaction.products.length} item
                      {transaction.products.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {transaction.products?.length > 0 ? (
                  <div className="space-y-4">
                    {transaction.products.map((product, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {product.name || `Product ${index + 1}`}
                          </h3>
                          <span className="text-sm font-bold text-primary-600">
                            {formatNaira(product.price)}
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <span className="text-gray-500">
                            Qty:{" "}
                            <span className="text-gray-900 font-medium">
                              {product.quantity || 1}
                            </span>
                          </span>
                          <span className="text-gray-500">
                            Total:{" "}
                            <span className="text-gray-900 font-medium">
                              {formatNaira(
                                (product.price || 0) * (product.quantity || 1),
                              )}
                            </span>
                          </span>
                        </div>
                        {product.description && (
                          <p className="text-sm text-gray-600 mt-2">
                            {product.description}
                          </p>
                        )}
                      </div>
                    ))}

                    {/* Total row */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className="font-semibold text-gray-700">
                        Subtotal
                      </span>
                      <span className="font-bold text-gray-900 text-lg">
                        {formatNaira(transaction.sum_total)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No products listed</p>
                  </div>
                )}
              </div>
            )}

            {/* ── SHIPPING TAB ── */}
            {activeTab === "shipping" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Truck className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Shipping Details
                  </h2>
                </div>

                {transaction.shipping ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">
                        Shipping Company
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {transaction.shipping.shipping_company || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">
                        Pickup Address
                      </p>
                      <p className="text-sm text-gray-900">
                        {transaction.shipping.pick_up_address || "N/A"}
                      </p>
                    </div>
                    {transaction.shipping.delivery_person_name && (
                      <>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Delivery Person
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.shipping.delivery_person_name}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Contact Number
                          </p>
                          <p className="text-sm text-gray-900">
                            {transaction.shipping.delivery_person_number ||
                              "N/A"}
                          </p>
                        </div>
                      </>
                    )}
                    {transaction.shipping.delivery_date && (
                      <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                        <p className="text-xs text-gray-500 mb-1">
                          Delivery Date
                        </p>
                        <p className="text-sm text-gray-900">
                          {formatDate(transaction.shipping.delivery_date)}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No shipping information available
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── PAYOUT TAB ── */}
            {activeTab === "payout" && (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Payout Information
                    </h2>
                  </div>

                  {payout ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-2">
                            Payout Status
                          </p>
                          {getStatusBadge(payout.payout_status)}
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Payout Amount
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatNaira(payout.payout_amount)}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Payment Method
                          </p>
                          <p className="text-sm text-gray-900 capitalize">
                            {payout.payout_method?.replace(/_/g, " ") || "N/A"}
                          </p>
                        </div>
                        {payout.transfer_reference && (
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1">
                              Transfer Reference
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-mono text-gray-900 truncate">
                                {payout.transfer_reference}
                              </p>
                              <button
                                onClick={() =>
                                  copyToClipboard(payout.transfer_reference)
                                }
                                className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                              >
                                <Copy className="w-3 h-3 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        )}
                        {payout.payout_failed && (
                          <div className="bg-red-50 rounded-xl p-4 md:col-span-2 border border-red-100">
                            <p className="text-xs text-red-600 mb-1 font-medium">
                              Failure Reason
                            </p>
                            <p className="text-sm text-red-900">
                              {payout.payout_failure_reason || "Unknown reason"}
                            </p>
                          </div>
                        )}
                        {payout.manual_payout_reason && (
                          <div className="bg-orange-50 rounded-xl p-4 md:col-span-2 border border-orange-100">
                            <p className="text-xs text-orange-600 mb-1 font-medium">
                              Manual Payout Reason
                            </p>
                            <p className="text-sm text-orange-900">
                              {payout.manual_payout_reason}
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/admin/transactions/payouts/${payout._id}`)
                        }
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-all font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Full Payout Details
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        No payout information available
                      </p>
                    </div>
                  )}
                </div>

                {analytics && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Scale className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Transaction Analytics
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {analytics.commission_amount && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Commission
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatNaira(analytics.commission_amount)}
                          </p>
                        </div>
                      )}
                      {analytics.revenue_recognized !== undefined && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Revenue Recognized
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {analytics.revenue_recognized ? "Yes" : "No"}
                          </p>
                        </div>
                      )}
                      {analytics.time_to_completion_hours && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Time to Complete
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {analytics.time_to_completion_hours?.toFixed(2)}h
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Right: Actions + Timeline ── */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-primary-600 rounded-full" />
                Timeline
              </h2>
              <div className="space-y-4">
                {[
                  {
                    show: !!transaction.createdAt,
                    Icon: ShoppingBag,
                    bg: "bg-blue-100",
                    ic: "text-blue-600",
                    label: "Transaction Created",
                    date: transaction.createdAt,
                  },
                  {
                    show: !!transaction.payment_verified_at,
                    Icon: CreditCard,
                    bg: "bg-cyan-100",
                    ic: "text-cyan-600",
                    label: "Payment Verified",
                    date: transaction.payment_verified_at,
                  },
                  {
                    show: !!transaction.buyer_confirm_status,
                    Icon: UserCheck,
                    bg: "bg-green-100",
                    ic: "text-green-600",
                    label: "Buyer Confirmed",
                    date: transaction.updatedAt,
                  },
                  {
                    show: transaction.transaction_status === "completed",
                    Icon: CheckCircle,
                    bg: "bg-green-100",
                    ic: "text-green-600",
                    label: "Transaction Completed",
                    date: transaction.updatedAt,
                  },
                ]
                  .filter((e) => e.show)
                  .map(({ Icon, bg, ic, label, date }, i, arr) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center`}
                        >
                          <Icon className={`w-4 h-4 ${ic}`} />
                        </div>
                        {i < arr.length - 1 && (
                          <div className="absolute top-8 left-4 w-0.5 h-10 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm font-medium text-gray-900">
                          {label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(date)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatRelativeTime(date)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Payment Verification */}
            {transaction.verified_payment_status && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary-600 rounded-full" />
                  Payment Verification
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium text-sm">
                    Verified
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionDetail;
