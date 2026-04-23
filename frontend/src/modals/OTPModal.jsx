import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as v from "yup";
import { verifySignupOTP, sendSignupOTP,resendSignupOTP } from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

  const OTPModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [cooldown, setCooldown] = useState(60);
  const [forceOpen, setForceOpen] = useState(false);

  useEffect(() => {
    const email = sessionStorage.getItem("verifyEmail");
    if (email) setForceOpen(true);
    else navigate("/signup");
  }, [navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // 🔢 Input change
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  //  NEW: Paste Support
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);

    // focus last input
    inputsRef.current[5]?.focus();
  };

  const formik = useFormik({
    initialValues: {},
    validationSchema: v.object({}),

    onSubmit: async (_, { setSubmitting }) => {
      const finalOTP = otp.join("");
      const email = sessionStorage.getItem("verifyEmail");

      if (finalOTP.length !== 6) {
        return toast.error("Enter complete OTP");
      }

      try {
        const res = await verifySignupOTP({ email, otp: finalOTP });

        if (res.data.success) {
          toast.success(res.data.message);
          sessionStorage.removeItem("verifyEmail");
          navigate("/login");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "OTP failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleResend = async () => {
    const email = sessionStorage.getItem("verifyEmail");
    if (cooldown > 0) return;

    try {
      await resendSignupOTP({
        email
      });
      setCooldown(60);
      toast.success("OTP resent successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Resend failed");
    }
  };

  const handleCancel = () => {
    sessionStorage.removeItem("verifyEmail");
    setForceOpen(false); // Modal hide karega
    if (onClose) onClose();
    navigate("/signup"); // Wapas form par bhej dega
  };

  if (!isOpen && !forceOpen) return null;

  return (
    <>
      {/*Animations */}
      <style>{`
        @keyframes fadeBlur {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(10px); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-backdrop { animation: fadeBlur 0.4s ease-out forwards; }
        .animate-modal { animation: popIn 0.4s ease-out forwards; }
      `}</style>

      {/* Cinematic Backdrop */}
      <div className="fixed inset-0 bg-linear-to-r from-black/90 via-black/60 to-black/90 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-backdrop">

        {/* Glass Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 text-center shadow-2xl animate-modal"
        >

            {/* Premium Close Button */}
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            title="Cancel Signup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <h2 className="text-3xl sm:text-4xl font-semibold mb-3">
            Verify your email
          </h2>

          <p className="text-gray-300 text-sm mb-8">
            We’ve sent a 6-digit code to your email
          </p>

          {/* OTP Inputs */}
          <div
            className="flex justify-between gap-2 sm:gap-3 mb-8"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => (inputsRef.current[i] = el)}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-10 sm:w-12 h-12 sm:h-14 text-center rounded-lg bg-white/10 border border-white/20 text-white text-lg sm:text-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
              />
            ))}
          </div>

          {/* Button */}
          <button
            onClick={formik.handleSubmit}
            disabled={formik.isSubmitting}
            className="w-full bg-white text-black py-3 rounded-full font-medium hover:scale-[1.03] active:scale-[0.98] transition"
          >
            {formik.isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>

          {/* Resend */}
          <div className="mt-6 text-sm text-gray-400">
            {cooldown > 0 ? (
              `Resend in ${cooldown}s`
            ) : (
              <span
                onClick={handleResend}
                className="cursor-pointer text-white hover:underline"
              >
                Resend OTP
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OTPModal;



// import React, { useState, useRef, useEffect } from "react";
// import { useFormik } from "formik";
// import * as v from "yup";
// import { verifySignupOTP, sendSignupOTP } from "../api/axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const OTPModal = ({ isOpen }) => {
//     const navigate = useNavigate();

//     const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//     const inputsRef = useRef([]);
//     const [cooldown, setCooldown] = useState(60);
//     const [forceOpen, setForceOpen] = useState(false);

//     //  Force open if email exists
//     useEffect(() => {
//         const email = sessionStorage.getItem("verifyEmail");

//         if (email) {
//             setForceOpen(true);
//         } else {
//             navigate("/signup"); // no email → go back
//         }
//     }, [navigate]);

//     // Cooldown Timer
//     useEffect(() => {
//         if (cooldown <= 0) return;

//         const timer = setInterval(() => {
//             setCooldown((prev) => prev - 1);
//         }, 1000);

//         return () => clearInterval(timer);
//     }, [cooldown]);

//     // 🔢 Handle OTP input
//     const handleChange = (value, index) => {
//         if (!/^[0-9]?$/.test(value)) return;

//         const newOtp = [...otp];
//         newOtp[index] = value;
//         setOtp(newOtp);

//         // Move forward
//         if (value && index < 5) {
//             inputsRef.current[index + 1].focus();
//         }
//     };

//     // ⬅️ Handle backspace
//     const handleKeyDown = (e, index) => {
//         if (e.key === "Backspace" && !otp[index] && index > 0) {
//             inputsRef.current[index - 1].focus();
//         }
//     };

//     const formik = useFormik({
//         initialValues: {},
//         validationSchema: v.object({}),

//         onSubmit: async (_, { setSubmitting }) => {
//             const finalOTP = otp.join("");
//             const email = sessionStorage.getItem("verifyEmail");

//             if (finalOTP.length !== 6) {
//                 return toast.error("Enter complete OTP");
//             }

//             try {
//                 const res = await verifySignupOTP({ email, otp: finalOTP });

//                 if (res.data.success) {
//                     toast.success(res.data.message);

//                     sessionStorage.removeItem("verifyEmail"); // 🔓 unlock
//                     navigate("/login");
//                 }
//             } catch (err) {
//                 toast.error(err.response?.data?.message || "OTP failed");
//             } finally {
//                 setSubmitting(false);
//             }
//         },
//     });

//     // 🔁 RESEND OTP
//     const handleResend = async () => {
//         const email = sessionStorage.getItem("verifyEmail");

//         if (cooldown > 0) return;

//         try {
//             setCooldown(60);

//             await sendSignupOTP({
//                 email,
//                 username: "temp",
//                 password: "temp12345",
//             });

//             toast.success("OTP resent successfully");
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Resend failed");
//         }
//     };

//     // 🔒 Force modal visibility
//     if (!isOpen && !forceOpen) return null;

//     return (
//         // 🔥 Cinematic Backdrop: Darker with a subtle blur
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            
//             {/* 🔥 Premium White Modal */}
//             <div
//                 className="bg-white p-8 md:p-10 rounded-[2rem] w-full max-w-[420px] shadow-2xl text-center"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 <h2 
//                     className="text-3xl font-bold text-black mb-8 tracking-tight"
//                     style={{ fontFamily: "'Playfair Display', serif" }}
//                 >
//                     Verify OTP
//                 </h2>

//                 {/* 🔥 Sleek OTP INPUTS */}
//                 <div className="flex justify-between gap-2 mb-8">
//                     {otp.map((digit, i) => (
//                         <input
//                             key={i}
//                             type="text"
//                             maxLength={1}
//                             value={digit}
//                             ref={(el) => (inputsRef.current[i] = el)}
//                             onChange={(e) => handleChange(e.target.value, i)}
//                             onKeyDown={(e) => handleKeyDown(e, i)}
//                             className="w-12 h-14 md:w-14 md:h-16 text-center border border-gray-200 rounded-xl text-2xl font-semibold text-black bg-[#f4f4f5] focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-200"
//                         />
//                     ))}
//                 </div>

//                 {/* 🔥 Solid Black Verify Button */}
//                 <button
//                     onClick={formik.handleSubmit}
//                     disabled={formik.isSubmitting}
//                     className="w-full bg-black text-white py-4 rounded-full text-base font-medium hover:bg-[#1a1a1a] transition-all duration-300 disabled:opacity-70 cursor-pointer"
//                 >
//                     {formik.isSubmitting ? "Verifying..." : "Verify OTP"}
//                 </button>

//                 {/* 🔥 Premium Resend Section */}
//                 <p className="mt-6 text-sm text-[#71717a] font-medium tracking-wide">
//                     {cooldown > 0 ? (
//                         `Resend code in ${cooldown}s`
//                     ) : (
//                         <span
//                             onClick={handleResend}
//                             className="text-black cursor-pointer underline underline-offset-4 hover:text-gray-600 transition-colors"
//                         >
//                             Resend OTP
//                         </span>
//                     )}
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default OTPModal;