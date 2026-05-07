import { toast } from "react-toastify";
import axios from "../../api/axios";

const CoverUploader = ({ cover, setCover }) => {

    const handleUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        try {
            const formData = new FormData();

            formData.append("media", file);       // 🔥 FIXED
            formData.append("type", "blogCover");

            const res = await axios.post(
                "/blog/upload-blog-cover",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

            setCover(res.data.data);
        } catch (err) {
            console.log(err);
            toast.error("Upload failed");
        }
    };

    const removeCover = () => {
        setCover(null);
    };

    return (
        <div className="w-full mt-6">
            <label className="block text-sm text-gray-400 mb-2">
                Cover Image
            </label>

            {/* Upload Box */}
            {!cover ? (
                <div className="border border-gray-700 rounded-xl p-6 bg-[#0f172a] text-center cursor-pointer hover:border-red-500 transition">
                    <input
                        type="file"
                        onChange={handleUpload}
                        className="hidden"
                        id="coverUpload"
                    />

                    <label
                        htmlFor="coverUpload"
                        className="cursor-pointer text-gray-400"
                    >
                        Click to upload cover image
                    </label>
                </div>
            ) : (
                <div className="relative mt-2">
                    <img
                        src={cover.url}
                        alt="cover"
                        className="w-full h-48 object-cover rounded-xl border border-gray-700"
                    />

                    {/* Remove Button */}
                    <button
                        onClick={removeCover}
                        className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded"
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
};

export default CoverUploader;