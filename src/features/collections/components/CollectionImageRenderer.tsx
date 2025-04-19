import React, { useState } from "react";

import { RenderPhotoContext } from "react-photo-album";
import { Link } from "react-router-dom";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { FiX as DeleteIcon } from "react-icons/fi";
import { Images } from "lucide-react";

import { AiOutlineLike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { HiOutlineEye } from "react-icons/hi";
import { GalleryPhoto } from "@/components/gallery/Gallery";
import { SelectedCollectionId } from "../types/collectionTypes";

export interface CollectionImageRendererOptions {
  onRemovePost: (postId: number) => void;
  selectedCollectionId: SelectedCollectionId;
}

export const CollectionImageRenderer = (
  context: RenderPhotoContext<GalleryPhoto>,
  options: CollectionImageRendererOptions,
) => {
  const { photo, width, height } = context;
  const { onRemovePost, selectedCollectionId } = options;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const canDelete = typeof selectedCollectionId === "number";

  const handleOpenDeleteDialog = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    onRemovePost(photo.postId);
    handleCloseDeleteDialog();
  };

  return (
    <div
      className="group relative cursor-pointer border border-transparent hover:border-gray-300 rounded-lg"
      style={{
        height: height,
        width: width,
      }}
    >
      {/* --- Delete Button --- */}
      {canDelete && (
        <Tooltip title="Remove from collection">
          <IconButton
            aria-label="Remove from collection"
            size="small"
            onClick={handleOpenDeleteDialog}
            sx={{
              position: "absolute",
              top: -8,
              right: -8,
              zIndex: 10,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              opacity: 0,
              transition: "opacity 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(200, 0, 0, 0.8)",
                opacity: 1,
              },
              ".group:hover &": {
                opacity: 1,
              },
            }}
          >
            <DeleteIcon fontSize={20} />
          </IconButton>
        </Tooltip>
      )}
      {/* --- End Delete Button --- */}

      {/* --- Original Link and Image Structure (no changes needed here) --- */}
      <Link to={`/posts/${photo.postId}`} className="block w-full h-full">
        {/* ... rest of the image and overlay structure ... */}
        <img
          key={photo.key || photo.src}
          src={photo.src}
          loading="lazy"
          className="rounded-lg w-full h-full object-cover"
          style={{ display: "block" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end items-start bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-0 group-hover:opacity-100 p-4 rounded-lg text-white transition-opacity duration-300 pointer-events-none">
          {/* pointer-events-none on overlay */}
          {/* Multiple Images Icon */}
          {photo.postLength > 1 && (
            <div className="top-2 left-2 absolute flex justify-center items-center bg-black/40 p-1 rounded-full pointer-events-auto">
              {/* pointer-events-auto here */}
              <Images size={14} />
            </div>
          )}
          {/* Text and Stats */}
          <div className="flex justify-between items-end w-full">
            <div>
              <span className="font-semibold text-md line-clamp-1">
                {photo.title}
              </span>
              <span className="text-xs line-clamp-1">{photo.author}</span>
            </div>
            {/* Stats section */}
            <div className="flex flex-col items-end space-y-1 pointer-events-auto">
              <div className="flex items-center space-x-1">
                <p className="font-semibold text-sm">9</p> {/* TODO: Data */}
                <AiOutlineLike className="size-4" />
              </div>
              <div className="flex items-center space-x-1">
                <p className="font-semibold text-sm">23</p> {/* TODO: Data */}
                <BiCommentDetail className="size-4 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                <p className="font-semibold text-sm">1k</p> {/* TODO: Data */}
                <HiOutlineEye className="size-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
      {/* --- End Original Link and Image Structure --- */}

      {/* --- Confirmation Dialog --- */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <DialogTitle id="alert-dialog-title">Confirm Removal</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove the post "
            {photo.title || "this post"}" from the collection?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleCloseDeleteDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
      {/* --- End Confirmation Dialog --- */}
    </div>
  );
};
