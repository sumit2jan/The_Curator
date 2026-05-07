// import React, { useEffect, useState } from "react";
// import API from "../api/axios";
// import { toast } from "react-toastify";
// import EditUserModal from "../modals/EditUserModal";
// import { FaPen } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const Profile = () => {
//     const navigate = useNavigate();
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [open, setOpen] = useState(false);
//     const [uploading, setUploading] = useState(false);


//     const [blogs, setBlogs] = useState([]);
//     const [page, setPage] = useState(1);
//     const [hasMore, setHasMore] = useState(true);
//     const [blogLoading, setBlogLoading] = useState(false);

//     //  Fetch Profile
//     const fetchProfile = async () => {
//         try {
//             const res = await API.get("/user/profile");
//             setUser(res.data.data);
//         } catch (err) {
//             toast.error("Failed to load profile");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchProfile();
//     }, []);

//     const fetchUserBlogs = async (pageNum = 1) => {
//         if (!user?._id) return;

//         try {
//             setBlogLoading(true);

//             const res = await API.get(
//                 `/user/${user._id}?page=${pageNum}&limit=6`
//             );

//             const newBlogs = res.data.data;

//             if (pageNum === 1) {
//                 setBlogs(newBlogs);
//                 setPage(1);
//             } else {
//                 setBlogs((prev) => [...prev, ...newBlogs]);
//             }

//             const totalPages = res.data.pagination.totalPages;

//             setHasMore(pageNum < totalPages);

//         } catch (err) {
//             toast.error("Failed to load blogs");
//         } finally {
//             setBlogLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (user?._id) {
//             fetchUserBlogs(1);
//         }
//     }, [user]);

//     const loadMore = () => {
//         const nextPage = page + 1;
//         setPage(nextPage);
//         fetchUserBlogs(nextPage);
//     };

//     //  Upload Profile Pic
//     const handleProfileUpload = async (file) => {
//         try {
//             setUploading(true);

//             const formData = new FormData();
//             formData.append("media", file);
//             //console.log(file);
//             formData.append("type", "profile");

//             const res = await API.post("/user/upload-profile-pic", formData, {
//                 // headers: {
//                 //     "Content-Type": "multipart/form-data",
//                 // },
//             });

//             setUser((prev) => ({
//                 ...prev,
//                 profilePic: res.data.data.profilePic,
//             }));

//             toast.success("Profile updated");
//         } catch (err) {
//             toast.error("Upload failed");
//         } finally {
//             setUploading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-black text-white flex items-center justify-center">
//                 <p className="text-gray-400">Loading profile...</p>
//             </div>
//         );
//     }

//     if (!user) return null;

//     return (
//         <div className="min-h-screen bg-black text-white">

//             {/* HERO (IMPROVED VISIBILITY) */}
//             <div className="relative h-110 w-full overflow-hidden">
//                 <img
//                     src={user.cover?.url || " https://res.cloudinary.com/dtzqjly9a/image/upload/v1777128786/anime-landscape-of-cabins-in-the-countryside-between-mountains_3840x2160_xtrafondos.com_zyuq9c.jpg"}
//                     alt="cover"
//                     className="w-full h-full object-cover opacity-80" // increased visibility
//                 />
//                 <div className="absolute inset-0 bg-linear-to-b from-black/30 to-black" />
//             </div>

//             <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10">

//                 <div className="flex flex-col md:flex-row gap-8 items-start">

//                     {/*  PROFILE IMAGE WITH UPLOAD */}
//                     <div className="relative group w-40 h-40 rounded-2xl overflow-hidden border border-white/10 shadow-lg cursor-pointer">

//                         <img
//                             src={user.profilePic?.url || " https://res.cloudinary.com/dtzqjly9a/image/upload/v1777125248/default_itqef1.png"}
//                             alt="profile"
//                             className="w-full h-full object-cover"
//                         />

//                         {/* HOVER OVERLAY */}
//                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
//                             <FaPen className="text-white text-lg" />
//                         </div>

//                         {/* HIDDEN INPUT */}
//                         <input
//                             type="file"
//                             accept="image/*"
//                             className="absolute inset-0 opacity-0 cursor-pointer"
//                             onChange={(e) => {
//                                 if (e.target.files[0]) {
//                                     handleProfileUpload(e.target.files[0]);
//                                 }
//                             }}
//                         />

//                     </div>

//                     {/* TEXT */}
//                     <div className="flex-1">

//                         <h1 className="text-4xl font-light mb-2 tracking-tight">
//                             {user.firstName} {user.lastName}
//                         </h1>

