import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  CardActionArea,
  Paper,
} from "@mui/material";
import { FiPlus as AddIcon } from "react-icons/fi";
import { HorizontalSlider } from "@/components/HorizontalSlider";
import { SelectedCollectionId, SliderItem } from "../types/collectionTypes";

const CARD_MIN_WIDTH = 256;

interface CollectionSliderProps {
  items: SliderItem[];
  selectedId: SelectedCollectionId;
  loading: boolean;
  onSelect: (id: SelectedCollectionId) => void;
  onAdd: () => void;
}

const getSliderItemId = (item: SliderItem): string => {
  switch (item.type) {
    case "all":
      return "all-posts";
    case "collection":
      return `collection-${item.id}`;
    case "add":
      return "add-collection";
    default:
      return `unknown-${Math.random()}`;
  }
};

const renderSliderItem = (
  item: SliderItem,
  selectedId: SelectedCollectionId,
  loadingCollections: boolean,
  onSelect: (id: SelectedCollectionId) => void,
  onAdd: () => void,
) => {
  const baseCardSx = {
    width: CARD_MIN_WIDTH,
    minWidth: CARD_MIN_WIDTH,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    transition: "box-shadow 0.3s, border-color 0.3s",
    overflow: "hidden",
    height: "100%",
    "&:hover": { boxShadow: 3 },
  };

  switch (item.type) {
    case "all":
    case "collection": {
      const isSelected =
        (item.type === "all" && selectedId === "all") ||
        (item.type === "collection" && selectedId === item.id);
      const title = item.type === "all" ? "All Posts" : item.name;
      const itemId = item.type === "all" ? "all" : item.id;
      const thumbnailUrl = item.thumbnailUrl;

      return (
        <Card
          key={getSliderItemId(item)}
          variant="outlined"
          sx={{
            ...baseCardSx,
            borderColor: isSelected ? "primary.main" : "grey.300",
            borderWidth: isSelected ? 2 : 1,
          }}
        >
          <CardActionArea
            onClick={() => onSelect(itemId)}
            disabled={loadingCollections}
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              p: 1.5,
              height: "100%",
            }}
          >
            {thumbnailUrl ? (
              <CardMedia
                component="img"
                image={thumbnailUrl}
                alt={title}
                sx={{
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  width: "100%",
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              />
            ) : (
              <Box
                sx={{
                  aspectRatio: "16 / 9",
                  width: "100%",
                  borderRadius: 1,
                  flexShrink: 0,
                  bgcolor: "grey.200",
                }}
              ></Box>
            )}
            <CardContent sx={{ flexGrow: 1, width: "100%", p: 0, pt: 1.5 }}>
              <Typography
                gutterBottom
                variant="subtitle2"
                component="div"
                noWrap
                fontWeight="medium"
              >
                {title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {loadingCollections ? "..." : `${item.count} items`}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      );
    }
    case "add": {
      return (
        <Paper
          key={getSliderItemId(item)}
          variant="outlined"
          onClick={onAdd}
          sx={{
            ...baseCardSx,
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            borderColor: "grey.400",
            borderStyle: "dashed",
            color: "grey.600",
            cursor: "pointer",
            "&:hover": {
              borderColor: "primary.main",
              color: "primary.main",
              bgcolor: "action.hover",
            },
          }}
        >
          <AddIcon fontSize={28} />
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ lineHeight: 1.3, mt: 1 }}
          >
            Add new collection
          </Typography>
        </Paper>
      );
    }
    default:
      return null;
  }
};

export const CollectionSlider: React.FC<CollectionSliderProps> = ({
  items,
  selectedId,
  loading,
  onSelect,
  onAdd,
}) => {
  if (loading && items.length === 0) {
    return (
      <Box display="flex" gap={2} py={1} overflow="hidden">
        {[...Array(5)].map((_, index) => (
          <Paper
            key={`placeholder-${index}`}
            variant="outlined"
            sx={{
              minWidth: CARD_MIN_WIDTH,
              height: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
              borderColor: "grey.300",
              borderStyle: "dashed",
              color: "grey.500",
              flexShrink: 0,
            }}
          >
            <CircularProgress size={24} color="inherit" />
          </Paper>
        ))}
      </Box>
    );
  }

  return (
    <HorizontalSlider
      data={items}
      renderItem={(item) =>
        renderSliderItem(item, selectedId, loading, onSelect, onAdd)
      }
      getItemId={getSliderItemId}
      wrapperClassName="collection-slider"
    />
  );
};
