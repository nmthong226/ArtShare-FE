import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

//Icons
import { FiLogIn } from "react-icons/fi";
import { BsPen } from "react-icons/bs";
import { BiSolidCoinStack } from "react-icons/bi";
import { FaBell } from "react-icons/fa6";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

//Components
import { Skeleton } from "../ui/skeleton";

//Types
import { User } from "@/types";
import PurchaseButton from "../buttons/PurchaseButton";
import { Button } from "@mui/material";
import { useNotifications } from "@/contexts/NotificationsContext";
import { formatDaysAgo } from "@/lib/utils";

const UserButton: React.FC<{
  user?: User | null;
  loading?: boolean;
}> = ({ user, loading }) => {
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { notifications, markAsRead, markAllAsRead, unreadCount } =
    useNotifications();

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <div className="flex items-center space-x-2 relative">
      <div className="relative">
        <Button
          onClick={toggleNotifications}
          className={`flex bg-white dark:bg-slate-700 items-center border-[0.5px] border-mountain-200 dark:border-slate-600 mr-2 h-8 w-8 rounded-full justify-center hover:bg-gray-100 dark:hover:bg-slate-600 ${
            location.pathname === "/messages"
              ? "dark:text-mountain-50 text-mountain-950" // Active: light text on dark, dark text on light
              : "dark:text-mountain-500 text-mountain-700" // Inactive: lighter text on dark, darker text on light
          }`}
        >
          {" "}
          <FaBell />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white"
              style={{ minWidth: "1rem", lineHeight: "1rem" }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>

        <div
          ref={notificationRef}
          className={`${
            isNotificationOpen ? "visible opacity-100" : "invisible opacity-0"
          } transition-all duration-300 ease-out absolute top-full mt-2 max-h-96 bg-white dark:bg-slate-700 rounded-xl shadow-2xl border border-mountain-200 dark:border-slate-600 z-50 overflow-hidden w-[calc(100vw-2rem)] xs:w-80 right-[-150px] xs:right-0`}
        >
          {" "}
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-slate-700 border-b border-mountain-200 dark:border-slate-600 px-4 py-3 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaBell className="text-indigo-600 dark:text-indigo-400" />{" "}
                <h4 className="text-sm font-semibold text-mountain-950 dark:text-mountain-50">
                  Notifications
                </h4>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    {unreadCount}
                  </span>
                )}
              </div>
              {/* Mark All Read - Always visible when there are unread notifications */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium transition-colors px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>
          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <div className="w-12 h-12 bg-mountain-100 dark:bg-slate-600 rounded-full flex items-center justify-center mb-3">
                  <FaBell className="text-xl text-mountain-400 dark:text-mountain-300" />
                </div>
                <h3 className="text-sm font-medium text-mountain-950 dark:text-mountain-50 mb-1">
                  All caught up!
                </h3>
                <p className="text-xs text-mountain-500 dark:text-mountain-300 text-center">
                  You're all up to date.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-mountain-100 dark:divide-slate-600">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {notifications.map((notif: any) => {
                  const getNotificationIcon = () => {
                    // You can enhance this based on notification type
                    switch (notif.type) {
                      case "report_resolved":
                        return <FaCheckCircle className="text-green-500" />;
                      case "warning":
                        return (
                          <FaExclamationTriangle className="text-yellow-500" />
                        );
                      default:
                        return <FaInfoCircle className="text-indigo-500" />;
                    }
                  };

                  const getNotificationBg = () => {
                    if (!notif.isRead) {
                      return "bg-indigo-50 dark:bg-indigo-950/30 border-l-4 border-indigo-500";
                    }
                    return "bg-white dark:bg-slate-700";
                  };

                  return (
                    <div
                      key={notif.id}
                      className={`relative px-4 py-3 hover:bg-mountain-50 dark:hover:bg-slate-600/50 transition-all duration-200 ${getNotificationBg()}`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-6 h-6 rounded-full bg-mountain-100 dark:bg-slate-600 flex items-center justify-center">
                            {getNotificationIcon()}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 mr-2">
                              <p className="text-xs font-medium text-mountain-950 dark:text-mountain-50 leading-relaxed text-left">
                                {notif?.payload?.message}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <time className="text-xs text-mountain-500 dark:text-mountain-300">
                                  {formatDaysAgo(notif.payload.resolvedAt)}
                                </time>
                                {!notif.isRead && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                    New
                                  </span>
                                )}
                              </div>
                            </div>{" "}
                            {/* Action Button */}
                            {!notif.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log(
                                    "[UserButton] Marking notification as read:",
                                    notif.id,
                                  );
                                  markAsRead(notif.id);
                                }}
                                className="flex-shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 px-2 py-1 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all duration-200"
                                title="Mark as read"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
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
