import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
  Stack,
} from "@mui/material";
import { FiEdit as EditIcon } from "react-icons/fi";
import { FiCheck  as SaveIcon } from "react-icons/fi";
import { FiX  as CancelIcon } from "react-icons/fi";

interface CollectionTitleProps {
  title: string;
  itemCountText: string;
  isEditable: boolean;
  isLoading?: boolean;
  error?: string | null;
  onSave: (newName: string) => Promise<void>;
}

export const CollectionTitle: React.FC<CollectionTitleProps> = ({
  title,
  itemCountText,
  isEditable,
  isLoading = false,
  error,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(title);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setEditedTitle(title);
    }
  }, [title, isEditing]);

  const handleEditClick = useCallback(() => {
    if (!isLoading) {
      setEditedTitle(title);
      setIsEditing(true);
      setIsHovered(false);
      setSaveError(null);
    }
  }, [title, isLoading]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditedTitle(title);
    setIsSaving(false);
    setSaveError(null);
  }, [title]);

  const handleSave = useCallback(async () => {
    const newName = editedTitle.trim();
    if (newName === "" || newName === title) {
      handleCancel();
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(newName);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving title:", err);
      setSaveError(
        err instanceof Error ? err.message : "Failed to save title.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [editedTitle, title, onSave, handleCancel]);

  const displayError = error || saveError;

  return (
    <Box
      minHeight={48}
      onMouseEnter={() =>
        isEditable && !isEditing && !isLoading && setIsHovered(true)
      }
      onMouseLeave={() => setIsHovered(false)}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {isEditing && isEditable ? (
          <>
            <TextField
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              variant="outlined"
              size="small"
              autoFocus
              disabled={isSaving || isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              error={!!saveError}
              sx={{ flexGrow: 1, maxWidth: 400 }}
            />
            <Tooltip title="Save Changes">
              <span>
                <IconButton
                  size="small"
                  onClick={handleSave}
                  disabled={
                    isSaving ||
                    isLoading ||
                    editedTitle.trim() === "" ||
                    editedTitle.trim() === title
                  }
                >
                  {isSaving ? (
                    <CircularProgress size={20} />
                  ) : (
                    <SaveIcon fontSize={20} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Cancel Edit">
              <span>
                <IconButton
                  size="small"
                  onClick={handleCancel}
                  disabled={isSaving || isLoading}
                >
                  <CancelIcon fontSize={20} />
                </IconButton>
              </span>
            </Tooltip>
          </>
        ) : (
          <>
            <Typography variant="h5" component="h2" fontWeight="medium" noWrap>
              {isLoading ? "Loading Title..." : title}
            </Typography>
            {!isLoading && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ pl: 0.5 }}
              >
                ({itemCountText})
              </Typography>
            )}
            {isEditable && !isLoading && (
              <Tooltip title="Rename Collection">
                <IconButton
                  size="small"
                  onClick={handleEditClick}
                  sx={{
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.2s ease-in-out",
                  }}
                >
                  <EditIcon fontSize={20} />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </Stack>

      {/* Error Display Area */}
      {displayError && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          Error: {displayError}
        </Typography>
      )}
    </Box>
  );
};
