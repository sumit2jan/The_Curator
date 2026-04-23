import React from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const EditProfileModal = ({ user, onClose, refresh }) => {

    const formik = useFormik({
        initialValues: {
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            username: user.username || "",
            email: user.email || "",
            country: user.country || "",
            bio: user.bio || "",
        },

        validationSchema: Yup.object({
            firstName: Yup.string().required("First name is required"),
            lastName: Yup.string().required("Last name is required"),
            username: Yup.string().min(3).required("Username is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            country: Yup.string().required("Country is required"),
            bio: Yup.string().max(200, "Max 200 characters"),
        }),

        onSubmit: async (values, { setSubmitting }) => {
            try {
                await API.put(`/user/update/${user._id || user.userId}`, values);

                toast.success("Profile updated successfully");

                refresh();
                onClose();
            } catch (err) {
                toast.error(err.response?.data?.message || "Update failed");
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <>
            {/* 🔥 Cinematic Animations */}
            <style>{`
                @keyframes blurFade {
                    0% { opacity: 0; backdrop-filter: blur(0px); }
                    100% { opacity: 1; backdrop-filter: blur(12px); }
                }
                @keyframes slideUpFade {
                    0% { opacity: 0; transform: translateY(30px) scale(0.98); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-bg { animation: blurFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-card { animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>

            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

                {/* 🔥 Intensely Dark Blurred Overlay */}
                <div
                    className="absolute inset-0 bg-black/80 animate-bg"
                    onClick={onClose}
                />

                {/* 🔥 High-End Dark Modal */}
                <div className="relative z-10 w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.9)] animate-card max-h-[90vh] overflow-y-auto custom-scrollbar">

                    {/* 🔥 Editorial Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h2
                                className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Profile.
                            </h2>
                            <p className="text-[#a1a1aa] text-sm font-light tracking-wide">
                                Refine your identity and personal details.
                            </p>
                        </div>

                        {/* Sleek Close Button */}
                        <button
                            onClick={onClose}
                            className="text-[#71717a] hover:text-white p-2 rounded-full hover:bg-white/5 transition-all duration-300"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* 🔥 Form */}
                    <form onSubmit={formik.handleSubmit} className="space-y-6">

                        {/* Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#71717a] font-bold mb-2">First Name</label>
                                <input
                                    {...formik.getFieldProps("firstName")}
                                    className="w-full bg-[#111111] border border-white/5 rounded-xl px-5 py-4 text-white text-base outline-none focus:border-white/40 focus:bg-[#151515] transition-all duration-300 placeholder:text-[#3f3f46]"
                                    placeholder="Enter first name"
                                />
                                {formik.touched.firstName && formik.errors.firstName && (
                                    <p className="text-[#ef4444] text-xs mt-2 font-medium tracking-wide">{formik.errors.firstName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#71717a] font-bold mb-2">Last Name</label>
                                <input
                                    {...formik.getFieldProps("lastName")}
                                    className="w-full bg-[#111111] border border-white/5 rounded-xl px-5 py-4 text-white text-base outline-none focus:border-white/40 focus:bg-[#151515] transition-all duration-300 placeholder:text-[#3f3f46]"
                                    placeholder="Enter last name"
                                />
                                {formik.touched.lastName && formik.errors.lastName && (
                                    <p className="text-[#ef4444] text-xs mt-2 font-medium tracking-wide">{formik.errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#71717a] font-bold mb-2">Username</label>
                            <input
                                {...formik.getFieldProps("username")}
                                className="w-full bg-[#111111] border border-white/5 rounded-xl px-5 py-4 text-white text-base outline-none focus:border-white/40 focus:bg-[#151515] transition-all duration-300 placeholder:text-[#3f3f46]"
                                placeholder="@username"
                            />
                            {formik.touched.username && formik.errors.username && (
                                <p className="text-[#ef4444] text-xs mt-2 font-medium tracking-wide">{formik.errors.username}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#71717a] font-bold mb-2">Email</label>
                            <input
                                {...formik.getFieldProps("email")}
                                className="w-full bg-[#111111] border border-white/5 rounded-xl px-5 py-4 text-white text-base outline-none focus:border-white/40 focus:bg-[#151515] transition-all duration-300 placeholder:text-[#3f3f46]"
                                placeholder="name@example.com"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-[#ef4444] text-xs mt-2 font-medium tracking-wide">{formik.errors.email}</p>
                            )}
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#71717a] font-bold mb-2">Country</label>
                            <input
                                {...formik.getFieldProps("country")}
                                className="w-full bg-[#111111] border border-white/5 rounded-xl px-5 py-4 text-white text-base outline-none focus:border-white/40 focus:bg-[#151515] transition-all duration-300 placeholder:text-[#3f3f46]"
                                placeholder="Your country"
                            />
                            {formik.touched.country && formik.errors.country && (
                                <p className="text-[#ef4444] text-xs mt-2 font-medium tracking-wide">{formik.errors.country}</p>
                            )}
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#71717a] font-bold mb-2">Bio</label>
                            <textarea
                                rows={3}
                                {...formik.getFieldProps("bio")}
                                className="w-full bg-[#111111] border border-white/5 rounded-xl px-5 py-4 text-white text-base outline-none focus:border-white/40 focus:bg-[#151515] transition-all duration-300 resize-none placeholder:text-[#3f3f46]"
                                placeholder="Tell us about yourself..."
                            />
                            {formik.touched.bio && formik.errors.bio && (
                                <p className="text-[#ef4444] text-xs mt-2 font-medium tracking-wide">{formik.errors.bio}</p>
                            )}
                        </div>

                        {/* 🔥 High-End Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="group w-full bg-white text-black py-4 rounded-full text-base font-semibold transition-all duration-300 hover:bg-gray-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-3 cursor-pointer"
                            >
                                <span>{formik.isSubmitting ? "Saving..." : "Save Changes"}</span>
                                {!formik.isSubmitting && (
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                                        →
                                    </span>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
};

export default EditProfileModal;