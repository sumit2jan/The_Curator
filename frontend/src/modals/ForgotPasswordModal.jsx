import React, { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const inputsRef = useRef([]);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => setTimer(timer - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    if (!isOpen) return null;

    const handleSendOTP = async () => {
        if (!email) return toast.error("Email is required");

        try {
            setLoading(true);
            const res = await axios.post("/auth/password/send-otp", { email });
            toast.success(res.data.message);
            setStep(2);
            setTimer(60);
        } catch (err) {
            toast.error(err.response?.data?.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        const finalOtp = otp.join("");

        if (!finalOtp || !password || !confirmPassword) {
            return toast.error("All fields required");
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        try {
            setLoading(true);

            const res = await axios.post("/auth/password/reset", {
                email,
                otp: finalOtp,
                newPassword: password,
            });

            toast.success(res.data.message);
            onClose();
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData("text").trim();
        if (!/^\d{6}$/.test(pasteData)) return;

        const newOtp = pasteData.split("");
        setOtp(newOtp);
        inputsRef.current[5]?.focus();
    };

    const getStrength = () => {
        if (password.length < 6) return "Weak";
        if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return "Strong";
        return "Medium";
    };

    return (
        <>
            <div className="fixed inset-0 bg-linear-to-r from-black/90 via-black/60 to-black/90 backdrop-blur-sm flex items-center justify-center z-50 px-4">

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 text-center shadow-2xl"
                >

                    {/* close */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>

                    <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
                        {step === 1 ? "Forgot Password" : "Reset Password"}
                    </h2>

                    {step === 1 && (
                        <>
                            <p className="text-gray-300 text-sm mb-6">
                                Enter your email to receive an OTP
                            </p>

                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-300 focus:outline-none focus:border-white/40"
                            />

                            <button
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="mt-5 w-full bg-white text-black py-3 rounded-full hover:scale-[1.03] transition"
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <p className="text-gray-300 text-sm mb-6">
                                Enter the verification code
                            </p>

                            {/* otp */}
                            <div
                                className="flex justify-between gap-2 mb-6"
                                onPaste={handlePaste}
                            >
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        value={digit}
                                        ref={(el) => (inputsRef.current[i] = el)}
                                        onChange={(e) => handleOtpChange(e.target.value, i)}
                                        maxLength={1}
                                        className="w-10 sm:w-12 h-12 sm:h-14 text-center rounded-lg bg-white/10 border border-white/20 text-white text-lg focus:outline-none focus:border-white"
                                    />
                                ))}
                            </div>

                            {/* password */}
                            <div className="relative mb-3">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-white pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-300"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            <p className="text-xs mb-3 text-gray-400">
                                Strength: <span className="text-white">{getStrength()}</span>
                            </p>

                            <div className="relative mb-4">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-white pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-300"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            <button
                                onClick={handleResetPassword}
                                disabled={loading}
                                className="w-full bg-white text-black py-3 rounded-full hover:scale-[1.03] transition"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>

                            <p className="mt-4 text-xs text-gray-400">
                                {timer > 0 ? (
                                    `Resend in ${timer}s`
                                ) : (
                                    <span
                                        onClick={handleSendOTP}
                                        className="cursor-pointer text-white hover:underline"
                                    >
                                        Resend OTP
                                    </span>
                                )}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordModal;
// import React, { useState, useEffect } from "react";
// import axios from "../api/axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const ForgotPasswordModal = ({ isOpen, onClose }) => {
//     const navigate = useNavigate();

//     const [step, setStep] = useState(1);
//     const [loading, setLoading] = useState(false);

//     const [email, setEmail] = useState("");
//     const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");

//     const [timer, setTimer] = useState(0);

//     // Timer
//     useEffect(() => {
//         if (timer <= 0) return;
//         const interval = setInterval(() => setTimer(timer - 1), 1000);
//         return () => clearInterval(interval);
//     }, [timer]);

//     if (!isOpen) return null;

//     const handleSendOTP = async () => {
//         if (!email) return toast.error("Email is required");

//         try {
//             setLoading(true);

//             const res = await axios.post("/auth/password/send-otp", { email });

//             toast.success(res.data.message);
//             setStep(2);
//             setTimer(60);
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleResetPassword = async () => {
//         const finalOtp = otp.join("");

//         if (!finalOtp || !password || !confirmPassword) {
//             return toast.error("All fields required");
//         }

//         if (password !== confirmPassword) {
//             return toast.error("Passwords do not match");
//         }

//         try {
//             setLoading(true);

//             const res = await axios.post("/auth/password/reset", {
//                 email,
//                 otp: finalOtp,
//                 newPassword: password,
//             });

//             toast.success(res.data.message);

//             onClose();
//             navigate("/login");
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Reset failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // 🔢 OTP input handler
//     const handleOtpChange = (value, index) => {
//         if (!/^[0-9]?$/.test(value)) return;

//         const newOtp = [...otp];
//         newOtp[index] = value;
//         setOtp(newOtp);

//         // auto focus next
//         if (value && index < 5) {
//             document.getElementById(`otp-${index + 1}`).focus();
//         }
//     };

//     // 🔐 Password strength
//     const getStrength = () => {
//         if (password.length < 6) return "Weak";
//         if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return "Strong";
//         return "Medium";
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">

//             {/* Overlay */}
//             <div
//                 className="absolute inset-0 bg-black/70 backdrop-blur-md"
//                 onClick={onClose}
//             />

//             {/* Modal */}
//             <div className="relative z-10 w-full max-w-md bg-[#111111] text-white rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-8 animate-fadeIn">

//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-xl font-medium tracking-tight">
//                         {step === 1 ? "Forgot Password" : "Reset Password"}
//                     </h2>
//                     <button
//                         onClick={onClose}
//                         className="text-gray-500 hover:text-white transition"
//                     >
//                         ✕
//                     </button>
//                 </div>

//                 {/* STEP 1 */}
//                 {step === 1 && (
//                     <>
//                         <p className="text-gray-400 text-sm mb-5">
//                             Enter your email to receive an OTP
//                         </p>

//                         <input
//                             type="email"
//                             placeholder="Email Address"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm 
//           focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition"
//                         />

//                         <button
//                             onClick={handleSendOTP}
//                             disabled={loading}
//                             className="mt-5 w-full bg-white text-black py-3 rounded-full font-medium
//           hover:scale-[1.03] active:scale-[0.98] transition disabled:opacity-50"
//                         >
//                             {loading ? "Sending..." : "Send OTP"}
//                         </button>
//                     </>
//                 )}

//                 {/* STEP 2 */}
//                 {step === 2 && (
//                     <>
//                         <p className="text-gray-400 text-sm mb-4 text-center">
//                             Enter the verification code
//                         </p>

//                         {/* 🔥 OTP BOXES UPGRADED */}
//                         <div className="flex justify-between gap-2 mb-5">
//                             {otp.map((digit, i) => (
//                                 <input
//                                     key={i}
//                                     id={`otp-${i}`}
//                                     value={digit}
//                                     onChange={(e) => handleOtpChange(e.target.value, i)}
//                                     maxLength={1}
//                                     className="w-12 h-12 bg-black border border-white/10 rounded-lg text-center text-lg 
//               focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/30 transition
//               hover:border-white/20"
//                                 />
//                             ))}
//                         </div>

//                         {/* Password */}
//                         <input
//                             type="password"
//                             placeholder="New Password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full mb-3 bg-black border border-white/10 rounded-lg px-4 py-3 text-sm
//           focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition"
//                         />

//                         {/* Strength */}
//                         <p className="text-xs mb-3 text-gray-500">
//                             Strength: <span className="text-white">{getStrength()}</span>
//                         </p>

//                         <input
//                             type="password"
//                             placeholder="Confirm Password"
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             className="w-full mb-4 bg-black border border-white/10 rounded-lg px-4 py-3 text-sm
//           focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition"
//                         />

//                         <button
//                             onClick={handleResetPassword}
//                             disabled={loading}
//                             className="w-full bg-white text-black py-3 rounded-full font-medium
//           hover:scale-[1.03] active:scale-[0.98] transition disabled:opacity-50"
//                         >
//                             {loading ? "Resetting..." : "Reset Password"}
//                         </button>

//                         {/* Resend */}
//                         <p className="mt-4 text-xs text-center text-gray-500">
//                             {timer > 0 ? (
//                                 `Resend in ${timer}s`
//                             ) : (
//                                 <span
//                                     onClick={handleSendOTP}
//                                     className="cursor-pointer hover:text-white"
//                                 >
//                                     Resend OTP
//                                 </span>
//                             )}
//                         </p>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ForgotPasswordModal;