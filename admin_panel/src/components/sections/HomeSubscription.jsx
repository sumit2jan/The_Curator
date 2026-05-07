import React from 'react'
import { useNavigate } from "react-router-dom";
import pic3 from "../../assets/Home/HomeFeatured1.jpg"
import pic2 from "../../assets/Home/pic2.jpg"
import pic1 from "../../assets/Home/pic1.jpg"

const HomeSubscription = () => {
    const navigate = useNavigate();
    return (
        <section className="bg-[#f5f5f5] py-32 px-6 text-black">

            {/* HEADER */}
            <div className="max-w-5xl mx-auto text-center mb-20">

                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                    Creative Support, Enhanced by AI
                </h2>

                <p className="text-gray-600 max-w-2xl mx-auto">
                    Work faster with human creativity + AI assistance. Choose a plan that adapts to your workflow.
                </p>

            </div>

            {/* CARDS */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

                {/* CARD */}
                <div className="bg-black text-white rounded-2xl p-6 group hover:-translate-y-2 transition duration-300 shadow-xl">

                    <div className="overflow-hidden rounded-xl mb-6">
                        <img
                            src={pic1}
                            className="h-44 w-full object-cover group-hover:scale-105 transition duration-500"
                        />
                    </div>

                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold">1 Day</h3>
                        <span className="text-xs bg-white text-black px-3 py-1 rounded-full">
                            ₹900
                        </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">
                        A focused day of creative execution with AI-assisted ideation.
                    </p>

                    {/* AI FEATURES */}
                    <ul className="text-xs text-gray-400 space-y-2">
                        <li>• AI writing suggestions</li>
                        <li>• Smart content drafts</li>
                        <li>• Idea generation boost</li>
                    </ul>

                </div>

                {/* CARD */}
                <div className="bg-black text-white rounded-2xl p-6 group hover:-translate-y-2 transition duration-300 shadow-xl border border-white/10">

                    <div className="overflow-hidden rounded-xl mb-6">
                        <img
                            src={pic2}
                            className="h-44 w-full object-cover group-hover:scale-105 transition duration-500"
                        />
                    </div>

                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold">1 Week</h3>
                        <span className="text-xs bg-white text-black px-3 py-1 rounded-full">
                            ₹3000
                        </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">
                        Continuous collaboration with AI-enhanced workflows and creative support.
                    </p>

                    <ul className="text-xs text-gray-400 space-y-2">
                        <li>• AI co-writing assistant</li>
                        <li>• Automated editing help</li>
                        <li>• Content optimization</li>
                    </ul>

                </div>

                {/* CARD */}
                <div className="bg-black text-white rounded-2xl p-6 group hover:-translate-y-2 transition duration-300 shadow-xl">

                    <div className="overflow-hidden rounded-xl mb-6">
                        <img
                            src={pic3}
                            className="h-44 w-full object-cover group-hover:scale-105 transition duration-500"
                        />
                    </div>

                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold">1 Month</h3>
                        <span className="text-xs bg-white text-black px-3 py-1 rounded-full">
                            ₹10000
                        </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">
                        Long-term creative growth powered by advanced AI + human collaboration.
                    </p>

                    <ul className="text-xs text-gray-400 space-y-2">
                        <li>• AI-powered storytelling</li>
                        <li>• Advanced insights</li>
                        <li>• Strategy + execution support</li>
                    </ul>

                </div>

            </div>

        </section>
    );
}

export default HomeSubscription
