// Update the MediatorsList component to use real dispute data
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  Activity,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  useGetMediatorsQuery,
  useGetMediatorDisputeStatsQuery,
  useDeleteMediatorMutation,
} from "../../Redux/Slice/AdminMeditor/mediatorApiSlice";

// Dispute Stats Component with better error handling
const DisputeStatsCell = ({ mediatorId }) => {
  const { data, isLoading, error } = useGetMediatorDisputeStatsQuery(
    mediatorId,
    {
      skip: !mediatorId, // Skip if no mediatorId
    },
  );

  if (!mediatorId) {
    return <div className="text-gray-400 text-sm">—</div>;
  }

  if (isLoading) {
    return (
      <div className="space-y-2 min-w-[180px]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Total</span>
            <div className="animate-pulse bg-gray-200 h-5 w-8 rounded"></div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <CheckCircle className="w-3 h-3 text-gray-300" />
              <span className="text-xs text-gray-500">Resolved</span>
            </div>
            <div className="animate-pulse bg-gray-200 h-5 w-8 rounded"></div>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-gray-300" />
              <span className="text-xs text-gray-500">Active</span>
            </div>
            <div className="animate-pulse bg-gray-200 h-5 w-8 rounded"></div>
          </div>
        </div>
        <div className="animate-pulse bg-gray-200 h-2 w-full rounded"></div>
      </div>
    );
  }

  if (error || !data?.data?.stats) {
    return (
      <div className="space-y-2 min-w-[180px]">
        <div className="text-gray-400 text-xs text-center">No dispute data</div>
      </div>
    );
  }

  const { stats } = data.data;

  // Determine progress bar color based on resolution rate
  const getProgressColor = (rate) => {
    if (rate >= 75) return "bg-green-500";
    if (rate >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-2 min-w-[200px]">
      {/* Stats Row with labels */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col items-center flex-1">
          <span className="text-xs text-gray-500 mb-1">Total</span>
          <span className="text-sm font-bold text-gray-800">
            {stats.total || 0}
          </span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center gap-1 mb-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span className="text-xs text-gray-500">Resolved</span>
          </div>
          <span className="text-sm font-semibold text-green-600">
            {stats.resolved || 0}
          </span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-orange-500" />
            <span className="text-xs text-gray-500">Active</span>
          </div>
          <span className="text-sm font-semibold text-orange-600">
            {stats.active || 0}
          </span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center gap-1 mb-1">
            <AlertCircle className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">Cancelled</span>
          </div>
          <span className="text-sm font-semibold text-gray-500">
            {stats.cancelled || 0}
          </span>
        </div>
      </div>

      {/* Progress Bar with label */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Resolution Rate</span>
          <span className="font-medium text-gray-700">
            {stats.resolution_rate || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor(stats.resolution_rate || 0)}`}
            style={{ width: `${stats.resolution_rate || 0}%` }}
          />
        </div>
      </div>

      {/* Avg Resolution Time */}
      {stats.avg_resolution_time_days > 0 && (
        <div className="text-xs text-gray-400 pt-1 border-t border-gray-100 mt-1">
          <div className="flex justify-between">
            <span>Avg. Resolution:</span>
            <span className="font-medium">
              {stats.avg_resolution_time_days} days
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const MediatorsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedMediator, setSelectedMediator] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const { data, isLoading, error } = useGetMediatorsQuery();
  const [deleteMediator] = useDeleteMediatorMutation();

  const mediators = data?.data?.mediators || [];

  // Filter mediators based on search
  const filteredMediators = useMemo(() => {
    let filtered = mediators.filter(
      (mediator) =>
        mediator.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mediator.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mediator.mediator_email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        `${mediator.first_name} ${mediator.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (mediator) => (mediator.status || "active") === statusFilter,
      );
    }

    return filtered;
  }, [mediators, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredMediators.length / itemsPerPage);
  const paginatedMediators = filteredMediators.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDelete = async () => {
    if (selectedMediator) {
      try {
        await deleteMediator(selectedMediator._id).unwrap();
        setShowDeleteAlert(false);
        setSelectedMediator(null);
      } catch (error) {
        console.error("Failed to delete mediator:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load mediators</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mediators</h1>
          <p className="text-gray-600 mt-2">
            Manage all platform mediators and track their dispute resolution
            performance
          </p>
        </div>
        <Link
          to="/admin/mediators/add"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Mediator
        </Link>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium mb-1">
                Total Mediators
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {mediators.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium mb-1">
                Active Mediators
              </p>
              <p className="text-3xl font-bold text-green-900">
                {
                  mediators.filter((m) => (m.status || "active") !== "inactive")
                    .length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium mb-1">
                Active Disputes
              </p>
              <p className="text-3xl font-bold text-orange-900">—</p>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm mb-6 p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filter: {statusFilter === "all" ? "All" : statusFilter}
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                {["all", "active", "inactive"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowFilterDropdown(false);
                      setCurrentPage(1);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 capitalize"
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
            >
              {[10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500">entries</span>
          </div>
        </div>
      </div>

      {/* Mediators Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Mediator
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col">
                    <span>Dispute Performance</span>
                    <span className="text-[10px] font-normal text-gray-400 mt-0.5">
                      Total | Resolved | Active | Cancelled
                    </span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMediators.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No mediators found
                  </td>
                </tr>
              ) : (
                paginatedMediators.map((mediator) => (
                  <tr
                    key={mediator._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                          <Users className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {mediator.first_name} {mediator.last_name}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            ID: {mediator._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 text-sm">
                        {mediator.mediator_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 text-sm">
                        {mediator.mediator_phone_number || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          (mediator.status || "active") === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {mediator.status || "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <DisputeStatsCell mediatorId={mediator._id} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/mediators/${mediator._id}`}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/admin/mediators/${mediator._id}/edit`}
                          className="text-green-600 hover:text-green-900 p-1 rounded-lg hover:bg-green-50 transition-colors"
                          title="Edit Mediator"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedMediator(mediator);
                            setShowDeleteAlert(true);
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Mediator"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredMediators.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredMediators.length)}{" "}
              of {filteredMediators.length} mediators
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? "bg-primary-500 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteAlert && selectedMediator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {selectedMediator.first_name} {selectedMediator.last_name}
              </span>
              ? This action cannot be undone and will remove all associated
              data.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteAlert(false);
                  setSelectedMediator(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Mediator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediatorsList;
