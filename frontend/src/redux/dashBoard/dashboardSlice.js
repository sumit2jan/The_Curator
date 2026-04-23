import { createSlice } from "@reduxjs/toolkit";
import { fetchUsersThunk } from "./dashBoardThunk";

const initialState = {
  users: [],
  loading: false,
  error: null,

  // Pagination
  page: 1,
  limit: 10,
  totalUsers: 0,
  totalPages: 1,

  // Filters
  search: "",
  debouncedSearch: "",
  sortBy: "createdAt",
  order: "desc",
  gender: "",
  country: "",

  // UI State
  selectedUser: null,
  isEditOpen: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,

  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },

    setDebouncedSearch: (state, action) => {
      state.debouncedSearch = action.payload;
      state.page = 1; // 🔥 reset page on search
    },

    setPage: (state, action) => {
      state.page = action.payload;
    },

    setLimit: (state, action) => {
      state.limit = action.payload;
      state.page = 1;
    },

    setSort: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.order = action.payload.order;
      state.page = 1;
    },

    setGender: (state, action) => {
      state.gender = action.payload;
      state.page = 1;
    },

    setCountry: (state, action) => {
      state.country = action.payload;
      state.page = 1;
    },

    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    setEditOpen: (state, action) => {
      state.isEditOpen = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.users = action.payload.users;

        state.totalUsers = action.payload.pagination.totalUsers;
        state.totalPages = action.payload.pagination.totalPages;
        state.page = action.payload.pagination.currentPage;
      })

      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearch,
  setDebouncedSearch,
  setPage,
  setLimit,
  setSort,
  setGender,
  setCountry,
  setSelectedUser,
  setEditOpen,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;