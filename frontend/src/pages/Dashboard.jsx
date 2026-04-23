import React, { useEffect } from "react";
import DataTable from "react-data-table-component/dist/index.es.js";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
  setSearch,
  setDebouncedSearch,
  setPage,
  setLimit,
  setSort,
  setGender,
  setCountry,
} from "../redux/dashBoard/dashboardSlice";

import { fetchUsersThunk } from "../redux/dashBoard/dashBoardThunk";

const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    users,
    loading,
    totalUsers,
    page,
    limit,
    search,
    debouncedSearch,
    sortBy,
    order,
    gender,
    country,
  } = useSelector((state) => state.dashboard);

  const BASE_URL = "http://localhost:5000";

  // 🔥 FETCH USERS
  useEffect(() => {
    dispatch(
      fetchUsersThunk({
        page,
        limit,
        sortBy,
        order,
        search: debouncedSearch,
        gender,
        country,
      })
    );
  }, [dispatch, page, limit, sortBy, order, debouncedSearch, gender, country]);

  // 🔥 DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setDebouncedSearch(search));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, search]);

  // 🔥 DELETE USER /admin/user/delete/${user._id}
  const handleDeleteClick = async (user) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete ${user.firstName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/user/delete/${user._id}`);
        Swal.fire("Deleted!", "User removed.", "success");

        if (users.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          getusers();
        }
      } catch (error) {
        Swal.fire("Error!", "Delete failed.", "error");
      }
    }
  };

  // 🔥 VERIFY USER
  const handleToggleVerify = async (user) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Change verification of ${user.firstName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await fetch(`/admin/user/toggleVerify/${user._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isVerified: !user.isVerified }),
        });

        Swal.fire("Updated!", "Verification changed.", "success");

        dispatch(fetchUsersThunk({ page, limit, sortBy, order, search: debouncedSearch, gender, country }));
      } catch (error) {
        Swal.fire("Error!", "Update failed.", "error");
      }
    }
  };

  const columns = [
    {
      name: "Profile",
      cell: (row) => {
        const img = row.profilePic
          ? `${BASE_URL}${row.profilePic}`
          : `${BASE_URL}/uploads/default.png`;

        return (
          <img
            src={img}
            alt="profile"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        );
      },
    },
    {
      name: "Name",
      selector: (row) => `${row.firstName || ""} ${row.lastName || ""}`,
      sortable: true,
      sortField: "username",
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Gender",
      selector: (row) => row.gender || "-",
    },
    {
      name: "Country",
      selector: (row) => row.country || "-",
    },
    {
      name: "Verified",
      cell: (row) => (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            checked={row.isVerified}
            onChange={() => handleToggleVerify(row)}
          />
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDeleteClick(row)}
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <section className="min-h-screen bg-black text-white px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* 🔥 HEADER */}
        <div className="mb-10 flex justify-between items-center">

          <h1
            className="text-3xl md:text-4xl font-light"
            style={{ fontFamily: "Playfair Display" }}
          >
            Dashboard
          </h1>

          <span className="text-sm text-gray-400">
            {totalUsers} users
          </span>

        </div>

        {/* 🔍 SEARCH */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full md:w-96 bg-[#111111] border border-white/10 rounded-full px-5 py-3 text-sm 
          focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition"
          />
        </div>

        {/* 🔥 FILTERS */}
        <div className="flex flex-wrap gap-4 mb-8">

          <select
            value={gender}
            onChange={(e) => dispatch(setGender(e.target.value))}
            className="bg-[#111111] border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none"
          >
            <option value="">All Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={country}
            onChange={(e) => dispatch(setCountry(e.target.value))}
            className="bg-[#111111] border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none"
          >
            <option value="">All Country</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
          </select>

        </div>

        {/* 🔥 TABLE WRAPPER */}
        <div className="bg-[#0b0b0b] rounded-2xl border border-white/10 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

          <DataTable
            columns={columns}
            data={users}
            pagination
            paginationServer
            paginationTotalRows={totalUsers}
            paginationPerPage={limit}
            paginationRowsPerPageOptions={[5, 10, 20]}
            onChangePage={(page) => dispatch(setPage(page))}
            onChangeRowsPerPage={(newLimit, page) => {
              dispatch(setLimit(newLimit));
              dispatch(setPage(page));
            }}
            progressPending={loading}
            highlightOnHover
            persistTableHead
            sortServer
            onSort={(column, sortDirection) => {
              dispatch(
                setSort({
                  sortBy: column.sortField || "createdAt",
                  order: sortDirection,
                })
              );
            }}

            /* 🔥 CUSTOM DARK STYLE */
            customStyles={{
              table: {
                style: {
                  backgroundColor: "#0b0b0b",
                },
              },
              headRow: {
                style: {
                  backgroundColor: "#111111",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                },
              },
              headCells: {
                style: {
                  color: "#9ca3af",
                  fontSize: "12px",
                  textTransform: "uppercase",
                },
              },
              rows: {
                style: {
                  backgroundColor: "#0b0b0b",
                  color: "#ffffff",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                },
                highlightOnHoverStyle: {
                  backgroundColor: "#111111",
                  cursor: "pointer",
                },
              },
              pagination: {
                style: {
                  backgroundColor: "#0b0b0b",
                  color: "#9ca3af",
                },
              },
            }}
          />

        </div>

      </div>

    </section>
  );
};

export default Dashboard;