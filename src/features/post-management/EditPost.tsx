import React, { useState, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchPost } from "../post/api/post.api";
import { updatePost } from "./api/update-post";
import { mappedCategoryPost } from "@/lib/utils";
import { Post } from "@/types";
import { PostMedia } from "./types/post-media";
import { usePostMediaUploader } from "./hooks/use-post-medias-uploader";
import {
  createFormDataForEdit,
  getImageUrlsToRetain,
  getNewImageFiles,
  getNewlyUploadedRequiredFile,
  getNewVideoFile,
} from "./helpers/edit-post.helper";
import PostForm from "./PostForm";
import Loading from "@/pages/Loading";
import { FormikHelpers } from "formik";
import { MEDIA_TYPE } from "@/utils/constants";
import { PostFormValues } from "./types/post-form-values.type";

/**
 * EditPostPage – fully‑screen page that reuses UploadPost components
 * Route: /posts/:postId/edit
 */
const EditPost: React.FC = () => {
  /** ──────────────────── fetch post data ─────────────────── */
  const { postId } = useParams<{ postId: string }>();
  const location = useLocation();
  const passedPostData = location.state?.postData as Post | undefined;
  const {
    data: fetchedPost,
    isLoading: isPostLoading,
    error: postError,
  } = useQuery({
    queryKey: ["postData", postId],
    enabled: !!postId,
    queryFn: async () => {
      if (passedPostData) return passedPostData;
      const res = await fetchPost(parseInt(postId!));
      return mappedCategoryPost(res.data);
    },
    initialData: passedPostData,
  });

  /** ─────────────────── internal UI state (mirrors UploadPost) ─────────────────── */
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [postMedias, setPostMedias] = useState<PostMedia[]>([]);
  const [thumbnail, setThumbnail] = useState<PostMedia | null>(null);
  const [originalThumbnail, setOriginalThumbnail] = useState<PostMedia | null>(
    null,
  );
  const [hasArtNovaImages, setHasArtNovaImages] = useState(false);
  const { handleUploadVideo, handleUploadImageFile } = usePostMediaUploader();

  /** ─────────────────── preload fetched post into state ─────────────────── */

  useEffect(() => {
    if (!fetchedPost) return;

    setHasArtNovaImages(fetchedPost.ai_created);

    // Set thumbnail and original thumbnail
    setThumbnail({
      url: fetchedPost.thumbnail_url,
      type: MEDIA_TYPE.IMAGE,
      file: new File([], "template file for thumbnail"),
    });
    console.log(
      "Setting original thumbnail with crop meta:",
      fetchedPost.thumbnail_crop_meta,
    );
    setOriginalThumbnail({
      url: fetchedPost.thumbnail_crop_meta.initialThumbnail,
      type: MEDIA_TYPE.IMAGE,
      file: new File([], "template file for thumbnail"),
    });

    // build postMedias from postData.medias
    const initialMedias = fetchedPost.medias.map((media) => ({
      url: media.url,
      type: media.media_type,
      file: new File([], "template file for existing media"),
    }));

    setPostMedias(initialMedias);
  }, [fetchedPost]);

  const initialFormValues = useMemo((): PostFormValues => {
    if (!fetchedPost) {
      console.error("Fetched post data is not available");
      throw new Error("Fetched post data is not available");
    }
    return {
      title: fetchedPost.title,
      description: fetchedPost.description,
      cate_ids: fetchedPost.categories?.map((c) => c.id) ?? [],
      isMature: fetchedPost.is_mature,
      thumbnailMeta: fetchedPost.thumbnail_crop_meta,
    };
  }, [fetchedPost]);

  /** ─────────────────── submit ─────────────────── */
  const handleSubmit = async (
    values: PostFormValues,
    formikActions: FormikHelpers<PostFormValues>,
  ) => {
    if (postMedias.length === 0) {
      showSnackbar("At least one image or video is required.", "error");
      return;
    }

    if (!thumbnail || !originalThumbnail) {
      showSnackbar("Thumbnail is required.", "error");
      return;
    }

    try {
      const videoMedia = postMedias.find((media) => media.type === "video");
      const newVideoFile = getNewVideoFile(videoMedia);
      const newThumbnailFile = getNewlyUploadedRequiredFile(thumbnail);
      const newOriginalThumbnailFile =
        getNewlyUploadedRequiredFile(originalThumbnail);

      const [newVideoUrl, newInitialThumbnailUrl, newThumbnailUrl] =
        await Promise.all([
          newVideoFile && handleUploadVideo(newVideoFile),
          newOriginalThumbnailFile &&
            handleUploadImageFile(
              newOriginalThumbnailFile,
              "original_thumbnail",
            ),
          newThumbnailFile &&
            handleUploadImageFile(newThumbnailFile, "thumbnail"),
        ] as Promise<string | undefined>[]);

      const imageMedias = postMedias.filter((media) => media.type === "image");

      const body = createFormDataForEdit({
        title: values.title,
        imageUrlsToRetain: getImageUrlsToRetain(imageMedias),
        newImageFiles: getNewImageFiles(imageMedias),
        cate_ids: values.cate_ids,
        thumbnailCropMeta: JSON.stringify(values.thumbnailMeta),
        description: values.description,
        videoUrl: newVideoUrl !== undefined ? newVideoUrl : videoMedia?.url,
        initialThumbnail:
          newInitialThumbnailUrl ??
          fetchedPost!.thumbnail_crop_meta.initialThumbnail,
        thumbnailUrl: newThumbnailUrl,
        isMature: values.isMature,
        aiCreated: hasArtNovaImages,
      });

      await updatePost(parseInt(postId!), body);
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error("Error during editing post", err);
      showSnackbar("Failed to update post", "error");
    } finally {
      formikActions.setSubmitting(false);
    }
  };

  /** ─────────────────── render ─────────────────── */
  if (isPostLoading) return <Loading />;
  if (postError || !fetchedPost) {
    return (
      <Box className="flex justify-center items-center h-full text-red-500">
        <p>
          Error loading post:{" "}
          {postError instanceof Error ? postError.message : "Unknown error"}
        </p>
      </Box>
    );
  }

  return (
    <PostForm
      initialFormValues={initialFormValues}
      postMedias={postMedias}
      setPostMedias={setPostMedias}
      thumbnail={thumbnail}
      setThumbnail={setThumbnail}
      originalThumbnail={originalThumbnail}
      setOriginalThumbnail={setOriginalThumbnail}
      hasArtNovaImages={hasArtNovaImages}
      setHasArtNovaImages={setHasArtNovaImages}
      isEditMode={true}
      onSubmit={handleSubmit}
    />
  );
};

export default EditPost;
