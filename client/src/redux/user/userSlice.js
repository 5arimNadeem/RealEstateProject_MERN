import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    // it is the name of our state
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false
        }
    }
})

export const { signInFailure, signInStart, signInSuccess } = userSlice.actions;

// because in the userSlice.js file we have exported in the default way  we can import in the other files by any name that we want , so in the store file we have took it as userReducer

export default userSlice.reducer;