import React from "react";
import { Link, useLocation } from "react-router-dom";

//Icons
import { FiLogIn } from "react-icons/fi";
import {
  IoMail,
  IoMailOutline,
  IoNotifications,
  IoNotificationsOutline,
} from "react-icons/io5";
import { BsPen } from "react-icons/bs";

//Components
import { Skeleton } from "../ui/skeleton";

//Types
import { User } from "@/types";
import UserPlan from "../sidebar/subscription";

const UserButton: React.FC<{
  user?: User | null;
  loading?: boolean;
}> = ({ user, loading }) => {
  const location = useLocation();

  // Show a loading indicator while checking authentication
  if (loading) {
    return (
      <>
        <Skeleton className="flex justify-center items-center space-x-2 dark:bg-mountain-900 rounded-2xl w-20 xl:w-26 h-9"></Skeleton>
        <Skeleton className="flex justify-center items-center space-x-2 dark:bg-mountain-900 rounded-2xl w-20 xl:w-26 h-9"></Skeleton>
      </>
    );
  }

  // Show Sign Up and Login for non-logged-in users
  if (!user) {
    return (
      <>
        <Link
          to="/signup"
          className="hidden xs:flex justify-center items-center space-x-2 border border-mountain-950 rounded-2xl w-24 xl:w-26 h-9 text-muted-foreground text-sm"
        >
          <BsPen />
          <p>Sign Up</p>
        </Link>
        <Link
          to="/login"
          className="flex justify-center items-center space-x-2 bg-mountain-950 hover:bg-mountain-600 dark:bg-mountain-200 rounded-2xl w-20 xl:w-26 h-9 text-mountain-100 dark:text-mountain-950 text-sm"
        >
          <FiLogIn />
          <p>Login</p>
        </Link>
      </>
    );
  }

  // Show Messages and Updates for logged-in users
  return (
    <>
      <Link
        to="/messages"
        className={`hidden xs:flex group items-center mr-2 h-full ${location.pathname === "/messages"
          ? "dark:text-mountain-50 text-mountain-950"
          : "dark:text-mountain-500 text-mountain-700"
          }`}
      >
        <div className="flex items-center hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg hover:text-mountain-800 dark:hover:text-mountain-50 hover:cursor-pointer">
          {location.pathname === "/updates" ? (
            <IoNotifications className="size-5" />
          ) : (
            <IoNotificationsOutline className="size-5" />
          )}
        </div>
      </Link>
    </>
  );
};

export default UserButton;
