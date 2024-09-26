import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        account: null,
        error: null
    },
    reducers: {
        setUser: (state, action) => {
            state.account = action.payload.account;
            state.isLoggedIn = true;
        },
        unsetUser: (state) => {
            state.account = null;
            state.isLoggedIn = false;
        }
    }
})

export const { setUser, unsetUser } = userSlice.actions;
export default userSlice.reducer;
