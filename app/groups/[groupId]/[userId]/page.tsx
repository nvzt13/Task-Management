import React from 'react'
import prisma from '@/lib/prisma'
import TasksClient from '@/components/shared/tasks/TasksClient'
import { auth } from '@/auth'


  const GroupUserPage = async ({ params }: { params: { userId: string; groupId: string } }) => {
    const session = await auth();
    if (!session || !session.user?.id) {
      return <div> Unauthorized</div>;
    }
  
    const group = await prisma.group.findFirst({
      where: {
        id: params.groupId,

      },
    });
  
    if (!group) {
      return <div> Not found </div>;
    }
  
    const tasks = await prisma.task.findMany({
      where: {
        userId: params.userId,
        groupId: params.groupId
      },
    });
  
    return (
      <div>
        <TasksClient tasks={tasks} isAdmin={group.adminId === session.user.id} groupId={params.groupId} userId={params.userId} isHimself={session.user.id === params.userId} />
      </div>
    );
  };
  
export default GroupUserPage