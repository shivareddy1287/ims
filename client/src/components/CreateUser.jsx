import React, { useState } from "react";
import { userPaymentAPI } from "../services/api";

const CreateUser = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({
    memberName: "",
    aadharNumber: "",
    phoneNumber: "",
    address: "",
    chitAmount: "",
    tenure: "",
    tenureType: "week",
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
          text: "User created successfully! Redirecting to users list...",
        });
        setActiveTab("users");
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
        text:
          error.response?.data?.message ||
          "Failed to create user. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">👤</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Create New Member
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Add a new member to the chit fund scheme
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4 mt-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <span className="text-sm font-semibold text-emerald-600">
              Personal Info
            </span>
          </div>
          <div className="w-8 h-0.5 bg-emerald-200"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-200 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <span className="text-sm font-semibold text-gray-500">Address</span>
          </div>
          <div className="w-8 h-0.5 bg-emerald-200"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-200 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <span className="text-sm font-semibold text-gray-500">
              Chit Details
            </span>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-white px-8 py-6 border-b border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Member Registration Form
              </h2>
              <p className="text-emerald-600 mt-1">
                Fill in the details below to register a new member
              </p>
            </div>
            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
              Required *
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mx-8 mt-6 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  message.type === "success" ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Member Name <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="text"
                  name="memberName"
                  value={formData.memberName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Aadhar Number <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{12}"
                  maxLength="12"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
                  placeholder="12-digit Aadhar number"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Phone Number <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
                  placeholder="10-digit phone number"
                />
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="space-y-6 pt-8 border-t border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900">
                Address Information
              </h3>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Full Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400 resize-none"
                placeholder="Enter complete address including street, city, state, and PIN code"
              />
            </div>
          </div>

          {/* Chitfund Details Section */}
          <div className="space-y-6 pt-8 border-t border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900">
                Chit Fund Details
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Chit Amount (₹) <span className="text-emerald-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="chitAmount"
                    value={formData.chitAmount}
                    onChange={handleChange}
                    required
                    min="1000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Tenure <span className="text-emerald-500">*</span>
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      name="tenure"
                      value={formData.tenure}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
                      placeholder="e.g., 12"
                    />
                  </div>
                  <div className="flex-1">
                    <select
                      name="tenureType"
                      value={formData.tenureType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400 appearance-none"
                    >
                      <option value="week">Weeks</option>
                      <option value="month">Months</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Start Date <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Submit Button Section */}
          <div className="flex justify-end pt-8 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-10 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-3 font-semibold text-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Member...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">👤</span>
                  <span>Create Member</span>
                  <span className="text-lg">→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-white text-sm">💡</span>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Quick Tips</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Ensure all required fields marked with * are filled</li>
              <li>• Verify Aadhar and phone numbers before submission</li>
              <li>• Double-check the chit amount and tenure details</li>
              <li>• Member will be activated immediately after creation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
