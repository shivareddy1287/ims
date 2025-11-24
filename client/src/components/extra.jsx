// import React, { useState, useEffect } from "react";
// import { userPaymentAPI } from "../services/api";

// const RecordPayment = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [userDetails, setUserDetails] = useState(null);
//   const [tenureTypeFilter, setTenureTypeFilter] = useState("week");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     filterUsers();
//   }, [users, tenureTypeFilter]);

//   const fetchUsers = async () => {
//     try {
//       const response = await userPaymentAPI.getAll();
//       if (response.data.success) {
//         setUsers(response.data.data.filter((user) => user.status === "active"));
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const filterUsers = () => {
//     let filtered = users;

//     // Filter by tenure type
//     if (tenureTypeFilter !== "all") {
//       filtered = filtered.filter(
//         (user) => user.tenureType === tenureTypeFilter
//       );
//     }

//     setFilteredUsers(filtered);
//   };

//   const fetchUserDetails = async (userId) => {
//     try {
//       const response = await userPaymentAPI.getById(userId);
//       if (response.data.success) {
//         setUserDetails(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//     }
//   };

//   const handleUserSelect = (userId) => {
//     setSelectedUser(userId);
//     if (userId) {
//       fetchUserDetails(userId);
//     } else {
//       setUserDetails(null);
//     }
//   };

//   const handleMonthSelect = (month) => {
//     setFormData((prev) => {
//       const isSelected = prev.monthNumbers.includes(month);
//       const newMonths = isSelected
//         ? prev.monthNumbers.filter((m) => m !== month)
//         : [...prev.monthNumbers, month];

//       return { ...prev, monthNumbers: newMonths };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedUser || formData.monthNumbers.length === 0) {
//       setMessage({
//         type: "error",
//         text: "Please select a user and at least one month",
//       });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       // Calculate total amount automatically
//       const totalAmount =
//         userDetails.monthlyPremium * formData.monthNumbers.length;

//       const paymentData = {
//         monthNumbers: formData.monthNumbers,
//         amount: totalAmount,
//         paymentDate: new Date().toISOString().split("T")[0],
//         paymentMethod: "cash",
//         status: "paid",
//       };

//       const response = await userPaymentAPI.recordPayment(
//         selectedUser,
//         paymentData
//       );

//       if (response.data.success) {
//         setMessage({
//           type: "success",
//           text: `Payment recorded successfully for ${
//             formData.monthNumbers.length
//           } ${
//             userDetails.tenureType === "week" ? "week(s)" : "month(s)"
//           }! Total: ₹${totalAmount}`,
//         });

//         // Reset form
//         setFormData({
//           monthNumbers: [],
//         });
//         setSelectedUser("");
//         setUserDetails(null);

//         // Refresh users list
//         fetchUsers();
//       }
//     } catch (error) {
//       setMessage({
//         type: "error",
//         text: error.response?.data?.message || "Failed to record payment",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPaidMonths = () => {
//     if (!userDetails) return [];
//     return userDetails.paymentRecords
//       .filter(
//         (record) => record.status === "paid" || record.status === "partial"
//       )
//       .map((record) => record.monthNumber);
//   };

//   const availableMonths = userDetails
//     ? Array.from({ length: userDetails.tenure }, (_, i) => i + 1).filter(
//         (month) => !getPaidMonths().includes(month)
//       )
//     : [];

//   // Get display text for tenure type
//   const getTenureDisplay = (type) => {
//     return type === "week" ? "weeks" : "months";
//   };

//   // Calculate total amount for selected months
//   const calculateTotalAmount = () => {
//     if (!userDetails || formData.monthNumbers.length === 0) return 0;
//     return userDetails.monthlyPremium * formData.monthNumbers.length;
//   };

//   const [formData, setFormData] = useState({
//     monthNumbers: [],
//   });

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-900">Record Payment</h1>
//           <p className="text-gray-600 mt-2">
//             Record payments for chitfund members
//           </p>
//         </div>

//         {message.text && (
//           <div
//             className={`mb-6 p-4 rounded-lg ${
//               message.type === "success"
//                 ? "bg-green-50 border border-green-200 text-green-700"
//                 : "bg-red-50 border border-red-200 text-red-700"
//             }`}
//           >
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Filters */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Filter by Tenure Type
//             </label>
//             <select
//               value={tenureTypeFilter}
//               onChange={(e) => setTenureTypeFilter(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             >
//               <option value="all">All Types</option>
//               <option value="week">Weekly</option>
//               <option value="month">Monthly</option>
//             </select>
//           </div>

//           {/* User Selection - Normal Dropdown */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select User *
//             </label>
//             <select
//               value={selectedUser}
//               onChange={(e) => handleUserSelect(e.target.value)}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             >
//               <option value="">Select a user</option>
//               {filteredUsers.map((user) => (
//                 <option key={user._id} value={user._id}>
//                   {user.memberName} | Aadhar: {user.aadharNumber} | Phone:{" "}
//                   {user.phoneNumber} |
//                   {user.tenureType === "week" ? " Weekly" : " Monthly"}: ₹
//                   {user.monthlyPremium} | Tenure: {user.tenure}{" "}
//                   {user.tenureType === "week" ? "weeks" : "months"}
//                 </option>
//               ))}

//               {filteredUsers.length === 0 && (
//                 <option value="" disabled>
//                   No users found
//                 </option>
//               )}
//             </select>
//           </div>

//           {/* User Details */}
//           {userDetails && (
//             <div className="bg-gray-50 rounded-lg p-4 border">
//               <h3 className="font-semibold text-gray-900 mb-2">User Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                 <div>
//                   <span className="text-gray-600">Name:</span>
//                   <span className="ml-2 font-medium">
//                     {userDetails.memberName}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Premium:</span>
//                   <span className="ml-2 font-medium">
//                     ₹{userDetails.monthlyPremium}/
//                     {userDetails.tenureType === "week" ? "week" : "month"}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Tenure:</span>
//                   <span className="ml-2 font-medium">
//                     {userDetails.tenure}{" "}
//                     {getTenureDisplay(userDetails.tenureType)}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">
//                     Paid {getTenureDisplay(userDetails.tenureType)}:
//                   </span>
//                   <span className="ml-2 font-medium">
//                     {getPaidMonths().length}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">
//                     Pending {getTenureDisplay(userDetails.tenureType)}:
//                   </span>
//                   <span className="ml-2 font-medium">
//                     {availableMonths.length}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Total Paid:</span>
//                   <span className="ml-2 font-medium">
//                     ₹{userDetails.totalPaidAmount || 0}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Month Selection */}
//           {userDetails && availableMonths.length > 0 && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-3">
//                 Select{" "}
//                 {getTenureDisplay(userDetails.tenureType)
//                   .charAt(0)
//                   .toUpperCase() +
//                   getTenureDisplay(userDetails.tenureType).slice(1)}{" "}
//                 to Pay *
//                 {formData.monthNumbers.length > 0 && (
//                   <span className="text-sm text-gray-500 font-normal ml-2">
//                     (Total: ₹{calculateTotalAmount()})
//                   </span>
//                 )}
//               </label>
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
//                 {availableMonths.map((month) => (
//                   <button
//                     key={month}
//                     type="button"
//                     onClick={() => handleMonthSelect(month)}
//                     className={`p-3 border rounded-lg text-center transition-all ${
//                       formData.monthNumbers.includes(month)
//                         ? "bg-blue-100 border-blue-500 text-blue-700 ring-2 ring-blue-200"
//                         : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
//                     }`}
//                   >
//                     <div className="font-medium">
//                       {userDetails.tenureType === "week" ? "Week" : "Month"}{" "}
//                       {month}
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       ₹{userDetails.monthlyPremium}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//               <p className="text-sm text-gray-500 mt-2">
//                 Selected: {formData.monthNumbers.length}{" "}
//                 {getTenureDisplay(userDetails.tenureType)}
//                 {formData.monthNumbers.length !== 1 ? "s" : ""}
//               </p>
//             </div>
//           )}

//           {userDetails && availableMonths.length === 0 && (
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
//               <p className="text-yellow-700">
//                 All {getTenureDisplay(userDetails.tenureType)} are already paid
//                 for this user.
//               </p>
//             </div>
//           )}

//           {/* Submit Button */}
//           {formData.monthNumbers.length > 0 && (
//             <div className="flex justify-end pt-6 border-t">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     <span>Processing...</span>
//                   </>
//                 ) : (
//                   <>
//                     <span>💳</span>
//                     <span>
//                       Record Payment for {formData.monthNumbers.length}{" "}
//                       {getTenureDisplay(userDetails.tenureType)} (₹
//                       {calculateTotalAmount()})
//                     </span>
//                   </>
//                 )}
//               </button>
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RecordPayment;
