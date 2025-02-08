"use client";
import { addUserToGroup } from "@/actions/groups/add-user-to-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2Icon, Loader } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchUsers } from "@/actions/users/fetch-users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteUserFromGroupProps } from "@/type/types";
import { User } from "@prisma/client";
import { removeUser } from "@/actions/users/remove-user-from-group";

const DeleteUserFromGroup = ({ groupId, open, onOpenChange,adminId }: DeleteUserFromGroupProps) => {
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // Seçilen kullanıcının email'ini tutmak için state
    const [users, setUsers] = useState<User[]>([]); // Kullanıcıları tutmak için state
  
   
    useEffect(() => {
      const loadUsers = async () => {
        try {
          const response = await fetchUsers(groupId);
  
          // Directly using the 'users' property from the response
          setUsers(response?.users || []); // If response?.users is undefined, use an empty array
        } catch (error) {
          toast.error("Failed to fetch users");
        }
      };
      loadUsers();
    }, [groupId]); // groupId changes trigger fetching users again
  
    const handleRemoveUserFromGroup = async () => {
      if(!selectedUserId) return;
      if(users.length <= 1) {
        toast("You dont have user for deleted!")
      }
      setLoading(true);
      const resp = await removeUser(groupId, selectedUserId,); // email parametresini gönder
      toast(resp.message);
      setLoading(false);
    };
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] p-6 bg-white shadow-lg rounded-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Delete User from Group
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Select a user to remove from this group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
           {users.length <= 1 ? 
           "You don't have a user for deleted!" :  <><ul>
                {users?.map((user) => (
                  adminId === user.id ? "" :
                    <li
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      className={cn(
                        "p-2 cursor-pointer hover:bg-gray-200 rounded"
                      )}
                    >
                      <p>@{user.name}</p> {/* Kullanıcının adı */}
                    </li>
                ))}
              </ul><Button
                onClick={handleRemoveUserFromGroup}
                className="mt-4 w-full"
              >
                  {loading ? (
                    <>
                      Removing...
                      <Loader className="animate-spin ml-2 w-4 h-4" />
                    </>
                  ) : (
                    "Remove User from Group"
                  )}
                </Button></>}
          </div>
          </DialogContent>
      </Dialog>
    );
  };
  
export default DeleteUserFromGroup;
