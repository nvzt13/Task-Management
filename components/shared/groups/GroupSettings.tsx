"use client";
import { useState } from "react";
import { deleteGroup } from "@/actions/groups/delete-group";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, Settings2Icon, SettingsIcon, Trash2Icon, UserPlusIcon, UserXIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AddUserToGroup from "./AddUserToGroup";
import DeleteUserFromGroup from "./DeleteUser";
import { useRouter } from "next/navigation";

export function GroupSettings({ groupId, adminId }: { groupId: string; adminId: string }) {
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const router = useRouter(); // typo düzeltildi

  const handleDeleteGroup = async () => {
    setLoading(true);
    try {
      const response = await deleteGroup(groupId);
      if (response.success) {
        router.push("/app/groups"); // doğru yönlendirme
        toast.success("Group deleted successfully");
        location.reload(); // sayfa yenileme
      } else {
        toast.error(response.message || "Failed to delete the group");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SettingsIcon className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-md p-2">
          <DropdownMenuLabel className="text-gray-800 font-semibold">
            Group Settings
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsAddDialogOpen(true)}>
            <UserPlusIcon className="w-4 h-4 mr-2 text-green-500" />
            Add User
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)}>
            <UserXIcon className="w-4 h-4 mr-2 text-red-500" />
            Delete User
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => handleDeleteGroup()}>
            <Trash2Icon className="w-4 h-4 mr-2 text-red-500" />
            <span className={cn({ "opacity-60": loading })}>
              Delete Group
            </span>
            {loading && <Loader className="animate-spin ml-2 w-4 h-4" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Kullanıcı ekleme ve silme dialogları */}
      <DeleteUserFromGroup
        adminId={adminId}
        groupId={groupId}
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(!isDeleteDialogOpen)}
      />
      <AddUserToGroup
        adminId={adminId}
        groupId={groupId}
        open={isAddDialogOpen}
        onOpenChange={() => setIsAddDialogOpen(!isAddDialogOpen)}
      />
    </>
  );
}
