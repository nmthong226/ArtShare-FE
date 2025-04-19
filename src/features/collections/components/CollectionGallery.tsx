import React from "react";

import IGallery, { GalleryPhoto } from "@/components/gallery/Gallery";

import {
  CollectionImageRenderer,
  CollectionImageRendererOptions,
} from "./CollectionImageRenderer";

import { RenderPhotoContext } from "react-photo-album";
import { SelectedCollectionId } from "../types/collectionTypes";

interface CollectionGalleryProps {
  photos: GalleryPhoto[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;

  onRemovePost: (postId: number) => void;
  selectedCollectionId: SelectedCollectionId;
}

export const CollectionGallery: React.FC<CollectionGalleryProps> = ({
  photos,
  isLoading,
  isError,
  error,

  onRemovePost,
  selectedCollectionId,
}) => {
  const showLoadingIndicator = isLoading && photos.length === 0;

  const renderPhotoCallback = React.useCallback(
    (_: unknown, context: RenderPhotoContext<GalleryPhoto>) => {
      const options: CollectionImageRendererOptions = {
        onRemovePost,
        selectedCollectionId,
      };

      return CollectionImageRenderer(context, options);
    },
    [onRemovePost, selectedCollectionId],
  );

  return (
    <IGallery
      photos={photos}
      isLoading={showLoadingIndicator}
      isFetchingNextPage={false}
      isError={isError}
      error={error ? new Error(error) : null}
      renderPhoto={renderPhotoCallback}
    />
  );
};
