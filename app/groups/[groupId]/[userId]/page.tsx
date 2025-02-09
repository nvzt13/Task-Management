"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // useRouter kullanıyoruz
import prisma from '@/lib/prisma';
import TasksClient from '@/components/shared/tasks/TasksClient';
import { auth } from '@/auth';
import { Group, Task } from '@prisma/client';

const GroupUserPage = () => {
  const router = useRouter();
  const { groupId, userId } = router.query; // params yerine router.query kullanıyoruz

  const [tasks, setTasks] = useState<Task[]>([]);
  const [group, setGroup] = useState<Group | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isHimself, setIsHimself] = useState<boolean>(false);
  const [authorized, setAuthorized] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const session = await auth();

      if (!session || !session.user?.id) {
        setAuthorized(false);
        return;
      }

      const groupData = await prisma.group.findFirst({
        where: {
          id: groupId as string, // groupId'yi string olarak tipliyoruz
        },
      });

      if (!groupData) {
        return;
      }

      setGroup(groupData);

      setIsAdmin(groupData.adminId === session.user.id);
      setIsHimself(session.user.id === userId);

      const tasksData = await prisma.task.findMany({
        where: {
          userId: userId as string, // userId'yi string olarak tipliyoruz
          groupId: groupId as string, // Aynı şekilde groupId'yi de string tipliyoruz
        },
      });

      setTasks(tasksData);
    };

    if (groupId && userId) { // query parametrelerinin gelmesini bekliyoruz
      fetchData();
    }
  }, [groupId, userId]);

  if (!authorized) {
    return <div>Unauthorized</div>;
  }

  if (!group) {
    return <div>Not found</div>;
  }

  return (
    <div>
      <TasksClient
        tasks={tasks}
        isAdmin={isAdmin}
        groupId={groupId as string} // string olarak kullanıyoruz
        userId={userId as string} // string olarak kullanıyoruz
        isHimself={isHimself}
      />
    </div>
  );
};

export default GroupUserPage;
