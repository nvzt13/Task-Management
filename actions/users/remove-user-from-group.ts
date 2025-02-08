'use server'
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export const removeUser = async (groupId: string, userId: string) => {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return {
        success: false,
        status: 401,
        message: "Unauthorized",
      };
    }

    // Check if the user has permission to remove other users from the group
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      return {
        success: false,
        status: 404,
        message: "Group not found",
      };
    }

    // Verify if the current user is an admin of the group
    if (session.user.id !== group.adminId) {
      return {
        success: false,
        status: 403,
        message: "You do not have permission to remove users from this group",
      };
    }

    // Remove user from group (disconnect relation)
    await prisma.group.update({
      where: { id: groupId },
      data: {
        groupUsers: {
          disconnect: { id: userId }, // Disconnect user from the group
        },
      },
    });

    return {
      success: true,
      status: 200,
      message: "User removed from the group successfully",
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "Server Error",
    };
  }
};
