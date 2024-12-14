const mongoose = require("mongoose");
const { Schema } = mongoose;


const orderSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["online", "Cash on Delivery"], required: true },
    status: { type: String, enum: ["pending", "shipped", "delivered"], default: "pending" },
    
    
  },
  {
    timestamps: true
  }
);

  
  const Order = mongoose.model("Order", orderSchema);
  module.exports = Order;
  
  