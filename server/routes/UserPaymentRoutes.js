// const express = require("express");
// const router = express.Router();
// const {
//   createUserPayment,
//   getAllUserPayments,
//   getUserPaymentById,
//   getUserPaymentByAadhar,
//   recordPayment,
//   recordBulkPayment,
//   getPaymentHistory,
//   updateUserPayment,
//   deleteUserPayment,
// } = require("../controllers/UserPaymentsController");

// // Create a new user payment account
// router.post("/", createUserPayment);

// // Get all user payments with optional filtering
// router.get("/", getAllUserPayments);

// // Get user payment by Aadhar number
// router.get("/aadhar/:aadharNumber", getUserPaymentByAadhar);

// // Get payment history for a user
// router.get("/:id/payment-history", getPaymentHistory);

// // Record payment for specific months
// router.post("/:id/pay", recordPayment);

// // Record bulk payment for multiple months
// router.post("/:id/bulk-pay", recordBulkPayment);

// // Get single user payment by ID
// router.get("/:id", getUserPaymentById);

// // Update user payment account
// router.put("/:id", updateUserPayment);

// // Delete user payment account
// router.delete("/:id", deleteUserPayment);

// module.exports = router;
const express = require("express");
const router = express.Router();
const {
  createUserPayment,
  getAllUserPayments,
  getUserPaymentById,
  getUserPaymentByAadhar,
  recordPayment,
  recordBulkPayment,
  getPaymentHistory,
  updateUserPayment,
  deleteUserPayment,
} = require("../controllers/UserPaymentsController");

router.post("/", createUserPayment);
router.get("/", getAllUserPayments);
router.get("/:id", getUserPaymentById);
router.get("/aadhar/:aadharNumber", getUserPaymentByAadhar);
router.post("/:id/pay", recordPayment);
router.post("/:id/bulk-pay", recordBulkPayment);
router.get("/:id/payment-history", getPaymentHistory);
router.put("/:id", updateUserPayment);
router.delete("/:id", deleteUserPayment);

module.exports = router;
