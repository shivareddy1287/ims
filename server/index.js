const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const UserPaymentsRoute = require("./routes/userPaymentRoutes");

// Load env vars
dotenv.config();

// Connect to databasee
const connectDB = require("./config/database");
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Node.js MongoDB Backend API",
    version: "1.0.0",
  });
});

app.use("/api/user-payments", UserPaymentsRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
