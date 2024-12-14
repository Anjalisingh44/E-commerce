const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Cart schema
const cartSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Reference to the User model
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products", // Reference to the Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
},
{
  timestamps: true,
});

// Middleware to calculate total price before saving
cartSchema.pre("save", async function (next) {
  const cart = this;
  let total = 0;

  for (const item of cart.items) {
    const product = await mongoose.model("products").findById(item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  }

  cart.totalPrice = total;
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
