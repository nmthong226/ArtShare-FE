import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

//Components
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import type { Blog } from "@/types/blog";
import Avatar from "boring-avatars";
//Icons
import { IoPersonAddOutline } from "react-icons/io5";
import { LuLink, LuPencil } from "react-icons/lu";
import RelatedBlogs from "./components/RelatedBlogs";
import { BiComment } from "react-icons/bi";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { MdOutlineFlag } from "react-icons/md"; // Report Icon
import { LikesDialog } from "@/components/like/LikesDialog";
import { fetchBlogDetails } from "./api/blog";
import CommentSection, {
  CommentSectionRef,
} from "../post/components/CommentSection";
import { fetchBlogComments } from "../post/api/comment.api";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/contexts/UserProvider";
import { useSnackbar } from "@/hooks/useSnackbar";
import {
  followUser,
  unfollowUser,
} from "../user-profile-public/api/follow.api";
import { AxiosError } from "axios";
import { createLike, removeLike } from "./api/like-blog";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { TargetType } from "@/utils/constants";

// Import your ReportDialog and the reporting hook
import ReportDialog from "../user-profile-public/components/ReportDialog";
import { useReport } from "../user-profile-public/hooks/useReport";
import { ReportTargetType } from "../user-profile-public/api/report.api";

