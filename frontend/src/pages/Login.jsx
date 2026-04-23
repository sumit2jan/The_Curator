import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as v from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../redux/auth/authThunk"; // ✅ IMPORT THUNK
import { authSelector } from "../redux/auth/authSelectors";
import ForgotPasswordModal from "../modals/ForgotPasswordModal";


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const { token, loading } = useSelector(authSelector);

    //  Auto redirect if already logged in
    useEffect(() => {
        if (token) {
            navigate("/profile");
        }
    }, [token, navigate]);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },

        validationSchema: v.object({
            email: v
                .string()
                .trim()
                .email("Invalid Email")
                .required("Required"),

            password: v
                .string()
                .min(8, "Min 8 characters required")
                .required("Required"),
        }),

        // UPDATED SUBMIT
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            const resultAction = await dispatch(loginThunk(values));
            resetForm();
            //  SUCCESS CASE
            if (loginThunk.fulfilled.match(resultAction)) {
                toast.success("Login successful 🚀");
                navigate("/profile");
            }

            //  ERROR CASE
            else {
                const errorMessage = resultAction.payload;

                if (errorMessage === "Account not verified") {
                    toast.error("Account not verified. Please contact support.");
                } else {
                    toast.error(errorMessage || "Login failed");
                }
            }

            setSubmitting(false);
        },
    });

    return (
        <section className="min-h-screen bg-black text-white flex items-center justify-center px-6">

            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-16 items-center">

                {/* 🔥 LEFT SIDE */}
                <div>

                    <h1
                        className="text-4xl md:text-5xl mb-6 leading-tight font-light"
                        style={{ fontFamily: "Playfair Display" }}
                    >
                        Welcome back.
                    </h1>

                    <p className="text-gray-400 max-w-md">
                        Continue your journey. Dive back into your stories, ideas, and creations.
                    </p>

                </div>

                {/* 🔥 RIGHT SIDE FORM */}
                <div className="bg-[#111111] p-8 rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

                    <h2 className="text-xl font-medium mb-6 tracking-tight">
                        Login to your account
                    </h2>

                    <form onSubmit={formik.handleSubmit} className="space-y-5">

                        {/* EMAIL */}
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                {...formik.getFieldProps("email")}
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm 
              focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-400 text-xs mt-1">
                                    {formik.errors.email}
                                </p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                {...formik.getFieldProps("password")}
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm 
              focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-red-400 text-xs mt-1">
                                    {formik.errors.password}
                                </p>
                            )}
                        </div>


                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={formik.isSubmitting || loading}
                            className="w-full bg-white text-black py-3 rounded-full font-medium
                            hover:scale-[1.03] active:scale-[0.98] transition"
                        >
                            {loading ? "Logging in..." : "Continue"}
                        </button>

                    </form>


                    {/* 🔥 EXTRA LINK */}
                    <p className="text-xs text-gray-500 mt-6 text-center">
                        New here?{" "}
                        <span
                            onClick={() => navigate("/signup")}
                            className="text-white cursor-pointer hover:underline"
                        >
                            Create account
                        </span>
                    </p>

                    {/* forgot password link */}
                    <p

                        className="text-xs text-gray-500 mt-3  text-center cursor-pointer"
                    >
                        Forgot Password?{" "}
                        <span
                            onClick={() => setShowModal(true)}
                            className="text-white cursor-pointer hover:underline"
                        >
                            Create new password
                        </span>
                    </p>

                </div>
                <ForgotPasswordModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                />

            </div>


        </section>
    );
};

export default Login;