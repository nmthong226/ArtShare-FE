import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";

import { Collection, Post } from "@/types";
import {
  CollectionDisplayInfo,
  SelectedCollectionId,
  SliderItem,
  SliderItemCollection,
} from "./types/collectionTypes";
import { useCollectionsData } from "./hooks/useCollectionsData";
import { useGalleryPhotos } from "./hooks/useGalleryPhotos";
import {
  createCollection,
  removePostFromCollection,
  renameCollection,
} from "./api/mockApi";
import { CollectionSlider } from "./components/CollectionSlider";
import { CollectionTitle } from "./components/CollectionTitle";
import { CollectionGallery } from "./components/CollectionGallery";
import {
  CreateCollectionDialog,
  CreateCollectionFormData,
} from "./components/CreateCollectionDialog";
import { SearchInput } from "@/components/SearchInput";

const CollectionPage: React.FC = () => {
  const [selectedCollectionId, setSelectedCollectionId] =
    useState<SelectedCollectionId>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const {
    collections,
    allPosts,
    loading: loadingCollections,
    error: collectionsError,
    setCollections,
    setError: setCollectionsError,
  } = useCollectionsData();

  const currentCollection = useMemo<Collection | undefined>(() => {
    return typeof selectedCollectionId === "number"
      ? collections.find((c) => c.id === selectedCollectionId)
      : undefined;
  }, [collections, selectedCollectionId]);

  const filteredPosts = useMemo<Post[]>(() => {
    if (loadingCollections) return [];

    const postsToFilter =
      selectedCollectionId === "all"
        ? allPosts
        : currentCollection?.posts || [];

    return [...postsToFilter].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [allPosts, currentCollection, selectedCollectionId, loadingCollections]);

  const {
    galleryPhotos,
    isProcessing: isProcessingPhotos,
    processingError: photosError,
  } = useGalleryPhotos(filteredPosts);

  const collectionsForDisplay = useMemo<CollectionDisplayInfo[]>(() => {
    if (loadingCollections) return [];
    return collections.map((collection) => {
      const sortedPosts = [...(collection.posts || [])].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      const newestPostInCollection = sortedPosts[0];
      const thumbnailUrl =
        newestPostInCollection?.thumbnail_url ||
        newestPostInCollection?.medias?.[0]?.url;
      return { ...collection, thumbnailUrl, posts: collection.posts || [] };
    });
  }, [collections, loadingCollections]);

  const newestOverallThumbnailUrl = useMemo(() => {
    const newestPost = allPosts[0];
    return newestPost?.thumbnail_url || newestPost?.medias?.[0]?.url;
  }, [allPosts]);

  const combinedSliderData = useMemo<SliderItem[]>(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const items: SliderItem[] = [];
    items.push({ type: "add" });

    const allPostsTitle = "all posts";
    if (!normalizedQuery || allPostsTitle.includes(normalizedQuery)) {
      items.push({
        type: "all",
        thumbnailUrl: newestOverallThumbnailUrl,
        count: allPosts.length,
      });
    }

    const filteredCollectionItems: SliderItemCollection[] =
      collectionsForDisplay
        .filter(
          (collection) =>
            !normalizedQuery ||
            collection.name.toLowerCase().includes(normalizedQuery),
        )
        .map((collection) => ({
          type: "collection",
          id: collection.id,
          name: collection.name,
          thumbnailUrl: collection.thumbnailUrl,
          count: collection.posts?.length ?? 0,
        }));

    items.push(...filteredCollectionItems);
    return items;
  }, [
    collectionsForDisplay,
    newestOverallThumbnailUrl,
    allPosts.length,
    searchQuery,
  ]);

  const handleCollectionSelect = useCallback(
    (id: SelectedCollectionId) => {
      setSelectedCollectionId(id);
      setActionError(null);
      setCollectionsError(null);
    },
    [setCollectionsError],
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleAddCollectionClick = useCallback(() => {
    setIsCreateDialogOpen(true);
    setActionError(null);
  }, []);

  const handleCloseCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(false);
  }, []);

  const handleCreateCollection = useCallback(
    async (data: CreateCollectionFormData) => {
      setActionError(null);

      try {
        const newCollection: Collection = await createCollection(data);

        setCollections((prevCollections) => [
          ...prevCollections,
          newCollection,
        ]);

        setSelectedCollectionId(newCollection.id);

        handleCloseCreateDialog();
      } catch (err) {
        console.error("Error creating collection:", err);
        const errorMsg =
          err instanceof Error ? err.message : "Failed to create collection.";
        setActionError(errorMsg);
      }
    },
    [setCollections, handleCloseCreateDialog],
  );

  const handleSaveTitle = useCallback(
    async (newName: string) => {
      if (!currentCollection) return;

      setActionError(null);
      try {
        await renameCollection(currentCollection.id, newName);

        setCollections((prevCollections) =>
          prevCollections.map((col) =>
            col.id === currentCollection.id ? { ...col, name: newName } : col,
          ),
        );
      } catch (err) {
        console.error("Error renaming collection:", err);
        const errorMsg =
          err instanceof Error ? err.message : "Failed to rename collection.";
        setActionError(errorMsg);

        throw err;
      }
    },
    [currentCollection, setCollections],
  );

  const handleRemovePost = useCallback(
    async (postId: number) => {
      if (typeof selectedCollectionId !== "number") return;

      setActionError(null);
      const originalCollections = collections;

      setCollections((prevCollections) =>
        prevCollections.map((col) => {
          if (col.id === selectedCollectionId) {
            return {
              ...col,
              posts: (col.posts || []).filter((p) => p.id !== postId),
            };
          }
          return col;
        }),
      );

      try {
        await removePostFromCollection(selectedCollectionId, postId);
      } catch (err) {
        console.error(`Error removing post ${postId}:`, err);
        const errorMsg =
          err instanceof Error ? err.message : "Failed to remove post.";
        setActionError(errorMsg);
        setCollections(originalCollections);
        alert(`Error removing post: ${errorMsg}`);
      }
    },
    [selectedCollectionId, collections, setCollections],
  );

  const galleryTitle = useMemo(() => {
    if (
      loadingCollections &&
      selectedCollectionId !== "all" &&
      !currentCollection
    )
      return "Loading...";
    if (selectedCollectionId === "all") return "All Posts";
    return currentCollection?.name || "Selected Collection";
  }, [selectedCollectionId, currentCollection, loadingCollections]);

  const galleryItemCountText = useMemo(() => {
    if (loadingCollections) return "Loading...";
    if (isProcessingPhotos) return "Processing...";
    return `${galleryPhotos.length} items`;
  }, [loadingCollections, isProcessingPhotos, galleryPhotos.length]);

  const isGalleryLoading = loadingCollections || isProcessingPhotos;
  const displayError = collectionsError || photosError || actionError;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        mb={4}
      >
        <Typography variant="h5" component="h1" fontWeight="medium">
          My Collections
        </Typography>
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          placeholder="Search collections..."
        />
      </Stack>

      {/* Slider */}
      <Box mb={6}>
        <CollectionSlider
          items={combinedSliderData}
          selectedId={selectedCollectionId}
          loading={loadingCollections}
          onSelect={handleCollectionSelect}
          onAdd={handleAddCollectionClick}
        />
      </Box>

      {/* Title Section */}
      <Box mb={4}>
        <CollectionTitle
          title={galleryTitle}
          itemCountText={galleryItemCountText}
          isEditable={typeof selectedCollectionId === "number"}
          isLoading={
            loadingCollections &&
            !currentCollection &&
            selectedCollectionId !== "all"
          }
          onSave={handleSaveTitle}
          error={actionError}
        />
        {/* Display data loading or photo processing errors below the title component */}
        {(collectionsError || photosError) && !actionError && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            Error: {collectionsError || photosError}
          </Typography>
        )}
      </Box>

      {/* Gallery */}
      <CollectionGallery
        photos={galleryPhotos}
        isLoading={isGalleryLoading}
        isError={!!displayError && !isGalleryLoading}
        error={displayError && !isGalleryLoading ? displayError : null}
        onRemovePost={handleRemovePost}
        selectedCollectionId={selectedCollectionId}
      />

      {/* Fallback loading indicator if gallery is empty during load */}
      {isGalleryLoading && galleryPhotos.length === 0 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: 200 }}
        >
          <CircularProgress />
        </Box>
      )}
      <CreateCollectionDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onCreate={handleCreateCollection}
      />
    </Container>
  );
};

export default CollectionPage;
