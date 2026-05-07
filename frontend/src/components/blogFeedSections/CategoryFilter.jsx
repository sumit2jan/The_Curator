import React from "react";

const CategoryFilter = ({
    categories = [],
    selectedCategories = [],
    setSelectedCategories,
    loading = false,
}) => {

    const toggleCategory = (id) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter((c) => c !== id));
        } else {
            setSelectedCategories([...selectedCategories, id]);
        }
    };

    const handleAll = () => {
        setSelectedCategories([]);
    };
    return (
        <div className="w-full space-y-3">

            {/* TITLE - Cleaned up */}
            {/* <h2 className="text-xl font-bold tracking-tight text-white mb-2">
                Categories
            </h2> */}

            {/* CONTAINER */}
            <div className="relative">

                {/* CONTENT */}
                {loading ? (
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-10 w-24 rounded-full bg-[#2a2a35] animate-pulse"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="relative group">

                        {/* LEFT FADE - Blends smoothly with your dark background */}
                        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />

                        {/* RIGHT FADE */}
                        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black via-black/80 to-transparent z-10" />

                        {/* LEFT BUTTON - Upgraded with SVG and better styling */}
                        <button
                            onClick={() => {
                                const container = document.getElementById("category-scroll");
                                container.scrollBy({ left: -250, behavior: "smooth" });
                            }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center h-8 w-8 rounded-full bg-[#1a1a2e] border border-[#2a2a35] text-white hover:bg-[#2a2a35] shadow-lg active:scale-90 ml-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* RIGHT BUTTON - Upgraded with SVG */}
                        <button
                            onClick={() => {
                                const container = document.getElementById("category-scroll");
                                container.scrollBy({ left: 250, behavior: "smooth" });
                            }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center h-8 w-8 rounded-full bg-[#1a1a2e] border border-[#2a2a35] text-white hover:bg-[#2a2a35] shadow-lg active:scale-90 mr-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* SCROLL AREA */}
                        <div
                            id="category-scroll"
                            className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-6"
                        >
                            {/* ALL BUTTON */}
                            <button
                                onClick={handleAll}
                                className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ease-out active:scale-95 border
                                ${selectedCategories.length === 0
                                        ? "bg-white text-black border-white shadow-md shadow-white/10"
                                        : "bg-transparent text-gray-400 border-[#2a2a35] hover:border-gray-300 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                All
                            </button>

                            {/* CATEGORY LIST */}
                            {categories.map((cat) => (
                                <button
                                    key={cat._id}
                                    onClick={() => toggleCategory(cat._id)}
                                    className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ease-out active:scale-95 border
                                    ${selectedCategories.includes(cat._id)
                                            ? "bg-white text-black border-white shadow-md shadow-white/10"
                                            : "bg-transparent text-gray-400 border-[#2a2a35] hover:border-gray-300 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryFilter;

//  return (
//         <div className="w-full">

//             {/* TITLE */}
//             <h2 className="text-lg font-semibold text-white mb-3">
//                 Categories
//             </h2>

//             {/* LOADING STATE */}
//             {loading ? (
//                 <div className="flex gap-3 overflow-x-auto">
//                     {[1, 2, 3, 4, 5].map((i) => (
//                         <div
//                             key={i}
//                             className="h-9 w-20 bg-gray-700 rounded-full animate-pulse"
//                         />
//                     ))}
//                 </div>
//             ) : (
//                 <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">

//                     {/* ALL BUTTON */}
//                     <button
//                         onClick={handleAll}
//                         className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all duration-200
//             ${selectedCategories.length === 0
//                                 ? "bg-white text-black border-white shadow"
//                                 : "bg-transparent text-gray-300 border-gray-600 hover:bg-white hover:text-black"
//                             }`}
//                     >
//                         All
//                     </button>

//                     {/* CATEGORY LIST */}
//                     {categories.map((cat) => (
//                         <button
//                             key={cat._id}
//                             onClick={() => toggleCategory(cat._id)}
//                             className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all duration-200
//               ${selectedCategories.includes(cat._id)
//                                     ? "bg-white text-black border-white shadow"
//                                     : "bg-transparent text-gray-300 border-gray-600 hover:bg-white hover:text-black"
//                                 }`}
//                         >
//                             {cat.name}
//                         </button>
//                     ))}

//                 </div>
//             )}
//         </div>
//     );