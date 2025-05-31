import { Button, Typography } from "@mui/material";
import React, { ChangeEvent } from "react";
import { RiImageCircleAiFill } from "react-icons/ri";
import { MediaPreviewContainer } from "./media-preview-container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { IoSparkles } from "react-icons/io5";
import BrowsePromptHistory from "./BrowsePromptHistory";

interface PostAiImagesProps {
  handleImageFilesChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const PostAiImages: React.FC<PostAiImagesProps> = () => {
  return (
    <MediaPreviewContainer>
      <Dialog>
        <DialogTrigger>
          <Button
            variant="text"
            component="label"
            size="small"
            className="flex flex-col justify-center items-center bg-white hover:bg-mountain-50 shadow-md p-4 border-1 border-mountain-200 w-40"
            sx={{
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "10px",
              textTransform: "none",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            <RiImageCircleAiFill className="mb-2 size-10 text-mountain-600" />
            <Typography variant="body1" className="text-sm">
              Browse My Stock
            </Typography>
          </Button>
        </DialogTrigger>
        <DialogContent
          hideCloseButton
          className="p-0 min-w-[90%] h-[95%] flex flex-col gap-0"
        >
          <DialogTitle hidden />
          <DialogDescription hidden />

          <div className="flex justify-between items-center shadow-md p-4 w-full h-24">
            <div className="flex flex-col">
              <p className="flex font-medium text-lg">
                Post With Your AI Images
              </p>
              <p className="flex text-mountain-600 text-sm">
                Browse your ai images and start sharing over the world
              </p>
            </div>
            <Link
              to="/image/tool/text-to-image"
              className="flex items-center bg-gradient-to-r from-blue-100 to-purple-100 shadow hover:brightness-105 px-4 py-2 rounded-full hover:scale-105 duration-300 ease-in-out hover:cursor-pointer transform"
            >
              <IoSparkles className="mr-2 text-amber-300" />
              <p>Generated with ArtNova</p>
            </Link>
          </div>

          <BrowsePromptHistory />
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </MediaPreviewContainer>
  );
};
export default PostAiImages;
