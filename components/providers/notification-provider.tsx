"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getUnreadCount } from "@/api/notifications";
import { getCookie } from "cookies-next/client";

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    const userRole = getCookie("user_role");
    setRole(userRole as string | undefined);
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    if (!role) return;
    try {
      const response = await getUnreadCount();
      if (response?.unread_count !== undefined) {
        setUnreadCount(response.unread_count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, [role]);

  useEffect(() => {
    if (role) {
      refreshUnreadCount();
      const interval = setInterval(refreshUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [role, refreshUnreadCount]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
}
