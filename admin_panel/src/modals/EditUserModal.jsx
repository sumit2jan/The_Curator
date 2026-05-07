import React, { useMemo } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import countryList from "react-select-country-list";

const EditProfileModal = ({ user, onClose, refresh }) => {
    console.log("MODAL USER:", user);

    const countryOptions = useMemo(() => countryList().getData(), []);

    const handleCoverUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append("media", file);

            await API.post("/user/upload-cover-pic", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Cover updated");
            refresh();
        } catch (err) {
            //console.log(err.response);
            toast.error(err.response?.data?.message || "Cover upload failed");

        }
    };

    const formik = useFormik({
        initialValues: {
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            username: user.username || "",
            email: user.email || "",
            country: user.country || "",
            bio: user.bio || "",
            gender: user.gender || "",
            profileVisibility: user.profileVisibility || "",
            dob: user.dob ? user.dob.split("T")[0] : "",
        },

        validationSchema: Yup.object({
            firstName: Yup.string().required("First name is required"),
            lastName: Yup.string().required("Last name is required"),
            username: Yup.string().min(3).required("Username is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            country: Yup.string().required("Country is required"),
            gender: Yup.string().required("Gender is required"),
            profileVisibility: Yup.string().required("profilecisibility  is required"),
            dob: Yup.date().required("Date of birth is required"),
            bio: Yup.string().max(500, "Max 500 characters"),
        }),

        onSubmit: async (values, { setSubmitting }) => {
            try {
                await API.put(`/user/update/${user._id || user.userId}`, values);

                toast.success("Profile updated successfully");

                refresh();
                onClose();
            } catch (err) {
                console.log(err.response);
                toast.error(err.response?.data?.message || "Update failed");
            } finally {
                setSubmitting(false);
            }
        },
    });
    return (
        <>
            {/* CINEMATIC ANIMATIONS */}
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

                {/* BACKDROP */}
                <div
                    className="absolute inset-0 bg-black/80 animate-bg"
                    onClick={onClose}
                />

                {/* MODAL */}
                <div className="relative z-10 w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.9)] animate-card max-h-[90vh] overflow-y-auto">

                    {/* HEADER */}
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

                        <button
                            onClick={onClose}
                            className="text-[#71717a] hover:text-white p-2 rounded-full hover:bg-white/5 transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* COVER */}
                    <div className="relative group h-45 w-full rounded-xl overflow-hidden mb-6 cursor-pointer">
                        <img src={
                            user.cover?.url ||
                            "https://res.cloudinary.com/dtzqjly9a/image/upload/v1777128786/anime-landscape-of-cabins-in-the-countryside-between-mountains_3840x2160_xtrafondos.com_zyuq9c.jpg"
                        }
                            alt="cover"
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                            <span className="text-white text-sm">Change Cover</span>
                        </div>

                        <input
                            type="file"
                            className="absolute inset-0 opacity-0"
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    handleCoverUpload(e.target.files[0]);
                                }
                            }}
                        />
                    </div>

                    {/* FORM (UNCHANGED LOGIC) */}
                    <form onSubmit={formik.handleSubmit} className="space-y-5">

                        {/* FIRST + LAST */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <input {...formik.getFieldProps("firstName")} placeholder="First Name" className={`input ${formik.touched.firstName && formik.errors.firstName ? "border-red-500" : ""}`} />
                                {formik.touched.firstName && formik.errors.firstName && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.firstName}</p>
                                )}
                            </div>

                            <div>
                                <input {...formik.getFieldProps("lastName")} placeholder="Last Name" className={`input ${formik.touched.lastName && formik.errors.lastName ? "border-red-500" : ""}`} />
                                {formik.touched.lastName && formik.errors.lastName && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* USERNAME */}
                        <div>
                            <input {...formik.getFieldProps("username")} placeholder="Username" className={`input ${formik.touched.username && formik.errors.username ? "border-red-500" : ""}`} />
                            {formik.touched.username && formik.errors.username && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.username}</p>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <input {...formik.getFieldProps("email")} placeholder="Email" className={`input ${formik.touched.email && formik.errors.email ? "border-red-500" : ""}`} />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                            )}
                        </div>

                        {/* GENDER */}
                        <div>
                            <select {...formik.getFieldProps("gender")} className={`input ${formik.touched.gender && formik.errors.gender ? "border-red-500" : ""}`}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {formik.touched.gender && formik.errors.gender && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.gender}</p>
                            )}
                        </div>
                        {/* profile visibility */}
                        <div>
                            <select {...formik.getFieldProps("profileVisibility")} className={`input ${formik.touched.profileVisibility && formik.errors.profileVisibility ? "border-red-500" : ""}`}>
                                <option value="">Select visibility</option>
                                <option value="public">public</option>
                                <option value="private">private</option>
                            </select>
                            {formik.touched.profileVisibility && formik.errors.profileVisibility && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.profileVisibility}</p>
                            )}
                        </div>

                        {/* DOB */}
                        <div>
                            <input
                                type="date"
                                max={new Date().toISOString().split("T")[0]}
                                {...formik.getFieldProps("dob")}
                                className={`input ${formik.touched.dob && formik.errors.dob ? "border-red-500" : ""}`}
                            />
                            {formik.touched.dob && formik.errors.dob && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.dob}</p>
                            )}
                        </div>

                        {/* COUNTRY */}
                        <div>
                            <Select
                                options={countryOptions}
                                value={countryOptions.find(c => c.label === formik.values.country)}
                                onChange={(val) => {
                                    formik.setFieldValue("country", val.label);
                                    formik.setFieldTouched("country", true);
                                }}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        backgroundColor: "#111",
                                        borderColor: "#333",
                                        borderRadius: "10px",
                                        padding: "4px",
                                        color: "white",
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        backgroundColor: "#111",
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isFocused ? "#222" : "#111",
                                        color: "white",
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: "white",
                                    }),
                                }}
                            />
                            {formik.touched.country && formik.errors.country && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.country}</p>
                            )}
                        </div>

                        {/* BIO */}
                        <div>
                            <textarea {...formik.getFieldProps("bio")} rows={3} placeholder="Bio" className={`input ${formik.touched.bio && formik.errors.bio ? "border-red-500" : ""}`} />
                            {formik.touched.bio && formik.errors.bio && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.bio}</p>
                            )}
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={!formik.isValid || formik.isSubmitting}
                            className={`w-full py-3 rounded-full font-semibold transition ${!formik.isValid
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-white text-black hover:scale-105"
                                }`}
                        >
                            {formik.isSubmitting ? "Saving..." : "Save Changes"}
                        </button>

                    </form>
                </div>
            </div>
        </>
    );



};

