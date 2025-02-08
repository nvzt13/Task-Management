"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MailIcon } from "lucide-react";
import { fetchNotifications } from "@/actions/notification/fetch-notifications";
import { rejectNotification } from "@/actions/notification/reject-notification";
import { Notification as PrismaNotification } from "@prisma/client"; // Renamed Prisma Notification import
import { approveNotification } from "@/actions/notification/aprove-notification";

const NotificationDropdown = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<PrismaNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0); // To track unread notifications count

  useEffect(() => {
    const handleFetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetchNotifications();

        if (response.notifications) {
          setNotifications(response.notifications);

        } else {
          console.warn("No notifications found", response.message);
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      } finally {
        setLoading(false);
      }
    };

    handleFetchNotifications();
  }, []);

  const handleApprove = async (groupId: string) => {
    try {
      await approveNotification(groupId);
      
      setNotifications((prev) =>
        prev.filter((notification) => notification.groupId !== groupId)
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0)); // Decrease unread count
    } catch (error) {
      console.error("Error approving notification", error);
    }
  };

  const handleReject = async (notificationId: string) => {
    try {
      await rejectNotification(notificationId);

      // Remove the rejected notification from the list
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0)); // Decrease unread count
    } catch (error) {
      console.error("Error rejecting notification", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative">
          <MailIcon />

          {/* Show unread notification count as a badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications found</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="p-2 border-b">
              <p>{notification.message}</p>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => handleApprove(notification.groupId)}
                  className="px-3 py-1 bg-green-500 text-white rounded-md"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(notification.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
