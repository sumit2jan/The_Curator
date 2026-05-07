import api from "./axios"

export const toggleUserVerify = (id, isVerified) =>
    api.patch(`/admin/user/toggleVerify/${id}`, { isVerified });


export const deleteUser = (id) =>
    api.delete(`/admin/user/delete/${id}`);