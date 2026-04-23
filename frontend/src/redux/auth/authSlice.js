import { createSlice } from "@reduxjs/toolkit";
import { loginThunk } from "./authThunk";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
    },
  },

  // THUNK HANDLING
  extraReducers: (builder) => {
    builder
      // pending
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // success
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      // error
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;