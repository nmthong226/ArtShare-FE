import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { AvatarSection } from "./components/AvatarSection";
import {
  getUserProfile,
  UserProfile,
} from "../user-profile-public/api/user-profile.api";
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

  useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

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

  const [formData, setFormData] = useState<UserProfile | null>({
    id: profileData?.id ?? "",
    username: profileData?.username ?? "",
    email: profileData?.email ?? "",
    full_name: profileData?.full_name ?? "",
    bio: profileData?.bio ?? "",
    profile_picture_url: profileData?.profile_picture_url ?? "",
    followings_count: profileData?.followings_count ?? 0,
    followers_count: profileData?.followers_count ?? 0,
    isFollowing: profileData?.isFollowing ?? false,
    birthday: profileData?.birthday ?? "",
  });

  if (loadingProfile || !formData) {
    return <div className="m-4 text-center">Loading....</div>;
  }

  return (
    <Container disableGutters className="px-15 pt-6 rounded-t-3xl h-screen">
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

      {/* <ProfileForm
          formData={formData}
          handleChange={handleChange}
          onSubmit={handleSave}
          isSubmitting={saving}
        /> */}
      {profileData && <EditProfileForm initialData={profileData} />}

      {/* <Box className="p-6 pt-3">
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
