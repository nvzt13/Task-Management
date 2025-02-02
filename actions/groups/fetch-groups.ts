"use server";
import { group } from "console";
import { auth } from "../../auth";
import prisma from "../../lib/prisma";

export const fetchGroups = async () => {
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

    const groups = await prisma.group.findMany({
      where: {
        groupUsers: {
          some: {
            id: session.user.id,
          },
        },
      },
    });
    return {
      status: 200,
      message: "Groups Returned",
      success: true,
      groups,
    };
  } catch (error) {}
};
