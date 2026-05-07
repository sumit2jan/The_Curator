import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchUsersThunk = createAsyncThunk(
  "dashboard/fetchUsers",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("admin/dashboard", {
        params: {
          page: params.page,
          limit: params.limit,
          sortBy: params.sortBy,
          order: params.order,
          search: params.search || undefined,
          gender: params.gender || undefined,
          country: params.country || undefined,
        },
      });

      return {
        users: res.data.data,
        pagination: res.data.pagination,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);