import IGallery, { GalleryPhoto } from "@/components/gallery/Gallery";
import { memo, useEffect, useRef, useState } from "react";
import { BsFilter } from "react-icons/bs";
import MediumFilters from "../MediumFilters";
import CategoryList from "@/components/filters/Filter";
import { useSearchPosts } from "../../hooks/useSearchPosts";
import { Box } from "@mui/material";

interface PostSearchProps {
  finalQuery: string | null;
}

const PostSearch = ({ finalQuery }: PostSearchProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  const galleryAreaRef = useRef<HTMLDivElement>(null);

  const {
    data: postsData,
    error: postsError,
    isError: isPostsError,
    isLoading: isLoadingPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchPosts({
    finalQuery,
    selectedMediums,
    enabled: !!finalQuery && finalQuery.length > 0,
  });

  useEffect(() => {
    const galleryElement = galleryAreaRef.current;
    if (!galleryElement) return;

    const handleScroll = () => {
      const scrollThreshold = 200;
      const scrolledFromTop = galleryElement.scrollTop;
      const elementHeight = galleryElement.clientHeight;
      const scrollableHeight = galleryElement.scrollHeight;

      if (
        elementHeight + scrolledFromTop >= scrollableHeight - scrollThreshold &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    const checkInitialContentHeight = () => {
      if (
        galleryElement.scrollHeight <= galleryElement.clientHeight &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isLoadingPosts
      ) {
        fetchNextPage();
      }
    };
    galleryElement.addEventListener("scroll", handleScroll);
    const timeoutId = setTimeout(checkInitialContentHeight, 500);
    return () => {
      galleryElement.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    postsData,
    isLoadingPosts,
  ]);

  const galleryPhotos: GalleryPhoto[] =
    postsData?.pages?.flat().filter(Boolean) ?? [];

  let isPostsDataEffectivelyEmpty = true;
  if (postsData && postsData.pages && Array.isArray(postsData.pages)) {
    if (
      postsData.pages.length > 0 &&
      postsData.pages.some((page) => page.length > 0)
    ) {
      isPostsDataEffectivelyEmpty = false;
    }
  }
  const isInitialGalleryLoading = isLoadingPosts && isPostsDataEffectivelyEmpty;

  return (
    <Box className="flex flex-col p-2 h-screen pb-48 relative">
      <div className="absolute left-0 top-0 z-50 flex h-16 bg-white dark:bg-mountain-950 dark:border-b dark:border-mountain-800">
        {/* Left side - Filter */}
        <div className="absolute flex items-center space-x-4 transform -translate-y-1/2 top-1/2 left-4">
          <div
            className={`flex items-center space-x-2 hover:bg-mountain-50 dark:hover:bg-mountain-900 px-2 py-1 rounded-lg hover:cursor-pointer ${
              showFilters
                ? "text-mountain-950 dark:text-mountain-50 font-medium"
                : "text-mountain-600 dark:text-mountain-400 font-normal"
            }`}
            onClick={() => {
              setShowFilters((prev) => !prev);
            }}
          >
            <BsFilter size={16} />
            <p>Filter</p>
          </div>

          {showFilters && (
            <MediumFilters
              selectedMediums={selectedMediums}
              setSelectedMediums={setSelectedMediums}
            />
          )}
        </div>
        {/* Center - Tabs */}
      </div>

      {selectedMediums.length > 0 && (
        <div className="flex items-center justify-center w-full h-12">
          <p className="mr-2 text-mountain-400 dark:text-mountain-500">
            Mediums:{" "}
          </p>
          <CategoryList
            selectedCategories={selectedMediums}
            setSelectedCategories={setSelectedMediums}
          />
        </div>
      )}
      {selectedMediums.length === 0 && (
        <div className="flex items-center justify-center w-full h-12">
          <div className="text-mountain-400 dark:text-mountain-500">
            Tips: Want more specific results? Try adding a channel filter.
          </div>
        </div>
      )}
      <div
        ref={galleryAreaRef}
        className="flex-1 p-4 overflow-y-auto gallery-area sidebar"
      >
        <IGallery
          photos={galleryPhotos}
          isLoading={isInitialGalleryLoading}
          isFetchingNextPage={isFetchingNextPage}
          isError={isPostsError}
          error={postsError as Error | null}
        />
      </div>
    </Box>
  );
};

export default memo(PostSearch);
