import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

//Components
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import BlogComments from "./components/BlogComments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Blog } from "@/types/blog";
//Icons
import { IoPersonAddOutline } from "react-icons/io5";
import { LuLink, LuTableOfContents } from "react-icons/lu";
import { IoIosArrowUp } from "react-icons/io";
import RelatedBlogs from "./components/RelatedBlogs";
import { BiComment } from "react-icons/bi";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { MdBookmarkBorder } from "react-icons/md";
import { LuPlus } from "react-icons/lu";
import { LikesDialog } from "@/components/like/LikesDialog";
import { fetchBlogDetails } from "./api/blog";
import { fetchBlogComments } from "../post/api/comment.api";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/contexts/UserProvider";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import {
  followUser,
  unfollowUser,
} from "../user-profile-public/api/follow.api";
import { AxiosError } from "axios";
import { createLike, removeLike } from "./api/like-blog";
import { TargetType } from "@/types/likes";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const BlogDetails = () => {
  const { blogId } = useParams<{ blogId: string }>(); // get blogId from URL
  const [showAuthorBadge, setShowAuthorBadge] = useState(false);
  // states for the likes dialog
  const [likesDialogOpen, setLikesDialogOpen] = useState(false);
  const { user } = useUser();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const requireAuth = useRequireAuth();
  const {
    data: blog,
    isLoading,
    error,
    refetch,
  } = useQuery<Blog, Error>({
    queryKey: ["blogDetails", blogId],
    queryFn: () => fetchBlogDetails(Number(blogId)),
    enabled: !!blogId,
  });
  /* ───────── comments query ───────── */
  const {
    data: comments = [],
    isLoading: commentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["blogComments", blogId],
    queryFn: () => fetchBlogComments(Number(blogId)),
    enabled: !!blogId,
  });
  /* comment count derived from list */
  const [commentCount, setCommentCount] = useState(0);
  useEffect(() => setCommentCount(comments.length), [comments]);

  const followMutation = useMutation({
    mutationFn: () => followUser(blog!.user.id),
    onSuccess: () => {
      refetch();
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Failed to follow user.";
      showSnackbar(msg, "error");
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(blog!.user.id),
    onSuccess: () => {
      refetch();
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Failed to unfollow user.";
      showSnackbar(msg, "error");
    },
  });

  // Like/unlike mutations
  const likeMutation = useMutation({
    mutationFn: () =>
      createLike({
        target_id: Number(blogId),
        target_type: TargetType.BLOG,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogDetails", blogId] });
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Failed to like blog.";
      showSnackbar(msg, "error");
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () =>
      removeLike({
        target_id: Number(blogId),
        target_type: TargetType.BLOG,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogDetails", blogId] });
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Failed to unlike blog.";
      showSnackbar(msg, "error");
    },
  });

  const isOwnProfile = user?.id === blog?.user.id;
  const isFollowing = blog?.user.is_following;

  const toggleFollow = () =>
    requireAuth("follow/unfollow users", () =>
      isFollowing ? unfollowMutation.mutate() : followMutation.mutate(),
    );

  const followBtnLoading =
    followMutation.isPending || unfollowMutation.isPending;
  // Check if user has liked the blog
  const isLiked = blog?.isLikedByCurrentUser || false;
  const likeCount = blog?.like_count || 0;

  // Function to handle toggling like status
  const handleToggleLike = () =>
    requireAuth("like this blog", () => {
      isLiked ? unlikeMutation.mutate() : likeMutation.mutate();
    });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowAuthorBadge(scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOpenLikesDialog = () =>
    requireAuth("view likes", () => setLikesDialogOpen(true));

  const handleCloseLikesDialog = () => {
    setLikesDialogOpen(false);
  };
  const handleCommentAdded = () => {
    setCommentCount((c) => c + 1);
    refetchComments();
  };
  const handleCommentDeleted = () => {
    setCommentCount((c) => Math.max(c - 1, 0));
    refetchComments();
  };

  /* ───────── loading / error ───────── */
  if (isLoading || commentsLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  if (error || commentsError)
    return (
      <div className="p-4 text-red-500">
        {(error || commentsError)?.message}
      </div>
    );

  if (!blog) return null;
  if (isLoading) {
    return (
      <div className="flex justify-center items-center space-x-4 h-screen">
        <CircularProgress size={36} />
        <p>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-4 h-screen text-red-500">
        {(error as Error)?.message}
      </div>
    );
  }
  if (!blog) return null;

  const readingTime = Math.ceil(blog.content.split(/\s+/).length / 200);

  console.log("@@ Current user:", user);

  return (
    <div className="flex flex-col items-center py-12 w-full h-screen sidebar">
      <div className="flex w-full h-full">
        <div className="relative flex flex-col w-[20%]">
          <div className="top-100 z-10 sticky flex justify-center items-center bg-white shadow-md mr-4 ml-auto rounded-full w-12 h-12">
            <LuTableOfContents className="size-5" />
          </div>
          <div className="right-4 bottom-4 z-50 fixed flex justify-center items-center bg-blue-400 shadow-md rounded-full w-12 h-12">
            <IoIosArrowUp className="mb-1 size-5 text-white" />
          </div>
        </div>
        <div className="group flex flex-col space-y-4 p-4 w-[60%]">
          <div className="flex space-x-2 w-full">
            <Link to="/blogs" className="underline">
              Blogs
            </Link>
            <span>/</span>
            <span className="text-mountain-600 line-clamp-1">{blog.title}</span>
          </div>
          <h1 className="font-medium text-2xl">{blog.title}</h1>{" "}
          <div className="flex items-center space-x-2 text-mountain-600 text-sm">
            <p>
              Posted{" "}
              {formatDistanceToNow(new Date(blog.created_at), {
                addSuffix: true,
              })}
            </p>
            <span>•</span>
            <p>{readingTime}m reading</p>
          </div>
          {/* Author Section */}
          <div className="flex justify-between items-center bg-gradient-to-r from-indigo-100 to-purple-100 shadow-sm p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={blog.user.profile_picture_url ?? undefined} />
                <AvatarFallback>
                  {blog.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <p className="font-medium text-gray-900 text-lg">
                  {blog.user.full_name}
                </p>
                <div className="flex items-center space-x-3 text-gray-600 text-sm">
                  <span>@{blog.user.username}</span>
                  <span className="text-gray-400">•</span>
                  <span>
                    {blog.user.followers_count.toLocaleString()}{" "}
                    {blog.user.followers_count <= 1 ? "follower" : "followers"}
                  </span>
                </div>
              </div>
            </div>
            {!isOwnProfile && (
              <Button
                onClick={toggleFollow}
                disabled={followBtnLoading}
                className="flex items-center bg-white shadow w-32 h-10 font-medium text-sm"
              >
                <IoPersonAddOutline className="mr-2 text-blue-500" />
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
          {/* Blog Content */}
          <div className="p-2 rounded-md max-w-none prose lg:prose-xl">
            {blog.content}
          </div>
          <hr className="flex border-mountain-200 border-t-1 w-full" />
          <BlogComments
            blogId={Number(blogId)}
            comments={comments}
            onCommentAdded={handleCommentAdded}
            onCommentDeleted={handleCommentDeleted}
          />
          <hr className="flex border-mountain-200 border-t-1 w-full" />
          <RelatedBlogs />
        </div>
        <div className="relative flex flex-col w-[20%]">
          <div
            className={`${showAuthorBadge ? "opacity-0 pointer-events-none" : "opacity-100"} space-y-2 flex-col transition ease-in-out duration-300 top-64 z-10 sticky flex justify-center items-center mr-auto ml-4 rounded-full w-14 h-76`}
          >
            <div className="relative flex justify-center items-center w-12 h-12">
              <Avatar>
                <AvatarImage
                  src="https://i.pravatar.cc/150?img=68"
                  className="object-cover"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Tooltip title="Follow" placement="right" arrow>
                <div className="-right-1 -bottom-1 absolute flex justify-center items-center bg-blue-400 border border-white rounded-full w-5 h-5">
                  <LuPlus className="text-white" />
                </div>
              </Tooltip>
            </div>
            <div
              className={`space-y-2 flex-col transition ease-in-out duration-300 flex justify-between items-center py-1 bg-white shadow-md rounded-full h-full w-full`}
            >
              <Tooltip
                title={isLiked ? "Unlike" : "Like"}
                placement="right"
                arrow
              >
                <div
                  className="flex justify-center items-center bg-blue-50 hover:bg-blue-100 shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer"
                  onClick={handleToggleLike}
                  aria-disabled={
                    likeMutation.isPending || unlikeMutation.isPending
                  }
                >
                  {isLiked ? (
                    <AiFillLike className="size-5 text-blue-500" />
                  ) : (
                    <AiOutlineLike className="size-5" />
                  )}
                  <p
                    className="ml-1 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLikesDialog();
                    }}
                  >
                    {likeCount}
                  </p>
                </div>
              </Tooltip>
              <Tooltip title="Comment" placement="right" arrow>
                <div className="flex justify-center items-center bg-green-50 hover:bg-green-100 shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer">
                  <BiComment className="mr-1 size-4" />
                  <span>{commentCount}</span>
                </div>
              </Tooltip>
              <Tooltip title="Save" placement="right" arrow>
                <div className="flex justify-center items-center shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer">
                  <MdBookmarkBorder className="size-4" />
                </div>
              </Tooltip>
              <Tooltip title={copied ? "Link copied!" : "Copy link"} arrow>
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex justify-center items-center shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer"
                >
                  <LuLink className="size-4" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <LikesDialog
        contentId={Number(blogId)}
        open={likesDialogOpen}
        onClose={handleCloseLikesDialog}
        variant="blog"
      />
    </div>
  );
};

export default BlogDetails;
