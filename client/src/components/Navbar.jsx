import React, { useState } from "react";

const Navbar = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "create", label: "Create User", icon: "👤" },
    { id: "users", label: "All Users", icon: "📋" },
    { id: "payments", label: "Record Payment", icon: "💳" },
    { id: "previews", label: "Previews", icon: "💳" },
  ];

  const handleProfileClick = () => {
    setIsProfilePopupOpen(true);
    setAccessCode("");
    setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (accessCode === "AnandMaster") {
      setActiveTab("AnandMaster");
      setIsProfilePopupOpen(false);
      setAccessCode("");
      setErrorMessage("");
    } else {
      setErrorMessage("Don't try to act smart, you don't have access to it");
      setAccessCode("");
    }
  };

  const handleClosePopup = () => {
    setIsProfilePopupOpen(false);
    setAccessCode("");
    setErrorMessage("");
  };

  return (
    <nav className="bg-[#BFBDB0] shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div
                onClick={handleProfileClick}
                className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg border border-emerald-500/30"
              >
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <div className="absolute -inset-1 bg-emerald-100 rounded-xl blur-sm opacity-50"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Anand Funds</h1>
              <p className="text-xs text-gray-600 font-medium">
                Payment Management
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                }`}
              >
                {/* Active indicator bar */}
                {activeTab === item.id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-emerald-500 rounded-full"></div>
                )}

                <span
                  className={`text-lg transition-transform duration-300 group-hover:scale-110 ${
                    activeTab === item.id ? "scale-110" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-semibold text-sm whitespace-nowrap">
                  {item.label}
                </span>

                {/* Hover effect */}
                <div
                  className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                    activeTab === item.id
                      ? "bg-emerald-500 opacity-5"
                      : "bg-gray-500 opacity-0 group-hover:opacity-5"
                  }`}
                ></div>
              </button>
            ))}
          </div>

          {/* User Profile / Action Button */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={handleProfileClick}
              className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center border border-emerald-500/30 shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              <span className="text-white text-sm font-bold">A</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isMobileMenuOpen
                  ? "bg-gray-100 text-gray-700 border border-gray-200"
                  : "text-gray-600 hover:bg-gray-50 border border-transparent"
              }`}
            >
              <div className="w-6 h-6 relative">
                <span
                  className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? "rotate-45 top-3" : "top-2"
                  }`}
                ></span>
                <span
                  className={`absolute block w-6 h-0.5 bg-current top-3 transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? "-rotate-45 top-3" : "top-4"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-gray-50 rounded-2xl border border-gray-200 mt-2 p-2 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                }`}
              >
                <span
                  className={`text-lg transition-transform duration-300 ${
                    activeTab === item.id
                      ? "scale-110"
                      : "group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-semibold text-sm flex-1 text-left">
                  {item.label}
                </span>
                {activeTab === item.id && (
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Popup */}
      {isProfilePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Admin Access</h3>
              <button
                onClick={handleClosePopup}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="accessCode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter Access Code
                </label>
                <input
                  type="password"
                  id="accessCode"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  placeholder="Enter access code..."
                  autoFocus
                />
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 font-medium shadow-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
