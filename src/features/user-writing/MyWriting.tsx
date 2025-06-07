import { useEffect, useRef, useState } from "react";
import Editor, { EditorHandle } from "./components/Editor";
import TextEditorHeader from "./components/TextEditorHeader";
import Toolbar from "./components/Toolbar";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchBlogDetails } from "../blog-details/api/blog";
import { updateExistingBlog, UpdateBlogPayload } from "./api/blog.api";
import { Blog } from "@/types/blog";
import { AxiosError } from "axios";
import { TUTORIAL_TEMPLATE_HTML } from "@/constants/template";
import { AutoSaveStatus } from "./components/AutoSaveStatus";

const WriteBlog = () => {
  const editorRef = useRef<EditorHandle>(null);
  const { showSnackbar } = useSnackbar();
  const { blogId } = useParams<{ blogId: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isNewDocument = blogId === "new";
  const templateType = searchParams.get("template");

  const [blogTitle, setBlogTitle] = useState("Untitled Document");
  const [isApiLoading, setIsApiLoading] = useState(!isNewDocument);
  const [isContentLoadedIntoEditor, setIsContentLoadedIntoEditor] =
    useState(isNewDocument);
  const [initialFetchedContent, setInitialFetchedContent] = useState<
    string | null
  >(
    isNewDocument
      ? templateType === "tutorial"
        ? TUTORIAL_TEMPLATE_HTML
        : ""
      : null,
  );
  const [isPublished, setIsPublished] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "saved" | "saving" | "unsaved" | "error"
  >("saved");
  const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("@@ has unsaved changes", hasUnsavedChanges, blogId);
    if (!hasUnsavedChanges || !blogId || blogId === "new") return;

    const autoSaveTimer = setTimeout(async () => {
      const content = editorRef.current?.getContent();
      if (content && blogId !== "new") {
        try {
          await updateExistingBlog(parseInt(blogId, 10), {
            content,
            title: blogTitle,
            is_published: false, // Keep as draft
          });
          setHasUnsavedChanges(false); // Reset after successful save
          console.log("Auto-saved successfully");
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [hasUnsavedChanges, blogId, blogTitle]);

  // Add a function to handle editor content changes
  const handleEditorChange = () => {
    if (!isNewDocument && blogId !== "new") {
      setHasUnsavedChanges(true);
    }
  };

  // Also trigger on title changes
  const handleTitleChange = (newTitle: string) => {
    setBlogTitle(newTitle);
    if (!isNewDocument && blogId !== "new") {
      setHasUnsavedChanges(true);
    }
  };

  useEffect(() => {
    // Skip API call for new documents
    if (isNewDocument) {
      setIsApiLoading(false);
      if (editorRef.current) {
        const content =
          templateType === "tutorial" ? TUTORIAL_TEMPLATE_HTML : "";
        editorRef.current.setContent(content);
        editorRef.current.focus();
      }
      return;
    }

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
  }, [blogId, navigate, showSnackbar, isNewDocument, templateType]);

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

  // Update the auto-save effect
  useEffect(() => {
    if (!hasUnsavedChanges || !blogId || blogId === "new") return;

    // Set status to unsaved when changes are detected
    setSaveStatus("unsaved");

    const autoSaveTimer = setTimeout(async () => {
      const content = editorRef.current?.getContent();
      if (content && blogId !== "new") {
        setSaveStatus("saving");
        try {
          await updateExistingBlog(parseInt(blogId, 10), {
            content,
            title: blogTitle,
            is_published: false,
          });
          setHasUnsavedChanges(false);
          setSaveStatus("saved");
          setLastSaved(new Date());
          console.log("Auto-saved successfully");
        } catch (error) {
          console.error("Auto-save failed:", error);
          setSaveStatus("error");
        }
      }
    }, 5000);

    return () => clearTimeout(autoSaveTimer);
  }, [hasUnsavedChanges, blogId, blogTitle]);

  if (isApiLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-white dark:bg-mountain-950">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
          <span className="text-gray-700 dark:text-gray-300">
            Loading editor data...
          </span>
        </div>
      </div>
    );
  }

  const handleExportDocument = async () => {
    if (!editorRef.current || !blogId) return;

    const link = `http://localhost:5173/blogs/${blogId}`; // replace with your dynamic link
    try {
      await navigator.clipboard.writeText(link);
      setTooltipOpen(true);
      setTimeout(() => {
        setTooltipOpen(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleSaveBlog = async (currentTitle: string) => {
    if (!editorRef.current || !blogId) return;

    setSaveStatus("saving");
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
      setSaveStatus("saved");
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      navigate(`/blogs/${updatedBlog.id}`);
    } catch (error: unknown) {
      setSaveStatus("error");
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
    <div className="flex flex-row w-full h-full bg-white dark:bg-mountain-950">
      <div className="flex flex-col flex-1 flex-shrink w-[calc(100vw-16rem)] h-full">
        <TextEditorHeader
          handleExport={handleExportDocument}
          handleSaveBlog={handleSaveBlog}
          text={blogTitle}
          setText={handleTitleChange}
          isPublished={isPublished}
          tooltipOpen={tooltipOpen}
          saveStatus={
            <AutoSaveStatus status={saveStatus} lastSaved={lastSaved} />
          }
        />
        <div className="border-l-1 bg-mountain-50 dark:bg-mountain-900 border-l-mountain-100 dark:border-l-mountain-700 h-full w-full">
          <Toolbar />
          <div className="print:bg-white dark:print:bg-mountain-950 print:p-0 pb-20 w-full h-screen overflow-x-hidden sidebar fixed">
            {/* <div className="right-60 bottom-4 z-50 fixed flex justify-center items-center bg-gradient-to-b from-blue-400 to-purple-400 shadow-md rounded-full w-14 h-14 hover:scale-105 transition duration-300 ease-in-out hover:cursor-pointer">
              <LuPencilLine className="size-6 text-white" />
            </div> */}
            <div className="flex mx-auto py-4 print:py-0 pb-20 w-[794px] print:w-full min-w-max min-h-[1123px] overflow-y-hidden mt-6">
              <Editor ref={editorRef} onChange={handleEditorChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteBlog;
