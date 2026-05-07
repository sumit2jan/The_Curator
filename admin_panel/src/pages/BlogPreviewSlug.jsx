import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { FiMoreVertical } from "react-icons/fi";
import Swal from "sweetalert2";

const BlogPreview = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    // FETCH BLOG
    const fetchBlog = async () => {
        try {
            const res = await API.get(`/blog/get-blogslug/${slug}`);
            setBlog(res.data.data);
        } catch (err) {
            toast.error("Failed to load blog");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlog();
    }, [slug]);

    // DELETE BLOG
    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Delete Blog?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",

            // 🔥 THEME
            background: "#0b0b0b",
            color: "#fff",

            confirmButtonColor: "#dc2626", // red
            cancelButtonColor: "#1f2937",

            customClass: {
                popup: "rounded-2xl border border-white/10",
                title: "text-lg font-semibold",
                confirmButton: "px-4 py-2 rounded-lg",
                cancelButton: "px-4 py-2 rounded-lg",
            },
        });

        if (result.isConfirmed) {
            try {
                await API.delete(`/blog/delete-blog/${id}`);

                await Swal.fire({
                    title: "Deleted!",
                    text: "Your blog has been deleted.",
                    icon: "success",
                    background: "#0b0b0b",
                    color: "#fff",
                    confirmButtonColor: "#2563eb",
                });

                navigate("/profile");

            } catch (err) {
                Swal.fire({
                    title: "Error",
                    text: "Failed to delete blog",
                    icon: "error",
                    background: "#0b0b0b",
                    color: "#fff",
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b1120] text-white flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="bg-black text-white min-h-screen">

            {/* 🔥HERO */}
            <div className="relative h-[75vh] w-full">

                {/* IMAGE */}
                <img
                    src={blog.cover?.url || "https://res.cloudinary.com/dtzqjly9a/image/upload/v1777372733/brad-pitt-as-sonny-5120x2880-21920_egylqw.jpg"}
                    className="w-full h-full object-cover"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/55 to-transparent" />

                {/* CONTENT */}
                <div className="absolute bottom-16 left-10 md:left-20 max-w-3xl z-10">

                    <h1 className="text-4xl md:text-6xl font-semibold mb-4 leading-tight">
                        {blog.title}
                    </h1>

                    <p className="text-gray-300 text-sm tracking-wide">
                        {blog.category?.name} •{" "}
                        {new Date(blog.createdAt).toLocaleDateString()} •{" "}
                        {blog.author?.username}
                    </p>
                </div>

                {/* 🔥 SETTINGS (FIXED ABOVE NAVBAR) */}
                <div className="absolute top-24 right-6 z-20">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="bg-black/60 hover:bg-black p-2 rounded-full backdrop-blur"
                    >
                        <FiMoreVertical size={18} />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-3 bg-[#111] border border-white/10 rounded-xl w-40 overflow-hidden shadow-lg">
                            <button
                                onClick={() => navigate(`/updateblog/${blog._id}`)}  // ab edit blog wala page banana hai hamne 
                                className="block w-full text-left px-4 py-3 hover:bg-white/10"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="block w-full text-left px-4 py-3 hover:bg-red-500/20 text-red-400"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {/* 🔥 CONTENT */}
            <div className="max-w-3xl mx-auto px-6 py-16">

                <div
                    className="prose prose-invert max-w-none leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* 🔥 MEDIA (UPGRADED) */}
                {blog.media?.length > 0 && (
                    <div className="mt-16">

                        <h2 className="text-lg mb-6 text-gray-400 tracking-wide">
                            Media
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            {blog.media.map((item) => (
                                <div
                                    key={item._id}
                                    className="overflow-hidden rounded-2xl group border border-white/10"
                                >
                                    {item.type === "video" ? (
                                        <video
                                            src={item.url}
                                            controls
                                            className="w-full h-[300px] object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={item.url}
                                            className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-500"
                                        />
                                    )}
                                </div>
                            ))}

                        </div>
                    </div>
                )}

                {/* 🔥 STATS */}
                <div className="flex justify-between items-center mt-16 border-t border-white/10 pt-6 text-gray-400">
                    <span>❤️ {blog.likes?.length || 0}</span>
                    <span>👁️ {blog.views}</span>
                </div>

                {/* 🔥 COMMENTS */}
                <div className="mt-16 border-t border-white/10 pt-8">
                    <h2 className="text-xl mb-4">Comments</h2>

                    <div className="bg-[#111] border border-white/10 p-6 rounded-xl text-gray-400">
                        No comments yet 🚀
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BlogPreview;