import React, { useState, useCallback, useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from "@mui/material";
import { MdClose } from "react-icons/md";
import getCroppedImg from "@/utils/cropImage";
import MuiButton from "@mui/material/Button";

interface Props {
  image: string;
  open: boolean;
  onClose: () => void;
  onCropped: (croppedFile: Blob, thumbnail_crop_meta: string) => void;
  initialCrop?: { x: number; y: number };
  initialZoom?: number;
  initialAspect?: number;
  initialSelectedAspect?: string;
  initialCroppedAreaPixels?: Area;
  onCropChange?: (crop: { x: number; y: number }) => void;
  onZoomChange?: (zoom: number) => void;
}

interface AspectOption {
  label: string;
  value: number | "free";
}

const aspectOptions: AspectOption[] = [
  { label: "1:1", value: 1 },
  { label: "3:2", value: 3 / 2 },
  { label: "2:3", value: 2 / 3 },
  { label: "9:16", value: 9 / 16 },
];

export const ImageCropperModal: React.FC<Props> = ({
  image,
  open,
  onClose,
  onCropped,
  initialCrop,
  initialZoom,
  initialAspect,
  initialSelectedAspect,
  initialCroppedAreaPixels,
  onCropChange,
  onZoomChange,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [selectedAspect, setSelectedAspect] = useState("Free");
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    if (initialCroppedAreaPixels) {
      setCroppedAreaPixels(initialCroppedAreaPixels);
    }
  }, [image]);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  console.log("📥 Received props:", { initialCrop, initialZoom, image, open });

  const cropImage = async () => {
    if (croppedAreaPixels) {
      const cropped = await getCroppedImg(image, croppedAreaPixels);
      const thumbnail_crop_meta = {
        crop,
        zoom,
        aspect,
        croppedAreaPixels,
        selectedAspect,
      };
      onCropped(cropped, JSON.stringify(thumbnail_crop_meta));
      onClose();
    }
  };

  const handleAspectChange = (option: AspectOption) => {
    setAspect(option.value === "free" ? undefined : option.value);
    setSelectedAspect(option.label);
  };

  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const naturalAspect = initialAspect ?? img.width / img.height;
      setAspect(naturalAspect);
      setSelectedAspect(initialSelectedAspect ?? "Original");
    };
  }, [image]);

  // Reset crop/zoom only on file change
  useEffect(() => {
    if (!open || !image) return;

    setCrop(initialCrop ?? { x: 0, y: 0 });
    setZoom(initialZoom ?? 1);
  }, [image]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          width: "50vw",
          maxWidth: "50vw",
          margin: "auto",
        },
      }}
    >
      <DialogTitle className="flex items-center justify-between">
        <Typography variant="h6">Crop Image</Typography>
        <IconButton onClick={onClose} size="small">
          <MdClose size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        className="flex flex-col gap-4"
        sx={{
          padding: 0,
          maxHeight: "calc(100vh - 150px)",
          overflow: "auto",
        }}
      >
        <div
          className="w-full relative  overflow-hidden"
          style={{ height: 320, minHeight: 280 }}
        >
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={(newCrop) => {
              setCrop(newCrop);
              onCropChange?.(newCrop); // propagate up
            }}
            onZoomChange={(newZoom) => {
              console.log("@@new zoom in parent", newZoom);
              setZoom(newZoom);
              onZoomChange?.(newZoom); // propagate up
            }}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="text-sm px-6 pb-4 flex flex-col gap-3 dark:text-white">
          <div>
            <label className="block mb-1 font-medium">
              {" "}
              {/* Added block and margin for better label spacing */}
              Zoom: {zoom.toFixed(1)}x{" "}
              {/* Display current zoom next to label */}
            </label>
            <input
              type="range"
              min="1" // Min zoom value
              max="3" // Max zoom value
              step="0.1"
              value={zoom}
              onChange={(e) => {
                const value = Number(e.target.value);
                setZoom(value);
                onZoomChange?.(value);
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" // Added dark mode bg
            />
            {/* Simplified labels for min and max */}
            <div className="flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400">
              <span>Min (1x)</span>
              <span>Max (3x)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {aspectOptions.map((option) => (
              <Button
                key={option.label}
                variant={
                  selectedAspect === option.label ? "default" : "outline"
                }
                onClick={() => handleAspectChange(option)}
                className="cursor-pointer"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <MuiButton
          variant="outlined"
          onClick={onClose}
          className="dark:text-white"
          sx={{
            border: "none",
            color: "#000", // black text
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#f3f4f6", // subtle gray background on hover (optional)
              border: "none",
            },
          }}
        >
          Cancel
        </MuiButton>

        <MuiButton variant="contained" onClick={cropImage}>
          Crop & Save
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};
