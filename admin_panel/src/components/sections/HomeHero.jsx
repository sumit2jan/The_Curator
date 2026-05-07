import React from "react";
import { useNavigate } from "react-router-dom";
import hero from "../../assets/Home/hero.jpg"

const Hero = () => {
    const navigate = useNavigate();
    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 overflow-hidden">

            {/*Background Image */}
            <div className="absolute inset-0">
                <img
                
                    // https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05
                    // https://images.unsplash.com/photo-1572372421973-dcbd21d537be?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
                    src={hero}
                    alt="bg"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Subtle Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]"></div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl">

                <h1
                    className="text-5xl md:text-7xl font-light leading-tight mb-6"
                    style={{ fontFamily: "Playfair Display" }}
                >
                    Write. Share. Inspire.
                </h1>

                <p className="text-gray-300 text-lg md:text-xl mb-8">
                    A premium platform for creators, writers, and thinkers.
                </p>

                <div className="flex items-center justify-center gap-4">

                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-200 transition">
                        Get Started
                    </button>

                    <button className="border border-white/20 px-6 py-3 rounded-full text-sm hover:bg-white/10 transition">
                        Browse Stories
                    </button>

                </div>

            </div>

            {/* Bottom me ek small scroll icon dikhega */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
                <div className="w-6 h-10 border border-white/30 rounded-full flex items-start justify-center p-1">
                    <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;