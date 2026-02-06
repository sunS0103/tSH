"use client";

import { useEffect, useState } from "react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { getNotifications, markNotificationAsRead } from "@/api/notifications";
import type { Notification } from "@/api/notifications";
import { sanitizeHtml } from "@/lib/utils";

interface NotificationPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  onNotificationRead?: () => void;
}

export default function NotificationPopover({
  open,
  onOpenChange,
  children,
  onNotificationRead,
}: NotificationPopoverProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await getNotifications({ page: 1, pageSize: 5 });
      if (response?.notifications) {
        setNotifications(response.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeeAll = () => {
    onOpenChange(false);
    router.push("/notifications");
  };

  const handleNotificationClick = async (notification: Notification) => {
    onOpenChange(false);

    // Mark as read if unread
    if (!notification.is_read) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notification.id ? { ...notif, is_read: true } : notif
          )
        );
        // Notify parent to refresh unread count
        onNotificationRead?.();
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    if (notification.url) {
      if (notification.url.startsWith("http")) {
        window.location.href = notification.url;
      } else {
        router.push(notification.url);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      {children}
      <PopoverContent
        className="w-[498px] p-0 max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-[5px_5px_20px_rgba(0,0,0,0.15)]"
        align="end"
        sideOffset={8}
      >
        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <Icon
                icon="mdi:bell-off-outline"
                className="size-12 text-gray-400 mb-4"
              />
              <p className="text-gray-500 text-sm font-medium">
                No notifications
              </p>
              <p className="text-gray-400 text-xs mt-1">
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`group px-4 py-3 hover:bg-gray-50 transition-colors ${
                    index < notifications.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  } ${
                    notification.url || !notification.is_read
                      ? "cursor-pointer"
                      : "cursor-default"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
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
        </div>

        {/* Footer with See All Button */}
        {/* {notifications.length > 0 && ( */}
        <div className="w-full ">
          <button
            className="cursor-pointer w-full rounded-b-2xl h-8 px-3 bg-primary-500 hover:bg-primary-600 text-white text-sm font-normal flex items-center justify-center transition-colors"
            onClick={handleSeeAll}
          >
            See All Updates
          </button>
        </div>
        {/* )} */}
      </PopoverContent>
    </Popover>
  );
}
