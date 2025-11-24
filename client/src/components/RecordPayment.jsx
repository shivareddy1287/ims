import React, { useState, useEffect } from "react";
import { userPaymentAPI } from "../services/api";

const UpcomingPayments = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [paymentType, setPaymentType] = useState("week"); // Default to weekly
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [recordingPayment, setRecordingPayment] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUpcomingPayments();
  }, [users, paymentType, currentDate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userPaymentAPI.getAll();
      if (response.data.success) {
        setUsers(response.data.data.filter((user) => user.status === "active"));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get Sunday of the current week
  const getSundayOfWeek = (date) => {
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - date.getDay());
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

  // Calculate week number from start date
  const getWeekNumber = (startDate, currentSunday) => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const startSunday = getSundayOfWeek(start);

    // If start date is after the calculated start Sunday, use the next Sunday
    if (start > startSunday) {
      startSunday.setDate(startSunday.getDate() + 7);
    }

    const diffTime = currentSunday - startSunday;
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks + 1; // Week numbers start from 1
  };

  // Calculate month number from start date
  const getMonthNumber = (startDate, currentFirst) => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const startFirst = getFirstOfMonth(start);

    const diffMonths =
      (currentFirst.getFullYear() - startFirst.getFullYear()) * 12 +
      (currentFirst.getMonth() - startFirst.getMonth());
    return diffMonths + 1; // Month numbers start from 1
  };

  // Check if user should pay for current period
  const shouldPayForPeriod = (user) => {
    if (paymentType === "week") {
      const currentSunday = getSundayOfWeek(currentDate);
      const weekNumber = getWeekNumber(user.startDate, currentSunday);

      // Check if this week is within tenure and after start date
      const isValidWeek = weekNumber >= 1 && weekNumber <= user.tenure;
      const hasStarted = currentSunday >= new Date(user.startDate);

      return isValidWeek && hasStarted;
    } else {
      const currentFirst = getFirstOfMonth(currentDate);
      const monthNumber = getMonthNumber(user.startDate, currentFirst);

      // Check if this month is within tenure and after start date
      const isValidMonth = monthNumber >= 1 && monthNumber <= user.tenure;
      const hasStarted =
        currentFirst >= getFirstOfMonth(new Date(user.startDate));

      return isValidMonth && hasStarted;
    }
  };

  // Get current period number for user
  const getCurrentPeriodNumber = (user) => {
    if (paymentType === "week") {
      const currentSunday = getSundayOfWeek(currentDate);
      return getWeekNumber(user.startDate, currentSunday);
    } else {
      const currentFirst = getFirstOfMonth(currentDate);
      return getMonthNumber(user.startDate, currentFirst);
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

      return `Week: ${sunday.toLocaleDateString()}`;
    } else {
      const first = getFirstOfMonth(currentDate);
      const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);

      return `Month: ${first.toLocaleDateString("en-US", {
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

  const handleRecordPayment = async (userId) => {
    try {
      setRecordingPayment(userId);
      const user = users.find((u) => u._id === userId);
      if (!user) return;

      const periodNumber = getCurrentPeriodNumber(user);

      const paymentData = {
        monthNumbers: [periodNumber],
        amount: user.monthlyPremium,
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
        status: "paid",
        dueDate:
          paymentType === "week"
            ? getSundayOfWeek(currentDate).toISOString().split("T")[0]
            : getFirstOfMonth(currentDate).toISOString().split("T")[0],
      };

      const response = await userPaymentAPI.recordPayment(userId, paymentData);

      if (response.data.success) {
        // Refresh the list
        await fetchUsers();

        // Show success message
        alert(
          `Payment recorded successfully for ${user.memberName} - ${
            paymentType === "week" ? "Week" : "Month"
          } ${periodNumber}`
        );
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
        // Refresh the list
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
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Collection
          </h1>
          <p className="text-gray-600 mt-2">
            Complete payment management system
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Payment Type Filter and Navigation */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type
            </label>
            <select
              value={paymentType}
              onChange={(e) => {
                setPaymentType(e.target.value);
                setCurrentDate(new Date());
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="week">Weekly (Sunday)</option>
              <option value="month">Monthly (1st)</option>
            </select>
          </div>

          <div className="flex-1 text-center">
            <div className="text-lg font-semibold text-gray-900">
              {getCurrentPeriodDisplay()}
            </div>
            <div className="text-sm text-gray-600">
              Collection day:{" "}
              {paymentType === "week" ? "Sunday" : "1st of the month"}
              {!isCurrentPeriod() && (
                <span
                  className={`ml-2 ${
                    isPastPeriod() ? "text-red-600" : "text-orange-600"
                  }`}
                >
                  ({isPastPeriod() ? "Past Period" : "Future Period"})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ◀ Prev
            </button>
            <button
              onClick={goToToday}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={goToNext}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {filteredUsers.length}
          </div>
          <div className="text-sm text-gray-600">Total Due</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {
              filteredUsers.filter((user) => getPaymentStatus(user) === "paid")
                .length
            }
          </div>
          <div className="text-sm text-gray-600">Paid</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {
              filteredUsers.filter(
                (user) => getPaymentStatus(user) === "unpaid"
              ).length
            }
          </div>
          <div className="text-sm text-gray-600">Unpaid</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredUsers.length > 0
              ? Math.round(
                  (filteredUsers.filter(
                    (user) => getPaymentStatus(user) === "paid"
                  ).length /
                    filteredUsers.length) *
                    100
                )
              : 0}
            %
          </div>
          <div className="text-sm text-gray-600">Collection Rate</div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">
              {paymentType === "week" ? "📅" : "📊"}
            </div>
            <p className="text-lg">No payments due for this period</p>
            <p className="text-sm mt-1">
              {paymentType === "week"
                ? "No weekly payments due for this week"
                : "No monthly payments due for this month"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment History
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
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
                      className={`hover:bg-gray-50 transition-colors ${
                        status === "paid" ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold">
                              {user.memberName?.charAt(0) || "U"}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.memberName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Started:{" "}
                              {new Date(user.startDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.phoneNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          Aadhar: {user.aadharNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{user.monthlyPremium}
                        </div>
                        <div className="text-sm text-gray-500">
                          {paymentType === "week" ? "Week" : "Month"}{" "}
                          {periodNumber} of {user.tenure}
                        </div>
                        <div className="text-xs text-gray-400">
                          Due: {paymentType === "week" ? "Sunday" : "1st"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {paymentHistory.slice(0, 12).map((period, index) => (
                            <div
                              key={index}
                              className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                                period.periodNumber === periodNumber
                                  ? "bg-blue-500 text-white"
                                  : period.status === "paid"
                                  ? "bg-green-500 text-white"
                                  : period.status === "partial"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-gray-300 text-gray-600"
                              }`}
                              title={`${
                                paymentType === "week" ? "Week" : "Month"
                              } ${period.periodNumber}: ${
                                period.status === "paid"
                                  ? "Paid"
                                  : period.status === "partial"
                                  ? "Partial"
                                  : "Unpaid"
                              }`}
                            >
                              {period.periodNumber}
                            </div>
                          ))}
                          {paymentHistory.length > 12 && (
                            <div className="text-xs text-gray-500">
                              +{paymentHistory.length - 12} more
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {paidPeriods.length}/{user.tenure} paid
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {status === "paid" ? "Paid" : "Unpaid"}
                          {currentPayment?.status === "partial" && " (Partial)"}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Total Paid: ₹{user.totalPaidAmount || 0}
                        </div>
                        {currentPayment?.status === "partial" && (
                          <div className="text-xs text-yellow-600 mt-1">
                            Paid: ₹{currentPayment.amount} of ₹
                            {user.monthlyPremium}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {status === "unpaid" && (
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => handleRecordPayment(user._id)}
                              disabled={recordingPayment === user._id}
                              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-1"
                            >
                              {recordingPayment === user._id ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                  <span>Processing...</span>
                                </>
                              ) : (
                                <>
                                  <span>💳</span>
                                  <span>
                                    Mark Paid (₹{user.monthlyPremium})
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                        {status === "paid" && (
                          <span className="text-green-600 flex items-center space-x-1">
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
