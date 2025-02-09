import React, { ReactNode } from "react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import GroupHeader from "@/components/shared/groups/GroupHeader";
import GroupUserList from "@/components/shared/groups/GroupUserList";
import { Loader } from "lucide-react"; // Loader eklenebilir

const GroupLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: { groupId: string };
}) => {
  const session = await auth();

  const selectedGroupId = params.groupId;
  if (!session || !session.user?.id) {
    return (
      <div className="flex items-center justify-center h-full text-lg text-red-500">
        Unauthorized: You need to be logged in to access this group.
      </div>
    );
  }

  const group = await prisma.group.findFirst({
    where: {
      id: selectedGroupId,
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

  if (!group) {
    return (
      <div className="flex items-center justify-center h-full text-lg text-red-500">
        Group not found or you do not have select a group.
      </div>
    );
  }

  return (
    <div className="w-full p-4 space-y-6 grid grid-rows-2 gap-6">
      {/* Group Header - First row */}
      <div className="row-span-1">
        <GroupHeader
          group={group}
          isAdmin={group.adminId === session.user.id}
        />
      </div>

      {/* Group Users and Main Content - Second row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Group Users */}
        <div className="col-span-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Group Users
          </h3>
          {group.groupUsers.length > 0 ? (
            <GroupUserList
              groupUsers={group.groupUsers}
              currentUserId={session.user.id}
              currentGroupId={params.groupId}
              adminId={group.adminId}
            />
          ) : (
            <div className="flex items-center justify-center text-gray-500">
              <Loader className="animate-spin mr-2" /> Loading users...
            </div>
          )}
        </div>

        {/* Main Content (children) */}
        <div className="col-span-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GroupLayout;
