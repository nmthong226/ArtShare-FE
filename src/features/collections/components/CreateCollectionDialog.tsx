import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import { X } from "lucide-react";
import { Paper } from "@mui/material";

export interface CreateCollectionFormData {
  name: string;
  isPrivate: boolean;
}

export interface CreateCollectionDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateCollectionFormData) => void;
}

export const CreateCollectionDialog = ({
  open,
  onClose,
  onCreate,
}: CreateCollectionDialogProps) => {
  const [collectionName, setCollectionName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (open) {
      setCollectionName("");
      setIsPrivate(false);
    }
  }, [open]);

  const handleInternalClose = () => {
    onClose();
  };

  const handleCreateClick = () => {
    const trimmedName = collectionName.trim();
    if (!trimmedName) {
      console.warn("Collection name cannot be empty.");

      return;
    }

    const formData: CreateCollectionFormData = {
      name: trimmedName,
      isPrivate: isPrivate,
    };
    onCreate(formData);
    handleInternalClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleInternalClose}
      aria-labelledby="create-collection-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        id="create-collection-dialog-title"
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Create New Collection</span>
        <IconButton
          aria-label="close"
          onClick={handleInternalClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
        <Paper
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{
            p: "2px 4px",
            mb: 2,
            display: "flex",
            alignItems: "center",
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "grey.400",
            boxShadow: "none",
            bgcolor: "background.paper",
            height: 40,
          }}
        >
          <Input
            placeholder="Collection name"
            fullWidth
            sx={{ ml: 2 }}
            disableUnderline
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            autoFocus
            required
          />
        </Paper>
        <FormControlLabel
          control={
            <Checkbox
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              color="primary"
              size="small"
            />
          }
          label="Make this collection private"
          sx={{ display: "block" }}
        />
      </DialogContent>
      <DialogActions sx={{ p: { xs: 2, sm: 3 }, pt: 2 }}>
        <Button variant="text" onClick={handleInternalClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCreateClick}
          disabled={!collectionName.trim()}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