export default EditProfileModal;





// return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

//         <div
//             className="absolute inset-0 bg-black/80 backdrop-blur-md"
//             onClick={onClose}
//         />

//         <div className="relative z-10 w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl max-h-[90vh] overflow-y-auto">

//             <div className="flex justify-between items-start mb-8">
//                 <h2 className="text-3xl font-bold text-white">Profile</h2>

//                 <button onClick={onClose} className="text-gray-400 hover:text-white">
//                     ✕
//                 </button>
//             </div>

//             {/* COVER */}
//             <div className="relative group h-45 w-full rounded-xl overflow-hidden mb-6 cursor-pointer">
//                 <img src={user.cover?.url} className="w-full h-full object-cover" />

//                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
//                     <span className="text-white text-sm">Change Cover</span>
//                 </div>

//                 <input
//                     type="file"
//                     className="absolute inset-0 opacity-0"
//                     onChange={(e) => {
//                         if (e.target.files[0]) {
//                             handleCoverUpload(e.target.files[0]);
//                         }
//                     }}
//                 />
//             </div>

//             <form onSubmit={formik.handleSubmit} className="space-y-5">

//                 {/* FIRST + LAST NAME */}
//                 <div className="grid md:grid-cols-2 gap-4">

//                     <div>
//                         <input
//                             {...formik.getFieldProps("firstName")}
//                             placeholder="First Name"
//                             className={`input ${formik.touched.firstName && formik.errors.firstName ? "border-red-500" : ""}`}
//                         />
//                         {formik.touched.firstName && formik.errors.firstName && (
//                             <p className="text-red-500 text-xs mt-1">{formik.errors.firstName}</p>
//                         )}
//                     </div>

//                     <div>
//                         <input
//                             {...formik.getFieldProps("lastName")}
//                             placeholder="Last Name"
//                             className={`input ${formik.touched.lastName && formik.errors.lastName ? "border-red-500" : ""}`}
//                         />
//                         {formik.touched.lastName && formik.errors.lastName && (
//                             <p className="text-red-500 text-xs mt-1">{formik.errors.lastName}</p>
//                         )}
//                     </div>

