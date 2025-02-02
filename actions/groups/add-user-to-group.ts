'use server'
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export const addUserToGroup = async (groupId: string, email: string) => {
  try {
    const session = await auth();

    if (!email) {
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
        email,
      },
    });

    if (!requestedUser) {
      return {
        success: false,
        status: 404,
        message: "User not found with the provided email!",
      };
    }

    const isUserAlreadyInGroup = currentGroup.groupUsers.some((user) => user.email === email);

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
        isSeen: false,
        message: `Do you want to join ${currentGroup.groupName}`,
      },
    });

    if (existingNotification) {
      return {
        success: false,
        status: 409, // 409 Conflict (Uygun bir status code)
        message: "Notification already sent!",
      };
    }

    await prisma.notification.create({
      data: {
        sendById: session.user.id,
        sendToId: requestedUser.id, // Burada sendToId yanlış gönderiliyordu, düzelttim
        message: `Do you want to join ${currentGroup.groupName}`,
      },
    });

    return {
      success: true,
      status: 200,
      message: `Join request sent to ${email}`,
    };
  } catch (error) {
    console.error('Error adding user to group:', error);
    return {
      success: false,
      status: 500,
      message: "Server Error!",
    };
  }
};
