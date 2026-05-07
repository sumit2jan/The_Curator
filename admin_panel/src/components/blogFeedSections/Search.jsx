import { useState, useEffect } from "react";

const Search = ({ searchType, setSearch, setSearchType }) => {
    const [input, setInput] = useState("");

    // Debounce (important)
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(input);
        }, 400);

        return () => clearTimeout(timer);
    }, [input, setSearch]);

    return (
        <div className="w-full flex justify-center-safe mt-6 mb-8">

            {/* THE PREMIUM PILL WRAPPER */}
            <div className="inline-flex items-center p-1.5 rounded-full bg-[#0a0a0f] border border-[#2a2a35] shadow-sm">

                {/* TOGGLE SEGMENT */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setSearchType("blog")}
                        className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-out select-none active:scale-95
                            ${searchType === "blog"
                                ? "bg-white text-black shadow-md shadow-white/10"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        Posts
                    </button>

                    <button
                        onClick={() => setSearchType("user")}
                        className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-out select-none active:scale-95
                            ${searchType === "user"
                                ? "bg-white text-black shadow-md shadow-white/10"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        Users
                    </button>
                </div>

                {/* SUBTLE DIVIDER */}
                <div className="w-px h-6 bg-[#2a2a35] mx-3"></div>

                {/* INPUT SEGMENT */}
                <div className="flex items-center gap-2 pr-4 pl-1">
                    {/* Clean SVG Search Icon instead of Emoji */}
                    <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>

                    <input
                        type="text"
                        placeholder={
                            searchType === "blog"
                                ? "Search Posts..."
                                : "Search users..."
                        }
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="bg-transparent border-none outline-none text-white text-sm w-48 sm:w-64 placeholder-gray-600 transition-all focus:placeholder-gray-400"
                    />
                </div>

            </div>
        </div>
    );
};

export default Search;

// return (
//         <div className="w-full flex justify-start">

//             <div className="flex items-center gap-2 bg-[#1e293b] px-4 py-2 rounded-xl border border-white/10 shadow-sm">

//                 {/* TYPE SELECT */}
//                 <select
//                     onChange={(e) => setSearchType(e.target.value)}
//                     className="bg-transparent text-white outline-none text-sm cursor-pointer"
//                 >
//                     <option value="blog">Blogs</option>
//                     <option value="user">Users</option>
//                 </select>

//                 {/* INPUT */}
//                 <input
//                     type="text"
//                     placeholder="Search blogs or users..."
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     className="bg-transparent outline-none text-white text-sm w-56 placeholder-gray-400"
//                 />

//             </div>

//         </div>
//     );