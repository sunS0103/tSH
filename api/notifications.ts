import axios from "./axios";

export interface Notification {
  id: string;
  title: string;
  description: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  notifications: Notification[];
  meta?: {
    query?: string;
    pagination?: {
      totalItems: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
    sorting?: {
      sortBy: string;
      sortDirection: string;
    };
  };
}

export const getNotifications = async ({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}): Promise<NotificationsResponse> => {
  const response = await axios.get("/notification/", {
    params: { page, pageSize },
  });
  return response.data;
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await axios.put(`/notification/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await axios.put("/notification/read-all");
  return response.data;
};

export interface UnreadCountResponse {
  success: boolean;
  message: string;
  unread_count: number;
}

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const response = await axios.get("/notification/unread-count");
  return response.data;
};
