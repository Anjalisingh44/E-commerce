import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalPrice: 0,
  },
  reducers: {
    addToCart(state, action) {
      const { productId, quantity, price, name, images, description } = action.payload;
      console.log('Reducer called with action: ', action.payload);
    
      const existingItem = state.cartItems.find((item) => item.productId === productId);
    
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice += price * quantity;
      } else {
        state.cartItems.push({
          description,
          images,
          productId,
          quantity,
          price,
          name,
          totalPrice: price * quantity,
        });
      }
    
      // Recalculate the total price for the cart
      state.totalPrice = state.cartItems.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
    },
    

    removeFromCart: (state, action) =>{
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.productId !== productId);
      
      // Recalculate total price after removing the item
      state.totalPrice = state.cartItems.reduce((total, item) => total + item.totalPrice, 0);
    },
    setCartItems(state, action) {
      state.cartItems = action.payload.cartItems || [];
      state.totalPrice = action.payload.totalPrice || 0;
    },
    clearCart(state) {
      console.log('clearCart action dispatched');
      state.cartItems = [];
      state.totalPrice = 0;
      
    },
  },
})

export const cartActions= cartSlice.actions;
export default cartSlice.reducer;
