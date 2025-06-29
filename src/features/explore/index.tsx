import {
  Categories,
  DataPopper,
} from "@/components/carousels/categories/Categories";
import IGallery, { GalleryPhoto } from "@/components/gallery/Gallery";
import { CategoryTypeValues } from "@/constants";
import { useCategories } from "@/hooks/useCategories";
import { Category, Post } from "@/types";
import { Button, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useInfiniteQuery, UseQueryResult } from "@tanstack/react-query";
import { Ellipsis, LoaderPinwheel } from "lucide-react";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { BsFilter } from "react-icons/bs";
import { fetchPosts } from "./api/get-post";

const getMediaDimensions = (
  url: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ width: 500, height: 500 });
      return;
    }
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = (err) => {
      console.error("Error loading image for dimensions:", url, err);
      resolve({ width: 500, height: 500 });
    };
    img.src = url;
  });
};

const Explore: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string | null>(
    null,
  );
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);

  const [openCP, setOpenCP] = useState(false);
  const [openPP, setOpenPP] = useState(false);
  const [anchorElCP, setAnchorElCP] = useState<null | HTMLElement>(null);
  const [anchorElPP, setAnchorElPP] = useState<null | HTMLElement>(null);
  const [tab, setTab] = useState<string>("for-you");
  const galleryAreaRef = useRef<HTMLDivElement>(null);

  const {
    data: allCategories,
    isLoading: isLoadingAllCategories,
    isError: isErrorAllCategories,
  }: UseQueryResult<Category[]> = useCategories({ page: 1, pageSize: 200 });

  const attributeCategories = useMemo(() => {
    if (!allCategories) return [];
    return allCategories.filter(
      (cat) => cat.type === CategoryTypeValues.ATTRIBUTE,
    );
  }, [allCategories]);

  const mediumCategories = useMemo(() => {
    if (!allCategories) return [];
    return allCategories.filter(
      (cat) => cat.type === CategoryTypeValues.MEDIUM,
    );
  }, [allCategories]);

  const {
    data: postsData,
    error: postsError,
    isError: isPostsError,
    isLoading: isLoadingPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", tab, selectedCategories, selectedMediums],
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async ({ pageParam = 1 }): Promise<GalleryPhoto[]> => {
      const categoriesToFetch: string[] = [];
      if (selectedCategories) {
        categoriesToFetch.push(selectedCategories);
      }

      const posts: Post[] = await fetchPosts(pageParam, tab, undefined, [
        ...categoriesToFetch,
        ...selectedMediums,
      ]);
      const galleryPhotosPromises = posts
        .filter(
          (post) =>
            post.thumbnail_url || (post.medias && post.medias.length > 0),
        )
        .map(async (post): Promise<GalleryPhoto | null> => {
          try {
            const imageUrl = post.thumbnail_url || post.medias[0]?.url;
            if (!imageUrl) return null;
            const mediaDimensions = await getMediaDimensions(imageUrl);
            return {
              key: post.id.toString(),
              title: post.title || "",
              author: post.user?.username || "Unknown Author",
              src: imageUrl,
              width: mediaDimensions.width,
              height: mediaDimensions.height,
              postLength: post.medias?.length ?? 0,
              postId: post.id,
              is_mature: post.is_mature,
              ai_created: post.ai_created,
              like_count: post.like_count,
              comment_count: post.comment_count,
              view_count: post.view_count,
            };
          } catch (dimensionError) {
            console.error(
              `Error getting dimensions for post ${post.id}:`,
              dimensionError,
            );
            return null;
          }
        });
      const resolvedPhotos = await Promise.all(galleryPhotosPromises);
      return resolvedPhotos.filter(
        (photo): photo is GalleryPhoto => photo !== null,
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });

  const handleCategoriesChange = (categoryName: string | null) => {
    setSelectedCategories(categoryName);
  };

  const handleToggleCP = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElCP(event.currentTarget);
    setOpenCP((prevOpen) => !prevOpen);
  };

  const handleTogglePP = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElPP(event.currentTarget);
    setOpenPP((prevOpen) => !prevOpen);
  };

  const handleTabChange = (
    _: React.MouseEvent<HTMLElement>,
    newTab: string | null,
  ) => {
    if (newTab) setTab(newTab);
  };

  const handleAllChannelsClick = () => {
    setSelectedCategories(null);

    if (openCP) setOpenCP(false);
  };

  useEffect(() => {
    const galleryElement = galleryAreaRef.current;
    if (!galleryElement) return;

    const handleScroll = () => {
      if (
        galleryElement.scrollTop + galleryElement.clientHeight >=
          galleryElement.scrollHeight - 200 &&
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

  const isAllChannelsSelected = selectedCategories === null;

  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      <div className="sticky z-10 flex flex-col gap-4 px-4 py-1 pt-3 bg-gradient-to-t dark:bg-gradient-to-t from-white dark:from-mountain-1000 to-mountain-50 dark:to-mountain-950 rounded-t-3xl">
        <div className="flex items-center w-full gap-6 overflow-x-hidden categories-bar">
          <Button
            className="flex flex-shrink-0 gap-2 dark:bg-mountain-900 shadow-none p-2 rounded-lg min-w-auto aspect-[1/1] font-normal dark:text-mountain-50 normal-case all-channels-btn"
            variant="contained"
            disableElevation
            onClick={handleToggleCP}
            disabled={isLoadingAllCategories}
          >
            {isLoadingAllCategories ? (
              <LoaderPinwheel size={16} className="animate-spin" />
            ) : (
              <Ellipsis />
            )}
          </Button>
          <DataPopper
            open={openCP}
            anchorEl={anchorElCP}
            onClose={() => setOpenCP(false)}
            onSave={(category) =>
              setSelectedCategories(category as string | null)
            }
            selectedData={selectedCategories}
            data={attributeCategories}
            placement="bottom-start"
            renderItem="category"
            selectionMode="single"
          />

          <Button
            className={`all-channels-btn flex gap-2 flex-shrink-0 rounded-lg p-2 ${
              isAllChannelsSelected
                ? " dark:bg-mountain-800"
                : "dark:bg-mountain-900"
            }  dark:text-mountain-200 normal-case font-normal shadow-none`}
            variant={isAllChannelsSelected ? "contained" : "outlined"}
            onClick={handleAllChannelsClick}
            disableElevation={isAllChannelsSelected}
          >
            <div
              className={`p-2 rounded aspect-[1/1] ${
                isAllChannelsSelected
                  ? "text-indigo-400 bg-mountain-50 dark:bg-mountain-700 dark:text-primary-400"
                  : "text-mountain-900 bg-mountain-200 dark:bg-mountain-800 dark:text-mountain-300"
              } `}
            >
              <LoaderPinwheel size={16} />
            </div>
            <span className="flex-shrink-0">All Channels</span>
          </Button>
          <div className="flex-grow overflow-x-auto">
            <Categories
              onSelectCategory={handleCategoriesChange}
              selectedCategory={selectedCategories}
              data={attributeCategories}
              isLoading={isLoadingAllCategories}
              isError={isErrorAllCategories}
            />
          </div>
          <Button
            className="flex-shrink-0 dark:bg-mountain-900 p-2 rounded-lg min-w-auto aspect-[1/1] dark:text-mountain-50 spread-btn"
            variant="contained"
            disableElevation
            onClick={handleTogglePP}
            disabled={isLoadingAllCategories || mediumCategories.length === 0}
          >
            {isLoadingAllCategories ? (
              <LoaderPinwheel size={16} className="animate-spin" />
            ) : (
              <BsFilter size={24} />
            )}
          </Button>
          <DataPopper
            open={openPP}
            onClose={() => setOpenPP(false)}
            onSave={(mediums) => setSelectedMediums(mediums as string[])}
            anchorEl={anchorElPP}
            data={mediumCategories}
            selectedData={selectedMediums}
            placement="bottom-end"
            renderItem="prop"
            selectionMode="multiple"
            showClearAllButton={true}
          />
        </div>
      </div>
      <div
        ref={galleryAreaRef}
        className="flex-grow p-4 overflow-y-auto gallery-area sidebar"
      >
        <IGallery
          photos={galleryPhotos}
          isLoading={isInitialGalleryLoading}
          isFetchingNextPage={isFetchingNextPage}
          isError={isPostsError}
          error={postsError as Error | null}
        />
      </div>
      <Paper className="fixed z-50 transform -translate-x-1/2 bg-white rounded-full shadow-lg bottom-4 left-1/2 dark:bg-mountain-800">
        <ToggleButtonGroup
          className="flex gap-2 m-1.5"
          size="small"
          value={tab}
          exclusive
          onChange={handleTabChange}
          aria-label="Filter posts"
        >
          <ToggleButton
            color="primary"
            className="data-[selected]:dark:bg-primary-700 -m-0.5 px-4 py-2 border-0 rounded-full data-[selected]:dark:text-white dark:text-mountain-100 normal-case"
            value="for-you"
          >
            For you
          </ToggleButton>
          <ToggleButton
            color="primary"
            className="data-[selected]:dark:bg-primary-700 -m-0.5 px-4 py-2 border-0 rounded-full data-[selected]:dark:text-white dark:text-mountain-100 normal-case"
            value="following"
          >
            Following
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>
    </div>
  );
};

export default memo(Explore);
