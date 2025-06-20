import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import BlogItem from "@/components/lists/BlogItem";
import { fetchBlogsByUsername } from "@/features/blog-details/api/blog";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 12;

const UserBlogs = () => {
  const { username } = useParams<{ username: string }>();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["userBlogs", username],
    queryFn: async ({ pageParam = 0 }) => {
      if (!username) return [];
      return await fetchBlogsByUsername(username, {
        take: PAGE_SIZE,
        skip: pageParam * PAGE_SIZE,
      });
    },
    enabled: !!username,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Return undefined if no more pages
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      // Return the next page number
      return allPages.length;
    },
  });

  // Flatten the pages into a single array
  const blogs = data?.pages.flat() ?? [];

  // Infinite scroll handler
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isFetchingNextPage || !hasNextPage) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollThreshold = 200;

      if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
        fetchNextPage();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (!username) return null;

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={200}
      >
        <Typography variant="body2" color="error">
          Error loading blogs: {error.message}
        </Typography>
      </Box>
    );
  }

  if (blogs.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={200}
      >
        <Typography variant="body2" color="textSecondary">
          No blogs available.
        </Typography>
      </Box>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col gap-4 w-full max-h-[600px] overflow-y-auto"
    >
      {blogs.map((blog) => (
        <BlogItem
          key={blog.id}
          blogId={String(blog.id)}
          title={blog.title}
          content={blog.content}
          thumbnail={
            Array.isArray(blog.pictures) && blog.pictures[0]
              ? blog.pictures[0]
              : "https://placehold.co/600x400"
          }
          author={{
            username: blog.user.username,
            avatar:
              blog.user.profile_picture_url &&
              blog.user.profile_picture_url.trim() !== ""
                ? blog.user.profile_picture_url
                : "",
          }}
          category={blog.categories?.[0]?.name ?? "Uncategorized"}
          timeReading={`${Math.ceil((blog.content ? blog.content.split(/\s+/).length : 0) / 200)}m reading`}
          dateCreated={blog.created_at}
          like_count={blog.like_count}
          comment_count={blog.comment_count}
          view_count={blog.view_count}
        />
      ))}

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <Box display="flex" justifyContent="center" alignItems="center" py={2}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="textSecondary" ml={1}>
            Loading more blogs...
          </Typography>
        </Box>
      )}

      {/* End of content indicator */}
      {!hasNextPage && blogs.length > 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" py={2}>
          <Typography variant="body2" color="textSecondary">
            No more blogs to load
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default UserBlogs;
