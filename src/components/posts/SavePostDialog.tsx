import { useState, useRef, useEffect, useCallback } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  Button,
  DialogContent,
  DialogContentText,
  Box,
  IconButton,
  Typography,
  DialogActions,
} from "@mui/material";
import { CheckIcon, PlusCircleIcon, X } from "lucide-react";

import { SearchInput } from "../SearchInput";

export interface SavePostDialogProps {
  open: boolean;
  onClose: () => void;
  postId: number;
  initialCollections?: DialogCollection[];
  onNavigateToCreate: () => void;
  onCollectionUpdate?: (updatedCollections: DialogCollection[]) => void;
}

export interface DialogCollection {
  name: string;
  postIds: number[];
}

export const SavePostDialog = (props: SavePostDialogProps) => {
  const {
    onClose,
    open,
    postId,
    initialCollections,
    onNavigateToCreate,
    onCollectionUpdate,
  } = props;
  const [searchQuery, setSearchQuery] = useState("");

  const [collections, setCollections] = useState<DialogCollection[]>([]);

  useEffect(() => {
    if (open) {
      setCollections(
        initialCollections || [
          { name: "My Art Projects", postIds: [1] },
          { name: "Inspiration Board", postIds: [] },
        ],
      );

      setSearchQuery("");
    } else {
      setSearchQuery("");
    }
  }, [open, initialCollections]);

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleClose = () => {
    onClose();
  };

  const handleCreateNewCollectionClick = () => {
    onNavigateToCreate();
  };

  const handleTogglePostInCollection = (collectionName: string) => {
    console.log(`Toggling post ${postId} in collection ${collectionName}`);
    setCollections((prevCollections) => {
      const updated = prevCollections.map((col) => {
        if (col.name === collectionName) {
          const postIndex = col.postIds.indexOf(postId);
          let newPostIds: number[];
          if (postIndex > -1) {
            newPostIds = col.postIds.filter((id) => id !== postId);
          } else {
            newPostIds = [...col.postIds, postId];
          }
          return { ...col, postIds: newPostIds };
        }
        return col;
      });

      if (onCollectionUpdate) {
        onCollectionUpdate(updated);
      }
      return updated;
    });
  };

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const descriptionElementRef = useRef<HTMLDivElement>(null);

  if (!open) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        id="scroll-dialog-title"
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Add to Collection</span>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      {/* Content Area */}
      <DialogContent
        dividers={true}
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "300px",
          width: "100%",
        }}
      >
        {/* Search Input */}
        <Box sx={{ p: { xs: 2, sm: 3 }, pb: 2 }}>
          <SearchInput
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            placeholder="Search collections..."
          />
        </Box>

        {/* Collection List */}
        <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
          component="div"
          sx={{
            overflowY: "auto",
            flexGrow: 1,
            p: 0,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          {filteredCollections.length > 0 ? (
            filteredCollections.map((collection) => {
              const isAdded = collection.postIds.includes(postId);
              return (
                <Box
                  key={collection.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    px: { xs: 2, sm: 3 },
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    "&:last-child": { borderBottom: 0 },
                  }}
                >
                  {/* Thumbnail */}
                  <Box
                    component="img"
                    src="https://cdnb.artstation.com/p/channels/covers/000/000/077/20200505141007/thumb/thumb.jpg?1588705807"
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 1,
                      objectFit: "cover",
                      flexShrink: 0,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                    alt={`${collection.name} thumbnail`}
                  />
                  {/* Info */}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight="medium" noWrap>
                      {collection.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {collection.postIds.length} post
                      {collection.postIds.length !== 1 ? "s" : ""}
                    </Typography>
                  </Box>
                  {/* Action Button */}
                  <Button
                    size="small"
                    variant={isAdded ? "outlined" : "contained"}
                    startIcon={isAdded ? <CheckIcon size={16} /> : null}
                    disableRipple={isAdded}
                    onClick={() =>
                      handleTogglePostInCollection(collection.name)
                    }
                    aria-label={
                      isAdded
                        ? `Remove project from ${collection.name}`
                        : `Add project to ${collection.name}`
                    }
                    sx={{
                      flexShrink: 0,
                      textTransform: "none",
                      fontWeight: "normal",
                      minWidth: "75px",
                    }}
                  >
                    {isAdded ? "Added" : "Add"}
                  </Button>
                </Box>
              );
            })
          ) : (
            <Typography
              sx={{ textAlign: "center", color: "text.secondary", p: 4 }}
            >
              No collections found
              {searchQuery ? " matching your search" : ""}.
            </Typography>
          )}
        </DialogContentText>
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          pt: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: "space-between",
        }}
      >
        {/* Button now calls the new handler */}
        <Button
          variant="text"
          startIcon={<PlusCircleIcon size={20} />}
          onClick={handleCreateNewCollectionClick}
          sx={{ textTransform: "none", fontWeight: "normal", mr: "auto" }}
        >
          Create new collection
        </Button>
        <Button variant="contained" onClick={handleClose}>
          {" "}
          {/* Use the main close handler */}
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};
