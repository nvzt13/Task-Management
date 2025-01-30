'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import { PlusIcon } from "lucide-react";
import { AddGroupDialog } from "./AddGroupDialog";
import { fetchGroups } from '../../../actions/fetch-groups'
import { toast } from "sonner";
import { CreateGroupType } from "@/type/types";
import { Group } from "@prisma/client";

const GroupList = () => {
    const pathName = usePathname();
    const [openDialog, setOpenDialog] = useState(false);
    const [data, setData] = useState<Group[]>([]);  // State for storing group data
    const [loading, setLoading] = useState(false);  // Loading state to manage data fetching state
    const [error, setError] = useState<string | null>(null);  // Error handling state

    useEffect(() => {
        const handleFetchGroup = async () => {
            setLoading(true);
            try {
                const resp = await fetchGroups();  // Await the promise to get the response
                if (resp?.success && resp.groups) {
                    setData(resp.groups);  // Set groups data if response is successful
                } else {
                    setError(resp?.message || "Failed to fetch groups");  // Set error message
                    toast.error(resp?.message || "Failed to fetch groups");  // Display toast error message
                }
            } catch (e: any) {
                setError("Error fetching groups");
                toast.error("Error fetching groups");
            } finally {
                setLoading(false);  // Stop loading when the fetch is done
            }
        };

        handleFetchGroup();  // Fetch groups when the component mounts
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <AddGroupDialog open={openDialog} onOpenChange={setOpenDialog} />
            <div className="flex w-full items-center justify-between p-2 border-b">
                <div className="text-lg font-semibold">Groups</div>
                <Button onClick={() => setOpenDialog(true)}> <PlusIcon /> </Button>
            </div>
            {data.length > 0 ? (
                data.map((group) => (
                    <div key={group.id}>
                        <Link href={`/groups/${group.id}`} className={cn({
                            "flex flex-col w-full p-2 border-b cursor-pointer transition hover:bg-gray-400": true,
                            "bg-black text-white hover:bg-slate-800 rounded": pathName === `/groups/${group.id}`
                        })}>
                            <p className="text-lg font-semibold"> {group.groupName} </p>
                            <p className="text-muted-foreground"> {group.description} </p>
                        </Link>
                    </div>
                ))
            ) : (
                <div>No groups available</div>
            )}
        </div>
    );
};

export default GroupList;
