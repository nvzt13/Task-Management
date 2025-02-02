"use server";

import { CreateTaskType } from "../../type/types";
import prisma from "../../lib/prisma";
import { auth } from "../../auth";

export const createTaskDb = async (
  task: CreateTaskType,
  groupId: string,
  userId: string
) => {
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

    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      return {
        success: false,
        status: 404,
        message: "Group not found",
      };
    }

    // Admin kontrolü
    if (group.adminId !== session.user.id) {
      return {
        success: false,
        status: 403,
        message: "You are not the admin of this group",
      };
    }

    // Yeni görev oluşturma
    const createdTask = await prisma.task.create({
      data: {
        title: task.taskName,
        userId: userId,
        groupId,
        isCompleted: false,
      },
    });

    return {
      success: true,
      status: 200,
      message: "Task created successfully",
      task: createdTask,
    };
  } catch (error) {
    console.error(error); // Hata günlüklerini tutmak için
    return {
      success: false,
      status: 500,
      message: "Server Error",
    };
  }
};
