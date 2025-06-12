import PostInfo from "./components/PostInfo";
import PostAssets from "./components/PostAssets";
import PostArtist from "./components/PostArtist";
import CommentSection from "./components/CommentSection.tsx";
import { fetchComments } from "./api/comment.api.ts";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { TargetType } from "@/utils/constants.ts";
import MatureContentWarning from "./components/MatureContentWarning.tsx";
import { useGetPostDetails } from "./hooks/useGetPostDetails.tsx";

const Post: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();

  // Effect to control body overflow
  useEffect(() => {
    // Store the original body overflow style
    const originalBodyOverflow = document.body.style.overflow;
    // Hide the main scrollbar
    document.body.style.overflow = "hidden";

    // Cleanup function to restore original body overflow when component unmounts
    return () => {
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []); // Empty dependency array ensures this effect runs only on mount and unmount
  const [showMatureContent, setShowMatureContent] = useState<boolean>(false);

  const numericPostId = postId ? parseInt(postId, 10) : NaN;

  const {
    data: postData,
    isLoading: isPostLoading,
    error: postError,
    refetch: refetchPostData,
  } = useGetPostDetails(numericPostId);

  const {
    data: comments,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", numericPostId],
    queryFn: async () => {
      if (isNaN(numericPostId)) {
        throw new Error("Invalid Post ID format for comments");
      }

      const commentsData = await fetchComments(numericPostId);
      if (commentsData === undefined || commentsData === null) {
        throw new Error("Failed to fetch comments or comments data is empty");
      }
      return commentsData;
    },
    enabled: !!postId && !isNaN(numericPostId),
  });

  const [commentCount, setCommentCount] = useState<number>(0);

  useEffect(() => {
    if (postData) {
      setCommentCount(postData.comment_count);
      setShowMatureContent(!postData.is_mature);
    }
  }, [postData]);

  const handleCommentAdded = () => {
    console.log("Comment added. Previous count:", commentCount);
    setCommentCount((prev) => prev + 1); // Increment comment count when a comment is added
    console.log("Updated comment count:", commentCount + 1);
    if (postData) {
      // Directly update postData.comment_count
      postData.comment_count += 1;
      refetchPostData();
    }
  };
  const handleCommentDeleted = () => {
    setCommentCount((prev) => Math.max(prev - 1, 0)); // Decrement comment count when a comment is deleted
    if (postData) {
      // Directly update postData.comment_count
      postData.comment_count -= 1; // This ensures that postData.comment_count is updated
      refetchPostData; // Refetch the post data to trigger a re-render of PostInfo
    }
  };

  const handleShowMatureContent = () => {
    setShowMatureContent(true);
  };

  if (!postId || isNaN(numericPostId)) {
    return (
      <div className="flex items-center justify-center m-4">
        Invalid Post ID.
      </div>
    );
  }

  if (isPostLoading || isCommentsLoading) {
    return (
      <div className="flex items-center justify-center h-screen m-4 text-center">
        <CircularProgress size={36} />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  if (postError) {
    return (
      <div className="flex items-center justify-center m-4">
        Error loading post:{" "}
        {(postError as Error).message || "Failed to fetch post."}
      </div>
    );
  }

  if (commentsError && postData) {
    return (
      <div className="flex items-center justify-center m-4">
        Error loading comments:{" "}
        {(commentsError as Error).message || "Failed to fetch comments."}
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="flex items-center justify-center m-4">
        Post not found or data is unavailable.
      </div>
    );
  }

  if (!comments) {
    return (
      <div className="flex items-center justify-center m-4">
        Comments not found or data is unavailable.
      </div>
    );
  }

  const displayAssets = !postData.is_mature || showMatureContent;

  return (
    <div className="relative flex-grow h-[calc(100vh-4rem)] overflow-hidden">
      {/* Mobile Layout */}
      <div className="relative flex flex-col h-full p-4 bg-white shadow md:hidden rounded-t-3xl">
        <div className="h-full overflow-y-auto sidebar">
          <PostArtist artist={postData.user} postData={postData} />
          {displayAssets ? (
            <PostAssets medias={postData.medias} />
          ) : (
            <MatureContentWarning onShow={handleShowMatureContent} />
          )}
          <PostInfo
            postData={postData}
            commentCount={commentCount}
            setCommentCount={setCommentCount}
          />
          <CommentSection
            comments={comments!}
            targetId={postData!.id} // Changed from postId to targetId
            targetType={TargetType.POST}
            onCommentAdded={handleCommentAdded}
            onCommentDeleted={handleCommentDeleted}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex-row hidden h-full gap-4 md:flex">
        <div className="flex items-center justify-center flex-grow h-full overflow-hidden sidebar">
          {displayAssets ? (
            <PostAssets medias={postData.medias} />
          ) : (
            <MatureContentWarning onShow={handleShowMatureContent} />
          )}
        </div>
        <div className="relative flex-shrink-0 bg-white shadow py-0 pl-4 rounded-t-3xl sm:w-[256px] md:w-[384px] lg:w-[448px] overflow-hidden">
          <div className="flex flex-col h-full gap-4 sidebar">
            <PostArtist artist={postData!.user} postData={postData!} />
            <PostInfo
              postData={postData}
              commentCount={commentCount}
              setCommentCount={setCommentCount}
            />
            <CommentSection
              comments={comments!}
              targetId={postData!.id}
              targetType={TargetType.POST}
              onCommentAdded={handleCommentAdded}
              onCommentDeleted={handleCommentDeleted}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
