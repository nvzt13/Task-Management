import GroupList from "@/components/shared/groups/GroupList";
import React, { ReactNode } from "react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import GroupHeader from "@/components/shared/groups/GroupHeader";
import GroupUserList from "@/components/shared/groups/GroupUserList";

const GroupLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: { groupId: string };
}) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return <div>Unauthorized</div>;
  }

  const group = await prisma.group.findFirst({
    where: {
      id: params.groupId,
      groupUsers: {
        some: {
          id: session.user.id,
        },
      },
    },
    include: {
      groupUsers: true,
    },
  });

  return (
    <div className="w-full h-full">
      Group Laout
      {!group ? (
        <div className="text-red-500">
          Group not found or you don't have access
        </div>
      ) : (
        <GroupHeader
          group={group}
          isAdmin={group.adminId === session.user.id}
        />
      )}

      <div className="w-full grid grid-cols-1 sm:grid-cols-3 md:grid-cols-7 lg:grid-cols-9 divide-x-2 space-x-4">
        <div className="md:col-span-2 lg:col-span-2 max-sm:absolute max-sm:bottom-0">
          {group ? (
            <GroupUserList
              groupUsers={group.groupUsers}
              currentUserId={session.user.id}
              currentGroupId={params.groupId}
              isAdmin={group.adminId === session.user.id}
            />
          ) : (
            <div>Loading group users...</div>
          )}
        </div>
        <div className="col-span-1 sm:col-span-3 md:col-span-5 lg:col-span-6 px-2 w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GroupLayout;
