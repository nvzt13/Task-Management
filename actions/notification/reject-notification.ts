'use server'
import prisma from "@/lib/prisma";

export const rejectNotification = async (notificationId: string) => {
    try {
      // Bildirimi veritabanından tamamen silme işlemi
      await prisma.notification.delete({
        where: {
          id: notificationId, // Bildirim ID'sine göre
        },
      });
  
      return { success: true, message: 'Notification deleted successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to delete notification' };
    }
  };
  