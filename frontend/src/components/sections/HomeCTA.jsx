import React from 'react'
import { useNavigate } from "react-router-dom";
import cta1 from "../../assets/Home/cta1.jpg"
import cta6 from "../../assets/Home/cta4.jpg"
import cta2 from "../../assets/Home/cta2.avif"
import cta5 from "../../assets/Home/cta3.avif"
import cta3 from "../../assets/Home/HomeFeatured3.jpg"
import cta4 from "../../assets/Home/HomeFeatured4.jpg"

const HomeCTA = () => {
    const navigate = useNavigate();
    return (
        <section className="bg-black py-40 px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

                {/*LEFT TEXT */}
                <div>
                    <h2
                        className="text-5xl md:text-6xl text-white mb-6 font-light leading-tight"
                        style={{ fontFamily: "Playfair Display" }}
                    >
                        Begin your <br /> narrative.
                    </h2>

                    <p className="text-gray-400 mb-10 max-w-md">
                        Join a global collective of creators and thinkers. Your first story is waiting to be told.
                    </p>

                    <button
                        onClick={() => navigate("/signup")}
                        className="px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition"
                    >
                        Get Started
                    </button>
                </div>

                {/*RIGHT SCROLLING IMAGES */}
                <div className="relative h-[420px] overflow-hidden flex gap-6">

                    {/* LEFT COLUMN */}
                    <div className="w-1/2 flex flex-col gap-6 animate-scrollUp">

                        <img
                            src={cta1}
                            className="rounded-2xl h-48 object-cover w-full"
                        />

                        <img
                            src={cta2}
                            className="rounded-2xl h-64 object-cover w-full"
                        />

                        <img
                            src={cta3}
                            className="rounded-2xl h-48 object-cover w-full"
                        />

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="w-1/2 flex flex-col gap-6 animate-scrollDown mt-10">

                        <img
                            src={cta4}
                            className="rounded-2xl h-64 object-cover w-full"
                        />

                        <img
                            src={cta5}
                            className="rounded-2xl h-48 object-cover w-full"
                        />

                        <img
                            src={cta6}
                            className="rounded-2xl h-64 object-cover w-full"
                        />

                    </div>

                    {/*SIDE FADE (VERY IMPORTANT) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none"></div>

                    {/*TOP & BOTTOM FADE */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>

                </div>

            </div>

            {/* Bottom text */}
            <p className="text-center text-xs text-gray-500 mt-16 tracking-widest">
                NO NOISE. NO TRACKING. PURE CREATION.
            </p>
        </section>
    );
}

export default HomeCTA
