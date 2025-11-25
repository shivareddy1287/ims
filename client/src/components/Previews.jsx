import React, { useState, useEffect } from "react";
import { userPaymentAPI } from "../services/api"; // Adjust import path as needed

const Previews = () => {
  const [activeTab, setActiveTab] = useState("weekly-start");
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch users from API
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

  // Date utility functions with proper timezone handling
  const getWeekSunday = (date) => {
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - date.getDay());
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  };

  const getWeekSaturday = (date) => {
    const saturday = new Date(date);
    saturday.setDate(date.getDate() + (6 - date.getDay()));
    saturday.setHours(23, 59, 59, 999);
    return saturday;
  };

  const getMonthFirstDay = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    firstDay.setHours(0, 0, 0, 0);
    return firstDay;
  };

  const getMonthLastDay = (date) => {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999);
    return lastDay;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Convert date string to Date object with proper timezone handling
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    // Create a new date without timezone offset to get the correct local date
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  };

  // Navigation functions
  const navigateWeek = (direction) => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === "next" ? 7 : -7));
      return newDate;
    });
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  // Data filtering functions with proper date comparison
  const filterUsersByStartDate = (users, startDate, endDate, tenureInp) => {
    return users.filter((user) => {
      console.log(user?.tenureType);

      const userStartDate = parseDate(user.startDate);
      if (!userStartDate) return false;

      userStartDate.setHours(0, 0, 0, 0);

      const filterStart = new Date(startDate);
      const filterEnd = new Date(endDate);

      filterStart.setHours(0, 0, 0, 0);
      filterEnd.setHours(23, 59, 59, 999);

      return (
        userStartDate >= filterStart &&
        userStartDate <= filterEnd &&
        user?.tenureType === tenureInp
      );
    });
  };

  const filterUsersByCompletionDate = (users, startDate, endDate) => {
    return users.filter((user) => {
      // For completion, check if the user's end date falls within the week
      if (user.status !== "completed") return false;

      const userEndDate = parseDate(user.endDate);
      if (!userEndDate) return false;

      userEndDate.setHours(0, 0, 0, 0);

      const filterStart = new Date(startDate);
      const filterEnd = new Date(endDate);

      filterStart.setHours(0, 0, 0, 0);
      filterEnd.setHours(23, 59, 59, 999);

      return userEndDate >= filterStart && userEndDate <= filterEnd;
    });
  };

  // Data loading functions
  const loadWeeklyData = () => {
    setLoading(true);

    const weekStart = getWeekSunday(currentWeek);
    const weekEnd = getWeekSaturday(currentWeek);

    let filteredData = [];

    if (activeTab === "weekly-start") {
      filteredData = filterUsersByStartDate(users, weekStart, weekEnd, "week");
    } else if (activeTab === "weekly-completion") {
      filteredData = filterUsersByCompletionDate(users, weekStart, weekEnd);
    }

    setWeeklyData(filteredData);
    setLoading(false);
  };

  const loadMonthlyData = () => {
    setLoading(true);

    const monthStart = getMonthFirstDay(currentMonth);
    const monthEnd = getMonthLastDay(currentMonth);

    let filteredData = [];

    if (activeTab === "monthly-start") {
      filteredData = filterUsersByStartDate(
        users,
        monthStart,
        monthEnd,
        "month"
      );
    } else if (activeTab === "monthly-completion") {
      filteredData = filterUsersByCompletionDate(users, monthStart, monthEnd);
    }

    setMonthlyData(filteredData);
    setLoading(false);
  };

  // Effects
  useEffect(() => {
    if (users.length > 0) {
      if (activeTab.includes("weekly")) {
        loadWeeklyData();
      } else {
        loadMonthlyData();
      }
    }
  }, [activeTab, currentWeek, currentMonth, users]);

  // UI Components
  const tabs = [
    { id: "weekly-start", label: "Weekly Start", icon: "📅" },
    { id: "monthly-start", label: "Monthly Start", icon: "📆" },
    { id: "weekly-completion", label: "Weekly Completion", icon: "✅" },
    { id: "monthly-completion", label: "Monthly Completion", icon: "✅" },
  ];

  const NavigationButton = ({ onClick, direction, label }) => (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
    >
      {direction === "prev" && <span>←</span>}
      <span>{label}</span>
      {direction === "next" && <span>→</span>}
    </button>
  );

  const WeekNavigation = () => {
    const weekStart = getWeekSunday(currentWeek);

    return (
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm border">
        <NavigationButton
          onClick={() => navigateWeek("prev")}
          direction="prev"
          label="Previous Week"
        />

        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Week Starting {formatDate(weekStart)}
          </h3>
          <p className="text-sm text-gray-600">
            Showing {activeTab.includes("start") ? "starts" : "completions"} for
            this week
          </p>
        </div>

        <NavigationButton
          onClick={() => navigateWeek("next")}
          direction="next"
          label="Next Week"
        />
      </div>
    );
  };

  const MonthNavigation = () => {
    const monthStart = getMonthFirstDay(currentMonth);
    const monthEnd = getMonthLastDay(currentMonth);

    return (
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm border">
        <NavigationButton
          onClick={() => navigateMonth("prev")}
          direction="prev"
          label="Previous Month"
        />

        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <p className="text-sm text-gray-600">
            {formatDate(monthStart)} - {formatDate(monthEnd)}
          </p>
        </div>

        <NavigationButton
          onClick={() => navigateMonth("next")}
          direction="next"
          label="Next Month"
        />
      </div>
    );
  };

  const UserCard = ({ user }) => {
    const startDate = parseDate(user.startDate);
    const endDate = parseDate(user.endDate);
    const lastPayment = user.paymentRecords?.[user.paymentRecords.length - 1];

    const premium =
      user.tenureType === "week"
        ? user.chitAmount / user.tenure
        : user.monthlyPremium || user.chitAmount / user.tenure;

    const getStatusColor = (status) => {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800";
        case "active":
          return "bg-blue-100 text-blue-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getTenureTypeColor = (type) => {
      return type === "week"
        ? "bg-purple-100 text-purple-800"
        : "bg-orange-100 text-orange-800";
    };

    // Calculate progress based on completed months/weeks
    const calculateProgress = () => {
      if (user.tenureType === "week") {
        return user.completedMonths || 0;
      } else {
        return user.completedMonths || 0;
      }
    };

    const progress = calculateProgress();

    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold text-gray-800">{user.memberName}</h4>
          <div className="flex flex-col items-end gap-1">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                user.status
              )}`}
            >
              {user.status}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getTenureTypeColor(
                user.tenureType
              )}`}
            >
              {user.tenureType === "week" ? "Weekly" : "Monthly"}
            </span>
          </div>
        </div>

        {/* Financial Info */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div>
            <span className="text-gray-600">Chit Amount:</span>
            <p className="font-medium">₹{user.chitAmount?.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-600">Tenure:</span>
            <p className="font-medium">
              {user.tenure} {user.tenureType}(s)
            </p>
          </div>
          <div>
            <span className="text-gray-600">
              {user.tenureType === "week" ? "Weekly" : "Monthly"} Premium:
            </span>
            <p className="font-medium">
              ₹{Math.round(premium)?.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Paid Amount:</span>
            <p className="font-medium">
              ₹{user.totalPaidAmount?.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div>
            <span className="text-gray-600">Start Date:</span>
            <p className="font-medium">{formatDate(startDate)}</p>
          </div>
          <div>
            <span className="text-gray-600">End Date:</span>
            <p className="font-medium">{formatDate(endDate)}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress:</span>
            <span>
              {progress} / {user.tenure} {user.tenureType}(s)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(progress / user.tenure) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Completion Info */}
        {activeTab.includes("completion") && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-sm">
              <span className="text-gray-600">Completion Date:</span>
              <p className="font-medium">{formatDate(endDate)}</p>
              {lastPayment && (
                <p className="text-gray-600">
                  Last Payment: ₹{lastPayment.amount?.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
          <span>Aadhar: {user.aadharNumber}</span>
          <span>Phone: {user.phoneNumber}</span>
        </div>
      </div>
    );
  };

  const currentData = activeTab.includes("weekly") ? weeklyData : monthlyData;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Previews</h1>
          <p className="text-gray-600">
            View user records based on start dates and completion dates
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl p-2 shadow-sm border mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation and Content */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {/* Navigation Controls */}
          {activeTab.includes("weekly") ? (
            <WeekNavigation />
          ) : (
            <MonthNavigation />
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          )}

          {/* Data Grid */}
          {!loading && (
            <>
              {currentData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentData.map((user) => (
                    <UserCard key={user._id} user={user} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Records Found
                  </h3>
                  <p className="text-gray-500">
                    No {activeTab.includes("start") ? "starts" : "completions"}{" "}
                    found for the selected period.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Summary */}
          {!loading && currentData.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <div className="bg-emerald-50 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-800 mb-2">Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-emerald-600">Total Records:</span>
                    <p className="font-semibold text-emerald-800">
                      {currentData.length}
                    </p>
                  </div>
                  <div>
                    <span className="text-emerald-600">Total Amount:</span>
                    <p className="font-semibold text-emerald-800">
                      ₹
                      {currentData
                        .reduce((sum, user) => sum + (user.chitAmount || 0), 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-emerald-600">Weekly Plans:</span>
                    <p className="font-semibold text-emerald-800">
                      {
                        currentData.filter((user) => user.tenureType === "week")
                          .length
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-emerald-600">Monthly Plans:</span>
                    <p className="font-semibold text-emerald-800">
                      {
                        currentData.filter(
                          (user) => user.tenureType === "month"
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Previews;
