import React, { useState } from "react";
import { userPaymentAPI } from "../services/api";

const CreateUser = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({
    memberName: "",
    aadharNumber: "",
    phoneNumber: "",
    address: "",
    chitAmount: "",
    tenure: "12",
    tenureType: "week",
    startDate: new Date().toISOString().split("T")[0],
    reference: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Function to check if a date is Sunday
  const isSunday = (dateString) => {
    const date = new Date(dateString);
    return date.getDay() === 0; // 0 is Sunday
  };

  // Function to get next available Sunday from a given date
  const getNextSunday = (fromDate = new Date()) => {
    const date = new Date(fromDate);
    const day = date.getDay();
    const daysUntilSunday = 7 - day;
    date.setDate(date.getDate() + daysUntilSunday);
    return date.toISOString().split("T")[0];
  };

  // Function to calculate end date based on start date, tenure and tenure type
  const calculateEndDate = (startDate, tenure, tenureType) => {
    const start = new Date(startDate);
    const end = new Date(start);

    if (tenureType === "week") {
      end.setDate(start.getDate() + parseInt(tenure) * 7);
    } else if (tenureType === "month") {
      end.setMonth(start.getMonth() + parseInt(tenure) - 1);
    }

    return end.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = {
      ...formData,
      [name]: value,
    };

    // If tenure type is week and startDate is being changed, validate it's a Sunday
    if (name === "startDate" && formData.tenureType === "week" && value) {
      if (!isSunday(value)) {
        // Auto-correct to next Sunday
        updatedFormData.startDate = getNextSunday(value);
        setMessage({
          type: "info",
          text: "Start date automatically adjusted to next Sunday for weekly tenure.",
        });
      } else {
        setMessage({ type: "", text: "" });
      }
    }

    // Recalculate endDate when startDate, tenure, or tenureType changes
    if (name === "startDate" || name === "tenure" || name === "tenureType") {
      if (updatedFormData.startDate && updatedFormData.tenure) {
        updatedFormData.endDate = calculateEndDate(
          updatedFormData.startDate,
          updatedFormData.tenure,
          updatedFormData.tenureType
        );
      }
    }

    // If tenure type changes, validate start date
    if (name === "tenureType" && formData.startDate) {
      if (value === "week" && !isSunday(formData.startDate)) {
        updatedFormData.startDate = getNextSunday(formData.startDate);
        setMessage({
          type: "info",
          text: "Start date automatically adjusted to next Sunday for weekly tenure.",
        });
      }
    }

    setFormData(updatedFormData);
  };

  // Custom date filter function for the date input
  const handleDateInput = (e) => {
    const selectedDate = e.target.value;

    console.log(selectedDate, formData.tenure, formData.tenureType);

    const endDt = calculateEndDate(
      selectedDate,
      formData.tenure,
      formData.tenureType
    );
    setFormData({ ...formData, endDate: endDt });
    console.log(endDt);

    if (formData.tenureType === "week" && selectedDate) {
      if (!isSunday(selectedDate)) {
        e.target.value = getNextSunday(selectedDate);
        setFormData((prev) => ({
          ...prev,
          startDate: getNextSunday(selectedDate),
        }));
        setMessage({
          type: "info",
          text: "Start date automatically adjusted to next Sunday for weekly tenure.",
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          startDate: selectedDate,
        }));
        setMessage({ type: "", text: "" });
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        startDate: selectedDate,
      }));
    }
  };

  // Function to disable dates in calendar (only for week tenure type)
  const disableDates = (date) => {
    if (formData.tenureType === "week") {
      return !isSunday(date);
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Final validation for weekly tenure
    if (
      formData.tenureType === "week" &&
      formData.startDate &&
      !isSunday(formData.startDate)
    ) {
      setMessage({
        type: "error",
        text: "Start date must be a Sunday for weekly tenure.",
      });
      setLoading(false);
      return;
    }

    // Ensure endDate is calculated before submission
    const submissionData = { ...formData };
    if (submissionData.startDate && submissionData.tenure) {
      submissionData.endDate = calculateEndDate(
        submissionData.startDate,
        submissionData.tenure,
        submissionData.tenureType
      );
    }

    try {
      const response = await userPaymentAPI.create(submissionData);

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "User created successfully! Redirecting to users list...",
        });
        setTimeout(() => {
          setActiveTab("users");
        }, 2000);
        setFormData({
          memberName: "",
          aadharNumber: "",
          phoneNumber: "",
          address: "",
          chitAmount: "",
          tenure: "",
          tenureType: "week",
          startDate: new Date().toISOString().split("T")[0],
          reference: "",
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
    <div className="max-w-5xl mx-auto p-2">
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
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mx-8 mt-6 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : message.type === "error"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-blue-50 border-blue-200 text-blue-700"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  message.type === "success"
                    ? "bg-emerald-500"
                    : message.type === "error"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              >
                <span className="text-white text-sm">
                  {message.type === "success"
                    ? "✓"
                    : message.type === "error"
                    ? "!"
                    : "i"}
                </span>
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
                  Member Name
                </label>
                <input
                  type="text"
                  name="memberName"
                  value={formData.memberName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Aadhar Number
                </label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  pattern="[0-9]{12}"
                  maxLength="12"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
                  placeholder="12-digit Aadhar number"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
                  placeholder="10-digit phone number"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Reference
                </label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
                  placeholder="Reference person or source"
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
                  Chit Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-8 transform -translate-y-1/2 text-gray-500 font-semibold">
                    ₹
                  </span>
                  {/* <input
                    type="number"
                    name="chitAmount"
                    value={formData.chitAmount}
                    onChange={handleChange}
                    min="1000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
                    placeholder="50000"
                  /> */}
                  {/* SELECT BOX */}
                  <select
                    name="chitAmount"
                    value={formData.chitAmountType || ""}
                    onChange={(e) => {
                      const value = e.target.value;

                      setFormData((prev) => ({
                        ...prev,
                        chitAmountType: value, // stores selected option
                        chitAmount: value !== "custom" ? value : "", // reset if custom
                      }));
                    }}
                    className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-xl 
             focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
             transition-all duration-300 bg-white hover:border-gray-400"
                  >
                    <option value="">Select amount</option>
                    <option value="6000">6,000</option>
                    <option value="12000">12,000</option>
                    <option value="18000">18,000</option>
                    <option value="24000">24,000</option>
                    <option value="custom">Custom Amount</option>
                  </select>

                  {/* SHOW INPUT ONLY WHEN "custom" IS SELECTED */}
                  {formData.chitAmountType === "custom" && (
                    <input
                      type="number"
                      name="chitAmount"
                      value={formData.chitAmount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          chitAmount: e.target.value,
                        }))
                      }
                      min="1000"
                      className="w-full mt-3 pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
               focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
               transition-all duration-300 bg-white hover:border-gray-400"
                      placeholder="Enter custom amount"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Tenure
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      name="tenure"
                      value={formData.tenure}
                      onChange={handleChange}
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
                  Start Date
                  {formData.tenureType === "week" && (
                    <span className="text-blue-600 text-xs ml-2">
                      (Sundays only)
                    </span>
                  )}
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleDateInput}
                  onInput={handleDateInput}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400 ${
                    formData.tenureType === "week"
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  title={
                    formData.tenureType === "week"
                      ? "Only Sundays are allowed for weekly tenure"
                      : "Select start date"
                  }
                />
                {formData.tenureType === "week" && formData.startDate && (
                  <p className="text-xs text-blue-600 mt-1">
                    {isSunday(formData.startDate)
                      ? "✓ Selected date is a Sunday"
                      : "⚠ Date will be adjusted to next Sunday"}
                  </p>
                )}
              </div>
            </div>

            {/* Display Calculated End Date */}
            {formData.endDate && (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📅</span>
                  </div>
                  <div>
                    <p className="text-emerald-700 font-semibold">
                      Calculated End Date
                    </p>
                    <p className="text-emerald-600">
                      The chit fund will end on:{" "}
                      <strong>{formData.endDate}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
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
    </div>
  );
};

export default CreateUser;
