import React, { useState, useEffect } from "react";
import { userPaymentAPI } from "../services/api";

const PaymentHistory = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [paymentHistory, setPaymentHistory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userPaymentAPI.getAll();
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchPaymentHistory = async (userId) => {
    try {
      setLoading(true);
      const response = await userPaymentAPI.getPaymentHistory(userId);
      if (response.data.success) {
        setPaymentHistory(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    if (userId) {
      fetchPaymentHistory(userId);
    } else {
      setPaymentHistory(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { color: "bg-green-100 text-green-800", label: "Paid" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      overdue: { color: "bg-red-100 text-red-800", label: "Overdue" },
      partial: { color: "bg-blue-100 text-blue-800", label: "Partial" },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const selectedUserDetails = users.find((user) => user._id === selectedUser);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600 mt-2">
            View payment records for chitfund members
          </p>
        </div>

        {/* User Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select User
          </label>
          <select
            value={selectedUser}
            onChange={handleUserChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Choose a user...</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.memberName} (Aadhar: {user.aadharNumber})
              </option>
            ))}
          </select>
        </div>

        {selectedUserDetails && (
          <div className="bg-gray-50 rounded-lg p-4 border mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">User Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">
                  {selectedUserDetails.memberName}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Chit Amount:</span>
                <span className="ml-2 font-medium">
                  ₹{selectedUserDetails.chitAmount?.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Monthly Premium:</span>
                <span className="ml-2 font-medium">
                  ₹{selectedUserDetails.monthlyPremium}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Tenure:</span>
                <span className="ml-2 font-medium">
                  {selectedUserDetails.tenure} months
                </span>
              </div>
              <div>
                <span className="text-gray-600">Total Paid:</span>
                <span className="ml-2 font-medium">
                  ₹{selectedUserDetails.totalPaidAmount || 0}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium capitalize">
                  {selectedUserDetails.status}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Start Date:</span>
                <span className="ml-2 font-medium">
                  {formatDate(selectedUserDetails.startDate)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">End Date:</span>
                <span className="ml-2 font-medium">
                  {selectedUserDetails.endDate
                    ? formatDate(selectedUserDetails.endDate)
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {paymentHistory && !loading && (
          <div className="space-y-6">
            {/* Paid Payments */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Paid Payments ({paymentHistory.totalPaid})
              </h3>

              {paymentHistory.paidPayments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border">
                  <div className="text-4xl mb-2">💸</div>
                  <p>No payments recorded yet</p>
                </div>
              ) : (
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Month
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Method
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Transaction ID
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paymentHistory.paidPayments.map((payment, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                Month {payment.monthNumber}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-green-600">
                                ₹{payment.amount?.toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {payment.paymentDate
                                ? formatDate(payment.paymentDate)
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                              {payment.paymentMethod?.replace("_", " ")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(payment.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.transactionId || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Pending Payments */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                Pending Payments ({paymentHistory.totalPending})
              </h3>

              {paymentHistory.pendingPayments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border">
                  <div className="text-4xl mb-2">🎉</div>
                  <p>All payments are completed!</p>
                </div>
              ) : (
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Month
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paymentHistory.pendingPayments.map(
                          (payment, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  Month {payment.monthNumber}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900">
                                  ₹
                                  {selectedUserDetails?.monthlyPremium?.toLocaleString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {payment.dueDate
                                  ? formatDate(payment.dueDate)
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(payment.status)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedUser && !loading && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-lg">Select a user to view payment history</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
