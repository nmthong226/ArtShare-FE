import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { RowsPhotoAlbum } from "react-photo-album";
import { useSearchUsers } from "../../hooks/useSearchUsers";
import { UserPhoto } from "../../types";
import { transformUserToPhoto } from "../../utils/transformUserToPhoto";
import { UserPhotoRenderer } from "./UserPhotoRenderer";
import Loading from "@/components/loading/Loading";
import { useInView } from "react-intersection-observer";

interface UserSearchResultsProps {
  searchQuery: string | null;
}

const UserSearchResults = ({ searchQuery }: UserSearchResultsProps) => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
  } = useSearchUsers({
    searchQuery: searchQuery ?? "",
    enabled: !!searchQuery,
  });

  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  useEffect(() => {
    if (!data) return;

    const processNewUsers = async () => {
      const lastPage = data.pages[data.pages.length - 1];
      if (!lastPage || !lastPage.data) return;
      const photoPromises = lastPage.data.map(transformUserToPhoto);
      const newPhotos = await Promise.all(photoPromises);
      const validNewPhotos = newPhotos.filter(
        (p): p is UserPhoto => p !== null,
      );

      console.log("Fetched new photos:", validNewPhotos);
      setPhotos((prevPhotos) => [...prevPhotos, ...validNewPhotos]);
    };

    const totalUsersFetched = data.pages.flatMap((page) => page.data).length;

    if (totalUsersFetched > photos.length) {
      processNewUsers();
    }
  }, [data, photos.length]);

  useEffect(() => {
    setPhotos([]);
  }, [searchQuery]);

  const { ref, inView } = useInView({
    threshold: 0, // Trigger as soon as 1px of the element is visible
    rootMargin: "200px", // Start fetching 200px *before* the user reaches the end
    // Tell the hook to completely ignore intersection events while we are fetching.
    // This is the key to breaking the rapid-fire loop.
    skip: isFetchingNextPage,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <Box className="flex flex-col px-2 h-screen pb-48">
      {isLoading && photos.length === 0 && <Loading />}

      <Box className="flex-1 overflow-y-auto gallery-area sidebar pb-20">
        <RowsPhotoAlbum
          photos={photos}
          spacing={8}
          targetRowHeight={250}
          rowConstraints={{ singleRowMaxHeight: 256 }}
          render={{ image: UserPhotoRenderer }}
        />
        {/* Inline loading state for fetching the next page */}
        {isFetchingNextPage && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              my: 4,
              gap: 2,
            }}
          >
            <CircularProgress size={24} />
            <Typography>Loading more...</Typography>
          </Box>
        )}
        {/* Error state for fetching *more* pages */}
        {isError && !isFetchingNextPage && photos.length > 0 && (
          <>
            {console.error("Error fetching more users:", error)}
            <Alert severity="warning" sx={{ my: 2 }}>
              Could not load more users at this time.
            </Alert>
          </>
        )}

        {!isLoading && !hasNextPage && photos.length > 0 && (
          <Box sx={{ my: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              You have reached the end of the results.
            </Typography>
          </Box>
        )}

        {hasNextPage && <div ref={ref} style={{ height: "1px" }} />}
      </Box>
    </Box>
  );
};

export default UserSearchResults;
