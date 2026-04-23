import React, { useState, useEffect } from "react";
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

    const [timer, setTimer] = useState(0);

    // Timer
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

    // 🔢 OTP input handler
    const handleOtpChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // auto focus next
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    // 🔐 Password strength
    const getStrength = () => {
        if (password.length < 6) return "Weak";
        if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return "Strong";
        return "Medium";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md bg-[#111111] text-white rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-8 animate-fadeIn">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium tracking-tight">
                        {step === 1 ? "Forgot Password" : "Reset Password"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition"
                    >
                        ✕
                    </button>
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <p className="text-gray-400 text-sm mb-5">
                            Enter your email to receive an OTP
                        </p>

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm 
          focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition"
                        />

                        <button
                            onClick={handleSendOTP}
                            disabled={loading}
                            className="mt-5 w-full bg-white text-black py-3 rounded-full font-medium
          hover:scale-[1.03] active:scale-[0.98] transition disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <p className="text-gray-400 text-sm mb-4 text-center">
                            Enter the verification code
                        </p>

                        {/* 🔥 OTP BOXES UPGRADED */}
                        <div className="flex justify-between gap-2 mb-5">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`otp-${i}`}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e.target.value, i)}
                                    maxLength={1}
                                    className="w-12 h-12 bg-black border border-white/10 rounded-lg text-center text-lg 
              focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/30 transition
              hover:border-white/20"
                                />
                            ))}
                        </div>

                        {/* Password */}
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mb-3 bg-black border border-white/10 rounded-lg px-4 py-3 text-sm
          focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition"
                        />

                        {/* Strength */}
                        <p className="text-xs mb-3 text-gray-500">
                            Strength: <span className="text-white">{getStrength()}</span>
                        </p>

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full mb-4 bg-black border border-white/10 rounded-lg px-4 py-3 text-sm
          focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition"
                        />

                        <button
                            onClick={handleResetPassword}
                            disabled={loading}
                            className="w-full bg-white text-black py-3 rounded-full font-medium
          hover:scale-[1.03] active:scale-[0.98] transition disabled:opacity-50"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

                        {/* Resend */}
                        <p className="mt-4 text-xs text-center text-gray-500">
                            {timer > 0 ? (
                                `Resend in ${timer}s`
                            ) : (
                                <span
                                    onClick={handleSendOTP}
                                    className="cursor-pointer hover:text-white"
                                >
                                    Resend OTP
                                </span>
                            )}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordModal;