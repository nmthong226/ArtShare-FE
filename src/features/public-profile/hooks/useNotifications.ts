// src/hooks/useNotifications.ts
import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import {
  connectToNotifications,
  disconnectFromNotifications,
} from "@/api/sockets/socket";
import api from "@/api/baseApi";

export interface Notification<T> {
  id: string;
  userId: string;
  type: string;
  payload: T;
  isRead: boolean;
  createdAt: string;
}

export interface ReportResolvedPayload {
  message: string;
  reportId: number;
  resolvedAt: string;
}

export function useNotifications(userId: string) {
  const socketRef = useRef<Socket | null>(null);

  const [notifications, setNotifications] = useState<
    Notification<ReportResolvedPayload>[]
  >([]);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = connectToNotifications(userId);

    (async () => {
      try {
        const res = await api.get('/notifications');
        if (res.status !== 201) throw new Error("Failed to fetch unread notifications");
        const existing: Notification<ReportResolvedPayload>[] = res.data;
        setNotifications(existing);
      } catch (err) {
        console.error("[useNotifications] could not load initial unread:", err);
      }
    })();

    const handler = (notification: Notification<ReportResolvedPayload>) => {
      console.log("[Socket] got raw notification →", notification);
      setNotifications((prev) => [...prev, notification]);
    };

    socketRef.current.on("new-notification", handler);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("new-notification", handler);
        disconnectFromNotifications();
        socketRef.current = null;
      }
    };
  }, [userId]);

 
  const markAllAsRead = async () => {
    try {
      const res = await api.post(
        `/notifications/read-all`,
      );
      console.log(res)

      if (res.status !== 201) throw new Error("Failed to mark all as read");
      setNotifications([]);
    } catch (err) {
      console.error("[useNotifications] markAllAsRead failed:", err);
    }
  };

  return {
    notifications,
    markAllAsRead,
  };
}
