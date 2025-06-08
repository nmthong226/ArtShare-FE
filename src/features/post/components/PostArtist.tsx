import { Box, CardContent, CardHeader, IconButton } from "@mui/material";
import { X } from "lucide-react";
import Avatar from "boring-avatars";
import { User, Post } from "@/types";
import { Link, useNavigate } from "react-router-dom";
import { PostMenu } from "./PostMenu";
import { auth } from "@/firebase";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { useReport } from "@/features/user-profile-public/hooks/useReport";
import ReportDialog from "@/features/user-profile-public/components/ReportDialog"; // This file will not be changed
import { useState } from "react";
import { ReportTargetType } from "@/features/user-profile-public/api/report.api";
import { useDeletePost } from "../hooks/useDeletePost";
import { BackendErrorResponse } from "@/api/types/error-response.type";
import axios, { AxiosError } from "axios";

const PostArtist = ({ artist, postData }: { artist: User; postData: Post }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const currentUser = auth.currentUser;
  const isOwner = currentUser && postData.user_id === currentUser.uid;

  const { mutate: deletePostQuery } = useDeletePost({
    onSuccess: () => {
      navigate(`/${postData.user.username}`);
      showSnackbar("Post successfully deleted!", "success");
    },
    onError: (errorMessage) => {
      showSnackbar(errorMessage, "error");
    },
  });

  const handleEdit = () => {
    navigate(`/post/${postData.id}/edit`, {
      state: { postData },
    });
  };

  const handleDelete = async () => {
    deletePostQuery(postData.id);
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
        onError: (err) => {
          const apiError = err as AxiosError<BackendErrorResponse>;

          const displayMessage = axios.isAxiosError(err)
            ? (apiError.response?.data?.message ??
              "Failed to submit report. Please try again.")
            : apiError.message;

          showSnackbar(displayMessage, "error");
          // The ReportDialog will remain open here if the submission fails.
          // The error is shown in the snackbar, not inside the dialog.
        },
      },
    );
  };

  if (!artist) {
    return (
      <div className="flex items-center justify-center m-4">
        Artist not found or data is unavailable.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-mountain-950 shadow p-4 md:border-b md:border-b-mountain-200 rounded-2xl md:rounded-b-none overflow-none">
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
  );
};

export default PostArtist;
