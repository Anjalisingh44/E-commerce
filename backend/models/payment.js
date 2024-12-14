const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    transactionId: { 
      type: String, 
      unique: true, 
      required: true // Unique ID provided by eSewa for the transaction
    },
    orderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Order", 
      required: true // Relating to the Order model
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user", 
      required: true // Relating to the User model
    },
    amount: { 
      type: Number, 
      required: true // The amount paid
    },
    paymentGateway: { 
      type: String, 
      enum: ["esewa"], // For now, only eSewa
      default: "esewa" 
    },
    paymentStatus: { 
      type: String, 
      enum: ["success", "pending", "failed"], 
      default: "pending" // Payment lifecycle states
    },
    paymentDate: { 
      type: Date, 
      default: Date.now // When the payment was made
    },
    verificationData: { 
      type: Object, 
      default: {} // Store eSewa verification response data
    },
  },
  { 
    timestamps: true // To track when the document is created and updated
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
