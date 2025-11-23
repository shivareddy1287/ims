// import React, { useState, useEffect } from "react";
// import { userPaymentAPI } from "../services/api";

// const UserList = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await userPaymentAPI.getAll();
//       if (response.data.success) {
//         setUsers(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.aadharNumber?.includes(searchTerm) ||
//       user.phoneNumber?.includes(searchTerm);
//     const matchesStatus =
//       statusFilter === "all" || user.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       active: { color: "bg-green-100 text-green-800", label: "Active" },
//       completed: { color: "bg-blue-100 text-blue-800", label: "Completed" },
//       cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
//     };

//     const config = statusConfig[status] || {
//       color: "bg-gray-100 text-gray-800",
//       label: status,
//     };

//     return (
//       <span
//         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
//       >
//         {config.label}
//       </span>
//     );
//   };

//   const handleDeleteUser = async (userId) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         await userPaymentAPI.delete(userId);
//         fetchUsers(); // Refresh the list
//       } catch (error) {
//         console.error("Error deleting user:", error);
//         alert("Failed to delete user");
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
//           <p className="text-gray-600 mt-2">
//             Manage chitfund members and their details
//           </p>
//         </div>
//         <button
//           onClick={fetchUsers}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//         >
//           <span>🔄</span>
//           <span>Refresh</span>
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-sm border p-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <input
//               type="text"
//               placeholder="Search by name, Aadhar, or phone..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             />
//           </div>
//           <div className="w-full md:w-48">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="completed">Completed</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Users Table */}
//       <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//         {filteredUsers.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             <div className="text-6xl mb-4">👥</div>
//             <p className="text-lg">No users found</p>
//             <p className="text-sm mt-1">
//               Try adjusting your search or create a new user
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Member
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Contact
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Chit Details
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredUsers.map((user) => (
//                   <tr
//                     key={user._id}
//                     className="hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                           <span className="text-blue-600 font-semibold">
//                             {user.memberName?.charAt(0) || "U"}
//                           </span>
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             {user.memberName}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             Aadhar: {user.aadharNumber}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {user.phoneNumber}
//                       </div>
//                       <div className="text-sm text-gray-500">{user.email}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">
//                         ₹{user.chitAmount?.toLocaleString()}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {user.tenure} months • ₹
//                         {user.monthlyPremium?.toLocaleString()}/month
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {getStatusBadge(user.status)}
//                       <div className="text-xs text-gray-500 mt-1">
//                         Paid: ₹{user.totalPaidAmount?.toLocaleString()}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleDeleteUser(user._id)}
//                           className="text-red-600 hover:text-red-900 transition-colors"
//                           title="Delete User"
//                         >
//                           🗑️
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Summary */}
//       {filteredUsers.length > 0 && (
//         <div className="bg-white rounded-xl shadow-sm border p-4">
//           <div className="flex justify-between items-center text-sm text-gray-600">
//             <span>
//               Showing {filteredUsers.length} of {users.length} users
//             </span>
//             <span>
//               Total Active: {users.filter((u) => u.status === "active").length}
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserList;
import React, { useState, useEffect } from "react";
import { userPaymentAPI } from "../services/api";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userPaymentAPI.getAll();
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.aadharNumber?.includes(searchTerm) ||
      user.phoneNumber?.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      completed: { color: "bg-blue-100 text-blue-800", label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  // Calculate completed months for a user
  const getCompletedMonths = (user) => {
    return (
      user.completedMonths ||
      user.paymentRecords?.filter(
        (record) => record.status === "paid" || record.status === "partial"
      ).length ||
      0
    );
  };

  // Calculate progress percentage
  const getProgressPercentage = (user) => {
    const completed = getCompletedMonths(user);
    return user.tenure ? Math.round((completed / user.tenure) * 100) : 0;
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userPaymentAPI.delete(userId);
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
          <p className="text-gray-600 mt-2">
            Manage chitfund members and their details
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, Aadhar, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-lg">No users found</p>
            <p className="text-sm mt-1">
              Try adjusting your search or create a new user
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chit Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const completedMonths = getCompletedMonths(user);
                  const progressPercentage = getProgressPercentage(user);

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold">
                              {user.memberName?.charAt(0) || "U"}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.memberName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Aadhar: {user.aadharNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.phoneNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{user.chitAmount?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.tenure} months • ₹
                          {user.monthlyPremium?.toLocaleString()}/month
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {completedMonths}/{user.tenure}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {progressPercentage}% completed
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                        <div className="text-xs text-gray-500 mt-1">
                          Paid: ₹{user.totalPaidAmount?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredUsers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing {filteredUsers.length} of {users.length} users
            </span>
            <div className="space-x-4">
              <span>
                Total Active:{" "}
                {users.filter((u) => u.status === "active").length}
              </span>
              <span>
                Avg Completion:{" "}
                {Math.round(
                  users.reduce(
                    (acc, user) => acc + getProgressPercentage(user),
                    0
                  ) / users.length
                )}
                %
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
