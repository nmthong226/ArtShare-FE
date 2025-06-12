import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider, Tooltip } from "@mui/material";
import { Edit, Image, Info, Trash2, Upload, Plus, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings2 } from "lucide-react";
import { GenPostContent } from "../../types/automation-project";
import { LuCalendarClock, LuScanEye, LuTrash2 } from "react-icons/lu";
import { TbFileTextSpark } from "react-icons/tb";
import { examples } from "../../mocks/data";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";
import Text from "@tiptap/extension-text";
import Placeholder from "@tiptap/extension-placeholder";
import "../../styles/text-editor.scss";
import { RiImageCircleAiFill } from "react-icons/ri";
import PostScheduler from "../posts/PostScheduling";

interface ProjectGenPostsProp {
  handleStepChange: (
    step: string,
    data?: { projectName?: string; selectedPlatform?: Platform },
  ) => void;
}

const MAX_WORDS = 500;

const ProjectGenPostsTab: React.FC<ProjectGenPostsProp> = () => {
  const [postNumber, setPostNumber] = useState<string>("1");
  const [generateMode, setGenerateMode] = useState(true);
  const [postContent, setPostContent] = useState<GenPostContent[]>([]);
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(250);
  const [generateHashtag, setGenerateHashtag] = useState(false);
  const [useEmojis, setUseEmojis] = useState(false);
  const [open, setOpen] = useState(false);
  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setCharCount(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 1000) {
      setCharCount(value);
    }
  };

  const tones = ["Friendly", "Professional", "Casual", "Inspiring", "Witty"];

  const generateMockPosts = (
    count: number,
    baseId: number = 0,
  ): GenPostContent[] => {
    const generated: GenPostContent[] = [];
    for (let i = 0; i < count; i++) {
      const example = examples[i % examples.length];
      generated.push({
        ...example,
        id: baseId + i + 1,
      });
    }
    return generated;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numberToGenerate = parseInt(postNumber);

    if (isNaN(numberToGenerate) || numberToGenerate <= 0) {
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setPostContent((prevPosts) => {
        const maxId =
          prevPosts.length > 0 ? Math.max(...prevPosts.map((p) => p.id)) : 0;
        const newPosts = generateMockPosts(numberToGenerate, maxId);
        const firstNewPostIndex = prevPosts.length;
        setSelectedPostIndex(firstNewPostIndex);
        setGenerateMode(false);
        return [...prevPosts, ...newPosts];
      });
      setIsLoading(false);
    }, 1000);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      CharacterCount.configure({
        wordCounter: (text) =>
          text.split(/\s+/).filter((word) => word !== "").length,
      }),
      Placeholder.configure({
        placeholder: "Write something about this post...",
      }),
      Text,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "focus:outline-none print:border-0 flex flex-col overflow-x-hidden cursor-text",
      },
    },
  });

  useEffect(() => {
    if (editor) {
      const post = selectedPostIndex
        ? postContent[selectedPostIndex]
        : postContent[0];
      if (post) {
        const timeout = setTimeout(() => {
          editor.commands.setContent(`${post.content}`);
        }, 10);
        return () => clearTimeout(timeout);
      }
    }
  }, [editor, selectedPostIndex, postContent]);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validImages = files.filter((file) => file.type.startsWith("image/"));
    const newPreviews = validImages.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full h-full bg-white"
    >
      {/* Left side for post list */}
      <div className="flex flex-col pl-4 border-mountain-200 border-r-1 w-[25%] h-full">
        <div className="flex items-end justify-between w-full pb-2 pr-2 border-mountain-200 border-b-1 h-18">
          <div className="relative flex gap-4 p-2">
            <p className="text-lg font-medium">Project Posts</p>
          </div>
          <div
            onClick={() => {
              setGenerateMode(true), setSelectedPostIndex(null);
            }}
            className="flex items-center p-2 px-4 space-x-2 text-sm rounded-full shadow-sm cursor-pointer bg-mountain-50 hover:bg-mountain-50/60"
          >
            <Plus />
            <p>New Post</p>
          </div>
        </div>
        <div className="flex flex-col p-2 space-y-2">
          {postContent.length > 0 ? (
            postContent.map((_, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedPostIndex(index), setGenerateMode(false);
                }}
                className={`flex justify-between px-2 items-center border-1 rounded-md w-full shadow-md h-14 cursor-pointer select-none shrink-0
                                    ${
                                      selectedPostIndex === index
                                        ? "bg-white border-indigo-600"
                                        : "bg-white border-mountain-200 hover:bg-gray-100"
                                    }`}
              >
                <p className="w-[70%] text-mountain-600 text-sm line-clamp-1">
                  Post {index + 1}
                </p>
                <div className="flex items-center space-x-2">
                  <Tooltip title="Preview" arrow placement="bottom">
                    <div className="flex items-center justify-center w-8 h-8 px-2 space-x-2 border rounded-md cursor-pointer bg-indigo-50 border-mountain-200">
                      <LuScanEye className="size-4" />
                    </div>
                  </Tooltip>
                  <Tooltip title="Delete" arrow placement="bottom">
                    <div className="flex items-center justify-center w-8 h-8 px-2 space-x-2 border rounded-md cursor-pointer bg-indigo-50 border-mountain-200">
                      <Trash2 className="size-4" />
                    </div>
                  </Tooltip>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-mountain-600">
              This project currently has no post.
            </p>
          )}
        </div>
      </div>
      {/* Right side for gen-post, preview post */}
      <div className="flex flex-col space-y-2 bg-mountain-50 w-[75%] h-full overflow-y-auto">
        {generateMode ? (
          <div className="flex items-center w-full pb-2 bg-white border-mountain-200 border-b-1 h-18">
            <div className="relative flex items-end gap-4 pl-4 w-xl">
              <div className="flex flex-col">
                <label className="flex items-center mb-1 space-x-2 text-sm text-mountain-800">
                  <p>Prompt Post Content</p>
                  <span>
                    <Info className="size-4" />
                  </span>
                </label>
                <Input
                  className="h-10 rounded-md w-108 placeholder:text-mountain-400"
                  placeholder="Generate your post content"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm text-mountain-800">
                  How many posts?
                </label>
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={postNumber}
                  onChange={(e) => setPostNumber(e.target.value)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g. 5"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center h-10 text-white transition rounded-md shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 w-30 shrink-0"
              >
                {isLoading ? "Writing..." : "Start Writing"}
              </button>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="absolute flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer -right-70 bg-mountain-50 hover:bg-mountain-100 border-mountain-200 text-mountain-950"
                  >
                    <Settings2 className="size-4" />
                    Settings
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="center"
                  sideOffset={8}
                  onInteractOutside={(e) => e.preventDefault()}
                  className="mt-2 space-y-6 overflow-x-hidden overflow-y-auto border rounded-lg shadow-md border-mountain-200 w-72"
                >
                  <div className="space-y-4">
                    <label className="flex items-center space-x-2 text-sm text-mountain-800">
                      <p>Prompt Settings</p>
                    </label>
                    <div className="space-y-2">
                      <label className="px-1 text-sm text-mountain-800">
                        Tone of Voice
                      </label>
                      <div className="flex flex-wrap gap-2 px-1">
                        {tones.map((tone) => (
                          <button
                            key={tone}
                            type="button"
                            onClick={() => setSelectedTone(tone)}
                            className={`px-2 py-1 rounded-md text-sm border transition 
                                                    ${
                                                      selectedTone === tone
                                                        ? "bg-indigo-500 text-white border-indigo-600"
                                                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                                    }`}
                          >
                            {tone}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {}}
                          className="flex items-center px-3 py-1 text-sm text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                        >
                          <BiChevronDown className="mr-1" />
                          <p>More</p>
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-mountain-800">
                          Number of words
                        </label>
                        <Input
                          className="w-16 h-8"
                          type="number"
                          value={charCount}
                          onChange={handleInputChange}
                          min={100}
                          max={500}
                        />
                      </div>
                      <Slider
                        value={charCount}
                        min={100}
                        max={500}
                        step={10}
                        onChange={handleSliderChange}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-mountain-800">
                        Generate hashtag
                      </label>
                      <Switch
                        checked={generateHashtag}
                        onClick={() => setGenerateHashtag(!generateHashtag)}
                        className="cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-mountain-800">
                        Include emojis
                      </label>
                      <Switch
                        checked={useEmojis}
                        onClick={() => setUseEmojis(!useEmojis)}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ) : (
          <div className="flex items-end w-full p-4 pb-2 bg-white border-mountain-200 border-b-1 h-18">
            <div className="flex items-center justify-between w-full">
              <div className="flex space-x-4">
                <div className="relative flex py-2">
                  <p className="text-lg font-medium">
                    Post {selectedPostIndex! + 1}
                  </p>
                </div>
                <div className="flex bg-mountain-200 w-0.5 h-12" />
                <div className="flex items-center p-2 space-x-2 border rounded-lg cursor-pointer hover:bg-mountain-50/60 border-mountain-200">
                  <LuScanEye />
                  <div>Preview</div>
                </div>
                <div className="flex items-center p-2 space-x-2 border rounded-lg cursor-pointer hover:bg-mountain-50/60 border-mountain-200">
                  <Image className="size-4" />
                  <div>Images: {imagePreviews.length}</div>
                </div>
                <Tooltip
                  title="This post is scheduled"
                  arrow
                  placement="bottom"
                >
                  <div className="flex items-center px-4 py-2 space-x-2 font-medium text-blue-800 bg-blue-100 rounded-full cursor-pointer hover:bg-blue-100/60 w-fit">
                    <LuCalendarClock className="size-4 shrink-0" />
                    <div className="flex bg-blue-800 w-0.5 h-8" />
                    <p>12/06/2025</p>
                    <p>21:00</p>
                  </div>
                </Tooltip>
              </div>
              <div className="flex space-x-2">
                <div className="flex items-center p-2 space-x-2 border rounded-lg border-mountain-200">
                  <Clock className="size-4" />
                  <div className="relative flex flex-col text-xs select-none">
                    <p className="text-mountain-600">Created At</p>
                    <p>09/06/2025</p>
                  </div>
                </div>
                <button className="flex items-center p-2 space-x-2 border rounded-lg bg-mountain-100 hover:bg-mountain-50 border-mountain-200">
                  <LuTrash2 className="size-4" />
                  <div>Delete</div>
                </button>
              </div>
            </div>
          </div>
        )}
        {postContent && postContent.length > 0 && !generateMode ? (
          <div className="flex flex-col h-[calc(100vh-13.5rem)] overflow-y-auto sidebar">
            <div className="h-full ml-4 space-y-2 overflow-y-auto sidebar">
              <div className="flex items-center py-2 space-x-2 text-indigo-900 border-mountain-200 border-b-1">
                <p>🖊️</p>
                <p>Post Content</p>
              </div>
              <div className="relative flex flex-col bg-white shadow-md border border-mountain-200 w-xl h-[520px]">
                <div className="flex items-center h-12 gap-2 px-2 bg-white border-b border-mountain-200 rounded-t-md shrink-0">
                  {editor && (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            editor.chain().focus().toggleBold().run()
                          }
                          className={`px-2 py-1 text-sm border  border-mountain-200 font-bold shadow rounded ${editor.isActive("bold") ? "bg-indigo-100" : ""}`}
                        >
                          B
                        </button>
                        <button
                          onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                          }
                          className={`px-2 py-1 text-sm border  border-mountain-200 italic shadow rounded ${editor.isActive("italic") ? "bg-indigo-100" : ""}`}
                        >
                          I
                        </button>
                        <button
                          onClick={() =>
                            editor.chain().focus().toggleUnderline().run()
                          }
                          className={`px-2 py-1 text-sm border  border-mountain-200 underline shadow rounded ${editor.isActive("underline") ? "bg-indigo-100" : ""}`}
                        >
                          U
                        </button>
                        <button className="px-2 py-1 text-sm border rounded-sm shadow cursor-pointer hover:bg-mountain-50/60 border-mountain-200">
                          <p>
                            😀<span>Emoji</span>
                          </p>
                        </button>
                      </div>
                      {editor && (
                        <div
                          className={`select-none flex hover:opacity-100 hover:z-50 transform ease-in-out duration-300 bg-white opacity-50 rounded-md p-2 text-xs text-mountain-600 character-count ${editor.storage.characterCount.words() === MAX_WORDS ? "character-count--warning" : ""}`}
                        >
                          {editor.storage.characterCount.words()} words
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {editor ? (
                  <div className="h-full p-4 overflow-auto text-left w-xl custom-scrollbar">
                    <EditorContent editor={editor} />
                  </div>
                ) : (
                  <p>Loading editor...</p>
                )}
              </div>
              <div className="flex items-center py-2 space-x-2 text-indigo-900 border-mountain-200 border-b-1">
                <p>🖼️</p>
                <p>Post Images</p>
              </div>
              <div className="flex flex-col bg-white border rounded-lg border-mountain-200 w-xl h-fit">
                <div className="flex items-center justify-between h-12 gap-2 px-2 bg-white border-b border-mountain-200 rounded-t-md text-mountain-800">
                  <div className="flex items-center space-x-2">
                    <span>Number of Image: {imagePreviews.length}</span>
                  </div>
                  <span className="text-sm italic text-mountain-600">
                    Up to 4 images
                  </span>
                </div>
                <div className="flex flex-wrap justify-center">
                  {imagePreviews.map((src, index) => (
                    <div
                      key={index}
                      className="relative w-full p-2 overflow-hidden bg-white group aspect-video"
                    >
                      <img
                        src={src}
                        alt={`Preview ${index}`}
                        className="object-cover w-full h-full rounded-md"
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
                {imagePreviews.length === 0 ? (
                  <div className="flex justify-center w-full p-2">
                    <label
                      htmlFor="imageUpload"
                      className="flex flex-col items-center w-48 px-4 py-2 mx-2 space-y-2 text-sm font-medium text-center bg-white border rounded-md shadow-sm cursor-pointer border-mountain-200 text-mountain-950"
                    >
                      <Upload />
                      <p>Upload From Device</p>
                    </label>
                    <label
                      htmlFor="imageUpload"
                      className="flex flex-col items-center w-48 px-4 py-2 mx-2 space-y-2 text-sm font-medium text-center bg-white border rounded-md shadow-sm cursor-pointer border-mountain-200 text-mountain-950"
                    >
                      <RiImageCircleAiFill className="size-6" />
                      <p>Browse Your Stock</p>
                    </label>
                  </div>
                ) : (
                  imagePreviews.length < 4 && (
                    <div className="flex justify-center w-full pb-2 rounded-full">
                      <label
                        onClick={() => {}}
                        className="flex items-center justify-center w-1/4 gap-2 px-4 py-2 mx-2 text-sm font-medium text-center bg-white border rounded-md shadow-sm cursor-pointer border-mountain-200 text-mountain-950"
                      >
                        <Trash2 />
                        <span>Clear All</span>
                      </label>
                      <label
                        htmlFor="imageUpload"
                        className="flex items-center justify-center w-3/4 gap-2 px-4 py-2 mx-2 text-sm font-medium text-center bg-white border rounded-md shadow-sm cursor-pointer border-mountain-200 text-mountain-950"
                      >
                        <Upload />
                        <span>Add More</span>
                      </label>
                    </div>
                  )
                )}
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <div className="flex items-center py-2 space-x-2 font-medium text-indigo-900 border-b border-mountain-200">
                <span>📅</span>
                <p>Post Scheduling</p>
              </div>
              <div className="h-full max-w-xl">
                <PostScheduler />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col justify-center items-center gap-4 ml-4 w-xl h-[520px]">
            <TbFileTextSpark className="size-12 text-mountain-400" />
            <p className="text-sm text-mountain-400">
              Prompt for your post content to automate posting workflow
            </p>
          </div>
        )}
      </div>
    </form>
  );
};

export default ProjectGenPostsTab;
