import React, { useEffect, useState } from "react";

//Libs
// import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, Tooltip } from "@mui/material";

//Icons
import { AiOutlineLike } from "react-icons/ai";
import { IoTrashBinOutline } from "react-icons/io5";

//Components
import { useNavigate } from "react-router-dom";
import { BiComment, BiDotsVertical } from "react-icons/bi";
import { MdBookmarkBorder } from "react-icons/md";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoPersonRemoveOutline } from "react-icons/io5";

//Style
import { formatDate } from "@/lib/utils";
import Share from "../dialogs/Share";

type Author = {
  username: string;
  avatar: string;
};

type BlogCardProps = {
  blogId: string;
  author: Author;
  title: string;
  content?: string;
  dateCreated: string;
  timeReading: string;
  category: string;
  thumbnail: string;
  like_count: number;
  comment_count: number;
  view_count: number;
};

const BlogCard: React.FC<BlogCardProps> = ({
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
  const handleClickMoreButton = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setOpen(true);
  };

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

  return (
    <div
      key={blogId}
      onClick={handleCardClick}
      className="group bg-white shadow-md border border-mountain-200 hover:border-indigo-400 rounded-lg w-full hover:cursor-pointer"
    >
      <div className="relative flex justify-between items-center p-2 w-full">
        <div className="flex items-center space-x-2">
          <img src={author.avatar} className="rounded-full w-10 h-10" />
          <p className="text-sm">{author.username}</p>
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            onClick={(e) => {
              handleClickMoreButton(e);
            }}
            className="top-1/2 right-1 absolute flex justify-center items-center hover:bg-mountain-100 rounded-full w-8 h-8 -translate-y-1/2"
          >
            <BiDotsVertical className="size-5 shrink-0" />
          </PopoverTrigger>
          <PopoverContent className="p-0 border-mountain-200 w-36 text-xs">
            <div className="flex items-center hover:bg-mountain-50 px-3 py-2 border-mountain-200 border-b-1 rounded-t-lg hover:cursor-pointer">
              <IoPersonRemoveOutline className="mr-2" />
              <p>Block User</p>
            </div>
            <div className="flex items-center hover:bg-mountain-50 px-3 py-2 border-mountain-200 border-b-1 rounded-t-lg hover:cursor-pointer">
              <IoTrashBinOutline className="mr-2" />
              <p>Remove From List</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex justify-start items-start p-2 w-full">
        <div className="w-full">
          <p className="font-medium line-clamp-2 mb-2">{title}</p>
          {content && (
            <p className="text-sm text-gray-600 line-clamp-2">{content}</p>
          )}
        </div>
      </div>
      <hr className="flex border-mountain-200 border-t-0.5 w-full" />
      <div className="flex flex-col space-y-1 p-2">
        <div className="flex justify-between text-mountain-600 text-sm">
          <div className="flex items-center space-x-2">
            <p>{formatDate(dateCreated)}</p>
            <span>•</span>
            <p>{timeReading} reading</p>
          </div>
          <p>{category}</p>
        </div>
        <div className="flex bg-black w-full h-fit overflow-hidden">
          <img
            src={thumbnail}
            className="w-full h-full object-cover group-hover:scale-120 transition-transform duration-300 ease-in-out transform"
          />
        </div>
      </div>
      <hr className="flex border-mountain-200 border-t-0.5 w-full" />
      <div className="flex justify-between items-center gap-x-2 p-2 w-full">
        <div className="flex items-center space-x-1 p-1 border border-mountain-200 rounded-lg w-1/2 h-8">
          <Tooltip title="Like">
            <Button className="w-1/2 h-full font-normal text-mountain-600 hover:text-mountain-950">
              <AiOutlineLike className="mr-1 size-5" />
              <p>{like_count}</p>
            </Button>
          </Tooltip>
          <Tooltip title="Comment">
            <Button className="w-1/2 h-full font-normal text-mountain-600 hover:text-mountain-950">
              <BiComment className="mr-1 size-5" />
              <p>{comment_count}</p>
            </Button>
          </Tooltip>
        </div>
        <div className="flex items-center space-x-1 p-1 rounded-lg w-1/2 h-8">
          <Tooltip title="Bookmark">
            <Button className="w-1/2 h-full font-normal text-mountain-600 hover:text-mountain-950">
              <MdBookmarkBorder className="mr-1 size-5" />
            </Button>
          </Tooltip>
          <Share
            className="flex justify-center hover:bg-mountain-50 p-0.5 rounded-md w-1/2 h-full font-normal text-mountain-600 hover:text-mountain-950"
            iconClassName="mr-1 size-5"
            link={`http://localhost:5173/blogs/${blogId}`}
            tooltipDirection="bottom"
          />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
