import { useEffect, useRef, useState } from "react";
import Editor, { EditorHandle } from "./components/Editor";
import TextEditorHeader from "./components/TextEditorHeader";
import Toolbar from "./components/Toolbar";
import { LuPencilLine } from "react-icons/lu";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBlogById,
  updateExistingBlog,
  UpdateBlogPayload,
} from "./api/blog.api";

const WriteBlog = () => {
  const editorRef = useRef<EditorHandle>(null);
  const { showSnackbar } = useSnackbar();
  const { blogId } = useParams<{ blogId: string }>();

  const [blogTitle, setBlogTitle] = useState("Untitled Document"); // Renamed for clarity
  const [isLoading, setIsLoading] = useState(true); // For loading state

  const navigate = useNavigate();

  useEffect(() => {
    if (!blogId) {
      showSnackbar("No blog ID provided.", "error");
      navigate("/blogs", { replace: true });
      return;
    }

    setIsLoading(true);
    getBlogById(blogId)
      .then((fetchedBlog) => {
        if (editorRef.current) {
          editorRef.current.setContent(fetchedBlog.content || "");
        }
        setBlogTitle(fetchedBlog.title);
      })
      .catch((error) => {
        console.error("Error fetching blog content:", error);
        showSnackbar("Failed to load blog content.", "error");
        navigate("/blogs", { replace: true });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [blogId, navigate, showSnackbar]); // Added navigate and showSnackbar to dependencies

  const handleExportDocument = async () => {
    if (!editorRef.current || !blogId) return;
    const content = editorRef.current?.getContent();

    const payload: UpdateBlogPayload = {
      title: blogTitle, // Use the state for title
      is_published: true,
      content,
    };

    try {
      const updatedBlog = await updateExistingBlog(blogId, payload);
      showSnackbar("Blog published successfully!", "success");
      console.log("Document published:", updatedBlog);
      navigate(`/blogs/${updatedBlog.id}`); // Redirect to the published blog
    } catch (error) {
      showSnackbar("Failed to publish blog", "error");
      console.error("Error publishing document:", error);
    }
  };

  const handleSaveBlog = async (currentTitle: string) => {
    if (!editorRef.current || !blogId) return;

    const content = editorRef.current?.getContent();
    const images = editorRef.current?.getImages() || [];

    const payload: UpdateBlogPayload = {
      title: currentTitle || "Untitled Document",
      is_published: true,
      pictures: images.map((img) => img.src),
      content,
    };

    try {
      const updatedBlog = await updateExistingBlog(blogId, payload);
      showSnackbar("Blog saved successfully!", "success");
      console.log("Document saved:", updatedBlog);
      setBlogTitle(updatedBlog.title); // Update title in state if backend modifies it
    } catch (error) {
      showSnackbar("Failed to save blog", "error");
      console.error("Error saving document:", error);
    }
  };

  if (isLoading) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className={`flex flex-row w-full h-full`}>
      <div
        className={`flex flex-col flex-1 flex-shrink w-[calc(100vw-16rem)] h-full`}
      >
        <TextEditorHeader
          handleExport={handleExportDocument}
          handleSaveBlog={handleSaveBlog}
          text={blogTitle}
          setText={setBlogTitle}
        />
        <div
          className={`border-l-1 bg-mountain-50 border-l-mountain-100 dark:border-l-mountain-700 h-full w-full`}
        >
          <Toolbar />
          <div className="z-0 relative flex flex-col justify-center print:bg-white print:p-0 pb-20 w-full h-screen overflow-x-hidden sidebar">
            <div className="right-60 bottom-4 z-50 fixed flex justify-center items-center bg-gradient-to-b from-blue-400 to-purple-400 shadow-md rounded-full w-14 h-14 hover:scale-105 transition duration-300 ease-in-out hover:cursor-pointer">
              <LuPencilLine className="size-6 text-white" />
            </div>
            <div className="flex mx-auto py-4 print:py-0 pb-20 w-[794px] print:w-full min-w-max min-h-[1123px] overflow-y-hidden">
              <Editor ref={editorRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteBlog;
