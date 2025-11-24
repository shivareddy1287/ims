import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import CreateUser from "./components/CreateUser";
import UserList from "./components/UserList";
import PaymentHistory from "./components/PaymentHistory";
import RecordPayment from "./components/RecordPayment";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "create":
        return <CreateUser setActiveTab={setActiveTab} />;
      case "users":
        return <UserList />;
      case "payments":
        return <RecordPayment />;
      case "history":
        return <PaymentHistory />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  );
}

export default App;
