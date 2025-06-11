import { createContext, useContext } from "react";

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

export interface NotificationsContextType {
  notifications: Notification<ReportResolvedPayload>[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  loading: boolean;
  isConnected: boolean;
  refreshNotifications: () => Promise<void>;
}

export const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );
  }
  return context;
};
