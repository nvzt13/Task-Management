import React from 'react';
import prisma from '@/lib/prisma';
import TasksClient from '@/components/shared/tasks/TasksClient';
import { auth } from '@/auth';

interface Params {
  userId: string;
  groupId: string;
}

const GroupUserPage = async ({ params }: { params: Promise<Params> }) => {
  // params'ı çözümleyip içindeki değerleri alıyoruz
  const resolvedParams = await params;
  const { groupId, userId } = resolvedParams;

  // auth işlemi sunucu tarafında yapılmalı
  const session = await auth();
  if (!session || !session.user?.id) {
    return <div> Unauthorized</div>;
  }

  const group = await prisma.group.findFirst({
    where: {
      id: groupId,
    },
  });

  if (!group) {
    return <div> Not found </div>;
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: userId,
      groupId: groupId,
    },
  });

  return (
    <div>
      <TasksClient
        tasks={tasks}
        isAdmin={group.adminId === session.user.id}
        groupId={groupId}
        userId={userId}
        isHimself={session.user.id === userId}
      />
    </div>
  );
};

export default GroupUserPage;
