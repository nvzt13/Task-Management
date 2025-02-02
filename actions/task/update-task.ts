"use server";
import prisma from "../../lib/prisma";
import { auth } from "../../auth";

export const updateTask = async (taskId: string, userIdTaskOwner: string, isCompleted: boolean) => {
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

  if(session.user.id !== userIdTaskOwner){
    return {
      success: false,
      status: 401,
      message: "Unauthorized",
    };
  }
  
  const upDateTask = await prisma.task.update({
    where: {
      id: taskId
    },
    data:{
      isCompleted: isCompleted
    }
  })
    return {
      success: true,
      status: 200,
      message: "Task updated successfully",
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
