"use server";
import { auth } from "../../auth";
import prisma from "../../lib/prisma";

export const fetchUsers = async (groupId?: string) => {
  try {
    // Session kontrolü yapın (eğer gerekiyorsa)
    const session = await auth();

    if (!session || !session.user?.id) {
      return {
        status: 401,
        message: "Unauthorized",
        success: false,
      };
    }

    let users;

    // Eğer groupId varsa, sadece o gruptaki kullanıcıları çekin
    if (groupId) {
      users = await prisma.user.findMany({
        where: {
          groups: {
            some: {
              id: groupId,
            },
          },
        },
      });
    } else {
      // Grup ID yoksa, tüm kullanıcıları çekin
      users = await prisma.user.findMany();
    }

    return {
      status: 200,
      message: "Users returned successfully",
      success: true,
      users,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Server Error",
      success: false,
    };
  }
};
