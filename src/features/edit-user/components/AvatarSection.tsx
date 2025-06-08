import { ChangeEvent, useEffect, useState } from "react";
import { Box, Backdrop, CircularProgress, IconButton } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { getPresignedUrl, uploadFile } from "@/api/storage";
import { useSnackbar } from "@/hooks/useSnackbar";
import { nanoid } from "nanoid";
import { updateUserProfile } from "../api/user-profile.api";
import { Edit2 } from "lucide-react";
import Avatar from "boring-avatars";
interface AvatarSectionProps {
  profilePictureUrl?: string | null;
  onUploadSuccess: (newUrl: string) => void;
  username?: string;
}

export function AvatarSection({
  profilePictureUrl,
  onUploadSuccess,
  username,
}: AvatarSectionProps) {
  const [preview, setPreview] = useState<string | null>(
    profilePictureUrl || null,
  );
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    setPreview(profilePictureUrl ?? null);
  }, [profilePictureUrl]);

  const uploadMutation = useMutation<string, Error, File>({
    mutationFn: async (file) => {
      const ext = file.type.split("/")[1];
      const key = `avatars/${nanoid(8)}.${ext}`;
      const { presignedUrl, fileUrl } = await getPresignedUrl(
        key,
        ext,
        "image",
        "users",
      );
      await uploadFile(file, presignedUrl);
      return fileUrl;
    },
    onSuccess: async (fileUrl) => {
      await updateUserProfile({ profile_picture_url: fileUrl });
      setPreview(fileUrl);
      onUploadSuccess(fileUrl);
      showSnackbar("Avatar updated", "success");
    },
    onError: (err) => {
      showSnackbar(err.message || "Failed to upload avatar", "error");
    },
  });

  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // immediate preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setPreview(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    uploadMutation.mutate(file);
  };

  return (
    <>
      <Backdrop open={uploadMutation.isPending} sx={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box className="flex flex-col items-center">
        <Box className="relative w-24 h-24">
          {/* 1) Crop the photo */}
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-700">
            {preview ? (
              <img
                src={preview}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              // 2) Show a boring-avatar when there's no preview
              <Avatar
                size={96} // match the Box 24×24 (px * 4)
                name={username || "Unknown"}
                variant="beam" // pick your favorite style
                colors={["#84bfc3", "#ff9b62", "#d96153"]}
              />
            )}
          </div>

          {/* 2) Overlay IconButton */}
          <IconButton
            component="label"
            size="small"
            disabled={uploadMutation.isPending}
            sx={{
              position: "absolute",
              bottom: 4,
              right: 3,
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
              width: 32,
              height: 32,
            }}
          >
            <Edit2 fontSize="small" />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploadMutation.isPending}
            />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
