import { fetchGroups } from './../groups/fetch-groups';
"use server";
import { auth } from "../../auth";
import prisma from "../../lib/prisma";

export const fetchNotifications = async () => {
  try {
    const session = await auth();
    // Session kontrolü
    if (!session || !session.user?.id) {
      return {
        success: false,
        status: 401,
        message: "Unauthorized",
      };
    }

    const notifications = await prisma.notification.findMany({
      where: {
            sendToId: session.user.id,
      },
    });
    return {
      status: 200,
      message: "Groups Returned",
      success: true,
      notifications,
    };
  } catch (error) {
    return {
        success: false,
        status: 400,
        message: "Unauthorized",
      };
  }
};
