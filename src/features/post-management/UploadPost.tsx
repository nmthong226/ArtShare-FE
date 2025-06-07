import React, { useEffect, useState } from "react";
import { useSnackbar } from "@/hooks/useSnackbar";
import { createPost } from "./api/create-post";

import { useLocation, useNavigate } from "react-router-dom";
import { fetchImageFileFromUrl } from "@/utils/fetch-media.utils";
import { PostMedia } from "./types/post-media";
import {
  createFormData,
  getImageFilesFromPostMedias,
  getVideoFileFromPostMedias,
} from "./helpers/upload-post.helper";
import { MEDIA_TYPE } from "@/utils/constants";
import { usePostMediaUploader } from "./hooks/use-post-medias-uploader";
import PostForm from "./PostForm";
import { FormikHelpers } from "formik";
import {
  defaultPostFormValues,
  PostFormValues,
} from "./types/post-form-values.type";

const UploadPost: React.FC = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const location = useLocation();
  const selectedPrompt: PromptResult | undefined = location.state?.prompt;

  const [promptId, setPromptId] = useState<number | null>(null);
  const [hasArtNovaImages, setHasArtNovaImages] = useState(false);
  const [postMedias, setPostMedias] = useState<PostMedia[]>([]);
  const [thumbnail, setThumbnail] = useState<PostMedia | null>(null);
  const [originalThumbnail, setOriginalThumbnail] = useState<PostMedia | null>(
    null,
  );

  const { handleUploadVideo, handleUploadImageFile } = usePostMediaUploader();

  const handleSubmitForCreate = async (
    values: PostFormValues,
    formikActions: FormikHelpers<PostFormValues>,
  ) => {
    if (postMedias.length === 0) {
      showSnackbar("At least one image or video is required.", "error");
      return;
    }
    try {
      if (!thumbnail || !originalThumbnail) {
        showSnackbar("Thumbnail is required.", "error");
        return;
      }

      if (hasArtNovaImages && !promptId) {
        showSnackbar("something went wrong, please try again.", "error");
        console.error(
          "AI generated images are selected but no prompt ID is provided.",
        );
        return;
      }

      const videoFile = getVideoFileFromPostMedias(postMedias);

      const [videoUrl, initialThumbnailUrl, thumbnailUrl] = await Promise.all([
        videoFile && handleUploadVideo(videoFile),
        handleUploadImageFile(originalThumbnail.file, "original_thumbnail"),
        handleUploadImageFile(thumbnail.file, "thumbnail"),
      ] as Promise<string | undefined>[]);

      await handleCreatePost(
        values,
        thumbnailUrl!,
        initialThumbnailUrl!,
        videoUrl,
        promptId,
      );
      navigate("/explore");
    } catch (error) {
      console.error("Error during creating post:", error);
      showSnackbar("Failed to create post or upload video.", "error");
    } finally {
      formikActions.setSubmitting(false);
    }
  };

  const handleCreatePost = async (
    values: PostFormValues,
    thumbnailUrl: string,
    initialThumbnailUrl: string,
    videoUrl?: string,
    promptId?: number | null,
  ): Promise<void> => {
    const formData = createFormData({
      title: values.title,
      thumbnailUrl: thumbnailUrl,
      thumbnailCropMeta: JSON.stringify(values.thumbnailMeta),
      description: values.description,
      imageFiles: getImageFilesFromPostMedias(postMedias),
      videoUrl,
      initialThumbnailUrl,
      isMature: values.isMature,
      aiCreated: hasArtNovaImages,
      cate_ids: values.cate_ids,
      prompt_id: promptId ?? undefined,
    });
    try {
      const response = await createPost(formData);
      console.log("Post created:", response);
    } catch (error) {
      console.error("Error creating post:", error);
      showSnackbar("Failed to create post.", "error");
      throw error;
    }
  };

  useEffect(() => {
    if (!selectedPrompt) return;

    const fetchFilesFromUrls = async () => {
      try {
        const aiImageMedias = selectedPrompt.image_urls.map((url) => ({
          type: MEDIA_TYPE.IMAGE,
          url: url,
          file: new File([], "temp_image.png", { type: "image/png" }), // Placeholder file
        }));
        setPostMedias(aiImageMedias);

        // update medias file in the background
        const updatePostMediasFileAsync = async () => {
          const aiImageMediasWithRealFile = await Promise.all(
            aiImageMedias.map(async (media) => {
              const file = await fetchImageFileFromUrl(media.url);
              return { ...media, file };
            }),
          );
          setPostMedias(aiImageMediasWithRealFile);

          const thumbnail = {
            file: aiImageMediasWithRealFile[0].file,
            type: MEDIA_TYPE.IMAGE,
            url: aiImageMediasWithRealFile[0].url,
          };
          setThumbnail(thumbnail);
          setOriginalThumbnail(thumbnail);
          setPromptId(selectedPrompt.id);
        };
        updatePostMediasFileAsync();
      } catch (err) {
        console.error("Error fetching images from S3", err);
      }
    };

    fetchFilesFromUrls();
    setHasArtNovaImages(true);

    // clear prompt out of history
    navigate(location.pathname, {
      replace: true, // swap current entry instead of pushing
      state: {}, // or `state: null`
    });
  }, [location.pathname, navigate, selectedPrompt]);

  return (
    <PostForm
      initialFormValues={defaultPostFormValues}
      postMedias={postMedias}
      setPostMedias={setPostMedias}
      thumbnail={thumbnail}
      setThumbnail={setThumbnail}
      originalThumbnail={originalThumbnail}
      setOriginalThumbnail={setOriginalThumbnail}
      hasArtNovaImages={hasArtNovaImages}
      setHasArtNovaImages={setHasArtNovaImages}
      isEditMode={false}
      onSubmit={handleSubmitForCreate}
    />
  );
};

export default UploadPost;
