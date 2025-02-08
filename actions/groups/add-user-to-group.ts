'use server'
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export const addUserToGroup = async (groupId: string, userId: string, message: string) => {
  try {
    const session = await auth();

    if (!userId) {
      return {
        success: false,
        status: 400,
        message: "Invalid request!",
      };
    }

    if (!session || !session.user?.id) {
      return {
        success: false,
        status: 401,
        message: "Unauthorized",
      };
    }

    const currentGroup = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        groupUsers: true,
      },
    });

    if (!currentGroup) {
      return {
        success: false,
        status: 404,
        message: "Group not found",
      };
    }

    if (currentGroup.adminId !== session.user.id) {
      return {
        success: false,
        status: 401,
        message: "Unauthorized",
      };
    }

    const requestedUser = await prisma.user.findFirst({
      where: {
        id:userId,
      },
    });

    if (!requestedUser) {
      return {
        success: false,
        status: 404,
        message: "User not found with the provided email!",
      };
    }

    const isUserAlreadyInGroup = currentGroup.groupUsers.some((user) => user.id === userId);

    if (isUserAlreadyInGroup) {
      return {
        success: false,
        status: 405,
        message: "User is already in the group!",
      };
    }

    const existingNotification = await prisma.notification.findFirst({
      where: {
        sendById: session.user.id,
        sendToId: requestedUser.id,
        groupId: groupId,
        isSeen: false,  // Görülmemiş bir mesaj varsa kontrol eder
      },
    });
    
    if (existingNotification) {
      return {
        success: false,
        status: 409, // 409 Conflict
        message: "Notification already sent and not seen yet!",
      };
    }
    
    // Eğer görüldüyse veya yeni bir mesaj göndermek istiyorsanız
    await prisma.notification.create({
      data: {
        sendById: session.user.id,
        sendToId: requestedUser.id,
        message: message,
        groupId
      },
    });
    

    return {
      success: true,
      status: 200,
      message: `Message send to ${userId}`,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "Server Error!",
    };
  }
};
