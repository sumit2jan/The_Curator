import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaEye } from "react-icons/fa";

const BlogCard = ({ blog, onLikeToggle }) => {
    const navigate = useNavigate();

    const handleBlogClick = () => {
        if (blog?.slug) {
            navigate(`/blog/${blog.slug}`);
        }
    };

    const handleAuthorClick = (e) => {
        e.stopPropagation();

        if (blog?.author?._id) {
            navigate(`/profile/${blog.author._id}`);
        }
    };

    // =========================
    // HANDLE LIKE CLICK
    // =========================
    const handleLikeClick = (e) => {
        e.stopPropagation();

        // CALL PARENT FUNCTION
        onLikeToggle(blog._id);
    };

    return (
        <div
            onClick={handleBlogClick}
            className="group bg-[#0d0d12] rounded-2xl overflow-hidden cursor-pointer border border-[#2a2a35] transition-all duration-300 hover:-translate-y-1.5 hover:border-gray-600/50 hover:shadow-2xl hover:shadow-black/60 flex flex-col h-full"
        >
            {/* COVER IMAGE */}
            <div className="relative h-52 overflow-hidden shrink-0">
                <img
                    src={blog?.cover?.url || "/fallback.jpg"}
                    alt="cover"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0d0d12] via-transparent to-transparent opacity-90" />
            </div>

            {/* CONTENT */}
            <div className="p-5 flex flex-col grow">

                {/* TITLE */}
                <h3 className="text-white text-lg font-bold tracking-tight leading-snug line-clamp-2 mb-2 transition-colors group-hover:text-gray-200">
                    {blog?.title || "Untitled Blog"}
                </h3>

                {/* EXCERPT */}
                <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mb-4 grow">
                    {blog?.excerpt || "No description available"}
                </p>


                {/* =========================
                    ENGAGEMENT SECTION
                ========================= */}
                <div className="flex items-center gap-5 mb-4">

                    {/* LIKES */}
                    <button
                        onClick={handleLikeClick}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
                    >

                        {/* FILLED / OUTLINE HEART */}
                        {blog?.likedByCurrentUser ? (
                            <FaHeart className="text-red-500" />
                        ) : (
                            <FaRegHeart />
                        )}

                        {/* TOTAL LIKES */}
                        <span>
                            {blog?.totalLikes || 0}
                        </span>
                    </button>

                    {/* VIEWS */}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <FaEye />
                        <span>
                            {blog?.views || 0}
                        </span>
                    </div>
                </div>


                {/* AUTHOR */}
                <div className="mt-auto pt-3 border-t border-[#2a2a35]/50 flex items-center">
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAuthorClick(e);
                        }}
                        className="text-xs font-medium text-gray-500 hover:text-white transition-colors"
                    >
                        By{" "}
                        <span className="text-gray-300 group-hover:text-white transition-colors">
                            {blog?.author?.username || "Unknown"}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BlogCard;

// import { useNavigate } from "react-router-dom";

// const BlogCard = ({ blog }) => {
//     const navigate = useNavigate();

//     const handleBlogClick = () => {
//         if (blog?.slug) {
//             navigate(`/blog/${blog.slug}`);
//         }
//     };

//     const handleAuthorClick = (e) => {
//         e.stopPropagation();

//         if (blog?.author?._id) {
//             navigate(`/profile/${blog.author._id}`);
//         }
//     };

//     return (
//         <div
//             onClick={handleBlogClick}
//             className="group bg-[#0d0d12] rounded-2xl overflow-hidden cursor-pointer border border-[#2a2a35] transition-all duration-300 hover:-translate-y-1.5 hover:border-gray-600/50 hover:shadow-2xl hover:shadow-black/60 flex flex-col h-full"
//         >
//             {/* COVER IMAGE */}
//             <div className="relative h-52 overflow-hidden shrink-0">
//                 <img
//                     src={blog?.cover?.url || "/fallback.jpg"}
//                     alt="cover"
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                 />

//                 {/* GRADIENT OVERLAY - Smoother transition into the card body */}
//                 <div className="absolute inset-0 bg-linear-to-t from-[#0d0d12] via-transparent to-transparent opacity-90" />
//             </div>

//             {/* CONTENT */}
//             <div className="p-5 flex flex-col grow">

//                 {/* TITLE */}
//                 <h3 className="text-white text-lg font-bold tracking-tight leading-snug line-clamp-2 mb-2 transition-colors group-hover:text-gray-200">
//                     {blog?.title || "Untitled Blog"}
//                 </h3>

//                 {/* EXCERPT */}
//                 <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mb-4 grow">
//                     {blog?.excerpt || "No description available"}
//                 </p>

//                 {/* AUTHOR */}
//                 <div className="mt-auto pt-3 border-t border-[#2a2a35]/50 flex items-center">
//                     <div
//                         onClick={(e) => {
//                             e.stopPropagation(); // ⚠️ keeps your logic safe
//                             handleAuthorClick(e);
//                         }}
//                         className="text-xs font-medium text-gray-500 hover:text-white transition-colors"
//                     >
//                         By <span className="text-gray-300 group-hover:text-white transition-colors">{blog?.author?.username || "Unknown"}</span>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default BlogCard;
