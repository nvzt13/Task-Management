"use client";
import { addUserToGroup } from "@/actions/groups/add-user-to-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@prisma/client";
import { fetchUsers } from "@/actions/users/fetch-users";
import { Loader2 } from "lucide-react";
import { DialogProps } from "@/type/types";

const AddUserToGroup = ({
  groupId,
  open,
  onOpenChange,
  adminId
}: DialogProps) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Do you want to join us?");
  const [selectedUserId,setSelectedUserId] = useState<string | null>(
    null
  );
  const [users, setUsers] = useState<User[]>([]); // Kullanıcıları tutmak için state
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.users || []); // Kullanıcıları state'e ekle
      } catch (error) {
        toast.error(`${error}`);
      }
    };
    loadUsers();
  }, []);

  const handleAddUserToGroup = async () => {
    if (!message) {
      toast.error("Please write a message!");
      return;
    }

    if (!selectedUserId) {
      toast.error("Please select a user!");
      return;
    }
    if (!groupId) {
      toast.error("Please select a group!");
      return;
    }

    setLoading(true);
    const resp = await addUserToGroup(groupId, selectedUserId, message); // selectedUserEmail here is guaranteed to be a string
    toast(resp.message);
    setLoading(false);
    setMessage("");
    setSelectedUserId(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6 bg-white shadow-lg rounded-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Add User to Group
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Select a user to add to the group and send them a message.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <h3 className="text-lg font-semibold mb-2">Select a User</h3>
          <ul>
            {users?.map((user) => (
              user.id === adminId ? "":
              <li
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={cn(
                  "p-2 cursor-pointer m-4 bg-gray-300 hover:bg-gray-500 hover:text-white rounded",
                  selectedUserId === user.id
                    ? "bg-gray-600 text-white"
                    : ""
                )}
              >
                <p>@{user.name}</p>
              </li>
            ))}
          </ul>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message to the user"
            className={cn({
              "w-full": true,
              "opacity-40": loading,
            })}
          />
          <Button
            onClick={handleAddUserToGroup}
            className="mt-4 w-full"
            disabled={loading || !selectedUserId}
          >
           Add User to Group
           <span> {loading && <Loader2 className="animate-spin"/> } </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserToGroup;
