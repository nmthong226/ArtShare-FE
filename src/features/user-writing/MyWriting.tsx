import { useEffect, useRef, useState } from "react";
import Editor, { EditorHandle } from "./components/Editor";
import TextEditorHeader from "./components/TextEditorHeader";
import Toolbar from "./components/Toolbar";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBlogDetails } from "../blog-details/api/blog";
import { updateExistingBlog, UpdateBlogPayload } from "./api/blog.api";
import { Blog } from "@/types/blog";
import { AxiosError } from "axios";

const isContentEmpty = (htmlContent: string | undefined): boolean => {
  if (!htmlContent) return true;
  const textContent = htmlContent.replace(/<[^>]*>/g, "").trim();
  return textContent.length === 0;
};

const WriteBlog = () => {
  const editorRef = useRef<EditorHandle>(null);
  const { showSnackbar } = useSnackbar();
  const { blogId } = useParams<{ blogId: string }>();

  const [blogTitle, setBlogTitle] = useState("Untitled Document");
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [isContentLoadedIntoEditor, setIsContentLoadedIntoEditor] =
    useState(false);
  const [initialFetchedContent, setInitialFetchedContent] = useState<
    string | null
  >(null); // State to hold fetched content

  const [isPublished, setIsPublished] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!blogId) {
      showSnackbar("No blog ID provided.", "error");
      navigate("/blogs", { replace: true });
      return;
    }

    setIsApiLoading(true);
    setIsContentLoadedIntoEditor(false);
    setInitialFetchedContent(null);
    const numericBlogId = parseInt(blogId, 10);

    if (isNaN(numericBlogId)) {
      showSnackbar("Invalid blog ID format.", "error");
      navigate("/blogs", { replace: true });
      setIsApiLoading(false);
      return;
    }

    fetchBlogDetails(numericBlogId)
      .then((fetchedBlog: Blog) => {
        setBlogTitle(fetchedBlog.title || "Untitled Document");
        setIsPublished(fetchedBlog.is_published || false);
        const contentToSet = fetchedBlog.content || "";
        setInitialFetchedContent(contentToSet);

        if (editorRef.current) {
          editorRef.current.setContent(contentToSet);
          setIsContentLoadedIntoEditor(true);
          editorRef.current.focus();
        }
      })
      .catch((error: unknown) => {
        console.error("Error fetching blog content:", error);
        let errorMessage = "Failed to load blog content.";
        if (error instanceof AxiosError) {
          errorMessage = error.response?.data?.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        showSnackbar(errorMessage, "error");
        navigate("/blogs", { replace: true });
      })
      .finally(() => {
        setIsApiLoading(false);
      });
  }, [blogId, navigate, showSnackbar]);

  // This effect ensures content is set if the editor wasn't ready during the fetch's .then()
  useEffect(() => {
    if (
      !isApiLoading &&
      editorRef.current &&
      initialFetchedContent !== null &&
      !isContentLoadedIntoEditor
    ) {
      editorRef.current.setContent(initialFetchedContent);
      setIsContentLoadedIntoEditor(true);
      // Add focus to ensure editor is interactive
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      }, 100);

      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      }, 500);
    }
  }, [isApiLoading, initialFetchedContent, isContentLoadedIntoEditor]);

  useEffect(() => {
    if (isContentLoadedIntoEditor && editorRef.current && !isApiLoading) {
      // Multiple focus attempts to ensure it works
      const focusAttempts = [100, 300, 600, 1000];

      focusAttempts.forEach((delay) => {
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.focus();
          }
        }, delay);
      });
    }
  }, [isContentLoadedIntoEditor, isApiLoading]);

  if (isApiLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span>Loading editor data...</span>
        </div>
      </div>
    );
  }

  const handleExportDocument = async () => {
    if (!editorRef.current || !blogId) return;

    const trimmedTitle = blogTitle.trim();
    const content = editorRef.current?.getContent();

    if (!trimmedTitle || trimmedTitle === "Untitled Document") {
      showSnackbar(
        "Please provide a title for your blog before publishing.",
        "error",
      );
      return;
    }
    if (isContentEmpty(content)) {
      showSnackbar(
        "Blog content cannot be empty. Please write something before publishing.",
        "error",
      );
      return;
    }

    const numericBlogId = parseInt(blogId, 10);
    const payload: UpdateBlogPayload = {
      title: trimmedTitle,
      is_published: true,
      content,
    };

    try {
      const updatedBlog: Blog = await updateExistingBlog(
        numericBlogId,
        payload,
      );
      showSnackbar("Blog published successfully!", "success");
      navigate(`/blogs/${updatedBlog.id}`);
    } catch (error: unknown) {
      let errorMessage = "Failed to publish blog.";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      showSnackbar(errorMessage, "error");
    }
  };

  const handleSaveBlog = async (currentTitle: string) => {
    if (!editorRef.current || !blogId) return;

    const content = editorRef.current?.getContent();
    const images = editorRef.current?.getImages() || [];
    const numericBlogId = parseInt(blogId, 10);
    const titleToSave = currentTitle.trim() || "Untitled Document";

    const payload: UpdateBlogPayload = {
      title: titleToSave,
      is_published: true,
      pictures: images.map((img) => img.src),
      content,
    };

    try {
      const updatedBlog: Blog = await updateExistingBlog(
        numericBlogId,
        payload,
      );
      // showSnackbar("Blog saved successfully!", "success");
      navigate(`/blogs/${updatedBlog.id}`);
      // setBlogTitle(updatedBlog.title);
    } catch (error: unknown) {
      let errorMessage = "Failed to save blog.";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      showSnackbar(errorMessage, "error");
    }
  };

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
          isPublished={isPublished}
        />
        <div
          className={`border-l-1 bg-mountain-50 border-l-mountain-100 dark:border-l-mountain-700 h-full w-full`}
        >
          <Toolbar />
          <div className="print:bg-white print:p-0 pb-20 w-full h-screen overflow-x-hidden sidebar fixed">
            {/* <div className="right-60 bottom-4 z-50 fixed flex justify-center items-center bg-gradient-to-b from-blue-400 to-purple-400 shadow-md rounded-full w-14 h-14 hover:scale-105 transition duration-300 ease-in-out hover:cursor-pointer">
              <LuPencilLine className="size-6 text-white" />
            </div> */}
            <div className="flex mx-auto py-4 print:py-0 pb-20 w-[794px] print:w-full min-w-max min-h-[1123px] overflow-y-hidden mt-6">
              <Editor ref={editorRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteBlog;