//                 </div>

//                 {/* USERNAME */}
//                 <div>
//                     <input
//                         {...formik.getFieldProps("username")}
//                         placeholder="Username"
//                         className={`input ${formik.touched.username && formik.errors.username ? "border-red-500" : ""}`}
//                     />
//                     {formik.touched.username && formik.errors.username && (
//                         <p className="text-red-500 text-xs mt-1">{formik.errors.username}</p>
//                     )}
//                 </div>

//                 {/* EMAIL */}
//                 <div>
//                     <input
//                         {...formik.getFieldProps("email")}
//                         placeholder="Email"
//                         className={`input ${formik.touched.email && formik.errors.email ? "border-red-500" : ""}`}
//                     />
//                     {formik.touched.email && formik.errors.email && (
//                         <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
//                     )}
//                 </div>

//                 {/* GENDER */}
//                 <div>
//                     <select
//                         {...formik.getFieldProps("gender")}
//                         className={`input ${formik.touched.gender && formik.errors.gender ? "border-red-500" : ""}`}
//                     >
//                         <option value="">Select Gender</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                     </select>

//                     {formik.touched.gender && formik.errors.gender && (
//                         <p className="text-red-500 text-xs mt-1">{formik.errors.gender}</p>
//                     )}
//                 </div>

//                 {/* DOB */}
//                 <div>
//                     <input
//                         type="date"
//                         max={new Date().toISOString().split("T")[0]} // 🚀 future date block
//                         {...formik.getFieldProps("dob")}
//                         className={`input ${formik.touched.dob && formik.errors.dob ? "border-red-500" : ""}`}
//                     />

//                     {formik.touched.dob && formik.errors.dob && (
//                         <p className="text-red-500 text-xs mt-1">{formik.errors.dob}</p>
//                     )}
//                 </div>

//                 {/* COUNTRY (FIXED UI) */}
//                 <div>
//                     <Select
//                         options={countryOptions}
//                         value={countryOptions.find(c => c.label === formik.values.country)}
//                         onChange={(val) => {
//                             formik.setFieldValue("country", val.label);
//                             formik.setFieldTouched("country", true);
//                         }}
//                         styles={{
//                             control: (base, state) => ({
//                                 ...base,
//                                 backgroundColor: "#111",
//                                 borderColor:
//                                     formik.touched.country && formik.errors.country
//                                         ? "red"
//                                         : "#333",
//                                 borderRadius: "10px",
//                                 padding: "4px",
//                                 color: "white",
//                                 boxShadow: "none",
//                             }),
//                             menu: (base) => ({
//                                 ...base,
//                                 backgroundColor: "#111",
//                                 color: "white",
//                             }),
//                             option: (base, state) => ({
//                                 ...base,
//                                 backgroundColor: state.isFocused ? "#222" : "#111",
//                                 color: "white",
//                                 cursor: "pointer",
//                             }),
//                             singleValue: (base) => ({
//                                 ...base,
//                                 color: "white",
//                             }),
//                         }}
//                     />

//                     {formik.touched.country && formik.errors.country && (
//                         <p className="text-red-500 text-xs mt-1">{formik.errors.country}</p>
//                     )}
//                 </div>

//                 {/* BIO */}
//                 <div>
//                     <textarea
//                         {...formik.getFieldProps("bio")}
//                         rows={3}
//                         placeholder="Bio"
//                         className={`input ${formik.touched.bio && formik.errors.bio ? "border-red-500" : ""}`}
//                     />

//                     {formik.touched.bio && formik.errors.bio && (
//                         <p className="text-red-500 text-xs mt-1">{formik.errors.bio}</p>
//                     )}
//                 </div>

//                 {/* BUTTON */}
//                 <button
//                     type="submit"
//                     disabled={!formik.isValid || formik.isSubmitting}
//                     className={`w-full py-3 rounded-full font-semibold transition ${!formik.isValid
//                         ? "bg-gray-600 cursor-not-allowed"
//                         : "bg-white text-black hover:scale-105"
//                         }`}
//                 >
//                     {formik.isSubmitting ? "Saving..." : "Save Changes"}
//                 </button>

//             </form>


//         </div>
//     </div>
// );