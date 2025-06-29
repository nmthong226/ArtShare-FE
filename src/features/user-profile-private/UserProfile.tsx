// import { useParams } from "react-router-dom";
// import { useUser } from "@/contexts/UserProvider";
import UserPosts from "@/features/user-profile-private/components/UserPosts";
import { Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { UserProfileCard } from "../user-profile-public/UserProfileCard";
import UserBlogs from "./components/UserBlogs";

const UserProfile = () => {
  // TODO: implement is owner for user profile

  // const { username } = useParams();
  // const { user } = useUser();
  // const isOwner = user?.username === username;
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box className="dark:bg-mountain-1000 bg-gradient-to-b from-mountain-50 to-white rounded-t-3xl h-[calc(100vh-4rem)] sidebar">
      {/* Container for Posts + Profile Sidebar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          height: "100%",
        }}
        className="p-2 pl-6 rounded-t-3xl"
      >
        {/* TOP SECTION: Profile card */}
        <div className="relative flex flex-col justify-end bg-white dark:bg-mountain-950 border border-mountain-200 rounded-3xl w-full h-72 shrink-0">
          <div className="top-0 left-0 absolute bg-gradient-to-b from-indigo-200 dark:from-mountain-950 to-purple-100 dark:to-mountain-1000 rounded-t-3xl w-full h-32" />
          <div className="z-50 flex justify-start items-center px-4 w-full h-full">
            <UserProfileCard />
          </div>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="primary"
            sx={{
              minHeight: 0,
              ".MuiTabs-flexContainer": { gap: 2 },
            }}
            className="z-50 flex px-6 border-mountain-200 border-t-1 rounded-b-3xl w-full h-12 shrink-0"
          >
            <Tab
              label="All posts"
              sx={{ textTransform: "none", minHeight: 0, minWidth: 0 }}
            />
            <Tab
              label="All blogs"
              sx={{ textTransform: "none", minHeight: 0, minWidth: 0 }}
            />
          </Tabs>
        </div>
        {/* BOTTOM SECTION: Posts */}
        <Box sx={{ width: "100%" }}>
          {selectedTab === 0 && <UserPosts />}
          {selectedTab === 1 && <UserBlogs />}
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;
