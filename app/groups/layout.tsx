import { auth } from "@/auth";
import GroupList from "@/components/shared/groups/GroupList";
import React, { ReactNode } from "react";

const GroupLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth()
  if(!session || !session.user?.id){
    return <div> Unauthorized</div>
  }
  return (
    <div className="w-full grid grid-cols1 border-2 sm:grid-cols-3 md:grid-cols-8 lg:grid-cols-12">
    <div className="col-span-1 md:col-span-2 lg:col-span-3">
      groups layout
        <GroupList />
    </div>
    <div className="col-span-1 sm:col-span-2 md:col-span-6 lg:col-span-9">
      {children}
    </div>
    </div>
  );
};

export default GroupLayout;
