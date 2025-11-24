import React, { useState } from "react";

const Navbar = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "create", label: "Create User", icon: "👤" },
    { id: "users", label: "All Users", icon: "📋" },
    { id: "payments", label: "Record Payment", icon: "💳" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl blur-sm opacity-30"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Anand Funds</h1>
              <p className="text-xs text-emerald-600 font-medium">
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
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-emerald-600 rounded-full"></div>
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
                      : "bg-gray-200 opacity-0 group-hover:opacity-50"
                  }`}
                ></div>
              </button>
            ))}
          </div>

          {/* User Profile / Action Button */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center border border-emerald-200">
              <span className="text-emerald-700 text-sm font-bold">A</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isMobileMenuOpen
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "text-gray-600 hover:bg-gray-100 border border-transparent"
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
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 mt-2 p-2 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? "bg-white text-emerald-700 shadow-sm border border-emerald-200"
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
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
