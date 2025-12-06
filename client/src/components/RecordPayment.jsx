import React, { useState, useEffect } from "react";
import { userPaymentAPI } from "../services/api";

const UpcomingPayments = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [paymentType, setPaymentType] = useState("week"); // Default to weekly
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [recordingPayment, setRecordingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search

  // New state for financial summary
  const [financialSummary, setFinancialSummary] = useState({
    totalCollected: 0,
    totalDue: 0,
    remainingToCollect: 0,
    collectionRate: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUpcomingPayments();
    calculateFinancialSummary();
  }, [users, paymentType, currentDate, filteredUsers, searchTerm]); // Added searchTerm dependency

  const fetchUsers = async (isToLoad) => {
    try {
      if (!isToLoad) setLoading(true);
      const response = await userPaymentAPI.getAll();
      if (response.data.success) {
        setUsers(response.data.data.filter((user) => user.status === "active"));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      if (!isToLoad) setLoading(false);
    }
  };

  // Search filter function
  const filterBySearch = (user) => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      user.memberName?.toLowerCase().includes(term) ||
      user.phoneNumber?.includes(term) ||
      user.aadharNumber?.includes(term)
    );
  };

  // Calculate financial summary for current period
  const calculateFinancialSummary = () => {
    let totalCollected = 0;
    let totalDue = 0;
    let paidCount = 0;

    filteredUsers.forEach((user) => {
      const periodNumber = getCurrentPeriodNumber(user);
      const paymentRecord = getPaymentRecordForPeriod(user, periodNumber);
      const userPremium = user.monthlyPremium || 0;

      totalDue += userPremium;

      if (paymentRecord) {
        if (paymentRecord.status === "paid") {
          totalCollected += userPremium;
          paidCount++;
        } else if (paymentRecord.status === "partial") {
          totalCollected += paymentRecord.amount;
          paidCount += paymentRecord.amount / userPremium; // Partial count
        }
      }
    });

    const remainingToCollect = totalDue - totalCollected;
    const collectionRate = totalDue > 0 ? (totalCollected / totalDue) * 100 : 0;

    setFinancialSummary({
      totalCollected,
      totalDue,
      remainingToCollect,
      collectionRate: Math.round(collectionRate),
    });
  };

  // Get Sunday of the current week
  const getSundayOfWeek = (date) => {
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - date.getDay()); // Sunday is day 0
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  };

  // Get first day of the month
  const getFirstOfMonth = (date) => {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    first.setHours(0, 0, 0, 0);
    return first;
  };

  // Navigation functions
  const goToPrevious = () => {
    if (paymentType === "week") {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() - 1);
      setCurrentDate(newDate);
    }
  };

  const goToNext = () => {
    if (paymentType === "week") {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() + 1);
      setCurrentDate(newDate);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calculate week number from start date to current date - SIMPLIFIED LOGIC
  const getWeekNumber = (user) => {
    if (paymentType !== "week") return 1;

    const startDate = new Date(user.startDate);
    const currentSunday = getSundayOfWeek(currentDate);
    const startSunday = getSundayOfWeek(startDate);

    // If current Sunday is before start Sunday, return 0
    if (currentSunday < startSunday) return 0;

    // Calculate difference in weeks
    const diffTime = currentSunday - startSunday;
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

    return diffWeeks;
  };

  // Calculate month number from start date
  const getMonthNumber = (user) => {
    if (paymentType !== "month") return 1;

    const startDate = new Date(user.startDate);
    const currentFirst = getFirstOfMonth(currentDate);
    const startFirst = getFirstOfMonth(startDate);

    // If current first is before start first, return 0
    if (currentFirst < startFirst) return 0;

    const diffMonths =
      (currentFirst.getFullYear() - startFirst.getFullYear()) * 12 +
      (currentFirst.getMonth() - startFirst.getMonth());

    return diffMonths + 1;
  };

  // Check if user should pay for current period - SIMPLIFIED LOGIC USING END DATE
  const shouldPayForPeriod = (user) => {
    const startDate = new Date(user.startDate);
    const endDate = new Date(user.endDate);
    const currentSunday = getSundayOfWeek(currentDate);

    if (paymentType === "week") {
      // Check if current Sunday is within the active period (startDate to endDate)
      const isWithinActivePeriod =
        currentSunday >= startDate && currentSunday <= endDate;

      // Also check if user has weekly tenure type
      const isWeeklyUser = user.tenureType === "week";

      return isWithinActivePeriod && isWeeklyUser;
    } else {
      const currentFirst = getFirstOfMonth(currentDate);
      const isWithinActivePeriod =
        currentFirst >= getFirstOfMonth(startDate) &&
        currentFirst <= getFirstOfMonth(endDate);
      const isMonthlyUser = user.tenureType === "month";

      return isWithinActivePeriod && isMonthlyUser;
    }
  };

  // Get current period number for user
  const getCurrentPeriodNumber = (user) => {
    if (paymentType === "week") {
      return getWeekNumber(user);
    } else {
      return getMonthNumber(user);
    }
  };

  // Check if user has paid for current period
  const hasPaidForPeriod = (user, periodNumber) => {
    return user.paymentRecords.some(
      (record) =>
        record.monthNumber === periodNumber &&
        (record.status === "paid" || record.status === "partial")
    );
  };

  // Get payment record for current period
  const getPaymentRecordForPeriod = (user, periodNumber) => {
    return user.paymentRecords.find(
      (record) => record.monthNumber === periodNumber
    );
  };

  const filterUpcomingPayments = () => {
    let filtered = [];

    if (paymentType === "week") {
      filtered = users.filter(
        (user) => user.tenureType === "week" && shouldPayForPeriod(user)
      );
    } else {
      filtered = users.filter(
        (user) => user.tenureType === "month" && shouldPayForPeriod(user)
      );
    }

    // Apply search filter
    filtered = filtered.filter(filterBySearch);

    // Sort: unpaid users first, then paid users
    filtered.sort((a, b) => {
      const aPeriod = getCurrentPeriodNumber(a);
      const bPeriod = getCurrentPeriodNumber(b);
      const aPaid = hasPaidForPeriod(a, aPeriod);
      const bPaid = hasPaidForPeriod(b, bPeriod);

      if (aPaid && !bPaid) return 1; // a is paid, b is unpaid -> b comes first
      if (!aPaid && bPaid) return -1; // a is unpaid, b is paid -> a comes first
      return 0; // keep original order if same status
    });

    setFilteredUsers(filtered);
  };

  const getPaymentStatus = (user) => {
    const periodNumber = getCurrentPeriodNumber(user);
    return hasPaidForPeriod(user, periodNumber) ? "paid" : "unpaid";
  };

  const getCurrentPeriodDisplay = () => {
    if (paymentType === "week") {
      const sunday = getSundayOfWeek(currentDate);
      const nextSunday = new Date(sunday);
      nextSunday.setDate(sunday.getDate() + 6);

      return `Week: ${sunday.toLocaleDateString()} `;
    } else {
      const first = getFirstOfMonth(currentDate);
      const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);

      return `${first.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })} (1st - ${last.getDate()}${getOrdinalSuffix(last.getDate())})`;
    }
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // const handleRecordPayment = async (userId) => {
  //   alert("s");
  //   try {
  //     setRecordingPayment(userId);
  //     const user = users.find((u) => u._id === userId);
  //     if (!user) return;

  //     const periodNumber = getCurrentPeriodNumber(user);
  //     alert(periodNumber);

  //     const paymentData = {
  //       monthNumbers: [periodNumber],
  //       amount: user.monthlyPremium,
  //       paymentMethod: "cash",
  //       status: "paid",
  //     };

  //     const response = await userPaymentAPI.recordPayment(userId, paymentData);

  //     if (response.data.success) {
  //       // Update the user's payment record locally without re-fetching all users
  //       setUsers((prevUsers) =>
  //         prevUsers.map((u) => {
  //           if (u._id === userId) {
  //             return {
  //               ...u,
  //               paymentRecords: [
  //                 ...u.paymentRecords,
  //                 {
  //                   ...paymentData,
  //                   paymentDate: new Date().toISOString().split("T")[0],
  //                   dueDate:
  //                     paymentType === "week"
  //                       ? getSundayOfWeek(currentDate)
  //                           .toISOString()
  //                           .split("T")[0]
  //                       : getFirstOfMonth(currentDate)
  //                           .toISOString()
  //                           .split("T")[0],
  //                 },
  //               ],
  //             };
  //           }
  //           return u;
  //         })
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error recording payment:", error);
  //     alert(
  //       "Failed to record payment: " +
  //         (error.response?.data?.message || error.message)
  //     );
  //   } finally {
  //     setRecordingPayment(null);
  //   }
  // };

  const handleRecordPayment = async (userId) => {
    try {
      setRecordingPayment(userId);
      const user = users.find((u) => u._id === userId);
      if (!user) return;

      const periodNumber = getCurrentPeriodNumber(user);

      const paymentData = {
        monthNumbers: [periodNumber],
        amount: user.monthlyPremium,
        paymentMethod: "cash",
        status: "paid",
      };

      const response = await userPaymentAPI.recordPayment(userId, paymentData);

      if (response.data.success) {
        await fetchUsers(true);
      }
    } catch (error) {
      console.error("Error recording payment:", error);
      alert(
        "Failed to record payment: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setRecordingPayment(null);
    }
  };

  const handleRecordPartialPayment = async (userId, amount) => {
    try {
      setRecordingPayment(userId);
      const user = users.find((u) => u._id === userId);
      if (!user) return;

      const periodNumber = getCurrentPeriodNumber(user);

      const paymentData = {
        monthNumbers: [periodNumber],
        amount: amount,
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
        status: "partial",
        dueDate:
          paymentType === "week"
            ? getSundayOfWeek(currentDate).toISOString().split("T")[0]
            : getFirstOfMonth(currentDate).toISOString().split("T")[0],
        remarks: `Partial payment of ₹${amount}`,
      };

      const response = await userPaymentAPI.recordPayment(userId, paymentData);

      if (response.data.success) {
        await fetchUsers();
        alert(`Partial payment of ₹${amount} recorded for ${user.memberName}`);
      }
    } catch (error) {
      console.error("Error recording partial payment:", error);
      alert("Failed to record partial payment");
    } finally {
      setRecordingPayment(null);
    }
  };

  // Check if current period is in the past/present/future
  const isCurrentPeriod = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (paymentType === "week") {
      const currentSunday = getSundayOfWeek(currentDate);
      const todaySunday = getSundayOfWeek(today);
      return currentSunday.getTime() === todaySunday.getTime();
    } else {
      const currentFirst = getFirstOfMonth(currentDate);
      const todayFirst = getFirstOfMonth(today);
      return currentFirst.getTime() === todayFirst.getTime();
    }
  };

  // Check if period is in the past
  const isPastPeriod = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (paymentType === "week") {
      const currentSunday = getSundayOfWeek(currentDate);
      const todaySunday = getSundayOfWeek(today);
      return currentSunday < todaySunday;
    } else {
      const currentFirst = getFirstOfMonth(currentDate);
      const todayFirst = getFirstOfMonth(today);
      return currentFirst < todayFirst;
    }
  };

  // Get all paid periods for user
  const getPaidPeriods = (user) => {
    return user.paymentRecords
      .filter(
        (record) => record.status === "paid" || record.status === "partial"
      )
      .map((record) => ({
        periodNumber: record.monthNumber,
        amount: record.amount,
        status: record.status,
        date: record.paymentDate,
      }))
      .sort((a, b) => a.periodNumber - b.periodNumber);
  };

  // Get payment history for user
  const getPaymentHistory = (user) => {
    const paidPeriods = getPaidPeriods(user);
    const allPeriods = [];

    for (let i = 1; i <= user.tenure; i++) {
      const paidRecord = paidPeriods.find((p) => p.periodNumber === i);
      allPeriods.push({
        periodNumber: i,
        status: paidRecord ? paidRecord.status : "unpaid",
        amount: paidRecord ? paidRecord.amount : 0,
        date: paidRecord ? paidRecord.date : null,
      });
    }

    return allPeriods;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 font-medium">
            Loading payment data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Payment Collection
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Complete payment management system
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

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Due */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-semibold">Total Due</p>
              <p className="text-3xl font-bold mt-2">
                ₹{financialSummary.totalDue.toLocaleString()}
              </p>
              <p className="text-blue-100 text-sm mt-1">
                {filteredUsers.length} members
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        {/* Collected Amount */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-semibold">
                Collected
              </p>
              <p className="text-3xl font-bold mt-2">
                ₹{financialSummary.totalCollected.toLocaleString()}
              </p>
              <p className="text-emerald-100 text-sm mt-1">
                {financialSummary.collectionRate}% collected
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        {/* Remaining to Collect */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-semibold">Remaining</p>
              <p className="text-3xl font-bold mt-2">
                ₹{financialSummary.remainingToCollect.toLocaleString()}
              </p>
              <p className="text-amber-100 text-sm mt-1">Yet to collect</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>

        {/* Collection Rate */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-semibold">
                Collection Rate
              </p>
              <p className="text-3xl font-bold mt-2">
                {financialSummary.collectionRate}%
              </p>
              <p className="text-purple-100 text-sm mt-1">Success rate</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar for Collection */}
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">
            Collection Progress
          </span>
          <span className="text-sm font-bold text-emerald-600">
            {financialSummary.collectionRate}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-4 rounded-full transition-all duration-1000 shadow-sm"
            style={{ width: `${financialSummary.collectionRate}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>₹0</span>
          <span>₹{financialSummary.totalDue.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment Type Filter, Search and Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="w-full lg:w-64">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Type
            </label>
            <select
              value={paymentType}
              onChange={(e) => {
                setPaymentType(e.target.value);
                setCurrentDate(new Date());
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
            >
              <option value="week">Weekly (Sunday)</option>
              <option value="month">Monthly (1st)</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="w-full lg:w-80">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Members
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, phone, or Aadhar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600">✕</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 text-center">
            <div className="text-xl font-bold text-gray-900">
              {getCurrentPeriodDisplay()}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Collection day:{" "}
              {paymentType === "week" ? "Sunday" : "1st of the month"}
              {!isCurrentPeriod() && (
                <span
                  className={`ml-2 font-semibold ${
                    isPastPeriod() ? "text-red-600" : "text-amber-600"
                  }`}
                >
                  ({isPastPeriod() ? "Past Period" : "Future Period"})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={goToPrevious}
              className="bg-gray-600 text-white px-4 py-3 rounded-xl hover:bg-gray-700 transition-all duration-300 shadow-sm flex items-center space-x-2"
            >
              <span>◀</span>
              <span>Prev</span>
            </button>
            <button
              onClick={goToToday}
              className="bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-sm flex items-center space-x-2"
            >
              <span>📅</span>
              <span>Today</span>
            </button>
            <button
              onClick={goToNext}
              className="bg-gray-600 text-white px-4 py-3 rounded-xl hover:bg-gray-700 transition-all duration-300 shadow-sm flex items-center space-x-2"
            >
              <span>Next</span>
              <span>▶</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
              <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
              <span>
                {paymentType === "week" ? "Weekly" : "Monthly"} Payments (
                {filteredUsers.length} members)
                {searchTerm && (
                  <span className="text-emerald-600 ml-2">
                    - Filtered by "{searchTerm}"
                  </span>
                )}
              </span>
            </h2>
            <div className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full">
              {financialSummary.collectionRate}% Collected
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">
                {paymentType === "week" ? "📅" : "📊"}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? "No Members Found" : "No Payments Due"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm
                ? "No members match your search criteria"
                : paymentType === "week"
                ? "No weekly payments due for this week"
                : "No monthly payments due for this month"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Clear Search
              </button>
            )}
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
                    Payment Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const periodNumber = getCurrentPeriodNumber(user);
                  const paymentHistory = getPaymentHistory(user);
                  const currentPayment = getPaymentRecordForPeriod(
                    user,
                    periodNumber
                  );
                  const status = getPaymentStatus(user);
                  const paidPeriods = getPaidPeriods(user);
                  const progressPercentage = Math.round(
                    (paidPeriods.length / user.tenure) * 100
                  );

                  return (
                    <tr
                      key={user._id}
                      className={`transition-all duration-300 group ${
                        status === "paid"
                          ? "bg-gray-50 hover:bg-gray-100"
                          : "hover:bg-emerald-50/50"
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                                status === "paid"
                                  ? "bg-gradient-to-br from-gray-400 to-gray-500"
                                  : "bg-gradient-to-br from-emerald-500 to-emerald-600"
                              }`}
                            >
                              <span className="text-white font-semibold text-sm">
                                {user.memberName?.charAt(0) || "U"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div
                              className={`font-semibold group-hover:text-emerald-700 transition-colors ${
                                status === "paid"
                                  ? "text-gray-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {user.memberName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center space-x-2 mt-1">
                              <span>📱 {user.phoneNumber}</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span>🆔 {user.aadharNumber}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Start:{" "}
                              {new Date(user.startDate).toLocaleDateString()} |
                              End: {new Date(user.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <div
                            className={`font-semibold text-lg ${
                              status === "paid"
                                ? "text-gray-600"
                                : "text-gray-900"
                            }`}
                          >
                            ₹{user.monthlyPremium?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {paymentType === "week" ? "Week" : "Month"}{" "}
                            {periodNumber} of {user.tenure}
                          </div>
                          <div
                            className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${
                              status === "paid"
                                ? "text-gray-600 bg-gray-100"
                                : "text-emerald-600 bg-emerald-50"
                            }`}
                          >
                            Due: {paymentType === "week" ? "Sunday" : "1st"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">
                              {paidPeriods.length}/{user.tenure} paid
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
                          <span
                            className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                              status === "paid"
                                ? "bg-gray-100 text-gray-800 border border-gray-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            <span>{status === "paid" ? "✅" : "❌"}</span>
                            <span>{status === "paid" ? "Paid" : "Unpaid"}</span>
                            {currentPayment?.status === "partial" && (
                              <span>(Partial)</span>
                            )}
                          </span>
                          {currentPayment?.status === "partial" && (
                            <div className="text-xs text-amber-600 font-medium">
                              Paid: ₹{currentPayment.amount} of ₹
                              {user.monthlyPremium}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {status === "unpaid" && (
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => handleRecordPayment(user._id)}
                              disabled={recordingPayment === user._id}
                              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2.5 rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow-md flex items-center space-x-2 font-semibold"
                            >
                              {recordingPayment === user._id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Processing...</span>
                                </>
                              ) : (
                                <>
                                  <span>💳</span>
                                  <span>Mark Paid</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                        {status === "paid" && (
                          <span className="text-gray-600 flex items-center space-x-2 font-semibold">
                            <span>✅</span>
                            <span>Collected</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingPayments;
