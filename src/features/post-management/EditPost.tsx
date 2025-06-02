import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchPost } from "../post/api/post.api";
import { updatePost } from "./api/update-post";
import UploadForm from "./components/UploadForm";
import MediaSelection from "./components/media-selection";
import { mappedCategoryPost } from "@/lib/utils";
import { Post } from "@/types";
import { Area } from "react-easy-crop";
import { fetchImageFileFromUrl } from "@/utils/fetch-media.utils";
import { PostMedia } from "./types/post-media";
import { usePostMediaUploader } from "./hooks/use-post-medias-uploader";
import {
  createFormDataForEdit,
  getImageUrlsToRetain,
  getNewImageFiles,
  getNewVideoFile,
} from "./helpers/edit-post.helper";

interface ThumbnailMeta {
  crop: { x: number; y: number };
  zoom: number;
  aspect: number;
  selectedAspect: string;
  croppedAreaPixels: Area;
  initialThumbnail: string;
}

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
    data: postData,
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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postMedias, setPostMedias] = useState<PostMedia[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();
  const [originalThumbnailFile, setOriginalThumbnailFile] = useState<
    File | undefined
  >();
  const [isMature, setIsMature] = useState(false);
  const [hasArtNovaImages, setHasArtNovaImages] = useState(false);
  const [cate_ids, setCateIds] = useState<number[]>([]);

  const [lastCrop, setLastCrop] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [lastZoom, setLastZoom] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailCropMeta, setThumbnailCropMeta] = useState<string>("{}");
  const [thumbnailMeta, setThumbnailMeta] = useState<ThumbnailMeta | undefined>(
    undefined,
  );

  const isUploadMediaValid = postMedias.length > 0;
  const imageMedias = postMedias.filter((media) => media.type === "image");
  const videoMedia = postMedias.find((media) => media.type === "video");
  const { handleUploadVideo, handleUploadImageFile } = usePostMediaUploader();

  const getThumbnailCropMeta = () => {
    const cropMeta = JSON.parse(thumbnailCropMeta);
    return {
      crop: cropMeta.crop,
      zoom: cropMeta.zoom,
      aspect: cropMeta.aspect,
      selectedAspect: cropMeta.selectedAspect,
      croppedAreaPixels: cropMeta.croppedAreaPixels,
      initialThumbnail: cropMeta.initialThumbnail,
    };
  };

  useEffect(() => {
    if (isPostLoading || postError) return;
    setThumbnailCropMeta(JSON.stringify(postData?.thumbnail_crop_meta) ?? "{}");
  }, [postData]);

  useEffect(() => {
    if (isPostLoading || postError) return;
    if (Object.keys(getThumbnailCropMeta()).length === 0) return;
    const metaData = getThumbnailCropMeta();
    setThumbnailMeta(metaData);

    fetchImageFileFromUrl(metaData.initialThumbnail).then((file) => {
      setLastCrop(metaData?.crop);
      setLastZoom(metaData?.zoom);
      setOriginalThumbnailFile(file);
    });
  }, [thumbnailCropMeta]);

  /** ─────────────────── preload fetched post into state ─────────────────── */
  useEffect(() => {
    if (!postData) return;

    // Populate form state
    setTitle(postData.title);
    setDescription(postData.description ?? "");
    setIsMature(postData.is_mature);
    setHasArtNovaImages(postData.ai_created);
    setCateIds(postData?.categories?.map((c) => c.id) ?? []);

    // build postMedias from postData.medias
    const initialMedias = postData.medias.map((media) => ({
      url: media.url,
      type: media.media_type,
      file: new File([], "template file for existing media"),
    }));

    setPostMedias(initialMedias);
  }, [postData]);

  /** ─────────────────── submit ─────────────────── */
  const handleSubmit = async () => {
    if (!postData) return;
    setIsSubmitted(true);

    if (!title.trim()) {
      showSnackbar("Title is required.", "error");
      return;
    }
    if (!isUploadMediaValid) {
      showSnackbar("At least one image or video is required.", "error");
      return;
    }

    try {
      setIsUploading(true);

      const newVideoFile = getNewVideoFile(videoMedia);

      const [newVideoUrl, newInitialThumbnailUrl, newThumbnailUrl] =
        await Promise.all([
          newVideoFile && handleUploadVideo(newVideoFile),
          originalThumbnailFile &&
            handleUploadImageFile(originalThumbnailFile, "original_thumbnail"),
          thumbnailFile && handleUploadImageFile(thumbnailFile, "thumbnail"),
        ] as Promise<string | undefined>[]);

      const body = createFormDataForEdit(
        title,
        getImageUrlsToRetain(imageMedias),
        getNewImageFiles(imageMedias),
        cate_ids,
        thumbnailCropMeta,
        description,
        newVideoUrl ?? videoMedia?.url,
        newInitialThumbnailUrl,
        newThumbnailUrl,
        isMature,
        hasArtNovaImages,
      );

      await updatePost(parseInt(postId!), body);
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to update post", "error");
    } finally {
      setIsUploading(false);
    }
  };

  /** ─────────────────── render ─────────────────── */
  if (isPostLoading) {
    console.log({ postData, isPostLoading, postError });

    return (
      <Box className="flex justify-center items-center space-x-4 h-full">
        <CircularProgress size={36} />
        <p>Loading...</p>
      </Box>
    );
  }
  if (postError || !postData) return <div>Unable to load post.</div>;

  return (
    <Box className="dark:bg-mountain-950 w-full h-full">
      {isUploading && (
        <Backdrop
          open
          sx={{ color: "#fff", zIndex: (t) => t.zIndex.modal + 1 }}
        >
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>Updating post…</Typography>
        </Backdrop>
      )}

      {/* Body */}
      <Box
        className="flex gap-3 p-4 w-full h-[calc(100vh-4rem)]"
        style={{ overflow: "hidden" }}
      >
        {/* LEFT: Media selection */}
        <MediaSelection
          postMedias={postMedias}
          setPostMedias={setPostMedias}
          setThumbnailFile={(f) => setThumbnailFile(f)}
          setHasArtNovaImages={setHasArtNovaImages}
          hasArtNovaImages={hasArtNovaImages}
        />

        {/* RIGHT: form */}
        <Box className="flex flex-col space-y-3 w-[50%]">
          <Box className="pr-4 rounded-md overflow-y-auto custom-scrollbar">
            <UploadForm
              thumbnailFile={thumbnailFile}
              onThumbnailChange={(f, _, thumbnail_crop_meta = "{}") => {
                setThumbnailFile(f);
                setThumbnailCropMeta(thumbnail_crop_meta);
              }}
              setOriginalThumbnailFile={setOriginalThumbnailFile}
              originalThumbnailFile={originalThumbnailFile}
              isSubmitted={isSubmitted}
              title={title}
              cate_ids={cate_ids}
              setCateIds={setCateIds}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              isMature={isMature}
              setIsMature={setIsMature}
              lastCrop={lastCrop}
              lastZoom={lastZoom}
              setLastCrop={setLastCrop}
              setLastZoom={setLastZoom}
              existingThumbnailUrl={postData.thumbnail_url}
              initialAspect={thumbnailMeta?.aspect}
              initialSelectedAspect={thumbnailMeta?.selectedAspect}
              initialCroppedAreaPixels={thumbnailMeta?.croppedAreaPixels}
            />
          </Box>
          <hr className="border-mountain-300 dark:border-mountain-700 border-t-1 w-full" />
          <Box className="flex justify-between mt-auto pr-4 w-full">
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!isUploadMediaValid}
              className="ml-auto rounded-md"
              sx={{
                textTransform: "none",
                background: !isUploadMediaValid
                  ? "linear-gradient(to right, #9ca3af, #6b7280)"
                  : "linear-gradient(to right, #3730a3, #5b21b6, #4c1d95)",
                color: "white",
                opacity: !isUploadMediaValid ? 0.6 : 1,
                pointerEvents: !isUploadMediaValid ? "none" : "auto",
                "&:hover": {
                  background: !isUploadMediaValid
                    ? "linear-gradient(to right, #9ca3af, #6b7280)"
                    : "linear-gradient(to right, #312e81, #4c1d95, #3b0764)",
                },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditPost;
