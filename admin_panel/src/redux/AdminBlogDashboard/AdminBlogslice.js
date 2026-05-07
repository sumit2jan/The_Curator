import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminBlogsThunk } from "./adminBlogsThunk";

const initialState = {
    blogs: [],
    loading: false,
    error: null,

    // Pagination
    page: 1,
    limit: 10,
    totalBlogs: 0,
    totalPages: 1,

    // Filters
    search: "",
    debouncedSearch: "",
    sort: "latest", // latest | popular
    category: "",
    searchType: "blog", // blog | user

    // UI State
    selectedBlog: null,
    isPreviewOpen: false,
};

const adminBlogsSlice = createSlice({
    name: "adminBlogs",
    initialState,

    reducers: {
        setSearch: (state, action) => {
            state.search = action.payload;
        },

        setDebouncedSearch: (state, action) => {
            state.debouncedSearch = action.payload;
            state.page = 1; // 🔥 reset page
        },

        setPage: (state, action) => {
            state.page = action.payload;
        },

        setLimit: (state, action) => {
            state.limit = action.payload;
            state.page = 1;
        },

        setSort: (state, action) => {
            state.sort = action.payload;
            state.page = 1;
        },

        setCategory: (state, action) => {
            state.category = action.payload;
            state.page = 1;
        },

        setSearchType: (state, action) => {
            state.searchType = action.payload;
            state.page = 1;
        },

        setSelectedBlog: (state, action) => {
            state.selectedBlog = action.payload;
        },

        setPreviewOpen: (state, action) => {
            state.isPreviewOpen = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminBlogsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAdminBlogsThunk.fulfilled, (state, action) => {
                state.loading = false;

                state.blogs = action.payload.blogs;

                state.totalBlogs = action.payload.pagination.total;
                state.totalPages = action.payload.pagination.totalPages;
                state.page = action.payload.pagination.page;
            })

            .addCase(fetchAdminBlogsThunk.rejected, (state, action) => {
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
    setCategory,
    setSearchType,
    setSelectedBlog,
    setPreviewOpen,
} = adminBlogsSlice.actions;

export default adminBlogsSlice.reducer;