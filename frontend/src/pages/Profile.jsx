import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import EditUserModal from "../modals/EditUserModal";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // 🔥 Fetch Profile
    const fetchProfile = async () => {
        try {
            const res = await API.get("/user/profile");
            setUser(res.data.data);
        } catch (err) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // 🔹 Loading UI
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-gray-400">Loading profile...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white">

            {/* 🔥 HERO */}
            <div className="relative h-[300px] w-full overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1715685434930-20b40a6f47bf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNvdmVyJTIwcGhvdG98ZW58MHx8MHx8fDA%3D"
                    alt="cover"
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black" />
            </div>

            {/* 🔥 PROFILE INFO */}
            <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10">

                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* PROFILE IMAGE */}
                    <div className="w-40 h-40 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                        <img
                            src={user.profilePic || "/images/profile.jpg"}
                            alt="profile"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* TEXT */}
                    <div className="flex-1">

                        <h1 className="text-4xl font-light mb-2 tracking-tight">
                            {user.firstName || "User"} {user.lastName || ""}
                        </h1>

                        <p className="text-gray-400 max-w-xl">
                            {user.bio || "No bio available"}
                        </p>

                        {/* ACTION */}
                        <button
                            onClick={() => setOpen(true)}
                            className="mt-5 bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
                        >
                            Edit Profile
                        </button>

                    </div>
                </div>

                {/* 🔥 STATS */}
                <div className="flex gap-10 mt-10 border-t border-white/10 pt-6 text-sm">
                    <div>
                        <p className="text-lg font-medium">
                            {user.followersCount || 0}
                        </p>
                        <p className="text-gray-500">Followers</p>
                    </div>
                    <div>
                        <p className="text-lg font-medium">
                            {user.followingCount || 0}
                        </p>
                        <p className="text-gray-500">Following</p>
                    </div>
                    <div>
                        <p className="text-lg font-medium">0</p>
                        <p className="text-gray-500">Posts</p>
                    </div>
                </div>

                {/* 🔥 TABS */}
                <div className="mt-10 border-b border-white/10 flex gap-8 text-sm">
                    <button className="pb-3 border-b border-white">
                        POSTS
                    </button>
                    <button className="pb-3 text-gray-500 hover:text-white">
                        LIKED
                    </button>
                </div>

                {/* 🔥 POSTS GRID (Placeholder) */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="bg-[#111111] border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition"
                        >
                            <p className="text-gray-400 text-sm">
                                Your content will appear here
                            </p>
                        </div>
                    ))}
                </div>

            </div>
            {open && (
                <EditUserModal
                    user={user}
                    onClose={() => setOpen(false)}
                    refresh={fetchProfile}
                />
            )}
        </div>
    );
};

export default Profile;

// 🔥 IMPORTANT (DO NOT CHANGE THIS FLOW)
//
// We DO NOT send userId from frontend for fetching own profile.
// Reason:
// - JWT token already contains user identity
// - Backend extracts user from req.user (authMiddleware)
// - More secure (prevents ID tampering)
//
// Use:
// 👉 GET /profile        → for logged-in user's own profile
// 👉 GET /profile/:id    → only for admin or public profile view
//
// ❌ Avoid:
// API.get("/profile/" + userId)  ← unnecessary & unsafe
//
// ✔ Correct: