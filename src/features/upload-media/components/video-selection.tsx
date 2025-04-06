import { Box, Button, Typography } from "@mui/material";
import useVideoFileHandler from "../hooks/use-video";
import {
  CloudUpload as CloudUploadIcon,
  DeleteOutlineOutlined,
} from "@mui/icons-material";

export default function VideoSelection({
  imageFilesPreview,
  videoPreviewUrl,
  setVideoFile,
  setThumbnailFile,
  setVideoPreviewUrl,
  hidden
}: {
  imageFilesPreview: Map<File, string>;
  videoPreviewUrl: string | undefined;
  setVideoFile: (file: File | undefined) => void;
  setThumbnailFile: (file: File | undefined) => void;
  setVideoPreviewUrl: (url: string | undefined) => void;
  hidden: boolean;
}) {

  const {
    handleVideoFileChange,
    handleRemoveVideoPreview
  } = useVideoFileHandler(
    setVideoFile,
    setThumbnailFile,
    imageFilesPreview,
    videoPreviewUrl,
    setVideoPreviewUrl
  )

  return (
    <Box
      className={`relative w-full rounded-md flex flex-col ${videoPreviewUrl
        ? "border border-gray-500 border-dashed"
        : ""
        }`}
      hidden={hidden}

      sx={{
        aspectRatio: "9 / 16", // Optional: keeps a vertical shape for empty state
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles?.[0]) {
          handleVideoFileChange({
            target: { files: droppedFiles },
          } as React.ChangeEvent<HTMLInputElement>);
        }
      }}
    >
      {videoPreviewUrl ? (
        <Box className="relative w-full h-full">
          {/* Video preview */}
          <video
            src={videoPreviewUrl}
            controls
            className="rounded w-full h-full object-contain"
            style={{
              maxHeight: "100%",
              width: "100%",
              objectFit: "contain",
            }}
          />

          <Button
            variant="text"
            size="small"
            startIcon={<DeleteOutlineOutlined sx={{ fontSize: 18 }} />}
            onClick={() => handleRemoveVideoPreview()}
            className="bg-gray-200 text-gray-800 hover:opacity-90"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 2,
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "10px",
              border: "1px solid",
              borderColor: "mountain-500",
              textTransform: "none",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            Remove video
          </Button>
        </Box>
      ) : (
        <>
          <Button
            variant="text"
            component="label"
            size="small"
            className="mb-2 border-mountain-600"
            sx={{
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "10px",
              border: "1px solid",
              textTransform: "none",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={handleVideoFileChange}
            />
            <CloudUploadIcon sx={{ mr: 1 }} />
            <Typography variant="body1" className="text-center">
              Upload your video
            </Typography>
          </Button>
          <Typography variant="body1" className="text-center">
            or drag and drop here
          </Typography>
        </>
      )}
    </Box>
  );
};