const BlogDetails = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const [showAuthorBadge, setShowAuthorBadge] = useState(false);
  const [likesDialogOpen, setLikesDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false); // State for report dialog
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

  const navigate = useNavigate();
  const commentSectionRef = useRef<CommentSectionRef>(null);

  // Reporting Hook
  const { mutate: reportBlogContent, isPending: isLoadingReport } = useReport();

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

  const followMutation = useMutation({
    mutationFn: () => followUser(blog!.user.id),
    onSuccess: () => refetch(),
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
    onSuccess: () => refetch(),
    onError: (error: unknown) => {
      const msg =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Failed to unfollow user.";
      showSnackbar(msg, "error");
    },
  });

  const likeMutation = useMutation({
    mutationFn: () =>
      createLike({
        target_id: Number(blogId),
        target_type: TargetType.BLOG,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["blogDetails", blogId] }),
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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["blogDetails", blogId] }),
    onError: (error: unknown) => {
      const msg =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Failed to unlike blog.";
      showSnackbar(msg, "error");
    },
  });

  const isOwnBlog = user?.id === blog?.user.id;
  const isFollowing = blog?.user.is_following;

  const toggleFollow = () =>
    requireAuth("follow/unfollow users", () =>
      isFollowing ? unfollowMutation.mutate() : followMutation.mutate(),
    );

  const followBtnLoading =
    followMutation.isPending || unfollowMutation.isPending;
  const isLiked = blog?.isLikedByCurrentUser || false;
  const likeCount = blog?.like_count || 0;

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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenLikesDialog = () =>
    requireAuth("view likes", () => setLikesDialogOpen(true));
  const handleCloseLikesDialog = () => setLikesDialogOpen(false);

  // Report dialog handlers
  const handleOpenReportDialog = () => {
    if (!user) {
      showSnackbar(
        "Please login to report this blog",
        "warning",
        <Button
          size="small"
          color="inherit"
          onClick={() => (window.location.href = "/login")}
        >
          Login
        </Button>,
      );
      return;
    }
    if (isOwnBlog) {
      showSnackbar("You cannot report your own blog.", "info");
      return;
    }
    setReportDialogOpen(true);
  };
  const handleCloseReportDialog = () => setReportDialogOpen(false);

  const handleReportSubmit = (reason: string) => {
    if (!blog) return;

    reportBlogContent(
      {
        targetId: blog.id,
        targetType: ReportTargetType.BLOG, // Make sure TargetType.BLOG is defined in your constants
        reason: reason,
      },
      {
        onSuccess: () => {
          setReportDialogOpen(false);
          showSnackbar(
            "Blog reported successfully. Thank you for your feedback.",
            "success",
          );
        },
        onError: (err: Error) => {
          showSnackbar(
            `Failed to report blog: ${err.message || "Unknown error"}`,
            "error",
          );
        },
      },
    );
  };

  const handleCommentAdded = () => {
    refetchComments();
    queryClient.invalidateQueries({ queryKey: ["blogDetails", blogId] });
  };
  const handleCommentDeleted = () => {
    refetchComments();
    queryClient.invalidateQueries({ queryKey: ["blogDetails", blogId] });
  };

  if (isLoading || commentsLoading || !blog)
    // Added !blog check here for early return
    return (
      <div className="flex justify-center items-center space-x-4 h-screen">
        <CircularProgress size={36} /> <p>Loading…</p>
      </div>
    );
  if (error || commentsError)
    return (
      <div className="p-4 text-red-500">
        {(error || commentsError)?.message}
      </div>
    );

  const readingTime = Math.ceil(blog.content.split(/\s+/).length / 200);

  // Centralized Action Buttons Component (Optional but recommended for DRY)
  const ActionButtons = () => (
    <div className="transition ease-in-out duration-300 flex items-center py-1 bg-white space-x-4 rounded-full h-full w-full">
      <Tooltip title={isLiked ? "Unlike" : "Like"} placement="bottom" arrow>
        <div
          className="flex justify-center items-center bg-blue-50 hover:bg-blue-100 shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer"
          onClick={handleToggleLike}
          aria-disabled={likeMutation.isPending || unlikeMutation.isPending}
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
      <Tooltip title="Comment" placement="bottom" arrow>
        <div
          className="flex justify-center items-center bg-green-50 hover:bg-green-100 shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer"
          onClick={() => commentSectionRef.current?.focusInput()}
        >
          <BiComment className="mr-1 size-4" />
          <span>{blog.comment_count}</span>
        </div>
      </Tooltip>
      <div className="ml-auto flex items-center space-x-4">
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
        {/* Report Button - Conditionally rendered */}
        {!isOwnBlog && (
          <Tooltip title="Report this blog" arrow>
            <IconButton
              onClick={handleOpenReportDialog}
              className="flex justify-center items-center shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer"
            >
              <MdOutlineFlag className="size-4 text-red-500" />
            </IconButton>
          </Tooltip>
        )}
        {isOwnBlog && (
          <Tooltip title="Edit" arrow>
            <IconButton
              onClick={() => navigate(`/docs/${blog.id}`)}
              className="flex justify-center items-center shadow p-1 rounded-full w-12 h-12 font-normal text-mountain-600 hover:text-mountain-950 hover:cursor-pointer"
            >
              <LuPencil className="size-4" />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center py-12 w-full h-screen sidebar">
      <div className="flex w-full h-full">
        <div className="relative flex flex-col w-[20%]">
          {/* Sidebar content if any */}
        </div>
        <div className="group flex flex-col space-y-4 p-4 w-[60%]">
          <div className="flex space-x-2 w-full">
            <Link to="/blogs" className="underline">
              Blogs
            </Link>
            <span>/</span>
            <span className="text-mountain-600 line-clamp-1">{blog.title}</span>
          </div>
          <h1 className="font-medium text-2xl">{blog.title}</h1>
          <div className="flex items-center space-x-2 text-mountain-600 text-sm">
            <p>
              Published{" "}
              {formatDistanceToNow(new Date(blog.created_at), {
                addSuffix: true,
              })}
            </p>
            <span>•</span>
            <p>{readingTime}m reading</p>
          </div>

          {/* Action Bar (conditionally visible based on scroll) */}
          <div
            className={`${showAuthorBadge ? "opacity-0 pointer-events-none" : "opacity-100"} transition ease-in-out duration-300 flex justify-center items-center mr-auto rounded-full w-full h-20`}
          >
            <ActionButtons />
          </div>

          {/* Author Info Box */}
          <div className="flex justify-between items-center bg-gradient-to-r from-indigo-100 to-purple-100 shadow-sm p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              {blog.user.profile_picture_url ? (
                <img
                  src={blog.user.profile_picture_url}
                  alt={blog.user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <Avatar
                  name={blog.user.username}
                  size={48}
                  variant="beam"
                  colors={["#84bfc3", "#ff9b62", "#d96153"]}
                />
              )}
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
            {!isOwnBlog && (
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
          <div
            className="p-2 rounded-md max-w-none prose lg:prose-xl"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          <hr className="flex border-mountain-200 border-t-1 w-full" />

          <div
            className={`${!showAuthorBadge ? "opacity-0 pointer-events-none" : "opacity-100"} transition ease-in-out duration-300 flex justify-center items-center mr-auto rounded-full w-full h-20`}
          >
            <ActionButtons />
          </div>

          <RelatedBlogs currentBlogId={Number(blogId)} />
          <hr className="flex border-mountain-200 border-t-1 w-full" />
          <CommentSection
            ref={commentSectionRef}
            inputPosition="top"
            comments={comments}
            targetId={Number(blogId)}
            targetType={TargetType.BLOG}
            onCommentAdded={handleCommentAdded}
            onCommentDeleted={handleCommentDeleted}
            hideWrapper
          />
        </div>
        <div className="relative flex flex-col w-[20%]" />
      </div>

      <LikesDialog
        contentId={Number(blogId)}
        open={likesDialogOpen}
        onClose={handleCloseLikesDialog}
        variant={TargetType.BLOG}
      />
      {/* Report Dialog Instance */}
      {blog && ( // Ensure blog data is available
        <ReportDialog
          open={reportDialogOpen}
          onClose={handleCloseReportDialog}
          onSubmit={handleReportSubmit} // This function will call the reportBlogContent hook
          submitting={isLoadingReport}
          itemName={blog.title} // Pass the blog title
          itemType="blog" // Specify the item type
        />
      )}
    </div>
  );
};

export default BlogDetails;
