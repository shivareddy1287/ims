import React, { useState, useEffect } from "react";
import { userPaymentAPI } from "../services/api";

const RecordPayment = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    monthNumbers: [],
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
    transactionId: "",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userPaymentAPI.getAll();
      if (response.data.success) {
        setUsers(response.data.data.filter((user) => user.status === "active"));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await userPaymentAPI.getById(userId);
      if (response.data.success) {
        setUserDetails(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    if (userId) {
      fetchUserDetails(userId);
    } else {
      setUserDetails(null);
    }
  };

  const handleMonthSelect = (month) => {
    setFormData((prev) => {
      const isSelected = prev.monthNumbers.includes(month);
      const newMonths = isSelected
        ? prev.monthNumbers.filter((m) => m !== month)
        : [...prev.monthNumbers, month];

      return { ...prev, monthNumbers: newMonths };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || formData.monthNumbers.length === 0) {
      setMessage({
        type: "error",
        text: "Please select a user and at least one month",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await userPaymentAPI.recordPayment(
        selectedUser,
        formData
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: `Payment recorded successfully for ${formData.monthNumbers.length} month(s)!`,
        });

        // Reset form
        setFormData({
          monthNumbers: [],
          amount: "",
          paymentDate: new Date().toISOString().split("T")[0],
          paymentMethod: "cash",
          transactionId: "",
          remarks: "",
        });

        // Refresh user details
        fetchUserDetails(selectedUser);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to record payment",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPaidMonths = () => {
    if (!userDetails) return [];
    return userDetails.paymentRecords
      .filter((record) => record.status === "paid")
      .map((record) => record.monthNumber);
  };

  const availableMonths = userDetails
    ? Array.from({ length: userDetails.tenure }, (_, i) => i + 1).filter(
        (month) => !getPaidMonths().includes(month)
      )
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Record Payment</h1>
          <p className="text-gray-600 mt-2">
            Record monthly payments for chitfund members
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User *
            </label>
            <select
              value={selectedUser}
              onChange={handleUserChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Choose a user...</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.memberName} (Aadhar: {user.aadharNumber}) - ₹
                  {user.monthlyPremium}/month
                </option>
              ))}
            </select>
          </div>

          {/* User Details */}
          {userDetails && (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-2">User Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">
                    {userDetails.memberName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Monthly Premium:</span>
                  <span className="ml-2 font-medium">
                    ₹{userDetails.monthlyPremium}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tenure:</span>
                  <span className="ml-2 font-medium">
                    {userDetails.tenure} months
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Paid Months:</span>
                  <span className="ml-2 font-medium">
                    {getPaidMonths().length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Pending Months:</span>
                  <span className="ml-2 font-medium">
                    {availableMonths.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Total Paid:</span>
                  <span className="ml-2 font-medium">
                    ₹{userDetails.totalPaidAmount || 0}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Month Selection */}
          {userDetails && availableMonths.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Months to Pay *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {availableMonths.map((month) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => handleMonthSelect(month)}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      formData.monthNumbers.includes(month)
                        ? "bg-blue-100 border-blue-500 text-blue-700 ring-2 ring-blue-200"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">Month {month}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      ₹{userDetails.monthlyPremium}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Selected: {formData.monthNumbers.length} month(s)
              </p>
            </div>
          )}

          {userDetails && availableMonths.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-700">
                All months are already paid for this user.
              </p>
            </div>
          )}

          {/* Payment Details */}
          {formData.monthNumbers.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    required
                    // min={
                    //   userDetails?.monthlyPremium * formData.monthNumbers.length
                    // }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    // placeholder={`Minimum: ₹${
                    //   userDetails
                    //     ? userDetails.monthlyPremium *
                    //       formData.monthNumbers.length
                    //     : 0
                    // }`}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentDate: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="upi">UPI</option>
                    <option value="cheque">Cheque</option>
                    <option value="card">Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={formData.transactionId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        transactionId: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="For reference"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        remarks: e.target.value,
                      }))
                    }
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <button
              type="submit"
              disabled={
                loading || !selectedUser || formData.monthNumbers.length === 0
              }
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>💳</span>
                  <span>Record Payment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordPayment;
