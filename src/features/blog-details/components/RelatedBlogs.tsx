import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import BlogCard from "@/components/cards/BlogCard";
import { LuBookOpenText } from "react-icons/lu";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { fetchRelevantBlogs } from "../api/blog";
import { Blog } from "@/types/blog";
import { useState } from "react";
import { getPlainTextPreview } from "../utils/blog";

interface RelatedBlogsProps {
  currentBlogId: number; // ID of the blog for which to find related ones
}

const RelatedBlogs = ({ currentBlogId }: RelatedBlogsProps) => {
  const [skip, setSkip] = useState(0);
  const take = 3; // Show 3 related blogs at a time

  const {
    data: relatedBlogs = [],
    isLoading,
    error,
    isPlaceholderData,
  } = useQuery<Blog[]>({
    // Query key includes currentBlogId and pagination params to refetch when they change
    queryKey: ["relatedBlogs", currentBlogId, take, skip],
    queryFn: () => fetchRelevantBlogs(currentBlogId, { take, skip }),
    placeholderData: (previousData) => previousData, // Replaces keepPreviousData in v5
  });

  // Basic pagination handlers (can be improved)
  const handleNext = () => {
    // Check if there might be more data. This is a simple check.
    // A proper check would involve knowing the total count of related blogs.
    if (!isPlaceholderData && relatedBlogs.length === take) {
      setSkip((prev) => prev + take);
    }
  };

  const handlePrevious = () => {
    setSkip((prev) => Math.max(0, prev - take));
  };

  if (isLoading && !isPlaceholderData) {
    // Show loader only on initial load or if not showing placeholder data
    return (
      <div className="flex flex-col justify-center items-center space-y-8 pt-8 w-full h-full">
        <div className="flex justify-center items-center space-x-2 w-full font-medium">
          <LuBookOpenText />
          <p>Loading Related Blogs...</p>
        </div>
        <CircularProgress size={36} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center space-y-8 pt-8 w-full h-full text-red-500">
        <div className="flex justify-center items-center space-x-2 w-full font-medium">
          <LuBookOpenText />
          <p>Related Blogs</p>
        </div>
        <p>Error loading related blogs: {(error as Error).message}</p>
      </div>
    );
  }

  if (relatedBlogs.length === 0 && skip === 0) {
    // Only show "no blogs" if it's the first page and empty
    return (
      <div className="flex flex-col justify-center items-center space-y-8 pt-8 w-full h-full">
        <div className="flex justify-center items-center space-x-2 w-full font-medium">
          <LuBookOpenText />
          <p>Related Blogs</p>
        </div>
        <p>No related blogs found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center space-y-8 pt-8 w-full h-full">
      <div className="flex justify-center items-center space-x-2 w-full font-medium">
        <LuBookOpenText />
        <p>Related Blogs</p>
      </div>
      <div className="flex justify-center items-center gap-4 w-[500px]">
        <button
          onClick={handlePrevious}
          disabled={skip === 0 || isLoading}
          className="flex justify-center items-center bg-mountain-200 shadow-md rounded-lg w-12 h-12 shrink-0 disabled:opacity-50"
        >
          <ArrowLeft className="size-5 text-white" />
        </button>

        <div className="flex justify-center items-center gap-4 flex-1">
          {relatedBlogs.map((blog: Blog) => (
            <BlogCard
              key={blog.id}
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
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={
            isPlaceholderData || isLoading || relatedBlogs.length < take
          }
          className="flex justify-center items-center bg-mountain-200 shadow-md rounded-lg w-12 h-12 shrink-0 disabled:opacity-50"
        >
          <ArrowRight className="size-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default RelatedBlogs;
