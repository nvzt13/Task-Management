import GroupList from "@/components/shared/groups/GroupList";
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

  if (!session || !session.user?.id) {
    return (
      <div className="flex items-center justify-center h-full text-lg text-red-500">
        Unauthorized: You need to be logged in to access this group.
      </div>
    );
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

  if (!group) {
    return (
      <div className="flex items-center justify-center h-full text-lg text-red-500">
        Group not found or you don't have select a group.
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 space-y-6">
      <GroupHeader
        group={group}
        isAdmin={group.adminId === session.user.id}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-7 lg:grid-cols-9 divide-x-2 space-x-4">
        {/* User List */}
        <div className="md:col-span-2 lg:col-span-2 max-sm:absolute max-sm:bottom-0">
          <div className="p-4 border rounded-lg bg-gray-50 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Group Users</h3>
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
        </div>

        {/* Main Content */}
        <div className="col-span-1 sm:col-span-3 md:col-span-5 lg:col-span-6 px-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GroupLayout;
