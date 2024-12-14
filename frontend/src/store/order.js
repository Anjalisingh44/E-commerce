import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [], // Stores the list of all orders
    totalOrders: 0, // Total number of orders
  },
  reducers: {
    // Add a new order
    addOrder(state, action) {
      const { orderId, items, totalPrice, status, paymentMethod, userId } = action.payload;
      
      // Push new order to the orders array
      state.orders.push({
        orderId,
        items,
        totalPrice,
        status: status || "pending", // Default status is pending
        paymentMethod,
        userId,
        createdAt: new Date().toISOString(),
      });

      // Increment the totalOrders count
      state.totalOrders = state.orders.length;
    },

    // Remove an order by ID
    removeOrder(state, action) {
      const orderId = action.payload;

      // Filter out the order with the specified ID
      state.orders = state.orders.filter((order) => order.orderId !== orderId);

      // Update totalOrders count
      state.totalOrders = state.orders.length;
    },

    // Update an order's status
    updateOrderStatus(state, action) {
      const { orderId, status } = action.payload;

      // Find the order by ID and update its status
      const existingOrder = state.orders.find((order) => order.orderId === orderId);
      if (existingOrder) {
        existingOrder.status = status;
      }
    },

    // Replace all orders (used when fetching orders from the backend)
    setOrders(state, action) {
      state.orders = action.payload.orders || [];
      state.totalOrders = state.orders.length;
    },

    // Retrieve order details
    getOrders(state) {
      return {
        orders: state.orders,
        totalOrders: state.totalOrders,
      };
    },
  },
});

export const orderActions = orderSlice.actions;
export default orderSlice.reducer;
