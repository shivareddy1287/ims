import React, { useState, useEffect } from "react";
import { userPaymentAPI } from "../services/api";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tenureTypeFilter, setTenureTypeFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userPaymentAPI.getAll();
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.aadharNumber?.includes(searchTerm) ||
      user.phoneNumber?.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesTenureType =
      tenureTypeFilter === "all" || user.tenureType === tenureTypeFilter;

    return matchesSearch && matchesStatus && matchesTenureType;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        label: "Active",
        icon: "🟢",
      },
      completed: {
        color: "bg-blue-100 text-blue-800 border border-blue-200",
        label: "Completed",
        icon: "✅",
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border border-red-200",
        label: "Cancelled",
        icon: "❌",
      },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800 border border-gray-200",
      label: status,
      icon: "⚪",
    };

    return (
      <span
        className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold ${config.color}`}
      >
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </span>
    );
  };

  const getCompletedMonths = (user) => {
    return (
      user.completedMonths ||
      user.paymentRecords?.filter(
        (record) => record.status === "paid" || record.status === "partial"
      ).length ||
      0
    );
  };

  const getProgressPercentage = (user) => {
    const completed = getCompletedMonths(user);
    return user.tenure ? Math.round((completed / user.tenure) * 100) : 0;
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await userPaymentAPI.delete(userId);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  const getTenureDisplay = (user) => {
    if (!user.tenure) return "N/A";
    const tenureType = user.tenureType || "month";
    const typeText = tenureType === "week" ? "weeks" : "months";
    return `${user.tenure} ${typeText}`;
  };

  const getPremiumDisplay = (user) => {
    if (!user.monthlyPremium) return "N/A";
    const tenureType = user.tenureType || "month";
    const typeText = tenureType === "week" ? "week" : "month";
    return `₹${user.monthlyPremium?.toLocaleString()}/${typeText}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 font-medium">
            Loading users data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Member Management
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Manage all chit fund members and their details
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 font-semibold group"
        >
          <span className="group-hover:rotate-180 transition-transform duration-500">
            🔄
          </span>
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-semibold">
                Total Members
              </p>
              <p className="text-3xl font-bold mt-2">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-semibold">
                Active Members
              </p>
              <p className="text-3xl font-bold mt-2">
                {users.filter((u) => u.status === "active").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-semibold">Completed</p>
              <p className="text-3xl font-bold mt-2">
                {users.filter((u) => u.status === "completed").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-semibold">
                Total Revenue
              </p>
              <p className="text-2xl font-bold mt-2">
                ₹
                {users
                  .reduce((sum, user) => sum + (user.totalPaidAmount || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Members
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, Aadhar, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>

          <div className="w-full lg:w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="w-full lg:w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Plan Type
            </label>
            <select
              value={tenureTypeFilter}
              onChange={(e) => setTenureTypeFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
            >
              <option value="all">All Plans</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
              <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
              <span>All Members ({filteredUsers.length})</span>
            </h2>
            <div className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full">
              {filteredUsers.length} of {users.length} members
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Members Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm ||
              statusFilter !== "all" ||
              tenureTypeFilter !== "all"
                ? "Try adjusting your search criteria or filters"
                : "Get started by creating your first member"}
            </p>
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors font-semibold">
              Create New Member
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Member Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Plan Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status & Payments
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const completedMonths = getCompletedMonths(user);
                  const progressPercentage = getProgressPercentage(user);

                  console.log("sss", user.status);

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-emerald-50/50 transition-all duration-300 group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                              <span className="text-white font-semibold text-sm">
                                {user.memberName?.charAt(0) || "U"}
                              </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                              {user.memberName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center space-x-2 mt-1">
                              <span>🆔 {user.aadharNumber}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-medium text-gray-900">
                          📱 {user.phoneNumber}
                        </div>
                        {user.address && (
                          <div className="text-sm text-gray-500 mt-1 max-w-xs">
                            <span title={user.address}>
                              {user.address.length > 35
                                ? `${user.address.substring(0, 35)}...`
                                : user.address}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-semibold text-gray-900 text-lg">
                          ₹{user.chitAmount?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {getTenureDisplay(user)} • {getPremiumDisplay(user)}
                        </div>
                        <div className="text-xs text-emerald-600 font-medium mt-1 bg-emerald-50 px-2 py-1 rounded-full inline-block">
                          {user.tenureType || "month"} plan
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">
                              {completedMonths}/{user.tenure}
                            </span>
                            <span className="font-semibold text-emerald-600">
                              {progressPercentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          {getStatusBadge(user.status)}
                          <div className="text-sm font-medium text-gray-900">
                            ₹{user.totalPaidAmount?.toLocaleString() || "0"}{" "}
                            paid
                          </div>
                          <div className="text-xs text-gray-500">
                            Started:{" "}
                            {new Date(user.startDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-2">
                          {user.status === "completed" ? (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110 group"
                              title="Delete Member"
                            >
                              <span className="text-lg group-hover:scale-110 transition-transform">
                                🗑️
                              </span>
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {filteredUsers.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold">{filteredUsers.length}</p>
              <p className="text-emerald-100 text-sm">Showing Members</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.round(
                  filteredUsers.reduce(
                    (acc, user) => acc + getProgressPercentage(user),
                    0
                  ) / filteredUsers.length
                )}
                %
              </p>
              <p className="text-emerald-100 text-sm">Avg Completion</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {filteredUsers.filter((u) => u.tenureType === "week").length}
              </p>
              <p className="text-emerald-100 text-sm">Weekly Plans</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {filteredUsers.filter((u) => u.tenureType === "month").length}
              </p>
              <p className="text-emerald-100 text-sm">Monthly Plans</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
