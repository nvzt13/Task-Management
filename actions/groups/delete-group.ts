"use server";

import prisma from "../../lib/prisma";

export const deleteGroup = async (groupId: string) => {
  try {
    // Grubun varlığını kontrol etme
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        groupUsers: true, // Grup ile ilişkilendirilmiş kullanıcıları al
        tasks: true, // İlişkili görevleri al
        notifications: true, // İlişkili bildirimleri al
      },
    });

    if (!group) {
      return {
        success: false,
        status: 404,
        message: "Group not found",
      };
    }

    // İlişkili görevleri silme
    const deleteTasksPromises = group.tasks.map(task =>
      prisma.task.delete({
        where: { id: task.id },
      })
    );

    // İlişkili bildirimleri silme
    const deleteNotificationsPromises = group.notifications.map(notification =>
      prisma.notification.delete({
        where: { id: notification.id },
      })
    );

    // Kullanıcıları gruptan çıkarma
    const removeUsersPromises = group.groupUsers.map(user =>
      prisma.group.update({
        where: { id: groupId },
        data: {
          groupUsers: {
            disconnect: { id: user.id },
          },
        },
      })
    );

    // Tüm ilişkili verileri silme
    await Promise.all([...deleteTasksPromises, ...deleteNotificationsPromises, ...removeUsersPromises]);

    // Grubu silme
    await prisma.group.delete({
      where: {
        id: groupId,
      },
    });

    return {
      success: true,
      status: 200,
      message: "Group deleted successfully, users removed, tasks and notifications cleared",
    };
  } catch (error) {
    console.error("Error deleting group:", error);
    return {
      success: false,
      status: 500,
      message: "Server Error",
    };
  }
};
