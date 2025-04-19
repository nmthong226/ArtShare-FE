import { Button, CardContent, Divider } from "@mui/material";
import {
  MessageSquareText,
  Bookmark,
  EllipsisVertical,
  Share2,
} from "lucide-react";
import ShowMoreText from "react-show-more-text";
import { ElementType, useState, useEffect, useCallback } from "react";
import ReactTimeAgo from "react-time-ago";
import { Post } from "@/types";
import { useFocusContext } from "@/contexts/focus/useFocusText";
import { SavePostDialog, DialogCollection } from "./SavePostDialog";
import {
  CreateCollectionDialog,
  CreateCollectionFormData,
} from "@/features/collections/components/CreateCollectionDialog";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";

const AnyShowMoreText: ElementType = ShowMoreText as unknown as ElementType;

const PostInfo = ({ postData }: { postData: Post }) => {
  const { postCommentsRef } = useFocusContext();

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [collections, setCollections] = useState<DialogCollection[]>([]);

  const [userLike, setUserLike] = useState(false);
  const [likeCount, setLikeCount] = useState(postData.like_count);

  useEffect(() => {
    console.log("Fetching collections for post:", postData.id);

    const fetchedCollections: DialogCollection[] = [
      { name: "My Art Projects", postIds: [1, postData.id] },
      { name: "Inspiration Board", postIds: [] },
      { name: "Private Stash", postIds: [5] },
    ];
    setCollections(fetchedCollections);
  }, [postData.id]);

  const handleOpenSaveDialog = () => {
    setIsCreateDialogOpen(false);
    setIsSaveDialogOpen(true);
  };

  const handleCloseSaveDialog = () => {
    setIsSaveDialogOpen(false);
  };

  const handleNavigateToCreate = () => {
    setIsSaveDialogOpen(false);
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);

    setIsSaveDialogOpen(true);
  };

  const handleCollectionCreated = useCallback(
    (formData: CreateCollectionFormData) => {
      console.log("PostInfo received new collection data:", formData);

      const newCollection: DialogCollection = {
        name: formData.name,
        postIds: [postData.id],
      };
      setCollections((prev) => [...prev, newCollection]);

      setIsCreateDialogOpen(false);

      setIsSaveDialogOpen(true);
    },
    [postData.id],
  );

  const handleCollectionUpdate = useCallback(
    (updatedCollections: DialogCollection[]) => {
      console.log("PostInfo received collection update:", updatedCollections);

      setCollections(updatedCollections);
    },
    [],
  );

  const handleFocusCommentInput = () => {
    if (postCommentsRef.current) {
      postCommentsRef.current.focusInput();
    }
  };

  const handleLikeClick = () => {
    if (userLike) {
      if (likeCount > 0) setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setUserLike(!userLike);
  };

  if (!postData) return null;

  return (
    <>
      {" "}
      {/* Use Fragment to render dialogs alongside the main content */}
      <div className="bg-white shadow p-4 rounded-2xl md:rounded-t-none overflow-none">
        <CardContent className="flex flex-col gap-4 p-0">
          {/* Post Title, Description, TimeAgo */}
          <div className="flex flex-col gap-2">
            <div className="font-bold text-xl">{postData.title}</div>
            <AnyShowMoreText
              lines={3}
              more="Show more"
              less="Show less"
              className="text-sm break-words"
              anchorClass="cursor-pointer hover:text-cyan-500 block py-2 underline text-sm"
              expanded={false}
              truncatedEndingComponent={"... "}
            >
              {postData.description}
            </AnyShowMoreText>
            <div className="text-xs italic">
              Posted <ReactTimeAgo date={postData.created_at} />
            </div>
          </div>
          <Divider className="border-0.5" />
          {/* Post Stats (Likes, Comments, Views) */}
          <div className="flex gap-6 text-mountain-950">
            <div className="flex items-center gap-1 text-sm">
              <p className="font-semibold">{likeCount}</p>
              <span className="text-mountain-600">
                {likeCount !== 1 ? " Likes" : " Like"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <p className="font-semibold">{postData.comment_count}</p>
              <span className="text-mountain-600">
                {postData.comment_count !== 1 ? " Comments" : " Comment"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <p className="font-semibold">{"1k"}</p> {/* Placeholder */}
              <span className="text-mountain-600">Views</span>
            </div>
          </div>
          <Divider className="border-0.5" />
          {/* Action Buttons */}
          <div className="flex justify-between w-full">
            <Button
              className="p-2 border-0 min-w-0 text-blue-900"
              title="Like"
              onClick={handleLikeClick}
            >
              {userLike ? (
                <AiFillLike className="size-6" />
              ) : (
                <AiOutlineLike className="size-6" />
              )}
            </Button>
            <Button
              className="p-2 border-0 min-w-0 text-blue-900"
              title="Comment"
              onClick={handleFocusCommentInput}
            >
              <MessageSquareText />
            </Button>
            {/* --- Updated Save Button --- */}
            <Button
              className="p-2 border-0 min-w-0 text-blue-900"
              title="Save"
              onClick={handleOpenSaveDialog}
            >
              <Bookmark />
            </Button>
            <Button
              className="p-2 border-0 min-w-0 text-blue-900"
              title="Copy Link"
            >
              <Share2 />
            </Button>
            <Button
              className="border-0 min-w-auto aspect-[1/1] text-blue-900"
              title="More options"
            >
              <EllipsisVertical />
            </Button>
          </div>
        </CardContent>
        {/* Render SavePostDialog conditionally */}
        <SavePostDialog
          postId={postData.id}
          open={isSaveDialogOpen}
          onClose={handleCloseSaveDialog}
          initialCollections={collections}
          onNavigateToCreate={handleNavigateToCreate}
          onCollectionUpdate={handleCollectionUpdate}
        />
      </div>
      {/* Render CreateCollectionDialog conditionally */}
      <CreateCollectionDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onCreate={handleCollectionCreated}
      />
    </>
  );
};

export default PostInfo;
