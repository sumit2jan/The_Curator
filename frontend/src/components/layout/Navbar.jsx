import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/auth/authSlice";

const Navbar = () => {
    // Ye sirf mobile menu ko open/close karne ki UI state hai
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { token, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/");
        setIsMobileMenuOpen(false); // Logout par menu band kar do
    };

    return (
        // Top spacing aur center alignment
        <div className="fixed top-4 md:top-6 left-0 w-full flex flex-col items-center z-50 px-3 md:px-0">

            {/* The exact floating white pill */}
            <nav className="relative w-full md:w-[96%] max-w-[1500px] 
        bg-[#f8f8f8] text-black 
        rounded-full px-4 md:px-8 py-2 md:py-2.5
        flex items-center justify-between 
        shadow-[0_4px_40px_rgba(0,0,0,0.1)] z-50">

                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-black text-white flex items-center justify-center rounded font-bold text-[10px] md:text-sm tracking-wider">
                        TC
                    </div>
                    {/* Playfair Display font */}
                    <span className="font-['Playfair_Display'] font-bold text-base md:text-xl tracking-tight">
                        The Curator
                    </span>
                </Link>

                {/* Right Side Links, Buttons & Hamburger */}
                <div className="flex items-center gap-3 md:gap-8">

                    {/* --- LOGGED OUT STATE --- */}
                    {!token && (
                        <>
                            {/* Desktop Links (Mobile pe hidden rahenge) */}
                            <div className="hidden md:flex items-center gap-6">
                                <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === "/" ? "text-black" : "text-[#71717a] hover:text-black"}`}>
                                    Home
                                </Link>
                                <Link to="/signup" className={`text-sm font-medium transition-colors ${location.pathname === "/signup" ? "text-black" : "text-[#71717a] hover:text-black"}`}>
                                    Signup
                                </Link>
                            </div>

                            {/* Login Button */}
                            <Link to="/login" className="bg-black text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium hover:bg-[#1a1a1a] transition-colors whitespace-nowrap">
                                Login
                            </Link>
                        </>
                    )}

                    {/* --- LOGGED IN STATE --- */}
                    {token && (
                        <>
                            {/* Desktop Username (Mobile pe hidden rahega) */}
                            <div className="hidden md:flex items-center gap-6">
                                <span className="text-sm font-medium text-[#71717a]">
                                    Hi, {user?.username}
                                </span>
                            </div>

                            {/* Logout Button */}
                            <button onClick={handleLogout} className="bg-black text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium hover:bg-[#1a1a1a] transition-colors cursor-pointer whitespace-nowrap">
                                Logout
                            </button>
                        </>
                    )}

                    {/* Mobile Hamburger Icon (Sirf choti screen pe dikhega) */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex flex-col justify-center items-center w-6 h-6 gap-[4px]"
                    >
                        {/* 3 lines for the menu icon, with smooth animation for turning into 'X' */}
                        <span className={`block w-4 h-[2px] bg-black transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[6px]' : ''}`}></span>
                        <span className={`block w-4 h-[2px] bg-black transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-4 h-[2px] bg-black transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}></span>
                    </button>

                </div>
            </nav>

            {/* Mobile Dropdown Menu (Jab hamburger icon pe click hoga tabhi khulega) */}
            {isMobileMenuOpen && (
                <div className="md:hidden w-full mt-2 bg-[#f8f8f8] rounded-2xl shadow-lg px-5 py-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                    {!token ? (
                        <div className="flex flex-col gap-4">
                            <Link onClick={() => setIsMobileMenuOpen(false)} to="/" className={`text-base font-medium transition-colors ${location.pathname === "/" ? "text-black" : "text-[#71717a]"}`}>
                                Home
                            </Link>
                            <div className="w-full h-[1px] bg-gray-200"></div> {/* Divider */}
                            <Link onClick={() => setIsMobileMenuOpen(false)} to="/signup" className={`text-base font-medium transition-colors ${location.pathname === "/signup" ? "text-black" : "text-[#71717a]"}`}>
                                Signup
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <span className="text-base font-medium text-[#71717a]">
                                Logged in as: <strong className="text-black">{user?.username}</strong>
                            </span>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default Navbar;