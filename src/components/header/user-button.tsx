// src/components/UserButton.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

// Icons
import { FiLogIn } from "react-icons/fi";
import {
  IoMail,
  IoMailOutline,
  IoNotifications,
  IoNotificationsOutline,
} from "react-icons/io5";
import { BsPen } from "react-icons/bs";

// Components
import { Skeleton } from "../ui/skeleton";

// Types
import { User } from "@/types";

// Your existing hook that fetches & listens to notifications via Socket.IO:
import {
  useNotifications,
} from "@/features/public-profile/hooks/useNotifications";

interface Props {
  user?: User | null;
  loading?: boolean;
}

const UserButton: React.FC<Props> = ({ user, loading }) => {
  const location = useLocation();

  const { notifications, markAllAsRead } = useNotifications(
    user?.id ?? ""
  );


  // 1) Show skeletons while loading Auth state
  if (loading) {
    return (
      <>
        <Skeleton className="flex justify-center items-center space-x-2 dark:bg-mountain-900 rounded-2xl w-20 xl:w-26 h-9" />
        <Skeleton className="flex justify-center items-center space-x-2 dark:bg-mountain-900 rounded-2xl w-20 xl:w-26 h-9" />
      </>
    );
  }

  // 2) Not logged in → show Sign Up / Login
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

  console.log('notis', notifications)

  return (
    <>
      {/* ---------- Mail Icon ---------- */}
      <Link
        to="/messages"
        className={`hidden xs:flex group items-center h-full ${
          location.pathname === "/messages"
            ? "dark:text-mountain-50 text-mountain-950"
            : "dark:text-mountain-500 text-mountain-700"
        }`}
      >
        <div className="flex items-center hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg hover:text-mountain-800 dark:hover:text-mountain-50 hover:cursor-pointer">
          {location.pathname === "/messages" ? (
            <IoMail className="size-5" />
          ) : (
            <IoMailOutline className="size-5" />
          )}
        </div>
      </Link>

      {/* ---------- Notifications Icon (with hover dropdown) ---------- */}
      <div className="relative hidden xs:flex group items-center mr-2 h-full">
        {/* 3.1) The bell icon + unread badge */}
        <Link
          to="/updates"
          className={`relative flex items-center ${
            location.pathname === "/updates"
              ? "dark:text-mountain-50 text-mountain-950"
              : "dark:text-mountain-500 text-mountain-700"
          } hover:bg-mountain-100 dark:hover:bg-mountain-1000 mt-1 p-2 rounded-lg hover:text-mountain-800 dark:hover:text-mountain-50 hover:cursor-pointer`}
        >
          {location.pathname === "/updates" ? (
            <IoNotifications className="size-5" />
          ) : (
            <IoNotificationsOutline className="size-5" />
          )}

          {/* Unread badge, only if there is at least one unread */}
          {notifications.length > 0 && (
            <span
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white"
              style={{ minWidth: "1rem", lineHeight: "1rem" }}
            >
              {notifications.length > 9 ? "9+" : notifications.length}
            </span>
          )}
        </Link>

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
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {notif.message}
                    </span>
                    <small className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notif.resolvedAt).toLocaleString()}
                    </small>
                  </div>

                  {/* Right side: if unread, show “Mark as read” */}
                  {!notif.isRead && (
                    <button
                      // onClick={() => markAsRead(notif.id)}
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
      </div>
    </>
  );
};

export default UserButton;