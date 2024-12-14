import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { isSignedIn: false, role:"user" },
    reducers: {
        Signin(state){
            state.isSignedIn = true;
        },
        logout(state){
            state.isSignedIn = false;
        },
        changeRole(state, action){
            const role = action.payload;
            state.role = role;
        },
    }, 
});
export const authAction = authSlice.actions;
export default authSlice.reducer;