import { useState, useEffect } from "react";
import API from "../api/axios";
import BlogCard from "../components/blogFeedSections/BlogCard";
import CategoryFilter from "../components/blogFeedSections/CategoryFilter";
import Search from "../components/blogFeedSections/Search";

const BlogFeed = () => {
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("blog");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(false);
    const [catLoading, setCatLoading] = useState(false);

    // FETCH BLOGS
    const fetchBlogs = async (reset = false) => {
        try {
            setLoading(true);

            const res = await API.get("/blog/blogs", {
                params: {
                    page,
                    limit: 6,
                    category: selectedCategories.length
                        ? selectedCategories.join(",")
                        : undefined,
                    search,
                    type: searchType
                },
            });

            const newBlogs = res.data.data;

            if (reset) {
                setBlogs(newBlogs);
            } else {
                setBlogs((prev) => [...prev, ...newBlogs]);
            }

            setTotalPages(res.data.pagination.totalPages);

        } catch (err) {
            console.error("Blog fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    // FETCH CATEGORIES
    const fetchCategories = async () => {
        try {
            setCatLoading(true);
            const res = await API.get("/blog/blog-categories");
            setCategories(res.data.data);
        } catch (err) {
            console.error("Category fetch error", err);
        } finally {
            setCatLoading(false);
        }
    };

    // INITIAL LOAD
    useEffect(() => {
        fetchCategories();
    }, []);

    // RESET WHEN FILTER CHANGES
    useEffect(() => {
        setPage(1);
        fetchBlogs(true);
    }, [selectedCategories, search, searchType]);

    // LOAD MORE WHEN PAGE CHANGES
    useEffect(() => {
        if (page !== 1) {
            fetchBlogs();
        }
    }, [page]);

    return (
        <div className="px-6 py-4 mt-21 ">

            {/* SEARCH */}
            <div className="mb-2">
                <Search
                    searchType={searchType}
                    setSearch={setSearch}
                    setSearchType={setSearchType}
                />
            </div>

            {/* CATEGORY */}
            <div className="mb-9">
                <CategoryFilter
                    categories={categories}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    loading={catLoading}
                />
            </div>


            {/* BLOGS */}
            <div>
                <h2 className="text-white text-xl font-semibold mb-4">
                    Latest Posts
                </h2>

                {blogs.length === 0 && !loading ? (
                    <p className="text-gray-400">No blogs found</p>
                ) : (
                    <>
                        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                            {blogs.map((blog) => (
                                <BlogCard key={blog._id} blog={blog} />
                            ))}
                        </div>

                        {/* LOAD MORE BUTTON */}
                        {page < totalPages && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setPage((prev) => prev + 1)}
                                    className="px-6 py-2 bg-white text-black rounded-lg hover:opacity-90 transition"
                                >
                                    {loading ? "Loading..." : "Load More"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogFeed;


// import { useState, useEffect } from "react";
// import API from "../api/axios";
// import BlogCard from "../components/blogFeedSections/BlogCard";
// import CategoryFilter from "../components/blogFeedSections/CategoryFilter";
// import Search from "../components/blogFeedSections/Search";

// const BlogFeed = () => {
//     const [blogs, setBlogs] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [search, setSearch] = useState("");
//     const [searchType, setSearchType] = useState("blog");

//     const [loading, setLoading] = useState(false);
//     const [catLoading, setCatLoading] = useState(false);

//     // FETCH BLOGS
//     const fetchBlogs = async () => {
//         try {
//             setLoading(true);

//             const res = await API.get("/user/blogs", {
//                 params: {
//                     category: selectedCategories.length
//                         ? selectedCategories.join(",")
//                         : undefined,
//                     search,
//                     type: searchType
//                 },
//             });

//             setBlogs(res.data.data);
//         } catch (err) {
//             console.error("Blog fetch error", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // FETCH CATEGORIES
//     const fetchCategories = async () => {
//         try {
//             setCatLoading(true);
//             const res = await API.get("/user/blog-categories");
//             setCategories(res.data.data);
//         } catch (err) {
//             console.error("Category fetch error", err);
//         } finally {
//             setCatLoading(false);
//         }
//     };

//     // INITIAL LOAD
//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     // FETCH BLOGS (debounced)
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             fetchBlogs();
//         }, 400);

//         return () => clearTimeout(timer);
//     }, [selectedCategories, search, searchType]);

//     return (
//         <div className="px-6 py-4 mt-12 space-y-6">

//             {/* CATEGORY FILTER */}
//             <CategoryFilter
//                 categories={categories}
//                 selectedCategories={selectedCategories}
//                 setSelectedCategories={setSelectedCategories}
//                 loading={catLoading}
//             />

//             {/* SEARCH BAR (NEW) */}
//             <Search
//                 setSearch={setSearch}
//                 setSearchType={setSearchType}
//             />

//             {/* BLOG SECTION */}
//             <div>
//                 <h2 className="text-white text-xl font-semibold mb-4">
//                     Latest Blogs
//                 </h2>

//                 {loading ? (
//                     <p className="text-gray-400">Loading...</p>
//                 ) : blogs.length === 0 ? (
//                     <p className="text-gray-400">No blogs found</p>
//                 ) : (
//                     <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
//                         {blogs.map((blog) => (
//                             <BlogCard key={blog._id} blog={blog} />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default BlogFeed;