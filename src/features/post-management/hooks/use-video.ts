// TODO: remove this unused file

import { useSnackbar } from "@/hooks/useSnackbar";

export default function useVideoFileHandler(
  setVideoFile: (file: File | undefined) => void,
  setThumbnailFile: (file: File | undefined, isOriginal?: boolean) => void,
  imageFilesPreview: Map<File, string>,
  videoPreviewUrl: string | undefined,
  setVideoPreviewUrl: (url: string | undefined) => void,
) {
  const { showSnackbar } = useSnackbar();

  const captureThumbnail = (videoElement: HTMLVideoElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const ctx = canvas.getContext("2d", { alpha: true }); // ✅ Fix: store it

    if (!ctx) {
      console.error("Failed to get canvas context");
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // ✅ Clear with transparency
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height); // ✅ draw the frame

    canvas.toBlob((blob) => {
      if (blob) {
        setThumbnailFile(
          new File([blob], "thumbnailFromVideo.png", { type: "image/png" }),
          true,
        );
      } else {
        throw new Error("Failed to create blob from canvas");
      }
    }, "image/png");
  };

  const validateVideoDuration = (
    file: File,
    maxDurationSec = 60,
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.onloadedmetadata = () => {
        URL.revokeObjectURL(videoElement.src);
        resolve(videoElement.duration <= maxDurationSec);
      };
      videoElement.onerror = () => resolve(false);
      videoElement.src = URL.createObjectURL(file);
    });
  };

  const handleVideoFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newFiles = event.target.files;
    if (!newFiles || newFiles.length === 0) return;
    const file = newFiles[0];

    const isValidDuration = await validateVideoDuration(file, 60);
    if (!isValidDuration) {
      showSnackbar("Video length cannot exceed 1 minute.", "error");
      return;
    }
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);

    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;
    video.crossOrigin = "anonymous";

    video.onloadeddata = () => {
      video.currentTime = 0;
    };

    video.onseeked = () => {
      if (imageFilesPreview.size === 0) {
        captureThumbnail(video);
      }
    };

    video.onerror = () => {
      showSnackbar("Invalid video file.", "error");
      URL.revokeObjectURL(url);
    };
  };

  const handleRemoveVideoPreview = () => {
    URL.revokeObjectURL(videoPreviewUrl!); // Revoke the object URL
    setVideoPreviewUrl(undefined);
    setVideoFile(undefined);
    if (imageFilesPreview.size === 0) {
      setThumbnailFile(undefined, true);
    }
  };

  return {
    videoPreviewUrl,
    handleVideoFileChange,
    handleRemoveVideoPreview,
  };
}
