import axios from "../../api/axios";
import { toast } from "react-toastify";

const MediaUploader = ({ media, setMedia }) => {

    const handleUpload = async (e) => {
        const files = e.target.files;

        for (let file of files) {
            try {
                const formData = new FormData();
                formData.append("media", file);
                formData.append("type", "blogMedia");

                const res = await axios.post(
                    "/blog/upload-blog-media",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });

                // ✅ FIX: spread (no nested array)
                setMedia((prev) => [...prev, ...res.data.data]);

            } catch (err) {
                console.log(err);
                toast.error("Upload failed");
            }
        }
    };

    const removeMedia = (public_id) => {
        setMedia((prev) =>
            prev.filter((item) => item.public_id !== public_id)
        );
    };

    return (
        <div className="w-full mt-6">
            <label className="block text-sm text-gray-400 mb-2">
                Upload Media
            </label>

            {/* Upload Box */}
            <div className="border border-gray-700 rounded-xl p-6 bg-[#0f172a] text-center cursor-pointer hover:border-white transition">
                <input
                    type="file"
                    multiple
                    onChange={handleUpload}
                    className="hidden"
                    id="mediaUpload"
                />

                <label
                    htmlFor="mediaUpload"
                    className="cursor-pointer text-gray-400"
                >
                    Click to upload images/videos
                </label>
            </div>

            {/* Preview */}
            {media.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {media.map((item) => (
                        <div
                            key={item.public_id}
                            className="relative rounded-xl overflow-hidden border border-gray-800 group"
                        >
                            {/* ✅ FIX: safe rendering */}
                            {item.type === "video" ? (
                                <video
                                    src={item.url}
                                    className="w-full h-32 object-cover"
                                    controls
                                />
                            ) : (
                                <img
                                    src={item.url}
                                    alt="media"
                                    className="w-full h-32 object-cover"
                                />
                            )}

                            {/* Remove Button */}
                            <button
                                onClick={() => removeMedia(item.public_id)}
                                className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MediaUploader;

// import axios from "../../api/axios";
// import { toast } from "react-toastify";
// const MediaUploader = ({ media, setMedia }) => {

//     const handleUpload = async (e) => {
//         const files = e.target.files;

//         for (let file of files) {
//             try {
//                 const formData = new FormData();
//                 formData.append("media", file);
//                 formData.append("type", "blogMedia");

//                 const res = await axios.post("/user/upload-blog-media", formData,
//                     {
//                         headers: {
//                             "Content-Type": "multipart/form-data",
//                         },
//                     });

//                 setMedia((prev) => [...prev, res.data.data]);
//             } catch (err) {
//                 console.log(err);
//                 toast.error("Upload failed");
//             }
//         }
//     };

//     const removeMedia = (public_id) => {
//         setMedia((prev) => prev.filter((item) => item.public_id !== public_id));
//     };

//     return (
//         <div className="w-full mt-6">
//             <label className="block text-sm text-gray-400 mb-2">
//                 Upload Media
//             </label>

//             {/* Upload Box */}
//             <div className="border border-gray-700 rounded-xl p-6 bg-[#0f172a] text-center cursor-pointer hover:border-red-500 transition">
//                 <input
//                     type="file"
//                     multiple
//                     onChange={handleUpload}
//                     className="hidden"
//                     id="mediaUpload"
//                 />

//                 <label htmlFor="mediaUpload" className="cursor-pointer text-gray-400">
//                     Click to upload images/videos
//                 </label>
//             </div>

//             {/* Preview */}
//             {media.length > 0 && (
//                 <div className="grid grid-cols-3 gap-4 mt-4">
//                     {media.map((item) => (
//                         <div
//                             key={item.public_id}
//                             className="relative rounded-lg overflow-hidden border border-gray-700"
//                         >
//                             {item.type === "image" ? (
//                                 <img
//                                     src={item.url}
//                                     alt=""
//                                     className="w-full h-32 object-cover"
//                                 />
//                             ) : (
//                                 <video
//                                     src={item.url}
//                                     className="w-full h-32 object-cover"
//                                     controls
//                                 />
//                             )}

//                             {/* Remove Button */}
//                             <button
//                                 onClick={() => removeMedia(item.public_id)}
//                                 className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
//                             >
//                                 ✕
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MediaUploader;