"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { AddGroupDialog } from "./AddGroupDialog";
import { fetchGroups } from "../../../actions/groups/fetch-groups";
import { toast } from "sonner";
import { Group } from "@prisma/client";

const GroupList = () => {
  const pathName = usePathname();
  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState<Group[]>([]); // State for storing group data
  const [loading, setLoading] = useState(false); // Loading state to manage data fetching state
  const [error, setError] = useState<string | null>(null); // Error handling state

  useEffect(() => {
    const handleFetchGroup = async () => {
      setLoading(true);
      try {
        const resp = await fetchGroups(); // Await the promise to get the response
        if (resp?.success && resp.groups) {
          setData(resp.groups); // Set groups data if response is successful
        } else {
          setError(resp?.message || "Failed to fetch groups"); // Set error message
          toast.error(resp?.message || "Failed to fetch groups"); // Display toast error message
        }
      } catch (e) {
        setError(`Error fetching groups ${e}`);
        toast.error("Error fetching groups");
      } finally {
        setLoading(false); // Stop loading when the fetch is done
      }
    };

    handleFetchGroup(); // Fetch groups when the component mounts
  }, []);

 
  if (error) return <div>{error}</div>;

  return (
    <div className="border-r-4 h-full">
      <AddGroupDialog open={openDialog} onOpenChange={setOpenDialog} />
      <div className="flex w-full items-center justify-between p-2 border-b">
        <Link href="/groups" className="text-lg font-semibold">Your Groups</Link>
        <Button onClick={() => setOpenDialog(true)}>
          Create Group
          <PlusIcon />
        </Button>
      </div>
      <div>
      {data.length > 0 ? (
        data.map((group) => (
          <div key={group.id}>
            <Link
              href={`/groups/${group.id}`}
              className={cn({
                "flex flex-col w-full p-2 border-b cursor-pointer transition hover:bg-gray-500 hover:text-white":
                  true,
                "bg-gray-900 text-white hover:bg-gray-700 rounded":
                  pathName.startsWith(`/groups/${group.id}`),
              })}
            >
              <p className="text-lg font-semibold"> {group.groupName} </p>
            </Link>
             {loading && <Loader2Icon className="animate-spin nevzat atalay" />}
          </div>
        ))
      ) : (
        <div className="w-full flex items-center justify-center mt-20">
          {loading &&  <Loader2Icon className="animate-spin" /> }
        </div>
      )}
      </div>
    </div>
  );
};

export default GroupList;
