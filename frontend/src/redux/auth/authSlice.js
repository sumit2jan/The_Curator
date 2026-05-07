import { createSlice } from "@reduxjs/toolkit";
import { loginThunk } from "./authThunk";

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
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
      state.refreshToken = null;
      state.error = null;
      state.loading = false;
    },
    googleLogin: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user || null;
      state.loading = false;
      state.error = null;
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
        state.refreshToken = action.payload.refreshToken;
      })

      // error
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, googleLogin } = authSlice.actions;
export default authSlice.reducer;