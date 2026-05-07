// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";

// const BlogEditor = ({ content, setContent }) => {
//     const editor = useEditor({
//         extensions: [StarterKit],
//         content: content || "",
//         onUpdate: ({ editor }) => {
//             setContent(editor.getHTML());
//         },
//     });

//     if (!editor) return null;

//     return (
//         <div className="w-full">
//             <label className="block text-sm text-gray-400 mb-2">
//                 Content
//             </label>

//             <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-3">

//                 {/* Toolbar */}
//                 <div className="flex gap-2 mb-3 flex-wrap">
//                     <button
//                         onClick={() => editor.chain().focus().toggleBold().run()}
//                         className="px-2 py-1 text-sm bg-gray-800 rounded"
//                     >
//                         Bold
//                     </button>

//                     <button
//                         onClick={() => editor.chain().focus().toggleItalic().run()}
//                         className="px-2 py-1 text-sm bg-gray-800 rounded"
//                     >
//                         Italic
//                     </button>

//                     <button
//                         onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//                         className="px-2 py-1 text-sm bg-gray-800 rounded"
//                     >
//                         H2
//                     </button>

//                     <button
//                         onClick={() => editor.chain().focus().toggleBulletList().run()}
//                         className="px-2 py-1 text-sm bg-gray-800 rounded"
//                     >
//                         List
//                     </button>
//                 </div>

//                 {/* Editor */}
//                 <EditorContent
//                     editor={editor}
//                     className="min-h-50 text-white outline-none"
//                 />
//             </div>
//         </div>
//     );
// };

// export default BlogEditor;

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";   // 👈 ADD THIS

const BlogEditor = ({ content, setContent }) => {
    const editor = useEditor(
        {
            extensions: [StarterKit],
            content: "",
            onUpdate: ({ editor }) => {
                const html = editor.getHTML();
                if (html !== content) {
                    setContent(html);
                }
            },
        },
        []   // 👈 🔥 IMPORTANT (this fixes recreation)
    );

    // THIS IS YOUR FIX
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [editor, content]);

    if (!editor) return null;

    return (
        <div className="w-full">
            <label className="block text-sm text-gray-400 mb-2">
                Content
            </label>

            <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-3">

                {/* Toolbar */}
                <div className="flex gap-2 mb-3 flex-wrap">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className="px-2 py-1 text-sm bg-gray-800 rounded"
                    >
                        Bold
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className="px-2 py-1 text-sm bg-gray-800 rounded"
                    >
                        Italic
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="px-2 py-1 text-sm bg-gray-800 rounded"
                    >
                        H2
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className="px-2 py-1 text-sm bg-gray-800 rounded"
                    >
                        List
                    </button>
                </div>

                {/* Editor */}
                <EditorContent
                    editor={editor}
                    className="min-h-50 text-white outline-none"
                />
            </div>
        </div>
    );
};

export default BlogEditor;