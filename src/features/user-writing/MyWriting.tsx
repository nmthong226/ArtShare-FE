import { useEffect, useRef, useState } from "react";
import Editor, { EditorHandle } from "./components/Editor";
import TextEditorHeader from "./components/TextEditorHeader";
import Toolbar from "./components/Toolbar";
import { useParams } from "react-router-dom";
import { fetchBlogDetails } from "./api/get-detail-document";
import AIEnhancer from "./components/AITools";
import { updateDoc } from "./api/edit-document";
import { createDoc } from "./api/create-document";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBlogPublishStatus } from "./api/set-document-published";

const WriteDocument = () => {
  const editorRef = useRef<EditorHandle>(null);
  const [isContentValid, setContentValid] = useState<boolean>(false);
  const [isTitleValid, setTitleValid] = useState<boolean>(false);
  const [canPublish, setCanPublish] = useState<boolean>(false);

  const [documentTitle, setDocumentTitle] = useState("");
  const [isPublished, setIsPublished] = useState<boolean | null>(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blog = await fetchBlogDetails(Number(id));
        setDocumentTitle(blog.title);
        setIsPublished(blog.is_published);
        editorRef.current?.setContent(blog.content); // make sure EditorHandle includes setContent
      } catch (error) {
        console.error("Failed to load blog:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  const { mutate: saveBlog, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const content = editorRef.current?.getContent();
      const titleToSave =
        documentTitle.length > 0 ? documentTitle : "Untitled Document";
      if (id) {
        return await updateDoc(Number(id), { title: titleToSave, content });
      } else {
        return await createDoc({ title: titleToSave, content });
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["myBlogs"] });
      console.log("Saved blog:", data);
    },
    onError: (error) => {
      console.error("Error saving blog:", error);
    },
  });

  const { mutate: togglePublish, isPending: isToggling } = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("No blog ID");
      return await updateBlogPublishStatus(Number(id), !isPublished);
    },
    onSuccess: (data) => {
      setIsPublished(data.is_published);
      queryClient.invalidateQueries({ queryKey: ["myBlogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogDetail", id] });
    },
    onError: (error) => {
      console.error("Failed to update publish status:", error);
    },
  });

  const handleSave = () => {
    if (!editorRef.current) return;
    saveBlog();
  };

  const handleSetDocumentPublish = () => {
    togglePublish();
  };

  const validateBeforePublish = () => {
    const currentContent = editorRef.current?.getContent() || "";
    const trimmedContent = currentContent.trim();
    const wordCount = trimmedContent.split(/\s+/).length;

    const titleValid = documentTitle.trim().length > 0;
    const contentValid = wordCount > 100;
    const canPublishNow = titleValid && contentValid;

    setTitleValid(titleValid);
    setContentValid(contentValid);
    setCanPublish(canPublishNow);

    return canPublishNow;
  };

  return (
    <div className={`flex flex-row w-full h-full`}>
      <div
        className={`flex flex-col flex-1 flex-shrink w-[calc(100vw-16rem)] h-full`}
      >
        <TextEditorHeader
          documentTitle={documentTitle}
          setDocumentTitle={setDocumentTitle}
          onValidatePublish={validateBeforePublish}
          handleSetDocumentPublish={handleSetDocumentPublish}
          handleSaveDocument={handleSave}
          isPublished={isPublished!}
          isLoading={loading}
          isSaving={isSaving}
          isToggling={isToggling}
          isTitleValid={isTitleValid}
          isContentValid={isContentValid}
          canPublish={canPublish}
        />
        <div
          className={`border-l-1 bg-mountain-50 border-l-mountain-100 dark:border-l-mountain-700 h-full w-full`}
        >
          <Toolbar />
          <div className="z-0 relativeflex flex-col justify-center print:bg-white print:p-0 pb-20 w-full h-screen overflow-x-hidden sidebar">
            <AIEnhancer />
            <div className="flex mx-auto py-4 print:py-0 pb-20 w-[794px] print:w-full min-w-max min-h-[1123px] overflow-y-hidden">
              <Editor ref={editorRef} isLoading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteDocument;