//                         <p className="text-gray-400 max-w-xl">
//                             {user.bio}
//                         </p>

//                         <button
//                             onClick={() => setOpen(true)}
//                             className="mt-5 bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
//                         >
//                             Edit Profile
//                         </button>
//                         {/* create blog  */}
//                         <button
//                             onClick={() => navigate("/createblog")}
//                             className="mt-5 ml-2 bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
//                         >
//                             create Blog
//                         </button>

//                     </div>
//                 </div>

//                 {/* STATS */}
//                 <div className="flex gap-10 mt-10 border-t border-white/10 pt-6 text-sm">
//                     <div>
//                         <p className="text-lg font-medium">
//                             {user.followersCount || 0}
//                         </p>
//                         <p className="text-gray-500">Followers</p>
//                     </div>
//                     <div>
//                         <p className="text-lg font-medium">
//                             {user.followingCount || 0}
//                         </p>
//                         <p className="text-gray-500">Following</p>
//                     </div>
//                     <div>
//                         <p className="text-lg font-medium"> {blogs.length}</p>
//                         <p className="text-gray-500">Posts</p>
//                     </div>
//                 </div>

//                 {/* TABS */}
//                 <div className="mt-10 border-b border-white/10 flex gap-8 text-sm">
//                     <button className="pb-3 border-b border-white">
//                         POSTS
//                     </button>
//                     <button className="pb-3 text-gray-500 hover:text-white">
//                         LIKED
//                     </button>
//                 </div>

//                 {/* POSTS */}
//                 {/* <div className="grid md:grid-cols-3 gap-6 mt-8">
//                     {[1, 2, 3].map((item) => (
//                         <div
//                             key={item}
//                             className="bg-[#111111] border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition"
//                         >
//                             <p className="text-gray-400 text-sm">
//                                 Your content will appear here
//                             </p>
//                         </div>
//                     ))}
//                 </div> */}

//                 <div className="mt-8">

//                     {blogs.length === 0 && !blogLoading && (
//                         <p className="text-gray-500 text-center">
//                             No blogs yet 🚀
//                         </p>
//                     )}

//                     <div className="grid md:grid-cols-3 gap-6">

//                         {blogs.map((blog) => (
//                             <div
//                                 key={blog._id}
//                                 onClick={() => navigate(`/previewblog/${blog._id}`)}
//                                 className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden hover:scale-[1.02] transition cursor-pointer"
//                             >
//                                 {/* COVER */}
//                                 <img
//                                     src={blog.cover?.url || "https://via.placeholder.com/300"} // I need to change this link later 
//                                     className="w-full h-40 object-cover"
//                                 />

//                                 {/* CONTENT */}
//                                 <div className="p-4 space-y-2">

//                                     <h2 className="text-lg font-medium line-clamp-2">
//                                         {blog.title}
//                                     </h2>

//                                     <p className="text-xs text-gray-400">
//                                         {blog.category?.name} •{" "}
//                                         {new Date(blog.createdAt).toLocaleDateString()}
//                                     </p>

//                                     <div className="flex justify-between text-xs text-gray-400 pt-2">
//                                         <span>❤️ {blog.likes?.length || 0}</span>
//                                         <span>👁️ {blog.views}</span>
//                                     </div>

//                                 </div>
//                             </div>
//                         ))}

//                     </div>

//                     {/* LOAD MORE */}
//                     {hasMore && (
//                         <div className="flex justify-center mt-8">
//                             <button
//                                 onClick={loadMore}
//                                 className="bg-white text-black px-6 py-2 rounded-full text-sm"
//                             >
//                                 {blogLoading ? "Loading..." : "Load More"}
//                             </button>
//                         </div>
//                     )}

//                 </div>

//             </div>



//             {
//                 open && (
//                     <EditUserModal
//                         user={user}
//                         onClose={() => setOpen(false)}
//                         refresh={fetchProfile}
//                     />
//                 )
//             }
//         </div >
//     );
// };

// export default Profile;



