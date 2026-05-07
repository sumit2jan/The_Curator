import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as v from "yup";
import { verifyOTP, resendVerifyOTP } from "../api/axios";
import { toast } from "react-toastify";

//Naya Prop Add Kiya: 'email' (Parent se aayega)
const LoginVerifyModal = ({ isOpen, onClose, email }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputsRef = useRef([]);
    const [cooldown, setCooldown] = useState(60);

    // HATA DIYA: Session storage aur forceOpen wala useEffect

    // Timer logic (Same)
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    //Input change
    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    //Backspace
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    // Paste Support
    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData("text").trim();
        if (!/^\d{6}$/.test(pasteData)) return;

        const newOtp = pasteData.split("");
        setOtp(newOtp);
        inputsRef.current[5]?.focus();
    };

    const formik = useFormik({
        initialValues: {},
        validationSchema: v.object({}),

        onSubmit: async (_, { setSubmitting }) => {
            const finalOTP = otp.join("");

            if (finalOTP.length !== 6) {
                return toast.error("Enter complete OTP");
            }

            try {
                //Prop wala email use kar rahe hain
                const res = await verifyOTP({ email, otp: finalOTP });

                if (res.data.success) {
                    toast.success("Account verified! Please click login again.");
                    if (onClose) onClose(); // Modal close kar dega
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "OTP verification failed");
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleResend = async () => {
        if (cooldown > 0) return;

        try {
            setCooldown(60);
            //Prop wala email use kar rahe hain
            await resendVerifyOTP({ email });
            toast.success("OTP resent successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Resend failed");
        }
    };

    const handleCancel = () => {
        // HATA DIYA: sessionStorage.removeItem
        if (onClose) onClose(); // Seedha modal close karega
    };

    // Sirf isOpen prop par depend karega
    if (!isOpen) return null;

    return (
        <>
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
                        title="Cancel Verification"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Header */}
                    <h2 className="text-3xl sm:text-4xl font-semibold mb-3">
                        Verify your account
                    </h2>

                    <p className="text-gray-300 text-sm mb-8">
                        You need to verify your email before logging in. We've sent a 6-digit code.
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
                        {formik.isSubmitting ? "Verifying..." : "Verify & Continue"}
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

export default LoginVerifyModal;