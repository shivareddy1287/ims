// const mongoose = require("mongoose");

// const paymentRecordSchema = new mongoose.Schema({
//   monthNumber: {
//     type: Number,
//     required: [true, "Month number is required"],
//     min: [1, "Month number must be at least 1"],
//   },
//   amount: {
//     type: Number,
//     required: [true, "Payment amount is required"],
//     min: [0, "Amount cannot be negative"],
//   },
//   paymentDate: {
//     type: Date,
//     required: [true, "Payment date is required"],
//     default: Date.now,
//   },
//   dueDate: {
//     type: Date,
//     required: [true, "Due date is required"],
//   },
//   status: {
//     type: String,
//     enum: ["paid", "pending", "overdue", "partial"],
//     default: "pending",
//   },
//   paymentMethod: {
//     type: String,
//     enum: ["cash", "bank_transfer", "upi", "cheque", "card"],
//     default: "cash",
//   },
//   transactionId: {
//     type: String,
//     trim: true,
//   },
//   remarks: {
//     type: String,
//     trim: true,
//     maxlength: [500, "Remarks cannot exceed 500 characters"],
//   },
//   lateFee: {
//     type: Number,
//     default: 0,
//     min: [0, "Late fee cannot be negative"],
//   },
// });

// const userPaymentSchema = new mongoose.Schema(
//   {
//     memberName: {
//       type: String,
//       required: [true, "Member name is required"],
//       trim: true,
//     },
//     aadharNumber: {
//       type: String,
//       required: [true, "Aadhar number is required"],
//       match: [/^\d{12}$/, "Please enter a valid 12-digit Aadhar number"],
//     },
//     phoneNumber: {
//       type: String,
//       required: [true, "Phone number is required"],
//       match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       lowercase: true,
//       match: [
//         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//         "Please enter a valid email",
//       ],
//     },
//     address: {
//       street: String,
//       city: String,
//       state: String,
//       pincode: String,
//     },
//     chitAmount: {
//       type: Number,
//       required: [true, "Chit amount is required"],
//       min: [1000, "Chit amount must be at least 1000"],
//     },
//     tenure: {
//       type: Number,
//       required: [true, "Tenure is required"],
//       min: [1, "Tenure must be at least 1 month"],
//     },
//     monthlyPremium: {
//       type: Number,
//       //   required: [true, "Monthly premium is required"],
//     },
//     startDate: {
//       type: Date,
//       required: [true, "Start date is required"],
//     },
//     endDate: {
//       type: Date,
//     },
//     status: {
//       type: String,
//       enum: ["active", "completed", "cancelled"],
//       default: "active",
//     },
//     paymentRecords: [paymentRecordSchema],

//     // Summary fields for easy querying
//     totalPaidAmount: {
//       type: Number,
//       default: 0,
//     },
//     pendingMonths: {
//       type: Number,
//       default: 0,
//     },
//     completedMonths: {
//       type: Number,
//       default: 0,
//     },
//     lastPaymentDate: {
//       type: Date,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Pre-save middleware to calculate derived fields
// userPaymentSchema.pre("save", function (next) {
//   // Calculate end date
//   if (this.startDate && this.tenure && !this.endDate) {
//     const endDate = new Date(this.startDate);
//     endDate.setMonth(endDate.getMonth() + this.tenure);
//     this.endDate = endDate;
//   }

//   // Calculate summary fields
//   if (this.paymentRecords && this.paymentRecords.length > 0) {
//     const paidRecords = this.paymentRecords.filter(
//       (record) => record.status === "paid" || record.status === "partial"
//     );

//     this.totalPaidAmount = paidRecords.reduce(
//       (total, record) => total + record.amount,
//       0
//     );
//     this.completedMonths = paidRecords.length;
//     this.pendingMonths = this.tenure - this.completedMonths;

//     // Find last payment date
//     const paidDates = paidRecords
//       .filter((record) => record.paymentDate)
//       .map((record) => record.paymentDate)
//       .sort((a, b) => b - a);

//     this.lastPaymentDate = paidDates.length > 0 ? paidDates[0] : null;
//   } else {
//     this.totalPaidAmount = 0;
//     this.completedMonths = 0;
//     this.pendingMonths = this.tenure;
//     this.lastPaymentDate = null;
//   }

//   // Update status to completed if all months are paid
//   if (this.completedMonths >= this.tenure) {
//     this.status = "completed";
//   }

//   next();
// });

// // Method to get payment summary
// userPaymentSchema.methods.getPaymentSummary = function () {
//   const paidRecords = this.paymentRecords.filter(
//     (record) => record.status === "paid" || record.status === "partial"
//   );
//   const pendingRecords = this.paymentRecords.filter(
//     (record) => record.status === "pending" || record.status === "overdue"
//   );

//   return {
//     totalMonths: this.tenure,
//     completedMonths: paidRecords.length,
//     pendingMonths: pendingRecords.length,
//     totalPaidAmount: this.totalPaidAmount,
//     totalDueAmount: this.tenure * this.monthlyPremium - this.totalPaidAmount,
//     completionPercentage: ((paidRecords.length / this.tenure) * 100).toFixed(2),
//   };
// };

// module.exports = mongoose.model("UserPayment", userPaymentSchema);
const mongoose = require("mongoose");

const paymentRecordSchema = new mongoose.Schema({
  monthNumber: {
    type: Number,
    required: [true, "Month number is required"],
    min: [1, "Month number must be at least 1"],
  },
  amount: {
    type: Number,
    required: [true, "Payment amount is required"],
    min: [0, "Amount cannot be negative"],
  },
  paymentDate: {
    type: Date,
    required: [true, "Payment date is required"],
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"],
  },
  status: {
    type: String,
    enum: ["paid", "pending", "overdue", "partial"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "bank_transfer", "upi", "cheque", "card"],
    default: "cash",
  },
  transactionId: {
    type: String,
    trim: true,
  },
  remarks: {
    type: String,
    trim: true,
    maxlength: [500, "Remarks cannot exceed 500 characters"],
  },
  lateFee: {
    type: Number,
    default: 0,
    min: [0, "Late fee cannot be negative"],
  },
});

const userPaymentSchema = new mongoose.Schema(
  {
    memberName: {
      type: String,
      required: [true, "Member name is required"],
      trim: true,
    },
    aadharNumber: {
      type: String,
      required: [true, "Aadhar number is required"],
      match: [/^\d{12}$/, "Please enter a valid 12-digit Aadhar number"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    chitAmount: {
      type: Number,
      required: [true, "Chit amount is required"],
      min: [1000, "Chit amount must be at least 1000"],
    },
    tenure: {
      type: Number,
      required: [true, "Tenure is required"],
      min: [1, "Tenure must be at least 1 month"],
    },
    monthlyPremium: {
      type: Number,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    paymentRecords: [paymentRecordSchema],

    // Summary fields for easy querying
    totalPaidAmount: {
      type: Number,
      default: 0,
    },
    pendingMonths: {
      type: Number,
      default: 0,
    },
    completedMonths: {
      type: Number,
      default: 0,
    },
    lastPaymentDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Method to get payment summary
userPaymentSchema.methods.getPaymentSummary = function () {
  const paidRecords = this.paymentRecords.filter(
    (record) => record.status === "paid" || record.status === "partial"
  );
  const pendingRecords = this.paymentRecords.filter(
    (record) => record.status === "pending" || record.status === "overdue"
  );

  return {
    totalMonths: this.tenure,
    completedMonths: paidRecords.length,
    pendingMonths: pendingRecords.length,
    totalPaidAmount: this.totalPaidAmount,
    totalDueAmount: this.tenure * this.monthlyPremium - this.totalPaidAmount,
    completionPercentage: ((paidRecords.length / this.tenure) * 100).toFixed(2),
  };
};

module.exports = mongoose.model("UserPayment", userPaymentSchema);
