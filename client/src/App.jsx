import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import CreateUser from "./components/CreateUser";
import UserList from "./components/UserList";
import PaymentHistory from "./components/PaymentHistory";
import RecordPayment from "./components/RecordPayment";
import Previews from "./components/Previews";
import UserUpdate from "./components/UpdateUser";

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
      case "previews":
        return <Previews />;
      case "AnandMaster":
        return <UserUpdate />;
      default:
        return <Dashboard />;
    }
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-red-400 via-orange-400 via-yellow-400 via-green-400 via-teal-400 via-blue-400 via-indigo-400 via-purple-400 via-pink-400 to-red-400">
    //   <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    //   <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    // </div>
    // <div className="min-h-screen bg-gradient-to-br from-blue-400 via-teal-400 via-cyan-400 via-sky-400 via-blue-500 via-indigo-400 via-purple-400 via-violet-400 via-lightBlue-400 to-blue-400">
    //   {/* Your content */}
    //   <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    //   <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    // </div>
    // <div className="min-h-screen bg-gradient-to-br from-red-400 via-orange-400 via-amber-400 via-yellow-400 via-pink-400 via-rose-400 via-red-500 via-orange-300 via-yellow-300 to-red-400">
    //   {/* Your content */}
    //   <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    //   <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    // </div>

    // <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-400 via-lime-400 via-teal-400 via-green-500 via-emerald-500 via-lime-300 via-teal-300 via-green-300 to-green-400">
    //   {/* Your content */}
    //   <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    //   <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    // </div>

    // <div className="min-h-screen bg-gradient-to-br from-purple-400 via-violet-400 via-indigo-400 via-purple-500 via-violet-500 via-fuchsia-400 via-pink-400 via-purple-300 via-violet-300 to-purple-400">
    //   {/* Your content */}
    //   <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    //   <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    // </div>

    // <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 via-amber-500 via-red-400 via-orange-400 via-amber-400 via-red-600 via-orange-600 via-yellow-500 to-red-500">
    //   {/* Your content */}
    //   <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    //   <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    // </div>

    // <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 via-blue-500 via-cyan-400 via-purple-600 via-pink-600 via-blue-600 via-cyan-300 via-purple-400 to-purple-500">
    //   {/* Your content */}
    //   <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    //   <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    // </div>

    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-400 via-lime-400 via-teal-400 via-green-500 via-emerald-500 via-lime-300 via-teal-300 via-green-300 to-green-400">
      {/* Your content */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    </div>

    // <div
    //   className="min-h-screen"
    //   style={{
    //     backgroundImage:
    //       "url('https://res.cloudinary.com/dzrc9ejln/image/upload/v1764046321/Gemini_Generated_Image_x7uecox7uecox7ue_yimyd1.png')",
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //     backgroundRepeat: "no-repeat",
    //   }}
    // >
    //   {/* Your content */}
    //   <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    //   <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    // </div>
  );
}

export default App;
