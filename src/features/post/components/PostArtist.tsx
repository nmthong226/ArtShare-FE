// src/PostArtist.tsx (or the actual path to this file)

import { Box, CardContent, CardHeader, IconButton } from "@mui/material";
import { X } from "lucide-react";
import Avatar from "boring-avatars";
import { User, Post } from "@/types";
import { Link, useNavigate } from "react-router-dom";
import { PostMenu } from "./PostMenu";
import { auth } from "@/firebase";
import { deletePost } from "@/api/post/post";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { useReport } from "@/features/user-profile-public/hooks/useReport";
import ReportDialog from "@/features/user-profile-public/components/ReportDialog"; // This file will not be changed
import { useState } from "react";
import { ReportTargetType } from "@/features/user-profile-public/api/report.api";

// Define a type for the expected API error structure
// This helps in safely accessing nested properties.
interface ApiError {
  response?: {
    data?: {
      message?: string; // The field we want, e.g., "You have already submitted a report for this item."
      error?: string; // e.g., "Conflict"
      statusCode?: number; // e.g., 409
    };
    status?: number;
  };
  message: string; // Fallback message, often the generic one like "Request failed..."
}

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
      showSnackbar("Failed to update post", "error"); // Consider parsing this error too if it's from an API
    }
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const { mutate: reportPost, isPending: isLoadingReportUser } = useReport();

  const handleReport = (reason: string) => {
    reportPost(
      { targetId: postData?.id, reason, targetType: ReportTargetType.POST },
      {
        onSuccess: () => {
          setDialogOpen(false);
          showSnackbar(
            "Your report will be reviewed soon! Thanks for your report",
            "success",
          );
        },
        onError: (err: unknown) => {
          // Catch as unknown, then type guard or cast
          const apiError = err as ApiError; // Cast to our defined type
          let displayMessage = "Failed to submit report. Please try again."; // A sensible default

          // Check for the specific backend message first
          if (
            apiError.response &&
            apiError.response.data &&
            apiError.response.data.message
          ) {
            displayMessage = apiError.response.data.message;
          } else if (apiError.message) {
            // Fallback to the general error message if the specific one isn't found
            displayMessage = apiError.message;
          }

          showSnackbar(displayMessage, "error");
          // The ReportDialog will remain open here if the submission fails.
          // The error is shown in the snackbar, not inside the dialog.
        },
      },
    );
  };

  return (
    artist && (
      <div className="bg-white shadow p-4 md:border-b md:border-b-mountain-200 rounded-2xl md:rounded-b-none overflow-none">
        <CardHeader
          className="p-0"
          action={
            <Box display="flex" gap={1}>
              <PostMenu
                isOwner={!!isOwner}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReport={() => setDialogOpen(true)}
              />
              <Link to="/explore">
                <IconButton>
                  <X />
                </IconButton>
              </Link>
            </Box>
          }
        />
        <CardContent
          className="flex flex-col gap-4 p-0 cursor-pointer"
          onClick={() => navigate(`/${artist.username}`)}
        >
          <div className="flex gap-4 cursor-pointer">
            <div className="flex-shrink-0 rounded-full overflow-hidden">
              {artist.profile_picture_url ? (
                <img
                  src={artist.profile_picture_url}
                  className="w-20 h-20 object-cover"
                  alt={`${artist.username}'s profile`}
                />
              ) : (
                <Avatar
                  name={artist.username || "Unknown"}
                  colors={["#84bfc3", "#ff9b62", "#d96153"]}
                  variant="beam"
                  size={48} // Note: In your code this was 48, image was w-20 h-20. Ensure consistency if intended.
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
        <ReportDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleReport}
          submitting={isLoadingReportUser}
          // No changes here, ReportDialog remains unaware of this API error.
        />
      </div>
    )
  );
};

export default PostArtist;
