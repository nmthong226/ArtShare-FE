import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { AvatarSection } from "./components/AvatarSection";
import {
  getUserProfile,
  UserProfile,
} from "../user-profile-public/api/user-profile.api"; // Make sure this path is correct
import { useQuery } from "@tanstack/react-query";
import EditProfileForm from "./components/EditProfileForm"; // Already has dark mode considerations

export default function EditUser() {
  const { data: profileData, isLoading: loadingProfile } = useQuery<
    UserProfile,
    Error
  >({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile(),
  });

  // formData is used for AvatarSection's immediate display and updates
  const [formData, setFormData] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

  if (loadingProfile || !formData) {
    return (
      <div className="m-4 text-center text-slate-700 dark:text-slate-200">
        {/* Adjusted text color for light and dark modes */}
        Loading....
      </div>
    );
  }

  return (
    <Container
      disableGutters
      className={
        "px-15 pt-6 h-full  min-h-screen"
        // Using 'dark:bg-background' assuming 'background' is your themed dark background (e.g., from shadcn/ui)
        // If not, use a specific color: "dark:bg-slate-900" or "dark:bg-gray-900"
        // Ensure text-foreground is defined in your theme for labels inside EditProfileForm to contrast this.
      }
    >
      {/* <ProfileHeader />  // If you add this, ensure it also has dark mode styles */}

      <Box>
        <AvatarSection
          profilePictureUrl={formData.profile_picture_url}
          username={formData.username}
          onUploadSuccess={(newUrl: string) =>
            setFormData((prev) =>
              prev ? { ...prev, profile_picture_url: newUrl } : prev,
            )
          }
          // AvatarSection itself might need internal dark mode styling for its elements
        />
      </Box>

      {/* 
        EditProfileForm receives `profileData` (the last fetched state from backend).
        If `AvatarSection` updates the avatar, `formData` changes, but `EditProfileForm`'s 
        `initialData` won't reflect this specific avatar change until `profileData` itself is refetched.
        This component (EditProfileForm) was already styled for dark mode in the previous step,
        including its own background (e.g., dark:bg-mountain-900) and white input fields.
      */}
      {profileData && <EditProfileForm initialData={profileData} />}
    </Container>
  );
}
