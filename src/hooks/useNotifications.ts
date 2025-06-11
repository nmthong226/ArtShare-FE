import { useNotifications as useNotificationsContext } from "@/contexts/NotificationsContext";
import type { NotificationsContextType } from "@/contexts/NotificationsContext";

export const useNotifications = (): NotificationsContextType => {
  return useNotificationsContext();
};
