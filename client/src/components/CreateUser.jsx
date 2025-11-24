import React, { useState } from "react";
import { userPaymentAPI } from "../services/api";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    memberName: "",
    aadharNumber: "",
    phoneNumber: "",
    address: "", // Changed from object to string
    chitAmount: "",
    tenure: "",
    tenureType: "week", // Added tenure type with default value "week"
    startDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await userPaymentAPI.create(formData);

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "User created successfully!",
        });
        setFormData({
          memberName: "",
          aadharNumber: "",
          phoneNumber: "",
          address: "",
          chitAmount: "",
          tenure: "",
          tenureType: "week",
          startDate: new Date().toISOString().split("T")[0],
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to create user",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
          <p className="text-gray-600 mt-2">
            Add a new member to the chitfund scheme
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
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Name *
              </label>
              <input
                type="text"
                name="memberName"
                value={formData.memberName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhar Number *
              </label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                required
                pattern="[0-9]{12}"
                maxLength="12"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="12-digit Aadhar number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                maxLength="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="10-digit phone number"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Address Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter complete address including street, city, state, and PIN code"
              />
            </div>
          </div>

          {/* Chitfund Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chitfund Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chit Amount (₹) *
                </label>
                <input
                  type="number"
                  name="chitAmount"
                  value={formData.chitAmount}
                  onChange={handleChange}
                  required
                  min="1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., 50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tenure *
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      name="tenure"
                      value={formData.tenure}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., 12"
                    />
                  </div>
                  <div className="flex-1">
                    <select
                      name="tenureType"
                      value={formData.tenureType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="week">Weeks</option>
                      <option value="month">Months</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>👤</span>
                  <span>Create User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
