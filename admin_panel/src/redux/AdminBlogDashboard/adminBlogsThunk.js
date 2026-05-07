import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchAdminBlogsThunk = createAsyncThunk(
  "adminBlogs/fetchBlogs",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().adminBlogs; // ✅ FIXED

      const res = await api.get("/blog/blogs", {
        params: {
          page: state.page,
          limit: state.limit,
          search: state.debouncedSearch,
          category: state.category || undefined,
          sort: state.sort,
          type: state.searchType,
        },
      });

      return {
        blogs: res.data.data,
        pagination: res.data.pagination,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blogs"
      );
    }
  }
);