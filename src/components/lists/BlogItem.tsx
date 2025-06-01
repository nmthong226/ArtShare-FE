import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Libs
// import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, Tooltip } from "@mui/material";

//Icons
import { AiOutlineLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { MdBookmarkBorder } from "react-icons/md";

//Components
import Share from "../dialogs/Share";
import ReactTimeAgo from "react-time-ago";

//Style
type Author = {
  username: string;
  avatar: string;
};

type BlogItemProps = {
  blogId: string;
  author: Author;
  title: string;
  content: string;
  dateCreated: string;
  timeReading: string;
  category: string;
  thumbnail: string;
  like_count: number;
  comment_count: number;
  view_count: number;
};

const BlogItem: React.FC<BlogItemProps> = ({
  blogId,
  author,
  title,
  content,
  dateCreated,
  timeReading,
  category,
  thumbnail,
  like_count,
  comment_count,
}) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/blogs/${blogId}`);
  };
  const [open, setOpen] = useState(false);

  // const handleClickMoreButton = (e: React.MouseEvent<HTMLElement>) => {
  //     e.stopPropagation();
  //     setOpen(true);
  // };

  useEffect(() => {
    const handleScroll = () => {
      setOpen(false);
    };

    if (open) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  // Helper function to strip HTML and get plain text preview
  const getPlainTextPreview = (
    htmlContent: string,
    maxLength: number = 150,
  ): string => {
    // Remove HTML tags
    const textOnly = htmlContent.replace(/<[^>]*>/g, "");
    // Decode HTML entities
    const decoded = textOnly
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // Trim whitespace and limit length
    const trimmed = decoded.trim();
    if (trimmed.length <= maxLength) return trimmed;

    // Cut at word boundary
    const truncated = trimmed.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return lastSpace > 0
      ? truncated.substring(0, lastSpace) + "..."
      : truncated + "...";
  };

  return (
    <div
      key={blogId}
      className="flex space-x-4 bg-white border-mountain-200 hover:border-indigo-400 w-full"
    >
      <div
        onClick={handleCardClick}
        className="flex bg-black w-64 h-48 overflow-hidden cursor-pointer shrink-0"
      >
        <img
          src={thumbnail}
          className="w-full h-full object-cover hover:scale-120 transition-transform duration-300 ease-in-out transform"
        />
      </div>
      <div className="flex w-full">
        <div className="flex flex-col justify-between space-y-2 w-full">
          <div className="flex justify-between w-full">
            <div className="flex items-center space-x-2 font-thin capitalize">
              <p>{category.trim() ? category : "Uncategorized"}</p>
              <span>•</span>
              <p>{timeReading}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Tooltip title="Bookmark">
                <div className="font-normal text-mountain-400 hover:text-mountain-950">
                  <MdBookmarkBorder className="mr-1 size-4" />
                </div>
              </Tooltip>
              <Share
                className="font-normal text-mountain-400 hover:text-mountain-950"
                iconClassName="mr-1 size-4"
                link={`http://localhost:5173/blogs/${blogId}`}
                tooltipDirection="bottom"
              />
            </div>
          </div>
          <p
            className="font-medium hover:text-indigo-600 text-lg line-clamp-1 duration-300 ease-in-out cursor-pointer transform"
            onClick={handleCardClick}
          >
            {title}
          </p>
          <p className="text-sm line-clamp-2">{getPlainTextPreview(content)}</p>
          <div className="flex justify-between w-full">
            <div className="flex items-center space-x-2">
              <img src={author.avatar} className="rounded-full w-12 h-12" />
              <p className="font-medium text-sm">{author.username}</p>
              <span>•</span>
              <ReactTimeAgo date={new Date(dateCreated)} locale="en-US" />
            </div>
            <div className="flex items-center w-fit">
              <Tooltip title="Like">
                <Button className="h-full font-normal text-mountain-400 hover:text-mountain-950">
                  <AiOutlineLike className="mr-1 size-4" />
                  <p>{like_count}</p>
                </Button>
              </Tooltip>
              <Tooltip title="Comment">
                <Button className="h-full font-normal text-mountain-400 hover:text-mountain-950">
                  <BiComment className="mr-1 size-4" />
                  <p>{comment_count}</p>
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
