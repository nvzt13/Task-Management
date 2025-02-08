"use server";

import { CreateGroupType } from "../../type/types";
import prisma from "../../lib/prisma";
import { auth } from "../../auth";

export const createGroupDb = async (group: CreateGroupType) => {
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

    // Kullanıcıyı bulma
    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!currentUser) {
      return {
        success: false,
        status: 401,
        message: "Unauthorized",
      };
    }

    // Grup oluşturma
    const createdGroup = await prisma.group.create({
      data: {
        groupName: group.groupName,
        description: group.description,
        adminId: currentUser.id,
        adminName: session.user.name ?? "Unknown", // Eğer name null ise "Unknown" olarak ayarlanır
        groupUsers: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    

    return {
      success: true,
      status: 200,
      message: "Group created successfully",
      group: createdGroup,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "Server Error",
    };
  }
};
