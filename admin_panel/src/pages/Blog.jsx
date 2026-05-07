import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-toastify";

import { useFormik } from "formik";
import * as Yup from "yup";

import BlogEditor from "../components/blogSections/BlogEditor";
import MediaUploader from "../components/blogSections/MediaUploader";
import CoverUploader from "../components/blogSections/CoverUploader";
import CategorySelect from "../components/blogSections/CategorySelect";

const Blog = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [media, setMedia] = useState([]);
    const [cover, setCover] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const blogSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        content: Yup.string().required("Content is required"),
        category: Yup.string().required("Category is required"),
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            content: "",
            category: "",
            excerpt: "",
            tags: [],
            visibility: "public",
        },
        validationSchema: blogSchema,
        enableReinitialize: !!id,

        onSubmit: async (values) => {
            try {
                setLoading(true);

                const payload = {
                    ...values,
                    media,
                    cover,
                };

                if (isEdit) {
                    await axios.put(`/blog/update-blog/${id}`, payload);
                    toast.success("Blog updated successfully ✏️");
                } else {
                    await axios.post(`/blog/create-blog`, payload);
                    toast.success("Blog created successfully 🚀");
                }

                navigate("/profile");
            } catch (err) {
                const message =
                    err?.response?.data?.message || "Something went wrong";

                toast.error(message);
            } finally {
                setLoading(false);
            }
        },
    });

    // ===== FETCH BLOG =====
    useEffect(() => {
        if (!id) return;

        const fetchBlog = async () => {
            try {
                const res = await axios.get(`/blog/get-blogid/${id}`);
                const blog = res.data.data;

                formik.setValues({
                    title: blog.title || "",
                    content: blog.content || "",
                    category: blog.category?._id || blog.category || "",
                    excerpt: blog.excerpt || "",
                    tags: blog.tags || [],
                    visibility: blog.visibility || "public",
                });

                setMedia(blog.media || []);
                setCover(blog.cover || null);

                setIsEdit(true);
            } catch (err) {
                toast.error("Failed to load blog");
            }
        };

        fetchBlog();
    }, [id]);

    return (
        <div className="min-h-screen bg-[#0b1120] text-white px-6 py-10 pt-28">
            <div className="max-w-7xl mx-auto grid grid-cols-3 gap-10">

                {/* LEFT */}
                <div className="col-span-2 space-y-8">

                    {/* TITLE */}
                    <div className="border-b border-gray-800 pb-4">
                        <input
                            type="text"
                            name="title"
                            placeholder="title..."
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            className="w-full bg-transparent text-3xl font-semibold placeholder-gray-500 outline-none"
                        />
                    </div>

                    {/* EXCERPT */}
                    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4">
                        <p className="text-gray-400 text-sm mb-2">Excerpt</p>
                        <textarea
                            name="excerpt"
                            placeholder="Short description..."
                            value={formik.values.excerpt}
                            onChange={formik.handleChange}
                            className="w-full bg-transparent outline-none text-sm text-gray-300 resize-none"
                            rows={3}
                        />
                    </div>

                    {/* EDITOR */}
                    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5">
                        <p className="text-gray-400 mb-3 text-sm">Content</p>

                        <BlogEditor
                            //key={formik.values.content}   // to fetch values from the edit blog 
                            content={formik.values.content}
                            setContent={(val) =>
                                formik.setFieldValue("content", val)
                            }
                        />
                    </div>

                    {/* MEDIA */}
                    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5">
                        <p className="text-gray-400 mb-3 text-sm">Media</p>
                        <MediaUploader media={media} setMedia={setMedia} />
                    </div>

                </div>

                {/* RIGHT */}
                <div className="space-y-6 sticky top-24 h-fit">

                    {/* CATEGORY */}
                    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5">
                        <p className="text-gray-400 mb-2 text-sm">Category</p>

                        <CategorySelect
                            category={formik.values.category}
                            setCategory={(val) =>
                                formik.setFieldValue("category", val)
                            }
                        />
                    </div>

                    {/* TAGS */}
                    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5">
                        <p className="text-gray-400 mb-2 text-sm">Tags</p>

                        <input
                            type="text"
                            placeholder="e.g. react, node"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const value = e.target.value.trim();
                                    if (!value) return;

                                    const currentTags = formik.values.tags || [];

                                    const updatedTags = [...currentTags, value];

                                    console.log("TAGS:", updatedTags);

                                    formik.setFieldValue("tags", updatedTags);

                                    e.target.value = "";
                                }
                            }}
                            className="w-full bg-transparent border border-gray-700 px-3 py-2 rounded-lg outline-none text-sm"
                        />

                        {/* SHOW TAGS */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {(formik.values.tags || []).map((tag, i) => (
                                <span
                                    key={i}
                                    className="bg-gray-800 px-3 py-1 text-xs rounded-full"
                                >
                                    {tag}
                                    <button
                                        onClick={() => {
                                            const updatedTags = formik.values.tags.filter((_, index) => index !== i);
                                            formik.setFieldValue("tags", updatedTags);
                                        }}
                                        className="text-gray-400 hover:text-red-400 text-xs"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* VISIBILITY */}
                    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5">
                        <p className="text-gray-400 mb-2 text-sm">Visibility</p>

                        <select
                            name="visibility"
                            value={formik.values.visibility}
                            onChange={formik.handleChange}
                            className="w-full bg-[#0b1120] border border-gray-700 px-3 py-2 rounded-lg outline-none"
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    {/* COVER */}
                    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5">
                        <p className="text-gray-400 mb-2 text-sm">Cover Image</p>
                        <CoverUploader cover={cover} setCover={setCover} />
                    </div>

                    {/* SUBMIT */}
                    <button
                        onClick={formik.handleSubmit}
                        disabled={loading}
                        className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-xl font-semibold transition"
                    >
                        {loading
                            ? "Saving..."
                            : isEdit
                                ? "Update Post"
                                : "Publish Post"}
                    </button>

                </div>

            </div>
        </div>
    );
};

export default Blog;





// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../api/axios";
// import { toast } from "react-toastify";

// import { useFormik } from "formik";
// import * as Yup from "yup";

// import BlogEditor from "../components/blogSections/BlogEditor";
// import MediaUploader from "../components/blogSections/MediaUploader";
// import CoverUploader from "../components/blogSections/CoverUploader";
// import CategorySelect from "../components/blogSections/CategorySelect";

// const CreateBlog = () => {
//     const navigate = useNavigate();

//     const [media, setMedia] = useState([]);
//     const [cover, setCover] = useState(null);
//     const [loading, setLoading] = useState(false);

//     // Validation Schema
//     const blogSchema = Yup.object({
//         title: Yup.string().required("Title is required"),
//         content: Yup.string().required("Content is required"),
//         category: Yup.string().required("Category is required"),
//     });

//     // Formik
//     const formik = useFormik({
//         initialValues: {
//             title: "",
//             content: "",
//             category: "",
//         },
//         validationSchema: blogSchema,
//         onSubmit: async (values) => {
//             try {
//                 setLoading(true);

//                 const payload = {
//                     ...values,
//                     media,
//                     cover,
//                 };

//                 const res = await axios.post("/user/create-blog", payload);

//                 toast.success("Blog created successfully 🚀");

//                 navigate("/profile");
//             } catch (err) {
//                 console.log(err);

//                 const message =
//                     err?.response?.data?.message || "Something went wrong";

//                 toast.error(message);
//             } finally {
//                 setLoading(false);
//             }
//         },
//     });

//     return (
//         <div className="min-h-screen bg-[#0b1120] text-white px-6 py-10 pt-28">
//             <div className="max-w-7xl mx-auto grid grid-cols-3 gap-10">

//                 {/* LEFT */}
//                 <div className="col-span-2 space-y-8">

//                     {/* TITLE */}
//                     <div className="border-b border-gray-800 pb-4">
//                         <input
//                             type="text"
//                             name="title"
//                             placeholder="Write your blog title..."
//                             value={formik.values.title}
//                             onChange={formik.handleChange}
//                             className="w-full bg-transparent text-3xl font-semibold placeholder-gray-500 outline-none"
//                         />
//                         {formik.touched.title && formik.errors.title && (
//                             <p className="text-red-500 text-sm mt-2">
//                                 {formik.errors.title}
//                             </p>
//                         )}
//                     </div>

//                     {/* EXCERPT */}
//                     <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4">
//                         <p className="text-gray-400 text-sm mb-2">Excerpt</p>
//                         <textarea
//                             name="excerpt"
//                             placeholder="Short description..."
//                             value={formik.values.excerpt || ""}
//                             onChange={formik.handleChange}
//                             className="w-full bg-transparent outline-none text-sm text-gray-300 resize-none"
//                             rows={3}
//                         />
//                     </div>

//                     {/* EDITOR */}
//                     <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5">
//                         <p className="text-gray-400 mb-3 text-sm">Content</p>

//                         <BlogEditor
//                             content={formik.values.content}
//                             setContent={(val) =>
//                                 formik.setFieldValue("content", val)
//                             }
//                         />
//                     </div>

//                     {/* MEDIA */}
//                     <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5">
//                         <p className="text-gray-400 mb-3 text-sm">Media</p>
//                         <MediaUploader media={media} setMedia={setMedia} />
//                     </div>

//                 </div>

//                 {/* RIGHT PANEL */}
//                 <div className="space-y-6 sticky top-24 h-fit">

//                     {/* CATEGORY */}
//                     <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5">
//                         <p className="text-gray-400 mb-2 text-sm">Category</p>

//                         <CategorySelect
//                             category={formik.values.category}
//                             setCategory={(val) =>
//                                 formik.setFieldValue("category", val)
//                             }
//                         />
//                     </div>

//                     {/* TAGS */}
//                     <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5">
//                         <p className="text-gray-400 mb-2 text-sm">Tags</p>

//                         <input
//                             type="text"
//                             placeholder="e.g. react, node"
//                             onKeyDown={(e) => {
//                                 if (e.key === "Enter") {
//                                     e.preventDefault();
//                                     const value = e.target.value.trim();
//                                     if (!value) return;

//                                     const tags = formik.values.tags || [];
//                                     formik.setFieldValue("tags", [...tags, value]);

//                                     e.target.value = "";
//                                 }
//                             }}
//                             className="w-full bg-transparent border border-gray-700 px-3 py-2 rounded-lg outline-none text-sm"
//                         />

//                         {/* Tag List */}
//                         <div className="flex flex-wrap gap-2 mt-3">
//                             {(formik.values.tags || []).map((tag, i) => (
//                                 <span
//                                     key={i}
//                                     className="bg-gray-800 px-3 py-1 text-xs rounded-full"
//                                 >
//                                     {tag}
//                                 </span>
//                             ))}
//                         </div>
//                     </div>

//                     {/* VISIBILITY */}
//                     <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5">
//                         <p className="text-gray-400 mb-2 text-sm">Visibility</p>

//                         <select
//                             name="visibility"
//                             value={formik.values.visibility || "public"}
//                             onChange={formik.handleChange}
//                             className="w-full bg-[#0b1120] border border-gray-700 px-3 py-2 rounded-lg outline-none"
//                         >
//                             <option value="public">Public</option>
//                             <option value="private">Private</option>
//                         </select>
//                     </div>

//                     {/* COVER */}
//                     <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5">
//                         <p className="text-gray-400 mb-2 text-sm">Cover Image</p>
//                         <CoverUploader cover={cover} setCover={setCover} />
//                     </div>

//                     {/* SUBMIT */}
//                     <button
//                         onClick={formik.handleSubmit}
//                         disabled={loading}
//                         className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-xl font-semibold transition"
//                     >
//                         {loading ? "Publishing..." : "Publish Blog"}
//                     </button>

//                 </div>

//             </div>
//         </div>
//     );
// };

// export default CreateBlog;


// //  <div className="min-h-screen bg-[#0b1120] text-white px-6 py-8 pt-24">
// //             <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">

// //                 {/* LEFT */}
// //                 <div className="col-span-2 space-y-8">

// //                     {/* Title */}
// //                     <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5">
// //                         <input
// //                             type="text"
// //                             name="title"
// //                             placeholder="Write your blog title..."
// //                             value={formik.values.title}
// //                             onChange={formik.handleChange}
// //                             className="w-full bg-transparent text-2xl font-semibold placeholder-gray-500 outline-none"
// //                         />
// //                         {formik.touched.title && formik.errors.title && (
// //                             <p className="text-red-500 text-sm mt-2">
// //                                 {formik.errors.title}
// //                             </p>
// //                         )}
// //                     </div>

// //                     {/* Editor */}
// //                     <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5">
// //                         <p className="text-gray-400 mb-3 text-sm">Content</p>

// //                         <BlogEditor
// //                             content={formik.values.content}
// //                             setContent={(val) =>
// //                                 formik.setFieldValue("content", val)
// //                             }
// //                         />

// //                         {formik.touched.content && formik.errors.content && (
// //                             <p className="text-red-500 text-sm mt-2">
// //                                 {formik.errors.content}
// //                             </p>
// //                         )}
// //                     </div>

// //                     {/* Media */}
// //                     <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5">
// //                         <p className="text-gray-400 mb-3 text-sm">Media</p>
// //                         <MediaUploader media={media} setMedia={setMedia} />
// //                     </div>

// //                 </div>

// //                 {/* RIGHT */}
// //                 <div className="space-y-6 sticky top-24 h-fit">

// //                     {/* Category */}
// //                     <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5">
// //                         <p className="text-gray-400 mb-3 text-sm">Category</p>

// //                         <CategorySelect
// //                             category={formik.values.category}
// //                             setCategory={(val) =>
// //                                 formik.setFieldValue("category", val)
// //                             }
// //                         />

// //                         {formik.touched.category && formik.errors.category && (
// //                             <p className="text-red-500 text-sm mt-2">
// //                                 {formik.errors.category}
// //                             </p>
// //                         )}
// //                     </div>

// //                     {/* Cover */}
// //                     <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5">
// //                         <p className="text-gray-400 mb-3 text-sm">Cover Image</p>
// //                         <CoverUploader cover={cover} setCover={setCover} />
// //                     </div>

// //                     {/* Submit */}
// //                     <button
// //                         onClick={formik.handleSubmit}
// //                         disabled={loading}
// //                         className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold transition shadow-lg shadow-red-900/30 disabled:opacity-50"
// //                     >
// //                         {loading ? "Publishing..." : "Publish Blog"}
// //                     </button>

// //                 </div>

// //             </div>
// //         </div>