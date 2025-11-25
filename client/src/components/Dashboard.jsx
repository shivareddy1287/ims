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
      console.log(response);

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

  const StatCard = ({ title, value, subtitle, icon, trend, color }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-14 h-14 rounded-xl ${color.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}
        >
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 font-medium">
            Loading dashboard data...
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
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Welcome to ChitFund Management System
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 font-semibold group"
        >
          <span className="group-hover:rotate-180 transition-transform duration-500">
            🔄
          </span>
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          subtitle="All registered members"
          icon="👥"
          trend={{
            value: "+12%",
            label: "from last month",
            color: "text-emerald-600",
          }}
          color={{
            bg: "bg-emerald-100 text-emerald-600",
            progress: "bg-emerald-500 w-3/4",
          }}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          subtitle="Currently paying"
          icon="✅"
          trend={{
            value: "+8%",
            label: "active growth",
            color: "text-green-600",
          }}
          color={{
            bg: "bg-green-100 text-green-600",
            progress: "bg-green-500 w-2/3",
          }}
        />
        <StatCard
          title="Completed"
          value={stats.completedUsers.toLocaleString()}
          subtitle="Fully paid members"
          icon="🎯"
          trend={{
            value: "+15%",
            label: "completions",
            color: "text-blue-600",
          }}
          color={{
            bg: "bg-blue-100 text-blue-600",
            progress: "bg-blue-500 w-1/2",
          }}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          subtitle="Total collected amount"
          icon="💰"
          trend={{
            value: "+22%",
            label: "revenue growth",
            color: "text-amber-600",
          }}
          color={{
            bg: "bg-amber-100 text-amber-600",
            progress: "bg-amber-500 w-4/5",
          }}
        />
      </div>

      {/* Recent Users Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
              <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
              <span>Recent Users</span>
            </h2>
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
              {recentUsers.length} users
            </span>
          </div>
        </div>

        <div className="p-6">
          {recentUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Users Found
              </h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                Create your first user to start managing chit fund payments.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentUsers.map((user, index) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 border border-emerald-50 rounded-xl hover:bg-emerald-50 transition-all duration-300 group hover:border-emerald-200"
                >
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
                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        {user.memberName}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center space-x-2 mt-1">
                        <span>🆔 {user.aadharNumber}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>₹{user.chitAmount?.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                        user.status === "active"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : user.status === "completed"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      {user.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-2">
                      Joined recently
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        {recentUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-emerald-100 bg-gray-50">
            <button className="w-full text-center text-emerald-600 font-semibold py-2 rounded-lg hover:bg-white transition-colors duration-300 border border-transparent hover:border-emerald-200">
              View All Users →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
