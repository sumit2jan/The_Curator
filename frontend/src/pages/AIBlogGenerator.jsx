import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../api/axios";
import { marked } from "marked";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const categories = [
    "Technology",
    "Programming",
    "Artificial Intelligence",
    "Machine Learning",
    "Cyber Security",
    "Web Development",
    "Mobile Development",
    "Anime",
    "Blockchain",
    "Business",
    "Finance",
    "Health",
    "Fitness",
    "Education",
    "Travel",
    "Sports",
];

const tones = [
    "Professional",
    "Casual",
    "Technical",
    "Creative",
    "Funny",
];

const AIBlogGenerator = () => {

    const [markdown, setMarkdown] = useState("");
    const [loading, setLoading] = useState(false);

    const htmlContent = marked(markdown);

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],

        content: `
            <p class="text-gray-400">
                Generated blog will appear here...
            </p>
        `,

        editorProps: {
            attributes: {
                class:
                    "prose prose-invert max-w-none focus:outline-none min-h-[500px]",
            },
        },
    });

    useEffect(() => {

        if (editor && markdown) {
            editor.commands.setContent(htmlContent);
        }

    }, [editor, htmlContent, markdown]);

    const formik = useFormik({

        initialValues: {
            topic: "",
            category: "",
            tone: "",
            words: "",
            tags: "",
        },

        validationSchema: Yup.object({

            topic: Yup.string()
                .min(3, "Minimum 3 characters")
                .required("Topic is required"),

            category: Yup.string()
                .required("Category is required"),

            tone: Yup.string()
                .required("Tone is required"),

            words: Yup.number()
                .min(100, "Minimum 100 words")
                .max(3000, "Maximum 3000 words")
                .required("Words are required"),

            tags: Yup.string()
                .required("Tags are required"),
        }),

        onSubmit: async (values) => {

            try {

                setLoading(true);

                const payload = {
                    ...values,

                    tags: values.tags
                        .split(",")
                        .map((tag) => tag.trim()),
                };

                const response = await axios.post(
                    "/ai/generate-blog",
                    payload
                );

                setMarkdown(response.data.markdown);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }
        },
    });

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-10">

            <div className="max-w-5xl mx-auto">

                <div className="bg-[#1e293b] p-8 rounded-2xl border border-gray-700">

                    <h1 className="text-4xl font-bold mb-2">
                        AI Blog Generator
                    </h1>

                    <p className="text-gray-400 mb-8">
                        Generate beautiful AI-powered blogs instantly.
                    </p>

                    <form
                        onSubmit={formik.handleSubmit}
                        className="space-y-6"
                    >

                        {/* Topic */}
                        <div>

                            <label className="block mb-2 font-medium">
                                Topic
                            </label>

                            <input
                                type="text"
                                name="topic"
                                placeholder="Enter blog topic"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.topic}
                                className="w-full p-4 rounded-xl bg-[#0f172a] border border-gray-600 outline-none"
                            />

                            {
                                formik.touched.topic &&
                                formik.errors.topic && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {formik.errors.topic}
                                    </p>
                                )
                            }

                        </div>

                        {/* Category */}
                        <div>

                            <label className="block mb-2 font-medium">
                                Category
                            </label>

                            <select
                                name="category"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.category}
                                className="w-full p-4 rounded-xl bg-[#0f172a] border border-gray-600 outline-none"
                            >
                                <option value="">
                                    Select Category
                                </option>

                                {
                                    categories.map((category) => (
                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>
                                    ))
                                }

                            </select>

                            {
                                formik.touched.category &&
                                formik.errors.category && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {formik.errors.category}
                                    </p>
                                )
                            }

                        </div>

                        {/* Tone */}
                        <div>

                            <label className="block mb-2 font-medium">
                                Tone
                            </label>

                            <select
                                name="tone"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.tone}
                                className="w-full p-4 rounded-xl bg-[#0f172a] border border-gray-600 outline-none"
                            >
                                <option value="">
                                    Select Tone
                                </option>

                                {
                                    tones.map((tone) => (
                                        <option
                                            key={tone}
                                            value={tone}
                                        >
                                            {tone}
                                        </option>
                                    ))
                                }

                            </select>

                            {
                                formik.touched.tone &&
                                formik.errors.tone && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {formik.errors.tone}
                                    </p>
                                )
                            }

                        </div>

                        {/* Words */}
                        <div>

                            <label className="block mb-2 font-medium">
                                Words
                            </label>

                            <input
                                type="number"
                                name="words"
                                placeholder="1000"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.words}
                                className="w-full p-4 rounded-xl bg-[#0f172a] border border-gray-600 outline-none"
                            />

                            {
                                formik.touched.words &&
                                formik.errors.words && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {formik.errors.words}
                                    </p>
                                )
                            }

                        </div>

                        {/* Tags */}
                        <div>

                            <label className="block mb-2 font-medium">
                                Tags
                            </label>

                            <input
                                type="text"
                                name="tags"
                                placeholder="AI, Future, Tech"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.tags}
                                className="w-full p-4 rounded-xl bg-[#0f172a] border border-gray-600 outline-none"
                            />

                            {
                                formik.touched.tags &&
                                formik.errors.tags && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {formik.errors.tags}
                                    </p>
                                )
                            }

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition-all p-4 rounded-xl font-semibold disabled:opacity-50"
                        >
                            {
                                loading
                                    ? "Generating Blog..."
                                    : "Generate Blog"
                            }
                        </button>

                    </form>

                </div>

                {/* Editor Section */}
                <div className="mt-10 bg-[#1e293b] border border-gray-700 rounded-2xl overflow-hidden">

                    <div className="border-b border-gray-700 px-6 py-4 flex items-center justify-between">

                        <h2 className="text-2xl font-semibold">
                            AI Blog Editor
                        </h2>

                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleBold()
                                        .run()
                                }
                                className="px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-600 hover:bg-gray-800"
                            >
                                Bold
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleHeading({ level: 2 })
                                        .run()
                                }
                                className="px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-600 hover:bg-gray-800"
                            >
                                H2
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleBulletList()
                                        .run()
                                }
                                className="px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-600 hover:bg-gray-800"
                            >
                                List
                            </button>

                        </div>

                    </div>

                    <div className="p-8 bg-[#0f172a] min-h-[600px]">

                        <EditorContent editor={editor} />

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AIBlogGenerator;

