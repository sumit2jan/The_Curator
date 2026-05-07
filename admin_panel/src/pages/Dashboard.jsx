import React, { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component/dist/index.es.js";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Select from "react-select";
import countryList from "react-select-country-list";
import api from "../api/axios";
import { toggleUserVerify, deleteUser } from "../api/adminApi";

// Tumhara pehle se bana hua modal import (path apne folder structure ke hisaab se adjust karlena)
import EditProfileModal from "../modals/EditUserModal";

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

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Country Options from react-select-country-list
  const countryOptions = useMemo(() => {
    const options = countryList().getData();
    // Adding a default 'All' option
    return [{ value: "", label: "All Countries" }, ...options];
  }, []);

  // FETCH USERS
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

  // DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setDebouncedSearch(search));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, search]);

  // REFRESH FUNCTION FOR MODAL
  const handleRefresh = () => {
    dispatch(fetchUsersThunk({ page, limit, sortBy, order, search: debouncedSearch, gender, country }));
  };

  // EDIT USER (Opens Modal)
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // SOFT DELETE USER
  const handleSoftDelete = async (user) => {
    const result = await Swal.fire({
      title: "Soft Delete?",
      text: `Are you sure you want to suspend ${user.firstName || user.username}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b", // Amber color
      confirmButtonText: "Yes, Suspend",
    });

    if (result.isConfirmed) {
      try {
        // TODO: Update this route according to your backend
        await fetch(`${BASE_URL}/admin/user/soft-delete/${user._id}`, { method: 'PATCH' });
        Swal.fire("Suspended!", "User has been soft deleted.", "success");
        handleRefresh();
      } catch (error) {
        Swal.fire("Error!", "Soft delete failed.", "error");
      }
    }
  };

  // HARD DELETE USER
  const handleHardDelete = async (user) => {
    const result = await Swal.fire({
      title: "Permanent Delete?",
      text: `Delete ${user.firstName || user.username} permanently? This cannot be undone.`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Yes, Delete!",
    });

    if (result.isConfirmed) {
      try {
        // TODO: Update this route according to your backend
        await deleteUser(user._id);
        Swal.fire("Deleted!", "User removed permanently.", "success");
        handleRefresh();
      } catch (error) {
        Swal.fire("Error!", "Delete failed.", "error");
      }
    }
  };

  // VERIFY USER
  const handleToggleVerify = async (user) => {
    const result = await Swal.fire({
      title: "Change Verification?",
      text: `Toggle verification status for ${user.firstName || user.username}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await toggleUserVerify(user._id, !user.isVerified);


        Swal.fire("Updated!", "Verification changed.", "success");

        handleRefresh(); // same as before
      } catch (error) {
        console.error("Toggle verify error:", error);

        Swal.fire("Error!", "Update failed.", "error");
      }
    }
  };

  // Custom Styles for react-select (Dark Theme)
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#111111",
      borderColor: "rgba(255, 255, 255, 0.1)",
      color: "white",
      borderRadius: "9999px",
      padding: "2px 10px",
      minWidth: "200px",
      boxShadow: "none",
      cursor: "pointer",
      "&:hover": {
        borderColor: "rgba(255, 255, 255, 0.3)",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#111111",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      zIndex: 50,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#222222" : "#111111",
      color: "white",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#333333",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
  };

  const columns = [
    {
      name: "Profile",
      width: "80px",
      cell: (row) => {
        const img =
          row.profilePic?.url ||
          "https://res.cloudinary.com/dtzqjly9a/image/upload/v1777125248/default_itqef1.png";

        return (
          <img
            src={img}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border border-white/20"
          />
        );
      },
    },
    {
      name: "Name",
      selector: (row) => `${row.firstName || ""} ${row.lastName || ""}`.trim() || row.username,
      sortable: true,
      sortField: "username",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      sortField: "email",
    },
    {
      name: "Gender",
      selector: (row) => row.gender || "-",
      width: "100px",
    },
    {
      name: "Country",
      selector: (row) => row.country || "-",
      width: "120px",
    },
    {
      name: "Verified",
      width: "100px",
      cell: (row) => (
        <div className="form-check form-switch cursor-pointer">
          <input
            className="form-check-input cursor-pointer"
            type="checkbox"
            checked={row.isVerified || false}
            onChange={() => handleToggleVerify(row)}
          />
        </div>
      ),
    },
    {
      name: "Actions",
      width: "280px",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded hover:bg-blue-600/40 transition"
            onClick={() => handleEditClick(row)}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 text-xs font-medium bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded hover:bg-yellow-600/40 transition"
            onClick={() => handleSoftDelete(row)}
          >
            Suspend
          </button>
          <button
            className="px-3 py-1 text-xs font-medium bg-red-600/20 text-red-400 border border-red-600/30 rounded hover:bg-red-600/40 transition"
            onClick={() => handleHardDelete(row)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-black font-sans">
      <section className="text-white px-6 py-4 pt-28">
        <div className="max-w-7xl mx-auto">
          {/* SEARCH & FILTERS HEADER */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

            {/* Search */}
            <div className="w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className="w-full bg-[#111111] border border-white/10 rounded-full px-5 py-2.5 text-sm 
                focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 w-full md:w-auto">
              <select
                value={gender}
                onChange={(e) => dispatch(setGender(e.target.value))}
                className="bg-[#111111] border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none cursor-pointer"
              >
                <option value="">All Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <div className="w-48">
                <Select
                  options={countryOptions}
                  value={countryOptions.find(c => c.value === country) || countryOptions[0]}
                  onChange={(selected) => dispatch(setCountry(selected.value))}
                  styles={customSelectStyles}
                  placeholder="All Country"
                  isSearchable={true}
                />
              </div>
            </div>
          </div>

          {/* TABLE WRAPPER */}
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
              customStyles={{
                table: {
                  style: { backgroundColor: "#0b0b0b" },
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
                    cursor: "default",
                  },
                },
                pagination: {
                  style: {
                    backgroundColor: "#0b0b0b",
                    color: "#9ca3af",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                  },
                  pageButtonsStyle: {
                    color: "#ffffff",
                    fill: "#ffffff",
                  }
                },
              }}
            />
          </div>
        </div>
      </section>

      {/* RENDER EDIT MODAL */}
      {isEditModalOpen && selectedUser && (
        <EditProfileModal
          user={selectedUser}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          refresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default Dashboard;

// import React, { useEffect } from "react";
// import DataTable from "react-data-table-component/dist/index.es.js";
// import { useDispatch, useSelector } from "react-redux";
// import Swal from "sweetalert2";

// import {
//   setSearch,
//   setDebouncedSearch,
//   setPage,
//   setLimit,
//   setSort,
//   setGender,
//   setCountry,
// } from "../redux/dashBoard/dashboardSlice";

// import { fetchUsersThunk } from "../redux/dashBoard/dashBoardThunk";

// const Dashboard = () => {
//   const dispatch = useDispatch();

//   const {
//     users,
//     loading,
//     totalUsers,
//     page,
//     limit,
//     search,
//     debouncedSearch,
//     sortBy,
//     order,
//     gender,
//     country,
//   } = useSelector((state) => state.dashboard);

//   const BASE_URL = "http://localhost:5000";

//   // 🔥 FETCH USERS
//   useEffect(() => {
//     dispatch(
//       fetchUsersThunk({
//         page,
//         limit,
//         sortBy,
//         order,
//         search: debouncedSearch,
//         gender,
//         country,
//       })
//     );
//   }, [dispatch, page, limit, sortBy, order, debouncedSearch, gender, country]);

//   // 🔥 DEBOUNCE SEARCH
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       dispatch(setDebouncedSearch(search));
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [dispatch, search]);

//   // 🔥 DELETE USER /admin/user/delete/${user._id}
//   const handleDeleteClick = async (user) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: `Delete ${user.firstName}?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc3545",
//     });

//     if (result.isConfirmed) {
//       try {
//         await api.delete(`/admin/user/delete/${user._id}`);
//         Swal.fire("Deleted!", "User removed.", "success");

//         if (users.length === 1 && page > 1) {
//           setPage(page - 1);
//         } else {
//           getusers();
//         }
//       } catch (error) {
//         Swal.fire("Error!", "Delete failed.", "error");
//       }
//     }
//   };

//   // 🔥 VERIFY USER
//   const handleToggleVerify = async (user) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: `Change verification of ${user.firstName}?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//     });

//     if (result.isConfirmed) {
//       try {
//         await fetch(`/admin/user/toggleVerify/${user._id}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ isVerified: !user.isVerified }),
//         });

//         Swal.fire("Updated!", "Verification changed.", "success");

//         dispatch(fetchUsersThunk({ page, limit, sortBy, order, search: debouncedSearch, gender, country }));
//       } catch (error) {
//         Swal.fire("Error!", "Update failed.", "error");
//       }
//     }
//   };

//   const columns = [
//     {
//       name: "Profile",
//       cell: (row) => {
//         const img = row.profilePic
//           ? `${BASE_URL}${row.profilePic}`
//           : `${BASE_URL}/uploads/default.png`;

//         return (
//           <img
//             src={img}
//             alt="profile"
//             style={{
//               width: "40px",
//               height: "40px",
//               borderRadius: "50%",
//               objectFit: "cover",
//             }}
//           />
//         );
//       },
//     },
//     {
//       name: "Name",
//       selector: (row) => `${row.firstName || ""} ${row.lastName || ""}`,
//       sortable: true,
//       sortField: "username",
//     },
//     {
//       name: "Email",
//       selector: (row) => row.email,
//     },
//     {
//       name: "Gender",
//       selector: (row) => row.gender || "-",
//     },
//     {
//       name: "Country",
//       selector: (row) => row.country || "-",
//     },
//     {
//       name: "Verified",
//       cell: (row) => (
//         <div className="form-check form-switch">
//           <input
//             className="form-check-input"
//             type="checkbox"
//             checked={row.isVerified}
//             onChange={() => handleToggleVerify(row)}
//           />
//         </div>
//       ),
//     },
//     {
//       name: "Actions",
//       cell: (row) => (
//         <button
//           className="btn btn-sm btn-danger"
//           onClick={() => handleDeleteClick(row)}
//         >
//           Delete
//         </button>
//       ),
//     },
//   ];

//   return (
//     <section className="min-h-screen bg-black text-white px-6 py-10">

//       <div className="max-w-7xl mx-auto">

//         {/* 🔥 HEADER */}
//         <div className="mb-10 flex justify-between items-center">

//           <h1
//             className="text-3xl md:text-4xl font-light"
//             style={{ fontFamily: "Playfair Display" }}
//           >
//             Dashboard
//           </h1>

//           <span className="text-sm text-gray-400">
//             {totalUsers} users
//           </span>

//         </div>

//         {/* 🔍 SEARCH */}
//         <div className="mb-6">
//           <input
//             type="text"
//             placeholder="Search users..."
//             value={search}
//             onChange={(e) => dispatch(setSearch(e.target.value))}
//             className="w-full md:w-96 bg-[#111111] border border-white/10 rounded-full px-5 py-3 text-sm
//           focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition"
//           />
//         </div>

//         {/* 🔥 FILTERS */}
//         <div className="flex flex-wrap gap-4 mb-8">

//           <select
//             value={gender}
//             onChange={(e) => dispatch(setGender(e.target.value))}
//             className="bg-[#111111] border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none"
//           >
//             <option value="">All Gender</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Other">Other</option>
//           </select>

//           <select
//             value={country}
//             onChange={(e) => dispatch(setCountry(e.target.value))}
//             className="bg-[#111111] border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none"
//           >
//             <option value="">All Country</option>
//             <option value="India">India</option>
//             <option value="USA">USA</option>
//           </select>

//         </div>

//         {/* 🔥 TABLE WRAPPER */}
//         <div className="bg-[#0b0b0b] rounded-2xl border border-white/10 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

//           <DataTable
//             columns={columns}
//             data={users}
//             pagination
//             paginationServer
//             paginationTotalRows={totalUsers}
//             paginationPerPage={limit}
//             paginationRowsPerPageOptions={[5, 10, 20]}
//             onChangePage={(page) => dispatch(setPage(page))}
//             onChangeRowsPerPage={(newLimit, page) => {
//               dispatch(setLimit(newLimit));
//               dispatch(setPage(page));
//             }}
//             progressPending={loading}
//             highlightOnHover
//             persistTableHead
//             sortServer
//             onSort={(column, sortDirection) => {
//               dispatch(
//                 setSort({
//                   sortBy: column.sortField || "createdAt",
//                   order: sortDirection,
//                 })
//               );
//             }}

//             /* 🔥 CUSTOM DARK STYLE */
//             customStyles={{
//               table: {
//                 style: {
//                   backgroundColor: "#0b0b0b",
//                 },
//               },
//               headRow: {
//                 style: {
//                   backgroundColor: "#111111",
//                   borderBottom: "1px solid rgba(255,255,255,0.1)",
//                 },
//               },
//               headCells: {
//                 style: {
//                   color: "#9ca3af",
//                   fontSize: "12px",
//                   textTransform: "uppercase",
//                 },
//               },
//               rows: {
//                 style: {
//                   backgroundColor: "#0b0b0b",
//                   color: "#ffffff",
//                   borderBottom: "1px solid rgba(255,255,255,0.05)",
//                 },
//                 highlightOnHoverStyle: {
//                   backgroundColor: "#111111",
//                   cursor: "pointer",
//                 },
//               },
//               pagination: {
//                 style: {
//                   backgroundColor: "#0b0b0b",
//                   color: "#9ca3af",
//                 },
//               },
//             }}
//           />

//         </div>

//       </div>

//     </section>
//   );
// };

// export default Dashboard;