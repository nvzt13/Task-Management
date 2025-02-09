import React, { ReactNode } from "react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import GroupHeader from "@/components/shared/groups/GroupHeader";
import GroupUserList from "@/components/shared/groups/GroupUserList";
import { Loader } from "lucide-react"; // Loader eklenebilir

interface Params {
  groupId: string;
}

const GroupLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<Params>;
}) => {
  // params'ı await ile çözüyoruz
  const resolvedParams = await params;
  const selectedGroupId = resolvedParams.groupId;

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
    <div className="w-full h-full p-4">
      {/* Group Header */}
      <div className="border-b-4  mb-4">
        <GroupHeader
          group={group}
          isAdmin={group.adminId === session.user.id}
        />
      </div>

      {/* Group Users and Main Content */}
      <div className="flex flex-col md:flex-row gap-6 divide-x divide-gray-300">
        {/* Group Users */}
        <div className="w-full md:w-1/3">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Group Users
          </h3>
          {group.groupUsers.length > 0 ? (
            <GroupUserList
              groupUsers={group.groupUsers}
              currentUserId={session.user.id}
              currentGroupId={selectedGroupId}
              adminId={group.adminId}
            />
          ) : (
            <div className="flex items-center justify-center text-gray-500">
              <Loader className="animate-spin mr-2" />{" "}
            </div>
          )}
        </div>

        {/* Main Content (children) */}
        <div className="w-full md:w-2/3 p-4">{children}</div>
      </div>
    </div>
  );
};

export default GroupLayout;
