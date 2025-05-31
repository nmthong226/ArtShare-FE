// Core
import { useState } from "react";

// Context/hooks
import { useTheme } from "@/contexts/ThemeProvider";
import { useUser } from "@/contexts/UserProvider";

// Icons
import { MdDarkMode, MdMoreVert } from "react-icons/md";
import { MdLightMode } from "react-icons/md";

// Components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
// Avatars
import BoringAvatar from "boring-avatars";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";

const UserInAppConfigs = () => {
  const { user, loading, logout } = useUser(); // Get user and logout function from UserProvider
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [matureContent, setMatureContent] = useState(false);
  const [aiContent, setAiContent] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 300);
  };

  if (loading)
    return (
      <>
        <Skeleton className="dark:bg-mountain-900 rounded-full w-10 h-10" />
      </>
    );

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <div>
          <Button
            variant="ghost"
            title="User menu"
            className={`flex items-center rounded-full w-10 h-10 p-0`}
            onMouseEnter={() => setOpen(true)}
          >
            {user ? (
              user.profile_picture_url ? (
                <Avatar className="shadow-md w-10 h-10 cursor-pointer">
                  <AvatarImage
                    src={user.profile_picture_url}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <BoringAvatar
                  size={32}
                  name={user.username}
                  variant="beam"
                  colors={[
                    "#84bfc3",
                    "#fff5d6",
                    "#ffb870",
                    "#d96153",
                    "#000511",
                  ]}
                />
              )
            ) : (
              <MdMoreVert className="size-5" />
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="dark:bg-mountain-900 mt-4 p-0 py-2 border-mountain-100 dark:border-mountain-700 w-64"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {user && (
          <>
            <div className="flex items-center space-x-2 p-3">
              {user.profile_picture_url ? (
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.profile_picture_url} />
                  <AvatarFallback>
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <BoringAvatar
                  size={40}
                  name={user.username}
                  variant="beam"
                  colors={[
                    "#84bfc3",
                    "#fff5d6",
                    "#ffb870",
                    "#d96153",
                    "#000511",
                  ]}
                />
              )}
              <div className="flex flex-col">
                <p className="text-mountain-950 dark:text-mountain-50">
                  {user.username}
                </p>
                <p className="text-mountain-500 text-xs">{user.email}</p>
              </div>
            </div>
            <hr className="my-2 border-mountain-100 dark:border-mountain-800" />
            <Link
              to={`/${user.username}`}
              className="block hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3"
            >
              <p className="text-sm">User Profile</p>
            </Link>
            <div className="xs:hidden flex hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full hover:cursor-pointer">
              <p className="text-sm">Message</p>
            </div>
            <div className="xs:hidden flex hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full hover:cursor-pointer">
              <p className="text-sm">Update</p>
            </div>
            <div className="flex hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full hover:cursor-pointer">
              <p className="text-sm">Settings</p>
            </div>
            <hr className="my-2 border-mountain-100 dark:border-mountain-800 border-t-1" />
          </>
        )}

        {/* Theme Toggle */}
        <div className="flex justify-between items-center hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full h-full">
          <span className="text-sm">Theme</span>
          <div className="flex space-x-2">
            <Button
              onClick={toggleTheme}
              className={`${
                theme === "light"
                  ? "border-indigo-600"
                  : "border-mountain-300 dark:border-mountain-800"
              } rounded-full dark:border-2 hover:cursor-pointer  dark:bg-mountain-800 size-8`}
              variant={"outline"}
            >
              <MdLightMode className="size-5" />
            </Button>
            <Button
              onClick={toggleTheme}
              className={`${
                theme === "dark"
                  ? "dark:border-indigo-600"
                  : "border-mountain-300 dark:border-mountain-800"
              } rounded-full dark:border-2 hover:cursor-pointer  dark:bg-mountain-800 size-8`}
              variant={"outline"}
            >
              <MdDarkMode className="size-5" />
            </Button>
          </div>
        </div>

        <hr className="my-2 border-mountain-100 dark:border-mountain-800 border-t-1" />

        {/* Content Settings */}
        <div className="flex justify-between items-center hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full h-full">
          <span className="text-sm">Mature Content</span>
          <Switch
            checked={matureContent}
            onCheckedChange={setMatureContent}
            className="hover:cursor-pointer"
          />
        </div>

        <div className="flex justify-between items-center hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full h-full">
          <span className="text-sm">AI Content</span>
          <Switch
            checked={aiContent}
            onCheckedChange={setAiContent}
            className="hover:cursor-pointer"
          />
        </div>
        {/* Show these options only if the user is not logged in */}
        <>
          <hr className="my-2 border-mountain-100 dark:border-mountain-800 border-t-1" />
          <div className="flex items-center space-x-2 hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full">
            <p className="text-sm">Help Center</p>
          </div>
        </>
        {/* Show these options only if the user is logged in */}
        {user && (
          <>
            <hr className="my-2 border-mountain-100 dark:border-mountain-800 border-t-1" />
            <div
              className="flex items-center space-x-2 hover:bg-mountain-50 dark:hover:bg-mountain-800 p-3 py-2 w-full hover:cursor-pointer"
              onClick={handleLogout}
            >
              <p className="text-sm">Logout</p>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default UserInAppConfigs;
