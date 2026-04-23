import React from 'react'
import { useNavigate } from "react-router-dom";
import FeaturedImage1 from "../../assets/Home/HomeFeatured1.jpg"
import FeaturedImage2 from "../../assets/Home/HomeFeatured2.jpg"
import FeaturedImage3 from "../../assets/Home/HomeFeatured3.jpg"
import FeaturedImage4 from "../../assets/Home/HomeFeatured4.jpg"

const HomeFeaturedSection = () => {
    const navigate = useNavigate();
    return (
        <section className="bg-[#f8f8f8] text-black py-32 px-6">
            <div className="max-w-6xl mx-auto">

                {/* 🔥 Heading */}
                <div className="flex justify-between items-end mb-20">

                    <div>
                        <p className="text-xs tracking-widest text-gray-500 mb-3 uppercase">
                            Curated Selection
                        </p>

                        <h2
                            className="text-5xl md:text-6xl font-light tracking-tight"
                            style={{ fontFamily: "Playfair Display" }}
                        >
                            Featured Stories
                        </h2>
                    </div>

                    <button className="text-sm border border-black/20 px-5 py-2 rounded-full hover:bg-black hover:text-white transition">
                        View All →
                    </button>

                </div>

                {/*Grid */}
                <div className="grid md:grid-cols-3 gap-8">

                    {/*BIG CARD */}
                    <div className="md:col-span-2 relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition duration-500 group-hover:-translate-y-1">

                        <img
                            src={FeaturedImage1}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

                        {/* Text */}
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                            <span className="text-xs opacity-70">The Craft</span>
                            <h3 className="text-2xl mt-1 font-medium">
                                The Architecture of Silence
                            </h3>
                        </div>

                    </div>

                    {/*SIDE CARD */}
                    <div className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition duration-500 group-hover:-translate-y-1">

                        <img
                            src={FeaturedImage2}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

                        <div className="absolute bottom-6 left-6 right-6 text-white">
                            <span className="text-xs opacity-70">Innovation</span>
                            <h3 className="text-lg mt-1 font-medium">
                                Augmented Creativity
                            </h3>
                        </div>

                    </div>

                </div>

                {/*SECOND ROW */}
                <div className="grid md:grid-cols-2 gap-8 mt-10">

                    {/* CARD 1 */}
                    <div className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition duration-500 group-hover:-translate-y-1">

                        <img
                            src={FeaturedImage3}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

                        <div className="absolute bottom-6 left-6 right-6 text-white">
                            <span className="text-xs opacity-70">Nature</span>
                            <h3 className="text-lg mt-1 font-medium">
                                Whispers of the Wild
                            </h3>
                        </div>

                    </div>

                    {/* CARD 2 */}
                    <div className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition duration-500 group-hover:-translate-y-1">

                        <img
                            src={FeaturedImage4}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

                        <div className="absolute bottom-6 left-6 right-6 text-white">
                            <span className="text-xs opacity-70">Philosophy</span>
                            <h3 className="text-lg mt-1 font-medium">
                                The Analogue Soul
                            </h3>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    )
}

export default HomeFeaturedSection
