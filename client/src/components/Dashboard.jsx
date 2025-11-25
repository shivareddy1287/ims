// import React, { useState, useEffect } from "react";
// import { userPaymentAPI } from "../services/api";

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     activeUsers: 0,
//     completedUsers: 0,
//     totalRevenue: 0,
//   });
//   const [recentUsers, setRecentUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const response = await userPaymentAPI.getAll();

//       if (response.data.success) {
//         const users = response.data.data;
//         const totalUsers = users.length;
//         const activeUsers = users.filter(
//           (user) => user.status === "active"
//         ).length;
//         const completedUsers = users.filter(
//           (user) => user.status === "completed"
//         ).length;
//         const totalRevenue = users.reduce(
//           (sum, user) => sum + (user.totalPaidAmount || 0),
//           0
//         );

//         setStats({
//           totalUsers,
//           activeUsers,
//           completedUsers,
//           totalRevenue,
//         });

//         setRecentUsers(users.slice(0, 5));
//       }
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const StatCard = ({ title, value, subtitle, icon, trend, color }) => (
//     <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] group">
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
//             {title}
//           </p>
//           <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
//           {subtitle && (
//             <p className="text-xs text-gray-500 mt-1 font-medium">{subtitle}</p>
//           )}
//         </div>
//         <div
//           className={`w-14 h-14 rounded-xl ${color.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}
//         >
//           <span className="text-2xl">{icon}</span>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-96">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
//           <p className="text-gray-600 mt-4 font-medium">
//             Loading dashboard data...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8 p-6">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//         <div>
//           <h1 className="text-4xl font-bold text-gray-900">
//             Dashboard Overview
//           </h1>
//           <p className="text-gray-600 mt-2 text-lg">
//             Welcome to ChitFund Management System
//           </p>
//         </div>
//         <button
//           onClick={fetchDashboardData}
//           className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 font-semibold group"
//         >
//           <span className="group-hover:rotate-180 transition-transform duration-500">
//             🔄
//           </span>
//           <span>Refresh Data</span>
//         </button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Users"
//           value={stats.totalUsers.toLocaleString()}
//           subtitle="All registered members"
//           icon="👥"
//           trend={{
//             value: "+12%",
//             label: "from last month",
//             color: "text-emerald-600",
//           }}
//           color={{
//             bg: "bg-emerald-100 text-emerald-600",
//             progress: "bg-emerald-500 w-3/4",
//           }}
//         />
//         <StatCard
//           title="Active Users"
//           value={stats.activeUsers.toLocaleString()}
//           subtitle="Currently paying"
//           icon="✅"
//           trend={{
//             value: "+8%",
//             label: "active growth",
//             color: "text-green-600",
//           }}
//           color={{
//             bg: "bg-green-100 text-green-600",
//             progress: "bg-green-500 w-2/3",
//           }}
//         />
//         <StatCard
//           title="Completed"
//           value={stats.completedUsers.toLocaleString()}
//           subtitle="Fully paid members"
//           icon="🎯"
//           trend={{
//             value: "+15%",
//             label: "completions",
//             color: "text-blue-600",
//           }}
//           color={{
//             bg: "bg-blue-100 text-blue-600",
//             progress: "bg-blue-500 w-1/2",
//           }}
//         />
//         <StatCard
//           title="Total Revenue"
//           value={`₹${stats.totalRevenue.toLocaleString()}`}
//           subtitle="Total collected amount"
//           icon="💰"
//           trend={{
//             value: "+22%",
//             label: "revenue growth",
//             color: "text-amber-600",
//           }}
//           color={{
//             bg: "bg-amber-100 text-amber-600",
//             progress: "bg-amber-500 w-4/5",
//           }}
//         />
//       </div>

//       {/* Recent Users Section */}
//       <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
//         <div className="px-6 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
//               <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
//               <span>Recent Users</span>
//             </h2>
//             <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
//               {recentUsers.length} users
//             </span>
//           </div>
//         </div>

//         <div className="p-6">
//           {recentUsers.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-3xl">👥</span>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 No Users Found
//               </h3>
//               <p className="text-gray-600 max-w-sm mx-auto">
//                 Create your first user to start managing chit fund payments.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {recentUsers.map((user, index) => (
//                 <div
//                   key={user._id}
//                   className="flex items-center justify-between p-4 border border-emerald-50 rounded-xl hover:bg-emerald-50 transition-all duration-300 group hover:border-emerald-200"
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div className="relative">
//                       <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
//                         <span className="text-white font-semibold text-sm">
//                           {user.memberName?.charAt(0) || "U"}
//                         </span>
//                       </div>
//                       <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
//                         <span className="text-white text-xs">✓</span>
//                       </div>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
//                         {user.memberName}
//                       </h3>
//                       <p className="text-sm text-gray-500 flex items-center space-x-2 mt-1">
//                         <span>🆔 {user.aadharNumber}</span>
//                         <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
//                         <span>₹{user.chitAmount?.toLocaleString()}</span>
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <span
//                       className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
//                         user.status === "active"
//                           ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
//                           : user.status === "completed"
//                           ? "bg-blue-100 text-blue-800 border border-blue-200"
//                           : "bg-gray-100 text-gray-800 border border-gray-200"
//                       }`}
//                     >
//                       {user.status}
//                     </span>
//                     <p className="text-xs text-gray-500 mt-2">
//                       Joined recently
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* View All Button */}
//         {recentUsers.length > 0 && (
//           <div className="px-6 py-4 border-t border-emerald-100 bg-gray-50">
//             <button className="w-full text-center text-emerald-600 font-semibold py-2 rounded-lg hover:bg-white transition-colors duration-300 border border-transparent hover:border-emerald-200">
//               View All Users →
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect } from "react";
import { userPaymentAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    completedUsers: 0,
    totalRevenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();

    // Set up continuous icon rotation interval
    const interval = setInterval(() => {
      // This will trigger re-renders for rotating icons
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true);
      const response = await userPaymentAPI.getAll();

      if (response.data.success) {
        const users = response.data.data;
        const totalUsers = users.length;
        const activeUsers = users.filter(
          (user) => user.status === "active"
        ).length;
        const completedUsers = users.filter(
          (user) => user.status === "completed"
        ).length;
        const totalRevenue = users.reduce(
          (sum, user) => sum + (user.totalPaidAmount || 0),
          0
        );

        setStats({
          totalUsers,
          activeUsers,
          completedUsers,
          totalRevenue,
        });
        setRecentUsers(users.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
      className="relative overflow-hidden rounded-3xl p-8 group cursor-pointer glass-morphism"
    >
      {/* Animated Gradient Background */}
      <div
        className={`absolute inset-0 ${color.gradient} opacity-90 group-hover:opacity-100 transition-all duration-700`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>

        {/* Floating bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white/40 rounded-full"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                scale: 0,
              }}
              animate={{
                x: [null, Math.random() * 100],
                y: [null, Math.random() * 100],
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-bold text-white/90 uppercase tracking-wider">
              {title}
            </p>
            <p className="text-4xl font-black text-white mt-4 mb-2 drop-shadow-lg">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm font-semibold text-white/80">{subtitle}</p>
            )}
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-white/30"
          >
            <span className="text-2xl">{icon}</span>
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/50 rounded-full mt-4 overflow-hidden">
          <motion.div
            className={`h-full ${color.accent}`}
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      </div>
    </motion.div>
  );

  const UserCard = ({ user, index }) => (
    <motion.div
      whileHover={{ x: 10, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl p-6 cursor-pointer glass-morphism"
    >
      {/* Gradient background based on status */}
      <div
        className={`absolute inset-0 ${
          user.status === "active"
            ? "bg-gradient-to-r from-emerald-400 to-cyan-500"
            : user.status === "completed"
            ? "bg-gradient-to-r from-blue-400 to-purple-500"
            : "bg-gradient-to-r from-gray-400 to-slate-500"
        } opacity-90 group-hover:opacity-100 transition-all duration-500`}
      >
        {/* Animated shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

        {/* Floating bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                scale: 0,
              }}
              animate={{
                x: [null, Math.random() * 100],
                y: [null, Math.random() * 100],
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.1 }} className="relative">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
              <span className="text-white font-bold text-lg">
                {user.memberName?.charAt(0) || "U"}
              </span>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-emerald-500 flex items-center justify-center"
            >
              <span className="text-emerald-600 text-xs font-bold">✓</span>
            </motion.div>
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg group-hover:text-white/90 transition-colors">
              {user.memberName}
            </h3>
            <p className="text-white/80 text-sm flex items-center space-x-2 mt-1">
              <span>🆔 {user.aadharNumber}</span>
              <span className="w-1 h-1 bg-white/50 rounded-full"></span>
              <span>₹{user.chitAmount?.toLocaleString()}</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <motion.span
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm border ${
              user.status === "active"
                ? "bg-white/20 text-white border-white/30"
                : user.status === "completed"
                ? "bg-white/20 text-white border-white/30"
                : "bg-white/20 text-white border-white/30"
            }`}
          >
            {user.status}
          </motion.span>
          <p className="text-white/70 text-xs mt-2">Joined recently</p>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
          ></motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-600 text-lg font-semibold"
          >
            Loading dashboard data...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8   min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-5xl  bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent font-bold">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-3 text-xl font-medium">
            Welcome to ChitFund Management System
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchDashboardData}
          disabled={isRefreshing}
          className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-3 font-bold group disabled:opacity-50 glass-morphism"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <motion.span
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
            className="relative z-10 text-xl"
          >
            🔄
          </motion.span>
          <span className="relative z-10">
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </span>
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          subtitle="All registered members"
          icon="👥"
          color={{
            gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
            accent: "bg-cyan-300",
          }}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          subtitle="Currently paying"
          icon="✅"
          color={{
            gradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
            accent: "bg-lime-300",
          }}
        />
        <StatCard
          title="Completed"
          value={stats.completedUsers.toLocaleString()}
          subtitle="Fully paid members"
          icon="🎯"
          color={{
            gradient: "bg-gradient-to-br from-blue-500 to-indigo-500",
            accent: "bg-cyan-300",
          }}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          subtitle="Total collected amount"
          icon="💰"
          color={{
            gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
            accent: "bg-yellow-300",
          }}
        />
      </div>

      {/* Recent Users Section */}
      <div className="relative overflow-hidden rounded-3xl glass-morphism shadow-2xl border border-white/50">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200/30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/20 rounded-full translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 px-8 py-6 border-b border-white/30 bg-gradient-to-r from-white/50 to-transparent backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 flex items-center space-x-4">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-12 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"
              ></motion.span>
              <span>Recent Users</span>
            </h2>
            <span className="text-sm font-black text-emerald-600 bg-emerald-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-200">
              {recentUsers.length} users
            </span>
          </div>
        </div>

        <div className="relative z-10 bg-gray-200 p-8">
          <AnimatePresence>
            {recentUsers.length === 0 ? (
              <div className="text-center py-16">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg glass-morphism"
                >
                  <span className="text-4xl">👥</span>
                </motion.div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  No Users Found
                </h3>
                <p className="text-gray-600 max-w-sm mx-auto text-lg">
                  Create your first user to start managing chit fund payments.
                </p>
              </div>
            ) : (
              <div className="space-y-4 ">
                {recentUsers.map((user, index) => (
                  <UserCard key={user._id} user={user} index={index} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* View All Button */}
        {recentUsers.length > 0 && (
          <div className="relative z-10 px-8 py-6 border-t border-white/30 bg-gradient-to-r from-transparent to-white/20 backdrop-blur-sm">
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-4 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 group glass-morphism"
            >
              <span>View All Users</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-lg"
              >
                →
              </motion.span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Add CSS for glass morphism */}
      <style jsx>{`
        .glass-morphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
