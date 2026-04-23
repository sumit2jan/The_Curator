// import React, { useState } from "react";
// import { useFormik } from "formik";
// import * as v from "yup";
// import { toast } from "react-toastify";
// import { sendSignupOTP } from "../api/axios";
// import OTPModal from "../modals/OTPModal";


// const Signup = () => {
//   const [showModal, setShowModal] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       username: "",
//       email: "",
//       password: "",
//     },

//     validationSchema: v.object({
//       username: v
//         .string()
//         .min(3, "Min 3 characters")
//         .required("Required"),

//       email: v
//         .string()
//         .email("Invalid email")
//         .required("Required"),

//       password: v
//         .string()
//         .min(8, "Min 8 characters")
//         .required("Required"),
//     }),

//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         const res = await sendSignupOTP(values);

//         if (res.data.success) {
//           toast.success(res.data.message);

//           sessionStorage.setItem("verifyEmail", values.email);
//           setShowModal(true);
//         }
//       } catch (err) {
//         toast.error(err.response?.data?.message || "Signup failed");
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   return (
//     <section className="min-h-screen bg-black text-white flex items-center justify-center px-6">

//       <div className="w-full max-w-6xl grid md:grid-cols-2 gap-16 items-center">

//         {/* 🔥 LEFT SIDE */}
//         <div>
//           <h1
//             className="text-4xl md:text-5xl mb-6 leading-tight"
//             style={{ fontFamily: "Playfair Display" }}
//           >
//             Begin your journey.
//           </h1>

//           <p className="text-gray-400 max-w-md">
//             Join a curated space for creators, writers, and thinkers.
//             Build, share, and grow with AI-enhanced storytelling.
//           </p>
//         </div>

//         {/* 🔥 RIGHT SIDE FORM */}
//         <div className="bg-[#111111] p-8 rounded-2xl border border-white/10 shadow-xl">

//           <h2 className="text-xl font-semibold mb-6">
//             Create Account
//           </h2>

//           <form onSubmit={formik.handleSubmit} className="space-y-4">

//             {/* Username */}
//             <div>
//               <input
//                 type="text"
//                 name="username"
//                 placeholder="Username"
//                 className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition"
//                 {...formik.getFieldProps("username")}
//               />
//               {formik.touched.username && formik.errors.username && (
//                 <p className="text-red-400 text-xs mt-1">
//                   {formik.errors.username}
//                 </p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email Address"
//                 className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition"
//                 {...formik.getFieldProps("email")}
//               />
//               {formik.touched.email && formik.errors.email && (
//                 <p className="text-red-400 text-xs mt-1">
//                   {formik.errors.email}
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition"
//                 {...formik.getFieldProps("password")}
//               />
//               {formik.touched.password && formik.errors.password && (
//                 <p className="text-red-400 text-xs mt-1">
//                   {formik.errors.password}
//                 </p>
//               )}
//             </div>

//             {/* Button */}
//             <button
//               type="submit"
//               disabled={formik.isSubmitting}
//               className="w-full bg-white text-black py-3 rounded-full mt-4 
//               hover:scale-[1.03] active:scale-[0.98] transition"
//             >
//               {formik.isSubmitting ? "Sending OTP..." : "Begin your journey"}
//             </button>

//           </form>

//         </div>

//       </div>

//       <OTPModal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//       />
//     </section>
//   );
// };

// export default Signup;



import React, { useState } from "react";
import { useFormik } from "formik";
import * as v from "yup";
import { toast } from "react-toastify";
import { sendSignupOTP } from "../api/axios";
import OTPModal from "../modals/OTPModal";
import SignUpImage from "../assets/Signup/signup.jpg"
const Signup = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 NEW

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },

    validationSchema: v.object({
      username: v.string().min(3, "Min 3 characters").required("Required"),
      email: v.string().email("Invalid email").required("Required"),
      password: v.string().min(8, "Min 8 characters").required("Required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await sendSignupOTP(values);

        if (res.data.success) {
          toast.success(res.data.message);
          sessionStorage.setItem("verifyEmail", values.email);
          setShowModal(true);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Signup failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 text-white overflow-hidden">

      {/* Background Image */}
      <img
        src={SignUpImage}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      {/* <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div> */}
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/70"></div>

      {/*  CONTENT */}
      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE */}
        <div className="text-center md:text-left">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl mb-6 leading-tight"
            style={{ fontFamily: "Playfair Display" }}
          >
            Begin your journey.
          </h1>

          <p className="text-gray-300 max-w-md mx-auto md:mx-0">
            Join a curated space for creators, writers, and thinkers.
            Build, share, and grow with AI-enhanced storytelling.
          </p>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">

          <h2 className="text-xl font-semibold mb-6 text-center md:text-left">
            Create Account
          </h2>

          <form onSubmit={formik.handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-300 focus:outline-none focus:border-white/40 transition"
                {...formik.getFieldProps("username")}
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-400 text-xs mt-1">
                  {formik.errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-300 focus:outline-none focus:border-white/40 transition"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-300 focus:outline-none focus:border-white/40 transition pr-12"
                {...formik.getFieldProps("password")}
              />

              {/* 👁 Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

              {formik.touched.password && formik.errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-white text-black py-3 rounded-full mt-4 
              hover:scale-[1.03] active:scale-[0.98] transition"
            >
              {formik.isSubmitting ? "Sending OTP..." : "Begin your journey"}
            </button>

          </form>
        </div>

      </div>

      <OTPModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </section>
  );
};

export default Signup;