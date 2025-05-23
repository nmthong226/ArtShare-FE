import PostInfo from "./components/PostInfo";
import PostAssets from "./components/PostAssets";
import PostArtist from "./components/PostArtist";
import PostComments from "./components/PostComments";
import { fetchPost } from "./api/post.api";
import { fetchComments } from "./api/comment.api.ts";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
// import PostShare from "@/components/posts/PostShare";
import { mappedCategoryPost } from "@/lib/utils";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

const Post: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();

  const {
    data: postData,
    isLoading: isPostLoading,
    error: postError,
    refetch: refetchPostData, // We will use this to refetch the post after comment is added
  } = useQuery({
    queryKey: ["postData", postId],
    queryFn: async () => {
      const response = await fetchPost(parseInt(postId!));
      console.log("fetchPost", response.data);
      const formattedData = mappedCategoryPost(response.data); // Convert BE type to FE type
      return formattedData;
    },
  });

  const {
    data: comments,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      return await fetchComments(parseInt(postId!));
    },
    enabled: !!postId, // Ensure postId is available before fetching comments
  });
  // Track comment count and update it when postData is loaded
  const [commentCount, setCommentCount] = useState<number>(0);

  useEffect(() => {
    if (postData) {
      console.log("Post data loaded:", postData);
      console.log("Initial comment count:", postData.comment_count);
      setCommentCount(postData.comment_count); // Update comment count when postData is available
    }
  }, [postData]); // Runs when postData changes

  const handleCommentAdded = () => {
    console.log("Comment added. Previous count:", commentCount);
    setCommentCount((prev) => prev + 1); // Increment comment count when a comment is added
    console.log("Updated comment count:", commentCount + 1);
    if (postData) {
      // Directly update postData.comment_count
      postData.comment_count += 1; // This ensures that postData.comment_count is updated
      refetchPostData;
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
  if (isPostLoading || isCommentsLoading) {
    return (
      <div className="flex m-4 text-center">
        <CircularProgress size={36} />
        <p>Loading...</p>
      </div>
    );
  }
  if (postError || commentsError) {
    return <div>Failed to fetch data.</div>;
  }

  return (
    <div className="relative flex-grow bg-mountain-50 dark:bg-gradient-to-b dark:from-mountain-1000 dark:to-mountain-950 p-4 h-[calc(100vh-4rem)] overflow-y-scroll no-scrollbar dark:bg-mountain-950">
      <div className="md:hidden relative flex flex-col bg-white shadow p-4 rounded-2xl h-full">
        <div className="rounded-2xl h-full overflow-y-auto">
          <PostArtist artist={postData!.user} postData={postData!} />
          <PostAssets medias={postData!.medias} />
          <PostInfo
            postData={postData!}
            commentCount={commentCount}
            setCommentCount={setCommentCount}
          />
          <PostComments
            comments={comments!}
            postId={postData!.id}
            onCommentAdded={handleCommentAdded}
            onCommentDeleted={handleCommentDeleted}
          />
        </div>
      </div>
      <div className="hidden md:flex flex-row gap-4 h-full">
        <div className="flex flex-grow justify-center items-center h-full">
          <PostAssets medias={postData!.medias} />
        </div>
        <div className="relative flex-shrink-0 bg-white dark:bg-mountain-950 shadow py-0 pl-4 rounded-2xl sm:w-[256px] md:w-[384px] lg:w-[448px]">
          <div className="flex flex-col gap-4 rounded-2xl h-full overflow-y-scroll custom-scrollbar">
            <PostArtist artist={postData!.user} postData={postData!} />
            <PostInfo
              postData={postData!}
              commentCount={commentCount}
              setCommentCount={setCommentCount}
            />
            <PostComments
              comments={comments!}
              postId={postData!.id}
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
