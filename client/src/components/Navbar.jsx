import React, { useState } from "react";

const Navbar = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "create", label: "Create User", icon: "👤" },
    { id: "users", label: "All Users", icon: "📋" },
    { id: "payments", label: "Record Payment", icon: "💳" },
    { id: "previews", label: "Previews", icon: "💳" },
  ];

  return (
    <nav className="bg-gradient-to-r from-emerald-600 to-green-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <div className="absolute -inset-1 bg-white/20 rounded-xl blur-sm opacity-50"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Anand Funds</h1>
              <p className="text-xs text-emerald-100 font-medium">
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
                    ? "bg-white/20 text-white border border-white/30 shadow-lg backdrop-blur-sm"
                    : "text-emerald-100 hover:bg-white/10 hover:text-white border border-transparent"
                }`}
              >
                {/* Active indicator bar */}
                {activeTab === item.id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-white rounded-full"></div>
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
                      ? "bg-white opacity-10"
                      : "bg-white opacity-0 group-hover:opacity-10"
                  }`}
                ></div>
              </button>
            ))}
          </div>

          {/* User Profile / Action Button */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
              <span className="text-white text-sm font-bold">A</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isMobileMenuOpen
                  ? "bg-white/20 text-white border border-white/30"
                  : "text-emerald-100 hover:bg-white/10 border border-transparent"
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
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 mt-2 p-2 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? "bg-white/30 text-white shadow-sm border border-white/30"
                    : "text-emerald-100 hover:bg-white/10 hover:text-white"
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
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
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
