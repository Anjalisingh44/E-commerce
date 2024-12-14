const Order = require("../models/order")
const Product = require("../models/product");
const Cart = require("../models/cart");


const placeOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required and must be a non-empty array." });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required." });
    }

    const userId = req.user.id; // Extracted from the token by validateToken
    const normalizedPaymentMethod = 
  paymentMethod.toLowerCase() === "online" ? "online" : paymentMethod;


    let totalPrice = 0;
    const invalidItems = [];
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        invalidItems.push(item.productId);
        continue;
      }
      totalPrice += product.price * item.quantity;
    }

    if (invalidItems.length > 0) {
      return res.status(404).json({ message: `Products not found: ${invalidItems.join(", ")}` });
    }

    const newOrder = new Order({
      userId,
      items,
      totalPrice,
      paymentMethod: normalizedPaymentMethod,
    });

  await newOrder.save();

    await Cart.findOneAndUpdate(
      { userId },
      { items: [], totalPrice: 0 }
    );

    res.status(201).json({ message: "Order placed successfully.", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error.message, error.stack);
    res.status(500).json({ message: "Failed to place order.", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const orders = await Order.find()
      .populate("userId", "username email")
      .populate("items.productId", "name price");
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders.", error: error.message });
  }
};

// Get user's orders (User)
const getUserOrders = async (req, res) => {
  try {
    console.log(req.user); // Log the user object to see if it contains the userId
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found" });
    }

    const orders = await Order.find({ userId }).populate("items.productId", "name price");
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your orders.", error: error.message });
  }
};



// Update order status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order status updated successfully.", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status.", error: error.message });
  }
};

// Delete an order (Admin)
const deleteOrder = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { orderId } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order.", error: error.message });
  }
};

module.exports = {
  placeOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
};

