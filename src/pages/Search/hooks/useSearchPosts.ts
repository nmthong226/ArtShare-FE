import { GalleryPhoto } from "@/components/gallery/Gallery";
import { fetchPosts } from "@/features/explore/api/get-post";
import { Post } from "@/types";
import { getMediaDimensions } from "@/utils/helpers/gallery.helper";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseSearchPostsParams {
  finalQuery?: string | null;
  selectedMediums?: string[];
  enabled?: boolean;
}

const searchAndTransformPosts = async ({
  pageParam,
  query,
  categories,
}: {
  pageParam: number;
  query?: string | null;
  categories?: string[];
}): Promise<GalleryPhoto[]> => {
  const posts: Post[] = await fetchPosts(
    pageParam,
    undefined,
    query || undefined,
    categories,
  );

  const galleryPhotosPromises = posts
    .filter((post) => post.thumbnail_url || post.medias?.length > 0)
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
          is_mature: post.is_mature || false,
          ai_created: post.ai_created || false,
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
};

export const useSearchPosts = (params: UseSearchPostsParams) => {
  const { finalQuery, selectedMediums, enabled = true } = params;

  return useInfiniteQuery({
    queryKey: ["postSearch", finalQuery, selectedMediums],

    queryFn: ({ pageParam = 1 }) =>
      searchAndTransformPosts({
        pageParam,
        query: finalQuery,
        categories: selectedMediums,
      }),

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },

    initialPageParam: 1,
    staleTime: 0,
    enabled,
  });
};
