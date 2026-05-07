import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (values, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", values);

      const { user, token } = res.data.data;

      return { user: user, token };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

