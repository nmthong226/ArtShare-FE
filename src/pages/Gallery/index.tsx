import React, { useContext, useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Ellipsis, LoaderPinwheel } from "lucide-react";
import { BsFilter } from "react-icons/bs";

import { Categories, DataPopper } from "@/components/categories/Categories";
import { SearchContext } from "@/layouts/public/InAppLayout";
import { categoriesData, propsData } from "@/components/categories/mocks";
import { Post } from "@/types";
import IGallery, { GalleryPhoto } from "@/components/gallery/Gallery";
import { fetchPosts } from "@/components/gallery/api/post";

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

const Gallery: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [openCP, setOpenCP] = useState(false);
  const [openPP, setOpenPP] = useState(false);
  const [anchorElCP, setAnchorElCP] = useState<null | HTMLElement>(null);
  const [anchorElPP, setAnchorElPP] = useState<null | HTMLElement>(null);
  const { query } = useContext(SearchContext);
  const [tab, setTab] = useState<string>("for-you");
  const galleryAreaRef = useRef<HTMLDivElement>(null);

  const {
    data,
    error,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", tab, query, selectedCategories],
    retry: 2,
    queryFn: async ({ pageParam = 1 }): Promise<GalleryPhoto[]> => {
      const posts: Post[] = await fetchPosts(
        pageParam,
        tab,
        query,
        selectedCategories,
      );
      console.log("Fetched posts:", posts);

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
              author: post.user?.full_name || "Unknown Author",
              src: imageUrl,
              width: mediaDimensions.width,
              height: mediaDimensions.height,
              postLength: post.medias?.length ?? 0,
              postId: post.id,
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

      return resolvedPhotos.filter((photo) => photo !== null) as GalleryPhoto[];
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });

  const handleCategoriesChange = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName],
    );
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
    if (newTab) {
      setTab(newTab);
    }
  };

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
        console.log("Fetching next page...");
        fetchNextPage();
      }
    };

    const checkInitialContentHeight = () => {
      if (
        galleryElement.scrollHeight <= galleryElement.clientHeight &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isLoading
      ) {
        console.log("Initial content too short, fetching next page...");
        fetchNextPage();
      }
    };

    galleryElement.addEventListener("scroll", handleScroll);

    const timeoutId = setTimeout(checkInitialContentHeight, 500);

    return () => {
      galleryElement.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, data, isLoading]);

  const galleryPhotos: GalleryPhoto[] =
    data?.pages?.flat().filter(Boolean) ?? [];
  console.log("Processed galleryPhotos:", galleryPhotos);

  return (
    <div className="flex flex-col h-full">
      <div className="top-16 z-50 sticky flex flex-col gap-4 bg-gradient-to-t dark:bg-gradient-to-t from-white dark:from-mountain-1000 to-mountain-50 dark:to-mountain-950 p-4">
        <div className="flex items-center gap-6 w-full categories-bar">
          <Button
            className="flex flex-shrink-0 gap-2 dark:bg-mountain-900 shadow-none p-2 rounded-lg min-w-auto aspect-[1/1] font-normal  dark:text-mountain-50 normal-case all-channels-btn"
            variant="contained"
            disableElevation
            onClick={handleToggleCP}
          >
            <Ellipsis />
          </Button>
          <DataPopper
            open={openCP}
            anchorEl={anchorElCP}
            onClose={() => setOpenCP(false)}
            onSave={(categories) => setSelectedCategories(categories)}
            selectedData={selectedCategories}
            data={categoriesData}
            placement="bottom-end"
            renderItem="category"
          />

          <Button
            className={`all-channels-btn flex gap-2 flex-shrink-0 rounded-lg p-2 ${
              selectedCategories.length === 0
                ? "bg-mountain-200 dark:bg-mountain-800"
                : "dark:bg-mountain-900"
            } text-gray-800 dark:text-mountain-200 normal-case font-normal shadow-none`}
            variant={selectedCategories.length === 0 ? "contained" : "outlined"}
            onClick={() => setSelectedCategories([])}
            disableElevation={selectedCategories.length === 0}
          >
            <div
              className={`p-2 rounded aspect-[1/1] ${
                selectedCategories.length === 0
                  ? "bg-primary-500 text-white"
                  : "bg-mountain-100 dark:bg-mountain-700"
              }`}
            >
              <LoaderPinwheel size={16} />
            </div>
            <span className="flex-shrink-0">All Channels</span>
          </Button>

          <div className="overflow-x-auto flex-grow scrollbar-hide">
            <Categories
              onSelectCategory={handleCategoriesChange}
              selectedCategories={selectedCategories}
            />
          </div>

          <Button
            className="flex-shrink-0 p-2 rounded-lg min-w-auto aspect-[1/1] spread-btn dark:bg-mountain-900  dark:text-mountain-50"
            variant="contained"
            disableElevation
            onClick={handleTogglePP}
          >
            <BsFilter size={24} />
          </Button>
          <DataPopper
            open={openPP}
            onClose={() => setOpenPP(false)}
            onSave={(props) => console.log("Props saved:", props)}
            anchorEl={anchorElPP}
            data={propsData}
            selectedData={[]}
            placement="left-end"
            renderItem="prop"
          />
        </div>
      </div>
      <div
        ref={galleryAreaRef}
        className="p-4 gallery-area flex-grow overflow-y-auto"
      >
        <IGallery
          photos={galleryPhotos}
          isLoading={isLoading && !data}
          isFetchingNextPage={isFetchingNextPage}
          isError={isError}
          error={error as Error | null}
        />
      </div>
      <Paper className="bottom-4 left-1/2 z-50 fixed bg-white dark:bg-mountain-800 shadow-lg rounded-full -translate-x-1/2 transform">
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
            className="-m-0.5 px-4 py-2 border-0 rounded-full normal-case dark:text-mountain-100 data-[selected]:dark:bg-primary-700 data-[selected]:dark:text-white"
            value="for-you"
          >
            For you
          </ToggleButton>
          <ToggleButton
            color="primary"
            className="-m-0.5 px-4 py-2 border-0 rounded-full normal-case dark:text-mountain-100 data-[selected]:dark:bg-primary-700 data-[selected]:dark:text-white"
            value="following"
          >
            Following
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>
    </div>
  );
};

export default Gallery;
