import { useEffect, useState } from "react";
import axios from "../../api/axios";

const CategorySelect = ({ category, setCategory }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("/blog/blog-categories");
                setCategories(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="w-full">
            <label className="block text-sm text-gray-400 mb-2">
                Category
            </label>

            <div className="relative">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0f172a] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none"
                >
                    <option value="">Select Category</option>

                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Custom Arrow */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    ▼
                </div>
            </div>
        </div>
    );
};

export default CategorySelect;