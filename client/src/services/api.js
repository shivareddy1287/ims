import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";
// const API_BASE_URL = "https://ims-backend-alpha.vercel.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const userPaymentAPI = {
  // Create a new user payment account
  create: (data) => api.post("/user-payments", data),

  // Get all user payments
  getAll: (params = {}) => api.get("/user-payments", { params }),

  // Get user payment by ID
  getById: (id) => api.get(`/user-payments/${id}`),

  // Get user payment by Aadhar number
  getByAadhar: (aadharNumber) =>
    api.get(`/user-payments/aadhar/${aadharNumber}`),

  // Record payment for specific months
  recordPayment: (id, data) => api.post(`/user-payments/${id}/pay`, data),

  // Record bulk payment
  recordBulkPayment: (id, data) =>
    api.post(`/user-payments/${id}/bulk-pay`, data),

  // Get payment history
  getPaymentHistory: (id) => api.get(`/user-payments/${id}/payment-history`),

  // Update user payment account
  update: (id, data) => api.put(`/user-payments/${id}`, data),

  // Delete user payment account
  delete: (id) => api.delete(`/user-payments/${id}`),
};

export default api;