// import React, { useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import axios from "../api/axios";
// import { marked } from "marked";

// const AIBlogGenerator = () => {

//     const [markdown, setMarkdown] = useState("");
//     const [loading, setLoading] = useState(false);
//     const htmlContent = marked(markdown);
//     const formik = useFormik({

//         initialValues: {
//             topic: "",
//             category: "",
//             tone: "",
//             words: "",
//             tags: "",
//         },

//         validationSchema: Yup.object({

//             topic: Yup.string()
//                 .min(3, "Minimum 3 characters")
//                 .required("Topic is required"),

//             category: Yup.string()
//                 .required("Category is required"),

//             tone: Yup.string()
//                 .required("Tone is required"),

//             words: Yup.number()
//                 .min(100, "Minimum 100 words")
//                 .max(3000, "Maximum 3000 words")
//                 .required("Words are required"),

//             tags: Yup.string()
//                 .required("Tags are required"),
//         }),

//         onSubmit: async (values) => {

//             try {

//                 setLoading(true);

//                 const payload = {
//                     ...values,
//                     tags: values.tags
//                         .split(",")
//                         .map((tag) => tag.trim()),
//                 };

//                 const response = await axios.post(
//                     "/ai/generate-blog",
//                     payload
//                 );

//                 setMarkdown(response.data.markdown);

//             } catch (error) {

//                 console.log(error);

//             } finally {

//                 setLoading(false);

//             }
//         },
//     });

//     return (
//         <div className="min-h-screen bg-[#0f172a] text-white p-10">

//             <div className="max-w-3xl mx-auto bg-[#1e293b] p-8 rounded-xl">

//                 <h1 className="text-3xl font-bold mb-8">
//                     AI Blog Generator
//                 </h1>

//                 <form
//                     onSubmit={formik.handleSubmit}
//                     className="space-y-6"
//                 >

//                     {/* Topic */}
//                     <div>

