import React from 'react'
import { useNavigate } from "react-router-dom";


const Footer = () => {
    const navigate = useNavigate();
    return (

        <footer className="bg-black text-white w-full px-6 md:px-12 pt-32 pb-12 flex justify-center">

            <div className="w-full max-w-[1500px] flex flex-col">

                {/*BIG BRAND (MASSIVE SCALE) */}
                <div className="mb-32 md:mb-48">
                    <h2
                        className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-none mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        The Curator.
                    </h2>
                    <p className="text-[#a1a1aa] text-lg md:text-2xl font-light max-w-lg leading-relaxed">
                        A premium platform for creators, writers, and thinkers.
                    </p>
                </div>

                {/*BOTTOM BAR (Editorial typography) */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-t border-white/15 pt-8">

                    {/* Links: Uppercase, wide tracking, small text */}
                    <div className="flex flex-wrap gap-8 md:gap-12 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[#71717a]">
                        <a href="#" className="hover:text-white transition-colors duration-300">
                            Privacy
                        </a>
                        <a href="#" className="hover:text-white transition-colors duration-300">
                            Terms
                        </a>
                        <a href="#" className="hover:text-white transition-colors duration-300">
                            Support
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[#52525b]">
                        © 2026 THE CURATOR
                    </div>

                </div>

            </div>

        </footer>
    )
}

export default Footer
