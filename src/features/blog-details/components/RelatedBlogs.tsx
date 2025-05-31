//Components
import BlogCard from "@/components/cards/BlogCard";
//Icons
import { LuBookOpenText } from "react-icons/lu";
import { ArrowLeft, ArrowRight } from "lucide-react";

//Mocks
import { BlogList } from "@/utils/mocks";

const RelatedBlogs = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-8 pt-8 w-full h-full">
      <div className="flex justify-center items-center space-x-2 w-full font-medium">
        <LuBookOpenText />
        <p>Related Blogs</p>
      </div>
      <div className="flex justify-center items-center gap-4 w-[500px]">
        <div className="flex justify-center items-center bg-mountain-200 shadow-md rounded-lg w-12 h-12 shrink-0">
          <ArrowLeft className="size-5 text-white" />
        </div>
        {BlogList.slice(0, 3).map((blog) => (
          <BlogCard
            blogId={blog.blogId}
            thumbnail={blog.thumbnail}
            title={blog.title}
            author={blog.user}
            timeReading={blog.timeReading}
            dateCreated={blog.dateCreated}
            category={blog.category}
            like_count={blog.like_count}
            comment_count={blog.comment_count}
            view_count={blog.view_count}
          />
        ))}
        <div className="flex justify-center items-center bg-mountain-200 shadow-md rounded-lg w-12 h-12 shrink-0">
          <ArrowRight className="size-5 text-white" />
        </div>
      </div>
    </div>
  );
};

export default RelatedBlogs;
