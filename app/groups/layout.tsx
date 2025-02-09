import { auth } from "@/auth";
import GroupList from "@/components/shared/groups/GroupList";
import React, { ReactNode } from "react";

const GroupLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session || !session.user?.id) {
    return <div className="p-4 text-center text-red-600">Unauthorized</div>;
  }

  return (
    <div className="w-full h-screen grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-8 lg:grid-cols-12 p-4 mb-36">
      {/* Groups Section */}
      <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-3 p-4 bg-gray-50 rounded-lg shadow-md">
        <GroupList />
      </div>

      {/* Main Content Section */}
      <div className="col-span-1 sm:col-span-2 md:col-span-6 lg:col-span-9 p-4 bg-white rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
};

export default GroupLayout;
