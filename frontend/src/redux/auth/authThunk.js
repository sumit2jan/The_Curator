import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (values, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", values);
      console.log(res);
      const { user, token, refreshToken } = res.data.data;

      return { user: user, token, refreshToken };
    } catch (error) {
      console.error(error.message)
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

