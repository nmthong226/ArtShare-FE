import React, { useEffect, useState } from "react";
import { Box, Button, Tooltip } from "@mui/material";
import UploadForm from "./components/UploadForm"; // Adjust import path as needed
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { createPost } from "./api/create-post";

import { useLocation, useNavigate } from "react-router-dom";
import MediaSelection from "./components/media-selection";
import { FaMagic } from "react-icons/fa";
import { generatePostContent } from "./api/generate-post-content.api";
import { fetchImageFileFromUrl } from "@/utils/fetch-media.utils";
import { PostMedia } from "./types/post-media";
import { createFormData } from "./helpers/upload-post.helper";
import { MEDIA_TYPE } from "@/utils/constants";
import { usePostMediaUploader } from "./hooks/use-post-medias-uploader";
import axios, { AxiosError } from "axios";
import {
  BackendErrorResponse,
  DEFAULT_ERROR_MSG,
} from "@/api/types/error-response.type";
import { useQueryClient } from "@tanstack/react-query";
import { useSubscriptionInfo } from "@/hooks/useSubscription";
import Loading from "@/pages/Loading";

const UploadPost: React.FC = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const location = useLocation();
  const selectedPrompt: PromptResult | undefined = location.state?.prompt;
  const [lastCrop, setLastCrop] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [lastZoom, setLastZoom] = useState(1);
  const [originalThumbnailFile, setOriginalThumbnailFile] = useState<
    File | undefined
  >();

  const [isLoading, setIsLoading] = useState(false);
  const [hasArtNovaImages, setHasArtNovaImages] = useState(false);

  // SHARED FIELDS
  const [title, setTitle] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cate_ids, setCateIds] = useState<number[]>([]);
  const [description, setDescription] = useState("");
  const [isMature, setIsMature] = useState(false);

  const [postMedias, setPostMedias] = useState<PostMedia[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>(
    undefined,
  );
  const [thumbnailCropMeta, setThumbnailCropMeta] = useState<string>("{}");

  const isUploadMediaValid = postMedias.length > 0;
  const imageFiles = postMedias
    .filter((media) => media.type === "image")
    .map((media) => media.file);
  const videoFile = postMedias.find((media) => media.type === "video")?.file;
  const { handleUploadVideo, handleUploadImageFile } = usePostMediaUploader();

  const queryClient = useQueryClient();
  const { data: subscriptionInfo } = useSubscriptionInfo();

  const validateVideoDuration = (
    file: File,
    maxDurationSec = 60,
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";

      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        const isValid = videoElement.duration <= maxDurationSec;
        resolve(isValid);
      };

      videoElement.onerror = () => {
        resolve(false);
      };

      videoElement.src = URL.createObjectURL(file);
    });
  };

  // Function to handle the form submission
  const handleSubmitMediaUploaded = async () => {
    setIsSubmitted(true);
    if (!title.trim()) {
      showSnackbar("Title is required.", "error");
      return;
    }
    if (!isUploadMediaValid) {
      showSnackbar("At least one image or video is required.", "error");
      return;
    }
    if (videoFile) {
      const isVideoValid = await validateVideoDuration(videoFile, 60); // 60 sec max
      if (!isVideoValid) {
        showSnackbar("Video length cannot exceed 1 minute.", "error");
        return;
      }
    }
    try {
      setIsLoading(true);
      if (!thumbnailFile) {
        throw new Error("Thumbnail file is not defined");
      }

      const [videoUrl, initialThumbnail, thumbnailUrl] = await Promise.all([
        videoFile && handleUploadVideo(videoFile),
        originalThumbnailFile &&
          handleUploadImageFile(originalThumbnailFile, "original_thumbnail"),
        thumbnailFile && handleUploadImageFile(thumbnailFile, "thumbnail"),
      ] as Promise<string | undefined>[]);

      await handleCreatePost(thumbnailUrl!, initialThumbnail, videoUrl);
      navigate("/explore");
    } catch (error) {
      console.error("Error during submission:", error);
      showSnackbar("Failed to create post or upload video.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (
    thumbnailUrl: string,
    initialThumbnail?: string,
    videoUrl?: string,
  ): Promise<void> => {
    const formData = createFormData(
      title,
      thumbnailUrl,
      thumbnailCropMeta,
      description,
      imageFiles,
      videoUrl,
      initialThumbnail,
      isMature,
      hasArtNovaImages,
      cate_ids,
    );
    try {
      const response = await createPost(formData);
      console.log("Post created:", response);
    } catch (error) {
      console.error("Error creating post:", error);
      showSnackbar("Failed to create post.", "error");
      throw error;
    }
  };

  const handleThumbnailChange = (
    file: File | undefined,
    isOriginal = false,
    thumbnail_crop_meta = "{}",
  ) => {
    setThumbnailFile(file);
    setThumbnailCropMeta(thumbnail_crop_meta);

    if (isOriginal) {
      setOriginalThumbnailFile(file);
      setLastCrop({ x: 0, y: 0 });
      setLastZoom(1);
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

          setThumbnailFile(aiImageMediasWithRealFile[0].file);
        };
        setHasArtNovaImages(true);
        updatePostMediasFileAsync();
      } catch (err) {
        console.error("Error fetching images from S3", err);
      }
    };

    fetchFilesFromUrls();

    // clear prompt out of history
    navigate(location.pathname, {
      replace: true, // swap current entry instead of pushing
      state: {}, // or `state: null`
    });
  }, [location.pathname, navigate, selectedPrompt]);

  const handleGenerateContent = async () => {
    if (!imageFiles || imageFiles.length === 0) {
      showSnackbar("Please upload an image first.", "error");
      return;
    }

    if (subscriptionInfo?.aiCreditRemaining === 0) {
      showSnackbar(
        "You’ve run out of AI credits. Upgrade your plan or come back later.",
        "warning",
      );
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      imageFiles.forEach((file) => formData.append("images", file));
      const response = await generatePostContent(formData);
      const { title, description, categories } = response;
      console.log("Generated content:", response);
      setTitle(title);
      setDescription(description);
      setCateIds(categories.map((cate) => cate.id));
    } catch (e) {
      const msg = axios.isAxiosError(e)
        ? ((e as AxiosError<BackendErrorResponse>).response?.data?.message ??
          DEFAULT_ERROR_MSG)
        : DEFAULT_ERROR_MSG;
      showSnackbar(msg, "error");
      console.error("Error generating content:", e);
    } finally {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ["subscriptionInfo"] });
    }
  };

  return (
    <Box className="dark:bg-mountain-950 w-full h-full">
      {isLoading && <Loading />}

      <Box
        className="flex gap-3 p-4 w-full h-[calc(100vh-4rem)]"
        style={{ overflow: "hidden" }}
      >
        {/* LEFT COLUMN */}
        <MediaSelection
          postMedias={postMedias}
          setPostMedias={setPostMedias}
          setThumbnailFile={handleThumbnailChange}
          hasArtNovaImages={hasArtNovaImages}
          setHasArtNovaImages={setHasArtNovaImages}
        />
        {/* RIGHT COLUMN: FORM FIELDS & ACTIONS */}
        <Box className="flex flex-col space-y-3 w-[40%]">
          {/* <Box className="mb-2">
            <UploadToggle
              isImageUpload={isImageUpload}
              onToggle={() => setIsImageUpload((prev) => !prev)}
            />
          </Box> */}
          {/* Form fields */}
          <Box className="relative pr-4 rounded-md w-full overflow-y-auto custom-scrollbar">
            <Tooltip
              title="Auto generate content (title, description, categories) - Credit cost: ~2"
              arrow
              placement="left"
            >
              <Button
                className="top-2 z-50 sticky flex justify-center items-center bg-gradient-to-b from-blue-400 to-purple-400 shadow-md ml-auto p-0 rounded-full w-12 min-w-0 h-12 hover:scale-105 duration-300 ease-in-out hover:cursor-pointer transform"
                onClick={handleGenerateContent}
              >
                <FaMagic className="size-5 text-white" />
              </Button>
            </Tooltip>
            <UploadForm
              thumbnailFile={thumbnailFile}
              originalThumbnailFile={originalThumbnailFile}
              setOriginalThumbnailFile={setOriginalThumbnailFile}
              // existingThumbnailUrl={aiImages?.image_urls[0]}
              onThumbnailChange={handleThumbnailChange}
              isSubmitted={isSubmitted}
              cate_ids={cate_ids}
              setCateIds={setCateIds}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              isMature={isMature}
              setIsMature={setIsMature}
              lastCrop={lastCrop}
              lastZoom={lastZoom}
              setLastCrop={setLastCrop}
              setLastZoom={setLastZoom}
            />
          </Box>
          <hr className="border-mountain-300 dark:border-mountain-700 border-t-1 w-full" />
          {/* Bottom actions */}
          <Box className="flex justify-end bg-none mt-auto pr-4 w-full">
            <Button
              variant="contained"
              onClick={handleSubmitMediaUploaded}
              disabled={!isUploadMediaValid}
              className="ml-auto rounded-md"
              sx={{
                textTransform: "none",
                background: !isUploadMediaValid
                  ? "linear-gradient(to right, #9ca3af, #6b7280)" // Tailwind's gray-400 to gray-500
                  : "linear-gradient(to right, #3730a3, #5b21b6, #4c1d95)", // indigo-violet gradient
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
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UploadPost;
