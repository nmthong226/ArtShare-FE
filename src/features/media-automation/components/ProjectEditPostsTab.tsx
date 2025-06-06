import { Bot, Edit, Image, Plus, ScreenShare, Trash2, Upload } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from '@tiptap/extension-placeholder'
import '../styles/text-editor.scss';
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ProjectPostCreateProp {
    handleStepChange: (step: string, data?: { projectName?: string; selectedPlatform?: Platform[] }) => void;
}

const MAX_CHARACTERS = 280; // max caption length

const ProjectPostEditForm: React.FC<ProjectPostCreateProp> = ({ handleStepChange }) => {
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validImages = files.filter(file => file.type.startsWith("image/"));
        const newPreviews = validImages.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // handleStepChange("create-posts", {
        //     projectName,
        //     selectedPlatform,
        // });
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            CharacterCount.configure({
                limit: MAX_CHARACTERS,
            }),
            Placeholder.configure({
                placeholder: 'Write something about this post...',
            })
        ],
        content: '',
        editorProps: {
            attributes: {
                class:
                    "focus:outline-none print:border-0 flex flex-col w-[765px] overflow-x-hidden cursor-text",
            },
        },
    });

    const percentage = editor
        ? Math.round((100 / MAX_CHARACTERS) * editor.storage.characterCount.characters())
        : 0

    return (
        <div className="relative flex gap-2 bg-white w-full h-full">
            <div className="flex flex-col items-center space-y-2 bg-mountain-50 p-2 border border-mountain-200 rounded-lg w-24 h-[calc(100vh-14.5rem)]">
                <div className="flex justify-center items-center bg-indigo-200 shadow-md rounded-full w-14 h-14">
                    <Plus />
                </div>
                <hr className="border-mountain-200 border-t-1 w-full h-1" />
                <div className="flex justify-center items-center bg-white border-1 border-indigo-600 rounded-md w-16 h-14 cursor-pointer select-none shrink-0">
                    <p className="text-mountain-600 text-sm">Post 1</p>
                </div>
                <div className="flex justify-center items-center bg-white border-1 border-mountain-200 rounded-md w-16 h-14 cursor-pointer select-none shrink-0">
                    <p className="text-mountain-600 text-sm">Post 2</p>
                </div>
            </div>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center w-full h-full"
            >
                <div className="flex gap-2 w-full h-full">
                    <div className="relative flex flex-col space-y-2 bg-white border-1 border-mountain-200 rounded-md w-[70%] h-[calc(100vh-14.5rem)]">
                        {editor && (
                            <div className="flex flex-wrap items-center gap-2 bg-white px-2 border-mountain-200 border-b rounded-t-md h-12 shrink-0">
                                <div className="flex flex-wrap items-center gap-2 bg-white px-2 border-mountain-200 border-b rounded-t-md h-12 text-mountain-800">
                                    <Edit className="size-4" />
                                    <span>Post Description</span>
                                </div>
                                <div className="bg-mountain-200 mr-4 w-[0.25px] h-full" />
                                <button
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    className={`px-2 py-1 text-sm border border-mountain-200 font-bold shadow rounded ${editor.isActive('bold') ? 'bg-indigo-100' : ''}`}
                                >
                                    B
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    className={`px-2 py-1 text-sm border border-mountain-200 italic shadow rounded ${editor.isActive('italic') ? 'bg-indigo-100' : ''}`}
                                >
                                    I
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                                    className={`px-2 py-1 text-sm border border-mountain-200 underline shadow rounded ${editor.isActive('underline') ? 'bg-indigo-100' : ''}`}
                                >
                                    U
                                </button>
                                <div className="relative flex bg-gradient-to-r from-indigo-50 to-purple-50 ml-auto rounded-full w-64 h-8 text-gray-400 text-xs">
                                    <Input placeholder="Ask AI Assisant" className="flex items-center shadow-none py-1.5 focus-visible:border-0 border-none rounded-full outline-none focus:outline-0 focus-visible:ring-0 focus-visible:ring-ring/0 w-96 h-fit" />
                                    <button className="top-1/2 right-0 absolute flex justify-center items-center bg-white border border-mountain-200 rounded-full w-8 h-8 -translate-y-1/2">
                                        <Bot className="size-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                        {editor ? (
                            <EditorContent editor={editor} className="p-4 outline-none w-full h-[calc(100vh-16rem)] overflow-x-hidden prose" />
                        ) : (
                            <p>Loading editor...</p>
                        )}
                        {editor && (
                            <div className={`absolute select-none bottom-2 left-2 hover:opacity-100 hover:z-50 transform ease-in-out duration-300 bg-white border border-mountain-200 opacity-50 rounded-md p-2 text-xs text-mountain-600 character-count ${editor.storage.characterCount.characters() === MAX_CHARACTERS ? 'character-count--warning' : ''}`}>
                                <svg
                                    height="20"
                                    width="20"
                                    viewBox="0 0 20 20"
                                >
                                    <circle
                                        r="10"
                                        cx="10"
                                        cy="10"
                                        fill="#e9ecef"
                                    />
                                    <circle
                                        r="5"
                                        cx="10"
                                        cy="10"
                                        fill="transparent"
                                        stroke="currentColor"
                                        strokeWidth="10"
                                        strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
                                        transform="rotate(-90) translate(-20)"
                                    />
                                    <circle
                                        r="6"
                                        cx="10"
                                        cy="10"
                                        fill="white"
                                    />
                                </svg>
                                {editor.storage.characterCount.characters()} / {MAX_CHARACTERS} characters
                                <br />
                                {editor.storage.characterCount.words()} words
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col space-y-4 bg-mountain-50 border border-mountain-200 rounded-lg w-[30%] h-[calc(100vh-14.5rem)]">
                        <div className="flex flex-wrap items-center gap-2 bg-white px-2 border-mountain-200 border-b rounded-t-md h-12 text-mountain-800">
                            <Image className="size-4" />
                            <span>Post Image</span>
                        </div>
                        {imagePreviews.length === 0 && (
                            <div className="flex justify-center w-full">
                                <label
                                    htmlFor="imageUpload"
                                    className="flex flex-col items-center space-y-2 bg-white shadow-sm mx-2 px-4 py-2 rounded-md w-48 font-medium text-mountain-950 text-sm text-center cursor-pointer"
                                >
                                    <Upload />
                                    <p>Choose Image</p>
                                </label>
                            </div>
                        )}
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div className="flex flex-wrap justify-center gap-2 px-2">
                            {imagePreviews.map((src, index) => (
                                <div key={index} className="group relative bg-white rounded-md w-full aspect-video overflow-hidden">
                                    <img
                                        src={src}
                                        alt={`Preview ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="hidden top-2 right-2 absolute group-hover:flex bg-white p-2 rounded-full cursor-pointer">
                                        <Edit className="size-4" />
                                    </div>
                                    <div className="hidden right-2 bottom-2 absolute group-hover:flex bg-white p-2 rounded-full cursor-pointer">
                                        <Trash2 className="size-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {imagePreviews.length > 1 && (
                            <div className="hidden group-hover:flex justify-center rounded-full w-full">
                                <label
                                    htmlFor="imageUpload"
                                    className="flex items-center gap-2 bg-white shadow-sm mx-2 px-4 py-2 rounded-md font-medium text-mountain-950 text-sm text-center cursor-pointer"
                                >
                                    <Upload />
                                    <span>Add More</span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </form>
            <div className="bottom-0 left-1/2 absolute flex space-x-4 -translate-x-1/2">
                <button
                    onClick={() => handleStepChange("generate-posts")}
                    className="flex justify-center items-center bg-indigo-200 hover:bg-indigo-300/80 mt-4 px-6 py-2 rounded-md w-48 text-mountain-950 transition cursor-pointer"
                >
                    Previous Step
                </button>
                <button
                    type="submit"
                    className="flex justify-center items-center bg-mountain-200 hover:bg-mountain-300/80 mt-4 px-6 py-2 rounded-md w-48 text-mountain-950 transition cursor-pointer btn"
                >
                    Next Step
                </button>
            </div>
            <div className="right-0 bottom-0 absolute flex">
                <button
                    type="submit"
                    className="flex justify-center items-center space-x-2 bg-white hover:bg-mountain-200/80 mt-4 px-4 py-2 border-1 border-mountain-200 rounded-md w-56 text-mountain-950 transition cursor-pointer"
                >
                    <ScreenShare />
                    <p>Preview on Facebook</p>
                </button>
            </div>
        </div>
    );
}

export default ProjectPostEditForm;