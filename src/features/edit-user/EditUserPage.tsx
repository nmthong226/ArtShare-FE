import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { AvatarSection } from "./components/AvatarSection";
import {
  getUserProfile,
  UserProfile,
} from "../user-profile-public/api/user-profile.api"; // Make sure this path is correct
import { useQuery } from "@tanstack/react-query";
import EditProfileForm from "./components/EditProfileForm";

export default function EditUser() {
  const { data: profileData, isLoading: loadingProfile } = useQuery<
    UserProfile,
    Error
  >({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile(),
  });

  // Initialize formData with a structure that matches UserProfile,
  // or null if profileData is not yet available.
  const [formData, setFormData] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

  // Commented out mutation logic as it was in the original snippet
  // const { mutate: saveProfile } = useMutation<
  //   UserProfile,
  //   Error,
  //   UpdateUserDTO
  // >({
  //   mutationFn: async (payload: UpdateUserDTO) => {
  //     const response = await updateUserProfile(payload);
  //     return response.data;
  //   },
  //   onSuccess: (updated) => {
  //     queryClient.setQueryData(["userProfile"], updated);
  //     showSnackbar("Profile updated successfully.", "success");
  //   },
  //   onError: (err) => {
  //     showSnackbar(err.message ?? "Failed to update profile.", "error");
  //   },
  // });

  if (loadingProfile || !formData) {
    // Check !formData as well, since it's initialized to null
    return <div className="m-4 text-center">Loading....</div>;
  }

  return (
    <Container
      disableGutters
      // Added bg-mountain-600 here
      // Also added min-h-screen to ensure the background covers the whole screen if content is short
      className="px-15 pt-6 h-full bg-mountain-600 min-h-screen"
    >
      {/* <ProfileHeader /> */}

      <Box>
        <AvatarSection
          profilePictureUrl={formData.profile_picture_url}
          username={formData.username}
          onUploadSuccess={(newUrl: string) =>
            setFormData((prev) =>
              prev ? { ...prev, profile_picture_url: newUrl } : prev,
            )
          }
        />
      </Box>

      {/* Render EditProfileForm only if profileData (and thus initialData) is available */}
      {profileData && <EditProfileForm initialData={profileData} />}

      {/* Commented out Save button as it was in the original snippet
      <Box className="p-6 pt-3">
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </Box> */}
    </Container>
  );
}
