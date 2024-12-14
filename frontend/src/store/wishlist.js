import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlistItems: [],
  },
  reducers: {
    setWishlist: (state, action) => {
      state.wishlistItems = action.payload;
    },
    addWishlistItem: (state, action) => {
      const { productId, name, price, images } = action.payload;
      const existingItem = state.wishlistItems.find(
        (item) => item.productId === productId
      );

      if (!existingItem) {
        state.wishlistItems.push({
          productId,
          name,
          price,
          images,
        });
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item.productId !== productId
      );
    },
  },
});

export const wishlistActions = wishlistSlice.actions;
export default wishlistSlice.reducer;
