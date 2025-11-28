import React, { useState, useEffect } from "react";
import { userPaymentAPI } from "../services/api";

const UserUpdate = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

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
    return (
      user.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.aadharNumber?.includes(searchTerm) ||
      user.phoneNumber?.includes(searchTerm)
    );
  });

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditFormData({
      memberName: user.memberName || "",
      aadharNumber: user.aadharNumber || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(true);
      await userPaymentAPI.update(selectedUser._id, editFormData);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the list
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setEditFormData({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 font-medium">
            Loading users data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Update Member Details
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Edit basic member information
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 font-semibold group"
        >
          <span className="group-hover:rotate-180 transition-transform duration-500">
            🔄
          </span>
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Search Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Members
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, Aadhar, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white hover:border-gray-400"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
              <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
              <span>All Members ({filteredUsers.length})</span>
            </h2>
            <div className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full">
              {filteredUsers.length} of {users.length} members
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Members Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "No members found in the system"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Member Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-emerald-50/50 transition-all duration-300 group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-semibold text-sm">
                              {user.memberName?.charAt(0) || "U"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {user.memberName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center space-x-2 mt-1">
                            <span>🆔 {user.aadharNumber}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-gray-900">
                        📱 {user.phoneNumber}
                      </div>
                      {user.address && (
                        <div className="text-sm text-gray-500 mt-1 max-w-xs">
                          <span title={user.address}>
                            {user.address.length > 35
                              ? `${user.address.substring(0, 35)}...`
                              : user.address}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105 flex items-center space-x-2 font-semibold"
                          title="Edit Member"
                        >
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Edit Member Details
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Update basic details for {selectedUser.memberName}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Member Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Member Name *
                </label>
                <input
                  type="text"
                  name="memberName"
                  value={editFormData.memberName}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  required
                />
              </div>

              {/* Aadhar Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Aadhar Number *
                </label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={editFormData.aadharNumber}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={editFormData.phoneNumber}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditFormChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  placeholder="Enter full address..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={updating}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Update Member</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserUpdate;
