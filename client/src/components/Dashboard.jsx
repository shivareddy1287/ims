import React, { useState, useEffect } from "react";
import { userPaymentAPI } from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    completedUsers: 0,
    totalRevenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await userPaymentAPI.getAll();

      if (response.data.success) {
        const users = response.data.data;
        const totalUsers = users.length;
        const activeUsers = users.filter(
          (user) => user.status === "active"
        ).length;
        const completedUsers = users.filter(
          (user) => user.status === "completed"
        ).length;
        const totalRevenue = users.reduce(
          (sum, user) => sum + (user.totalPaidAmount || 0),
          0
        );

        setStats({
          totalUsers,
          activeUsers,
          completedUsers,
          totalRevenue,
        });

        setRecentUsers(users.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div
          className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}
        >
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to ChitFund Management System
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle="All registered members"
          icon="👥"
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          subtitle="Currently paying"
          icon="✅"
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Completed"
          value={stats.completedUsers}
          subtitle="Fully paid members"
          icon="🎯"
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          subtitle="Total collected amount"
          icon="💰"
          color="bg-yellow-100 text-yellow-600"
        />
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
        </div>
        <div className="p-6">
          {recentUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found. Create your first user to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {user.memberName?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {user.memberName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Aadhar: {user.aadharNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{user.chitAmount?.toLocaleString()}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
