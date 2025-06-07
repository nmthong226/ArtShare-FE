import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import BlogCard from "@/components/cards/BlogCard";
import { LuBookOpenText } from "react-icons/lu";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { fetchRelevantBlogs } from "../api/blog";
import { Blog } from "@/types/blog";
import { useState, useEffect } from "react"; // Import useEffect
import { getPlainTextPreview } from "../utils/blog";

interface RelatedBlogsProps {
  currentBlogId: number;
}

const RelatedBlogs = ({ currentBlogId }: RelatedBlogsProps) => {
  const [skip, setSkip] = useState(0);
  const take = 3;

  const {
    data: relatedBlogs = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<Blog[]>({
    queryKey: ["relatedBlogs", currentBlogId, take, skip],
    queryFn: () => fetchRelevantBlogs(currentBlogId, { take, skip }),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });

  const handleNext = () => {
    setSkip((prev) => prev + take);
  };

  const handlePrevious = () => {
    setSkip((prev) => Math.max(0, prev - take));
  };

  const isLastPage = relatedBlogs.length < take;

  // --- DEBUGGING: Log state changes ---
  useEffect(() => {
    console.log({
      skip,
      isFetching,
      isLastPage,
      numberOfBlogs: relatedBlogs.length,
      blogs: relatedBlogs,
    });
  }, [skip, isFetching, isLastPage, relatedBlogs]);
  // --- END DEBUGGING ---

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-8 pt-8 w-full min-h-[300px]">
        <div className="flex justify-center items-center space-x-2 w-full font-medium text-gray-900 dark:text-gray-100">
          <LuBookOpenText className="text-gray-700 dark:text-gray-300" />
          <p>Loading Related Blogs...</p>
        </div>
        <CircularProgress size={36} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center space-y-8 pt-8 w-full min-h-[300px] text-red-500 dark:text-red-400">
        <p>Error loading related blogs: {(error as Error).message}</p>
      </div>
    );
  }

  if (relatedBlogs.length === 0 && skip === 0) {
    return (
      <div className="flex flex-col justify-center items-center space-y-8 pt-8 w-full min-h-[300px]">
        <div className="flex justify-center items-center space-x-2 w-full font-medium text-gray-900 dark:text-gray-100">
          <LuBookOpenText className="text-gray-700 dark:text-gray-300" />
          <p>Related Blogs</p>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          No related blogs found.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center space-y-8 pt-8 w-full">
      <div className="flex justify-center items-center space-x-2 w-full font-medium text-gray-900 dark:text-gray-100">
        <LuBookOpenText className="text-gray-700 dark:text-gray-300" />
        <p>Related Blogs</p>
      </div>
      <div className="flex justify-center items-center gap-6 w-full max-w-7xl px-4 relative">
        {!(skip === 0 && isLastPage) && (
          <button
            onClick={handlePrevious}
            disabled={skip === 0 || isFetching}
            className="flex justify-center items-center bg-mountain-200 dark:bg-mountain-700 hover:bg-mountain-300 dark:hover:bg-mountain-600 shadow-md rounded-lg w-12 h-12 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ArrowLeft className="size-5 text-white" />
          </button>
        )}

        <div className="flex-grow w-full">
          <div
            className={`grid gap-6 transition-opacity duration-300 ${
              isFetching ? "opacity-50" : "opacity-100"
            } ${
              relatedBlogs.length === 1
                ? "grid-cols-1 max-w-sm mx-auto"
                : relatedBlogs.length === 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {relatedBlogs.map((blog: Blog) => (
              <div key={blog.id} className="h-full">
                <BlogCard
                  blogId={String(blog.id)}
                  thumbnail={
                    Array.isArray(blog.pictures) && blog.pictures[0]
                      ? blog.pictures[0]
                      : "https://placehold.co/600x400"
                  }
                  title={blog.title}
                  content={getPlainTextPreview(blog.content)}
                  author={{
                    username: blog.user.username,
                    avatar: blog.user.profile_picture_url ?? "",
                  }}
                  timeReading={`${Math.ceil((blog.content ? blog.content.split(/\s+/).length : 0) / 200)}m reading`}
                  dateCreated={blog.created_at}
                  category={blog.categories?.[0]?.name ?? "Uncategorized"}
                  like_count={blog.like_count}
                  comment_count={blog.comment_count}
                  view_count={blog.view_count}
                  className="h-full"
                />
              </div>
            ))}
          </div>

          {isLastPage && skip > 0 && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              End of results
            </p>
          )}
        </div>

        {!(skip === 0 && isLastPage) && (
          <button
            onClick={handleNext}
            disabled={isLastPage || isFetching}
            className="flex justify-center items-center bg-mountain-200 dark:bg-mountain-700 hover:bg-mountain-300 dark:hover:bg-mountain-600 shadow-md rounded-lg w-12 h-12 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ArrowRight className="size-5 text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default RelatedBlogs;