import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import EditUserModal from "../modals/EditUserModal";
import { FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [blogLoading, setBlogLoading] = useState(false);

    //  PROFILE
    const fetchProfile = async () => {
        try {
            const res = await API.get("/user/profile");
            setUser(res.data.data);
        } catch {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // BLOGS
    const fetchUserBlogs = async (pageNum = 1) => {
        if (!user?._id) return;

        try {
            setBlogLoading(true);

            const res = await API.get(
                `/blog/${user._id}?page=${pageNum}&limit=6`
            );

            const newBlogs = res.data.data;

            if (pageNum === 1) {
                setBlogs(newBlogs);
                setPage(1);
            } else {
                setBlogs((prev) => [...prev, ...newBlogs]);
            }

            const totalPages = res.data.pagination.totalPages;
            setHasMore(pageNum < totalPages);

        } catch {
            toast.error("Failed to load blogs");
        } finally {
            setBlogLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchUserBlogs(1);
        }
    }, [user]);

    const loadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchUserBlogs(next);
    };

    //  PROFILE PIC UPLOAD
    const handleProfileUpload = async (file) => {
        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("media", file);
            formData.append("type", "profile");

            const res = await API.post("/user/upload-profile-pic", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setUser((prev) => ({
                ...prev,
                profilePic: res.data.data.profilePic,
            }));

            toast.success("Profile updated");
        } catch (err) {
            toast.error(err.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                Loading profile...
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white">

            {/* HERO */}
            <div className="relative h-105 w-full overflow-hidden">
                <img
                    src={
                        user.cover?.url ||
                        "https://res.cloudinary.com/dtzqjly9a/image/upload/v1777128786/anime-landscape-of-cabins-in-the-countryside-between-mountains_3840x2160_xtrafondos.com_zyuq9c.jpg"
                    }
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/30 to-black" />
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10">

                {/* PROFILE */}
                <div className="flex flex-col md:flex-row gap-8">

                    {/* IMAGE */}
                    <div className="relative group w-40 h-40 rounded-2xl overflow-hidden border border-white/10 cursor-pointer">
                        <img
                            src={
                                user.profilePic?.url ||
                                "https://res.cloudinary.com/dtzqjly9a/image/upload/v1777125248/default_itqef1.png"
                            }
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                            <FaPen />
                        </div>

                        <input
                            type="file"
                            className="absolute inset-0 opacity-0"
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    handleProfileUpload(e.target.files[0]);
                                }
                            }}
                        />
                    </div>

                    {/* TEXT */}
                    <div>
                        <h1 className="text-4xl font-light">
                            {user.firstName} {user.lastName}
                        </h1>

                        <p className="text-gray-400 mt-2">{user.bio}</p>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => setOpen(true)}
                                className="mt-2 bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
                            >
                                Edit Profile
                            </button>

                            <button
                                onClick={() => navigate("/createblog")}
                                className="mt-2 ml-2 bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
                            >
                                Create Post
                            </button>
                        </div>
                    </div>
                </div>

                {/* STATS */}
                <div className="flex gap-10 mt-10 border-t border-white/10 pt-6">
                    <div>
                        <p className="text-lg">{user.followersCount || 0}</p>
                        <p className="text-gray-500 text-sm">Followers</p>
                    </div>

                    <div>
                        <p className="text-lg">{user.followingCount || 0}</p>
                        <p className="text-gray-500 text-sm">Following</p>
                    </div>

                    <div>
                        <p className="text-lg">{blogs.length}</p>
                        <p className="text-gray-500 text-sm">Posts</p>
                    </div>
                </div>

                {/* POSTS */}
                <div className="mt-10">

                    {blogs.length === 0 && !blogLoading && (
                        <p className="text-gray-500 text-center">
                            No blogs yet. Start writing your first story ✍️
                        </p>
                    )}

                    <div className="grid md:grid-cols-3 gap-6">

                        {blogs.map((blog) => (
                            <div
                                key={blog._id}
                                onClick={() => navigate(`/previewblog/${blog._id}`)}
                                className="group bg-[#111] border border-white/10 rounded-xl overflow-hidden cursor-pointer"
                            >
                                <div className="relative">
                                    <img
                                        src={blog.cover?.url || "https://via.placeholder.com/300"}
                                        className="w-full h-40 object-cover group-hover:scale-105 transition"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                        View Blog
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h2 className="line-clamp-2">{blog.title}</h2>

                                    <p className="text-xs text-gray-400 mt-1">
                                        {blog.category?.name} •{" "}
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </p>

                                    <div className="flex justify-between text-xs mt-2 text-gray-400">
                                        <span>❤️ {blog.likes?.length || 0}</span>
                                        <span>👁️ {blog.views}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>

                    {/* LOAD MORE */}
                    {hasMore && (
                        <div className="flex justify-center mt-8">
                            <button onClick={loadMore}>
                                {blogLoading ? "Loading..." : "Load More"}
                            </button>
                        </div>
                    )}
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


