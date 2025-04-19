import React from "react";

import { Photo, RowsPhotoAlbum, RenderPhotoContext } from "react-photo-album";
import "react-photo-album/rows.css";

import { ImageRenderer } from "./ImageRenderer";
import LoadingSpinner from "@/components/LoadingSpinner";

export interface GalleryPhoto extends Photo {
  key: string;
  title: string;
  author: string;
  postLength: number;
  postId: number;
}

interface IGalleryProps {
  photos: GalleryPhoto[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isError: boolean;
  error: Error | null;

  /**
   * Optional custom rendering function for each photo.
   * If not provided, defaults to the basic ImageRenderer.
   * The function receives RenderPhotoProps<GalleryPhoto> from react-photo-album.
   */
  renderPhoto?: (
    _: unknown,
    context: RenderPhotoContext<GalleryPhoto>,
  ) => React.ReactNode;
}

const IGallery: React.FC<IGalleryProps> = ({
  photos,
  isLoading,
  isFetchingNextPage,
  isError,
  error,

  renderPhoto,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError && !isLoading && photos.length === 0) {
    return (
      <div className="p-4 text-red-500 text-center">
        Error loading posts: {error?.message || "Unknown error"}
      </div>
    );
  }

  if (!isLoading && photos.length === 0 && !isFetchingNextPage) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No posts found matching your criteria.
      </div>
    );
  }

  const effectiveRenderPhoto = renderPhoto ? renderPhoto : ImageRenderer;

  return (
    <div className="relative pb-20">
      {/* Padding at the bottom for the spinner */}
      <RowsPhotoAlbum
        spacing={8}
        targetRowHeight={256}
        rowConstraints={{ singleRowMaxHeight: 256 }}
        photos={photos}
        render={{ image: effectiveRenderPhoto }}
      />
      {/* --- Loading More Spinner --- */}
      {isFetchingNextPage && (
        <div className="my-4 text-center">
          <LoadingSpinner />
        </div>
      )}
      {/* --- Error fetching more state (shown below existing photos) --- */}
      {isError && !isLoading && photos.length > 0 && (
        <div className="text-red-500 text-center py-4">
          Error fetching more posts: {error?.message || "Unknown error"}
        </div>
      )}
    </div>
  );
};

export default IGallery;
