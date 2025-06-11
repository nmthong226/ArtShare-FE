import React from "react";
import { Link, useLocation } from "react-router-dom";

//Icons
import { FiLogIn } from "react-icons/fi";
import { BsPen } from "react-icons/bs";
import { BiSolidCoinStack } from "react-icons/bi";

//Components
import { Skeleton } from "../ui/skeleton";

//Types
import { User } from "@/types";
import { FaBell } from "react-icons/fa6";
import PurchaseButton from "../buttons/PurchaseButton";
import { Button } from "@mui/material";
import { useNotifications } from "@/features/notifications/useNotifications";

const UserButton: React.FC<{
  user?: User | null;
  loading?: boolean;
}> = ({ user, loading }) => {
  const location = useLocation();

  const { notifications, markAllAsRead, markAsRead } = useNotifications(
    user?.id ?? ""
  );

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
      <div className="flex items-center space-x-2">
        <Link
          to="/signup"
          className="hidden xs:flex justify-center items-center space-x-2 border border-mountain-950 dark:border-mountain-500 rounded-2xl w-24 xl:w-26 h-9 text-muted-foreground dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-mountain-700"
        >
          <BsPen />
          <p>Sign Up</p>
        </Link>
        <Link
          to="/login"
          className="flex justify-center items-center space-x-2 bg-mountain-950 hover:bg-mountain-600 dark:bg-mountain-200 dark:hover:bg-mountain-300 rounded-2xl w-20 xl:w-26 h-9 text-mountain-100 dark:text-mountain-950 text-sm"
        >
          <FiLogIn />
          <p>Login</p>
        </Link>
      </div>
    );
  }

  // Show Messages and Updates for logged-in users
  return (
    <div className="flex items-center space-x-2 relative group">
      <Button
        className={`hidden xs:flex group bg-white dark:bg-slate-700 items-center border-[0.5px] border-mountain-200 dark:border-slate-600 mr-2 h-8 w-8 rounded-full justify-center hover:bg-gray-100 dark:hover:bg-slate-600 ${
          location.pathname === "/messages"
            ? "dark:text-mountain-50 text-mountain-950" // Active: light text on dark, dark text on light
            : "dark:text-mountain-500 text-mountain-700" // Inactive: lighter text on dark, darker text on light
        }`}
      >
        <FaBell />
        {notifications.length > 0 && (
            <span
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white"
              style={{ minWidth: "1rem", lineHeight: "1rem" }}
            >
              {notifications.length > 9 ? "9+" : notifications.length}
            </span>
          )}
           <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 absolute top-1 right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-lg z-20">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-4 py-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Notifications
            </h4>
            {notifications.length > 0 ? (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
            ) : (
              <span className="text-xs text-gray-500">All read</span>
            )}
          </div>

          {/* List of notifications */}
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.length === 0 ? (
              <li className="py-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No notifications.
              </li>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              notifications.map((notif: any) => (
                <li
                  key={notif.id}
                  className={`flex justify-between items-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    notif.isRead
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-700"
                  }`}
                >
                  {/* Left side: message + timestamp */}
                  <div className="flex flex-col">
                    <span className="text-sm text-left text-gray-800 dark:text-gray-200">
                      {notif?.payload?.message}
                    </span>
                    <small className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notif.payload.resolvedAt).toLocaleString()}
                    </small>
                  </div>

                  {/* Right side: if unread, show “Mark as read” */}
                  {!notif.isRead && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="self-start text-xs text-blue-600 hover:underline ml-2 cursor-pointer"
                    >
                      Mark read
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
      </div>
      </Button>
      <div className="flex justify-between items-center bg-white dark:bg-slate-700 p-[2px] border-[0.5px] border-mountain-200 dark:border-slate-600 rounded-full w-42 h-10">
        <div className="flex items-center space-x-1 px-2">
          <BiSolidCoinStack className="text-indigo-600 dark:text-indigo-400" />
          <span className="text-gray-800 dark:text-gray-100">50</span>
        </div>
        <PurchaseButton />
      </div>
    </div>
  );
};

export default UserButton;
