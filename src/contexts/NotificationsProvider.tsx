import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import type { Socket } from "socket.io-client";
import { connectToNotifications } from "@/api/sockets/socket";
import api from "@/api/baseApi";
import { useUser } from "./UserProvider";
import {
  NotificationsContext,
  Notification,
  ReportResolvedPayload,
  NotificationsContextType,
} from "./NotificationsContext";

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const socketRef = useRef<Socket | null>(null);
  const [notifications, setNotifications] = useState<
    Notification<ReportResolvedPayload>[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const backgroundRefreshRef = useRef<NodeJS.Timeout | null>(null);

  // Polling fallback for when socket connection fails
  const startPollingFallback = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Immediate check for new notifications when starting polling
    const checkForNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        if (res.status === 200 || res.status === 201) {
          const freshNotifications: Notification<ReportResolvedPayload>[] =
            res.data;
          setNotifications((prev) => {
            // Compare by IDs and timestamps to detect actual changes
            const currentIds = prev.map((n) => n.id).sort();
            const freshIds = freshNotifications.map((n) => n.id).sort();

            // Check if there are different notifications or different counts
            const hasChanges =
              freshNotifications.length !== prev.length ||
              JSON.stringify(currentIds) !== JSON.stringify(freshIds) ||
              freshNotifications.some((fresh) => {
                const existing = prev.find((p) => p.id === fresh.id);
                return !existing || existing.isRead !== fresh.isRead;
              });

            if (hasChanges) {
              return freshNotifications;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("[NotificationsProvider] Polling failed:", error);
      }
    };

    // Check immediately
    checkForNotifications();

    // Then poll every 2 seconds for faster responsiveness
    pollingIntervalRef.current = setInterval(checkForNotifications, 2000);
  }, []);

  const stopPollingFallback = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const stopBackgroundRefresh = useCallback(() => {
    if (backgroundRefreshRef.current) {
      clearInterval(backgroundRefreshRef.current);
      backgroundRefreshRef.current = null;
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const res = await api.get("/notifications");
      if (res.status === 200 || res.status === 201) {
        const freshNotifications: Notification<ReportResolvedPayload>[] =
          res.data;
        const filteredNotifications = freshNotifications.filter(
            (notification) => notification.type !== "report_created",
        );
        setNotifications(filteredNotifications);
      }
    } catch (error) {
      console.error(
        "[NotificationsProvider] Failed to refresh notifications:",
        error,
      );
    }
  }, []);

  const startBackgroundRefresh = useCallback(() => {
    if (backgroundRefreshRef.current) {
      clearInterval(backgroundRefreshRef.current);
    }

    // Refresh notifications every 15 seconds as a safety net
    backgroundRefreshRef.current = setInterval(() => {
      if (isConnected) {
        refreshNotifications();
      }
    }, 15000);
  }, [isConnected, refreshNotifications]);
  // Only establish one socket connection per user
  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      setLoading(false);
      setIsConnected(false);
      return;
    }

    // Cleanup any existing connection
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Stop any existing polling
    stopPollingFallback();
    stopBackgroundRefresh();

    // Establish new connection
    setLoading(true);

    socketRef.current = connectToNotifications(user.id);

    // Handle incoming notifications
    const handler = (notification: Notification<ReportResolvedPayload>) => {
      setNotifications((prev) => {
        // Prevent duplicates by checking if notification already exists
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) {
          return prev;
        }
        const updated = [notification, ...prev];
        return updated;
      });
    };

    // Handle report resolved notifications specifically
    const reportResolvedHandler = (data: Record<string, unknown>) => {
      // Convert to standard notification format if needed
      const payload = data.payload as Record<string, unknown> | undefined;
      const notification: Notification<ReportResolvedPayload> = {
        id:
          (data.id as string) ||
          `report_${(data.reportId as number) || "unknown"}_${Date.now()}`,
        userId: user.id,
        type: "report_resolved",
        payload: {
          message:
            (data.message as string) ||
            (payload?.message as string) ||
            "Your report has been resolved",
          reportId:
            (data.reportId as number) || (payload?.reportId as number) || 0,
          resolvedAt:
            (data.resolvedAt as string) ||
            (payload?.resolvedAt as string) ||
            new Date().toISOString(),
        },
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      handler(notification);
    };

    // Set up socket event listeners IMMEDIATELY
    if (socketRef.current) {
      // Add the notification listener immediately
      socketRef.current.on("new-notification", handler);

      // Listen for specific report resolved events (backend might emit different event names)
      socketRef.current.on("report_resolved", reportResolvedHandler);
      socketRef.current.on("reportResolved", reportResolvedHandler);
      socketRef.current.on("report-resolved", reportResolvedHandler);

      // Listen for common event patterns to debug
      socketRef.current.onAny((eventName: string) => {
        if (
          ![
            "connect",
            "disconnect",
            "connect_error",
            "reconnect",
            "reconnect_attempt",
            "reconnect_error",
            "reconnect_failed",
            "ping",
            "pong",
          ].includes(eventName)
        ) {
          // Handle any notification-related events we might have missed
          if (
            eventName.toLowerCase().includes("notification") ||
            eventName.toLowerCase().includes("report")
          ) {
            refreshNotifications();
          }
        }
      });

      // Also listen for connection events to ensure we're ready
      socketRef.current.on("connect", () => {
        setIsConnected(true);
        stopPollingFallback(); // Stop polling when socket connects
        startBackgroundRefresh(); // Start background refresh as safety net
        // Immediately refresh notifications to catch any missed while disconnected
        refreshNotifications();
      });

      socketRef.current.on("disconnect", () => {
        setIsConnected(false);
        // Start polling immediately when socket disconnects
        startPollingFallback();
      });

      socketRef.current.on("connect_error", (error) => {
        console.error(
          "[NotificationsProvider] Socket connection error:",
          error,
        );
        console.error(
          "[NotificationsProvider] Make sure the backend server is running!",
        );
        setIsConnected(false);
        startPollingFallback();
      });

      socketRef.current.on("error", (error) => {
        console.error("[NotificationsProvider] Socket error:", error);
      });

      // Add additional debugging for socket connection
      socketRef.current.on("reconnect", () => {
        stopPollingFallback(); // Stop polling when socket reconnects
      });

      socketRef.current.on("reconnect_attempt", () => {
        // Reconnection attempt in progress
      });

      socketRef.current.on("reconnect_error", (error) => {
        console.error(
          "[NotificationsProvider] Socket reconnection failed:",
          error,
        );
      });

      socketRef.current.on("reconnect_failed", () => {
        console.error(
          "[NotificationsProvider] Socket reconnection failed permanently - backend may be down",
        );
        startPollingFallback();
      });
    }

    // Load initial notifications
    (async () => {
      try {
        const res = await api.get("/notifications");
        if (res.status !== 200 && res.status !== 201) {
          console.log("failed res:", res);
          throw new Error("Failed to fetch notifications");
        }
        const existing: Notification<ReportResolvedPayload>[] = res.data;

        // Merge with any notifications received via socket while loading
        setNotifications((prev) => {
          // Get IDs of existing notifications to avoid duplicates
          const existingIds = existing.map((n) => n.id);
          const socketNotifications = prev.filter(
            (n) => !existingIds.includes(n.id),
          );

          // Combine socket notifications (newer) with existing notifications
          return [...socketNotifications, ...existing];
        });
      } catch (err) {
        console.error(
          "[NotificationsProvider] could not load initial notifications:",
          err,
        );
        // Don't clear socket notifications if API fails
        setNotifications((prev) => prev);
        // Start polling if initial load fails
        if (!socketRef.current?.connected) {
          startPollingFallback();
        }
      } finally {
        setLoading(false);
      }
    })();

    // Cleanup on unmount or user change
    return () => {
      stopPollingFallback();
      if (socketRef.current) {
        socketRef.current.off("notification", handler);
        socketRef.current.off("report_resolved", reportResolvedHandler);
        socketRef.current.off("reportResolved", reportResolvedHandler);
        socketRef.current.off("report-resolved", reportResolvedHandler);
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("connect_error");
        socketRef.current.off("error");
        socketRef.current.offAny();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?.id]);
  const markAsRead = async (notificationId: string) => {
    // Optimistic update - immediately update the UI
    setNotifications((prev) => {
      const updated = prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif,
      );
      return updated;
    });

    try {
      const res = await api.post("/notifications/read", { id: notificationId });
      if (res.status !== 200 && res.status !== 201) {
        // Revert the optimistic update if the API call failed
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, isRead: false } : notif,
          ),
        );
        throw new Error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error(
        "[NotificationsProvider] Failed to mark notification as read:",
        error,
      );
      // Revert the optimistic update
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: false } : notif,
        ),
      );
    }
  };
  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
      if (unreadIds.length === 0) return;

      const res = await api.post("/notifications/read-all");
      if (res.status === 200 || res.status === 201) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true })),
        );
      }
    } catch (error) {
      console.error(
        "[NotificationsProvider] Failed to mark all notifications as read:",
        error,
      );
    }
  };

  const unreadCount = useMemo(() => {
    const count = notifications.filter((notif) => !notif.isRead).length;
    return count;
  }, [notifications]);

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loading,
    isConnected,
    refreshNotifications,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}{" "}
    </NotificationsContext.Provider>
  );
};
