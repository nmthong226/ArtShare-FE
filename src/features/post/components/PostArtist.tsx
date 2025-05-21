import { Box, CardContent, CardHeader, IconButton } from "@mui/material";
import { X } from "lucide-react";
import Avatar from "boring-avatars";
import { User, Post } from "@/types";
import { Link, useNavigate } from "react-router-dom";
import { PostMenu } from "./PostMenu";
import { auth } from "@/firebase";
import { deletePost } from "@/api/post/post";
import { useSnackbar } from "@/contexts/SnackbarProvider";

const PostArtist = ({ artist, postData }: { artist: User; postData: Post }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const currentUser = auth.currentUser;
  const isOwner = currentUser && postData.user_id === currentUser.uid;

  const handleEdit = () => {
    navigate(`/post/${postData.id}/edit`, {
      state: { postData },
    });
  };

  const handleDelete = async () => {
    try {
      await deletePost(postData.id);
      navigate(`/${postData.user.username}`);
    } catch {
      showSnackbar("Failed to update post", "error");
    }
  };

  const handleReport = () => {
    showSnackbar("Reported post", "info");
  };

  return (
    artist && (
      <div className="bg-white dark:bg-mountain-950 shadow p-4 md:border-b md:border-b-mountain-200 rounded-2xl md:rounded-b-none overflow-none">
        <CardHeader
          className="p-0"
          action={
            <Box display="flex" gap={1}>
              <PostMenu
                isOwner={!!isOwner}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReport={handleReport}
              />
              <Link to="/explore">
                <IconButton>
                  <X />
                </IconButton>
              </Link>
            </Box>
          }
        />
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex gap-4 cursor-pointer">
            <div className="flex-shrink-0 rounded-full overflow-hidden">
              {artist.profile_picture_url ? (
                <img
                  src={artist.profile_picture_url}
                  className="w-20 h-20 object-cover"
                />
              ) : (
                <Avatar
                  name={artist.username || "Unknown"}
                  colors={["#84bfc3", "#ff9b62", "#d96153"]}
                  variant="beam"
                  size={48}
                />
              )}
            </div>
            <div className="flex flex-col pt-0.5">
              <div className="font-bold text-xl">
                {artist.full_name || "Unknown fullname"}
              </div>
              <div className="text-sm line-clamp-1">@{artist.username}</div>
            </div>
          </div>
        </CardContent>
      </div>
    )
  );
};

export default PostArtist;
