import { configureStore} from "@reduxjs/toolkit";
import authReducer from "./auth";
import cartReducer from "./cart";
import wishlistReducer from "./wishlist";
import orderReducer from "./order";

const store = configureStore ({
    reducer: {
        auth:authReducer,
        cart:cartReducer,
        wishlist: wishlistReducer,
        Order: orderReducer,
    },
})
export default store;