const express = require("express");
const {
  placeOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/order");
const validateToken = require("../middleware/validateToken"); // Authentication middleware
const router = express.Router();

// User Routes
router.post("/orders", validateToken, placeOrder); // Place an order
router.get("/user/:userId", validateToken, getUserOrders); // Fetch user-specific orders

// Admin Routes
router.get("/Adminorders", validateToken, getAllOrders); // Fetch all orders (Admin only)
router.put("/orders/:orderId/status", validateToken, updateOrderStatus); // Update order status (Admin only)
router.delete("/orders/:orderId", validateToken, deleteOrder); // Delete an order (Admin only)

module.exports = router;