//                         <label className="block mb-2">
//                             Topic
//                         </label>

//                         <input
//                             type="text"
//                             name="topic"
//                             placeholder="Enter blog topic"
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             value={formik.values.topic}
//                             className="w-full p-3 rounded-lg bg-[#0f172a] border border-gray-600 outline-none"
//                         />

//                         {
//                             formik.touched.topic &&
//                             formik.errors.topic && (
//                                 <p className="text-red-500 text-sm mt-2">
//                                     {formik.errors.topic}
//                                 </p>
//                             )
//                         }

//                     </div>

//                     {/* Category */}
//                     <div>

//                         <label className="block mb-2">
//                             Category
//                         </label>

//                         <input
//                             type="text"
//                             name="category"
//                             placeholder="Technology"
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             value={formik.values.category}
//                             className="w-full p-3 rounded-lg bg-[#0f172a] border border-gray-600 outline-none"
//                         />

//                         {
//                             formik.touched.category &&
//                             formik.errors.category && (
//                                 <p className="text-red-500 text-sm mt-2">
//                                     {formik.errors.category}
//                                 </p>
//                             )
//                         }

//                     </div>

//                     {/* Tone */}
//                     <div>

//                         <label className="block mb-2">
//                             Tone
//                         </label>

//                         <select
//                             name="tone"
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             value={formik.values.tone}
//                             className="w-full p-3 rounded-lg bg-[#0f172a] border border-gray-600 outline-none"
//                         >
//                             <option value="">
//                                 Select Tone
//                             </option>

//                             <option value="Professional">
//                                 Professional
//                             </option>

//                             <option value="Casual">
//                                 Casual
//                             </option>

//                             <option value="Technical">
//                                 Technical
//                             </option>

//                             <option value="Creative">
//                                 Creative
//                             </option>

//                             <option value="Funny">
//                                 Funny
//                             </option>

//                         </select>

//                         {
//                             formik.touched.tone &&
//                             formik.errors.tone && (
//                                 <p className="text-red-500 text-sm mt-2">
//                                     {formik.errors.tone}
//                                 </p>
//                             )
//                         }

//                     </div>

//                     {/* Words */}
//                     <div>

//                         <label className="block mb-2">
//                             Words
//                         </label>

//                         <input
//                             type="number"
//                             name="words"
//                             placeholder="1000"
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             value={formik.values.words}
//                             className="w-full p-3 rounded-lg bg-[#0f172a] border border-gray-600 outline-none"
//                         />

//                         {
//                             formik.touched.words &&
//                             formik.errors.words && (
//                                 <p className="text-red-500 text-sm mt-2">
//                                     {formik.errors.words}
//                                 </p>
//                             )
//                         }

//                     </div>

//                     {/* Tags */}
//                     <div>

//                         <label className="block mb-2">
//                             Tags
//                         </label>

//                         <input
//                             type="text"
//                             name="tags"
//                             placeholder="AI, Future, Tech"
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             value={formik.values.tags}
//                             className="w-full p-3 rounded-lg bg-[#0f172a] border border-gray-600 outline-none"
//                         />

//                         {
//                             formik.touched.tags &&
//                             formik.errors.tags && (
//                                 <p className="text-red-500 text-sm mt-2">
//                                     {formik.errors.tags}
//                                 </p>
//                             )
//                         }

//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full bg-blue-600 hover:bg-blue-700 transition-all p-3 rounded-lg font-semibold disabled:opacity-50"
//                     >
//                         {
//                             loading
//                                 ? "Generating..."
//                                 : "Generate Blog"
//                         }
//                     </button>

//                 </form>

//                 {/* Preview */}
//                 <div className="mt-10 bg-[#0f172a] p-6 rounded-lg border border-gray-700">

//                     <h2 className="text-2xl font-semibold mb-4">
//                         Generated Blog Preview
//                     </h2>

//                     <div
//                         className="prose prose-invert max-w-none"
//                         dangerouslySetInnerHTML={{
//                             __html: markdown
//                                 ? htmlContent
//                                 : "<p>Generated blog will appear here...</p>",
//                         }}
//                     />

//                 </div>

//             </div>

//         </div>
//     );
// };

// export default AIBlogGenerator;