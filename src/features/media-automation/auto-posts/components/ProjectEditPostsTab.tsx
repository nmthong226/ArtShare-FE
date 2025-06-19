import { Input } from '@/components/ui/input';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bot,
  Edit,
  Image,
  Plus,
  ScreenShare,
  Trash2,
  Upload,
} from 'lucide-react';
import { useState } from 'react';
import { Platform } from '../../projects/types/platform';
import '../../styles/text-editor.scss';

interface ProjectPostCreateProp {
  handleStepChange: (
    step: string,
    data?: { projectName?: string; selectedPlatform?: Platform },
  ) => void;
}

const MAX_CHARACTERS = 280; // max caption length

const ProjectPostEditForm: React.FC<ProjectPostCreateProp> = () => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validImages = files.filter((file) => file.type.startsWith('image/'));
    const newPreviews = validImages.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
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
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class:
          'focus:outline-none print:border-0 flex flex-col w-[765px] overflow-x-hidden cursor-text',
      },
    },
  });

  const percentage = editor
    ? Math.round(
        (100 / MAX_CHARACTERS) * editor.storage.characterCount.characters(),
      )
    : 0;

  return (
    <>
      <div className="relative flex w-full h-full gap-2 bg-white">
        <div className="flex flex-col items-center space-y-2 bg-mountain-50 p-2 border border-mountain-200 rounded-lg w-24 h-[calc(100vh-14.5rem)]">
          <div className="flex items-center justify-center bg-indigo-200 rounded-full shadow-md w-14 h-14">
            <Plus />
          </div>
          <hr className="w-full h-1 border-mountain-200 border-t-1" />
          <div className="flex items-center justify-center w-16 bg-white border-indigo-600 rounded-md cursor-pointer select-none border-1 h-14 shrink-0">
            <p className="text-sm text-mountain-600">Post 1</p>
          </div>
          <div className="flex items-center justify-center w-16 bg-white rounded-md cursor-pointer select-none border-1 border-mountain-200 h-14 shrink-0">
            <p className="text-sm text-mountain-600">Post 2</p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full h-full"
        >
          <div className="flex w-full h-full gap-2">
            <div className="relative flex flex-col space-y-2 bg-white border-1 border-mountain-200 rounded-md w-[70%] h-[calc(100vh-14.5rem)]">
              {editor && (
                <div className="flex flex-wrap items-center h-12 gap-2 px-2 bg-white border-b border-mountain-200 rounded-t-md shrink-0">
                  <div className="flex flex-wrap items-center h-12 gap-2 px-2 bg-white border-b border-mountain-200 rounded-t-md text-mountain-800">
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
                    onClick={() =>
                      editor.chain().focus().toggleUnderline().run()
                    }
                    className={`px-2 py-1 text-sm border border-mountain-200 underline shadow rounded ${editor.isActive('underline') ? 'bg-indigo-100' : ''}`}
                  >
                    U
                  </button>
                  <div className="relative flex w-64 h-8 ml-auto text-xs text-gray-400 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50">
                    <Input
                      placeholder="Ask AI Assisant"
                      className="flex items-center shadow-none py-1.5 focus-visible:border-0 border-none rounded-full outline-none focus:outline-0 focus-visible:ring-0 focus-visible:ring-ring/0 w-96 h-fit"
                    />
                    <button className="absolute right-0 flex items-center justify-center w-8 h-8 -translate-y-1/2 bg-white border rounded-full top-1/2 border-mountain-200">
                      <Bot className="size-5" />
                    </button>
                  </div>
                </div>
              )}
              {editor ? (
                <EditorContent
                  editor={editor}
                  className="p-4 outline-none w-full h-[calc(100vh-16rem)] overflow-x-hidden prose"
                />
              ) : (
                <p>Loading editor...</p>
              )}
              {editor && (
                <div
                  className={`absolute select-none bottom-2 left-2 hover:opacity-100 hover:z-50 transform ease-in-out duration-300 bg-white border border-mountain-200 opacity-50 rounded-md p-2 text-xs text-mountain-600 character-count ${editor.storage.characterCount.characters() === MAX_CHARACTERS ? 'character-count--warning' : ''}`}
                >
                  <svg height="20" width="20" viewBox="0 0 20 20">
                    <circle r="10" cx="10" cy="10" fill="#e9ecef" />
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
                    <circle r="6" cx="10" cy="10" fill="white" />
                  </svg>
                  {editor.storage.characterCount.characters()} /{' '}
                  {MAX_CHARACTERS} characters
                  <br />
                  {editor.storage.characterCount.words()} words
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-4 bg-mountain-50 border border-mountain-200 rounded-lg w-[30%] h-[calc(100vh-14.5rem)]">
              <div className="flex flex-wrap items-center h-12 gap-2 px-2 bg-white border-b border-mountain-200 rounded-t-md text-mountain-800">
                <Image className="size-4" />
                <span>Post Image</span>
              </div>
              {imagePreviews.length === 0 && (
                <div className="flex justify-center w-full">
                  <label
                    htmlFor="imageUpload"
                    className="flex flex-col items-center w-48 px-4 py-2 mx-2 space-y-2 text-sm font-medium text-center bg-white rounded-md shadow-sm cursor-pointer text-mountain-950"
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
                  <div
                    key={index}
                    className="relative w-full overflow-hidden bg-white rounded-md group aspect-video"
                  >
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute hidden p-2 bg-white rounded-full cursor-pointer top-2 right-2 group-hover:flex">
                      <Edit className="size-4" />
                    </div>
                    <div className="absolute hidden p-2 bg-white rounded-full cursor-pointer right-2 bottom-2 group-hover:flex">
                      <Trash2 className="size-4" />
                    </div>
                  </div>
                ))}
              </div>
              {imagePreviews.length > 1 && (
                <div className="justify-center hidden w-full rounded-full group-hover:flex">
                  <label
                    htmlFor="imageUpload"
                    className="flex items-center gap-2 px-4 py-2 mx-2 text-sm font-medium text-center bg-white rounded-md shadow-sm cursor-pointer text-mountain-950"
                  >
                    <Upload />
                    <span>Add More</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </form>
        <div className="absolute bottom-0 right-0 flex">
          <button
            type="submit"
            className="flex items-center justify-center w-56 px-4 py-2 mt-4 space-x-2 transition bg-white rounded-md cursor-pointer hover:bg-mountain-200/80 border-1 border-mountain-200 text-mountain-950"
          >
            <ScreenShare />
            <p>Preview on Facebook</p>
          </button>
        </div>
      </div>
      <hr className="w-full h-1 border-mountain-200 border-t-1" />
      <div className="flex items-center justify-center w-16 bg-white border-indigo-600 rounded-md cursor-pointer select-none border-1 h-14 shrink-0">
        <p className="text-sm text-mountain-600">Post 1</p>
      </div>
      <div className="flex items-center justify-center w-16 bg-white rounded-md cursor-pointer select-none border-1 border-mountain-200 h-14 shrink-0">
        <p className="text-sm text-mountain-600">Post 2</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full h-full"
      >
        <div className="flex w-full h-full gap-2">
          <div className="relative flex flex-col space-y-2 bg-white border-1 border-mountain-200 rounded-md w-[70%] h-[calc(100vh-14.5rem)]">
            {editor && (
              <div className="flex flex-wrap items-center h-12 gap-2 px-2 bg-white border-b border-mountain-200 rounded-t-md shrink-0">
                <div className="flex flex-wrap items-center h-12 gap-2 px-2 bg-white border-b border-mountain-200 rounded-t-md text-mountain-800">
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
                <div className="relative flex w-64 h-8 ml-auto text-xs text-gray-400 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50">
                  <Input
                    placeholder="Ask AI Assisant"
                    className="flex items-center shadow-none py-1.5 focus-visible:border-0 border-none rounded-full outline-none focus:outline-0 focus-visible:ring-0 focus-visible:ring-ring/0 w-96 h-fit"
                  />
                  <button className="absolute right-0 flex items-center justify-center w-8 h-8 -translate-y-1/2 bg-white border rounded-full top-1/2 border-mountain-200">
                    <Bot className="size-5" />
                  </button>
                </div>
              </div>
            )}
            {editor ? (
              <EditorContent
                editor={editor}
                className="p-4 outline-none w-full h-[calc(100vh-16rem)] overflow-x-hidden prose"
              />
            ) : (
              <p>Loading editor...</p>
            )}
            {editor && (
              <div
                className={`absolute select-none bottom-2 left-2 hover:opacity-100 hover:z-50 transform ease-in-out duration-300 bg-white border border-mountain-200 opacity-50 rounded-md p-2 text-xs text-mountain-600 character-count ${editor.storage.characterCount.characters() === MAX_CHARACTERS ? 'character-count--warning' : ''}`}
              >
                <svg height="20" width="20" viewBox="0 0 20 20">
                  <circle r="10" cx="10" cy="10" fill="#e9ecef" />
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
                  <circle r="6" cx="10" cy="10" fill="white" />
                </svg>
                {editor.storage.characterCount.characters()} / {MAX_CHARACTERS}{' '}
                characters
                <br />
                {editor.storage.characterCount.words()} words
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-4 bg-mountain-50 border border-mountain-200 rounded-lg w-[30%] h-[calc(100vh-14.5rem)]">
            <div className="flex flex-wrap items-center h-12 gap-2 px-2 bg-white border-b border-mountain-200 rounded-t-md text-mountain-800">
              <Image className="size-4" />
              <span>Post Image</span>
            </div>
            {imagePreviews.length === 0 && (
              <div className="flex justify-center w-full">
                <label
                  htmlFor="imageUpload"
                  className="flex flex-col items-center w-48 px-4 py-2 mx-2 space-y-2 text-sm font-medium text-center bg-white rounded-md shadow-sm cursor-pointer text-mountain-950"
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
                <div
                  key={index}
                  className="relative w-full overflow-hidden bg-white rounded-md group aspect-video"
                >
                  <img
                    src={src}
                    alt={`Preview ${index}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute hidden p-2 bg-white rounded-full cursor-pointer top-2 right-2 group-hover:flex">
                    <Edit className="size-4" />
                  </div>
                  <div className="absolute hidden p-2 bg-white rounded-full cursor-pointer right-2 bottom-2 group-hover:flex">
                    <Trash2 className="size-4" />
                  </div>
                </div>
              ))}
            </div>
            {imagePreviews.length > 1 && (
              <div className="justify-center hidden w-full rounded-full group-hover:flex">
                <label
                  htmlFor="imageUpload"
                  className="flex items-center gap-2 px-4 py-2 mx-2 text-sm font-medium text-center bg-white rounded-md shadow-sm cursor-pointer text-mountain-950"
                >
                  <Upload />
                  <span>Add More</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </form>
      <div className="absolute bottom-0 right-0 flex">
        <button
          type="submit"
          className="flex items-center justify-center w-56 px-4 py-2 mt-4 space-x-2 transition bg-white rounded-md cursor-pointer hover:bg-mountain-200/80 border-1 border-mountain-200 text-mountain-950"
        >
          <ScreenShare />
          <p>Preview on Facebook</p>
        </button>
      </div>
    </>
  );
};

export default ProjectPostEditForm;
