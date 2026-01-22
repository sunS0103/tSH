"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  getUnreadCount,
} from "@/api/notifications";
import type { Notification } from "@/api/notifications";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { sanitizeHtml } from "@/lib/utils";

export default function NotificationsPageWrapper() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchNotifications();
  }, [currentPage]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await getNotifications({
        page: currentPage,
        pageSize,
      });
      if (response?.notifications) {
        setNotifications(response.notifications);
        const total = response?.meta?.pagination?.totalPages || 1;
        setTotalPages(total);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif,
        ),
      );
      // Refresh unread count
      const countResponse = await getUnreadCount();
      if (countResponse?.unread_count !== undefined) {
        setUnreadCount(countResponse.unread_count);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true })),
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
    // Format full date for older notifications
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-container px-6 pt-6 pb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <Link
            href="/dashboard"
            className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-sm text-gray-700">/</span>
          <span className="text-sm text-black font-medium">Notifications</span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-black mb-6">Notifications</h1>

        {/* Notifications List */}
        <div className="w-full max-w-2xl ">
          {isLoading ? (
            <div className="flex items-center mx-auto justify-center py-12">
              <Loader />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl">
              <Icon
                icon="mdi:bell-off-outline"
                className="size-16 text-gray-400 mb-4"
              />
              <p className="text-gray-500 text-lg font-medium">
                No notifications
              </p>
              <p className="text-gray-400 text-sm mt-2">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                    index < notifications.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  } ${notification.is_read ? "cursor-default" : "cursor-pointer"}`}
                  onClick={() => {
                    if (!notification.is_read) {
                      handleMarkAsRead(notification.id);
                    }
                  }}
                >
                  <div className="flex gap-3 items-start">
                    {/* Unread Indicator */}
                    <div className="shrink-0 mt-1.5">
                      {!notification.is_read && (
                        <div className="size-1 rounded-full bg-primary-600" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-900 leading-tight">
                          {notification.title}
                        </span>
                        <div className="shrink-0">
                          <p className="text-xs text-gray-500 text-right whitespace-nowrap">
                            {notification.created_at}
                          </p>
                        </div>
                      </div>
                      <div
                        className="text-xs text-gray-700 leading-normal"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(notification.description),
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <Icon icon="mdi:chevron-left" className="size-4" />
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <Icon icon="mdi:chevron-right" className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
