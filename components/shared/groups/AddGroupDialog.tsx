"use client";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { cn } from "../../../lib/utils";
import { AddGroupDialogProps } from "../../../type/types";
import { CreateGroupType } from "../../../type/types";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { createGroupDb } from "@/actions/groups/create-group";
import { Loader } from "lucide-react";

// Şemayı önce tanımlayın
export const createGroupSchema = z.object({
  groupName: z
    .string()
    .min(3, "Group Name should be at least 3 characters long")
    .nonempty("Group Name is required"), // Bu satır eklendi
  description: z
    .string()
    .min(3, "Description should be at least 3 characters long")
    .nonempty("Description is required"), // Bu satır eklendi
});

// AddGroupDialog component
export function AddGroupDialog({ open, onOpenChange }: AddGroupDialogProps) {
  const [createGroup, setCreateGroup] = useState<CreateGroupType>({
    groupName: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async () => {
    try {
      setLoading(true);

      // Validasyon işlemi
      createGroupSchema.parse(createGroup); // Burada doğrulama işlemi yapılır.

      // Grup oluşturma işlemi
      const resp = await createGroupDb(createGroup);

      if (resp.success) {
        toast(resp.message);
      } else {
        toast.error(
          resp.message || "An error occurred while creating the group"
        );
      }
      location.reload();
    } catch (error) {
      // Zod validation error handling
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message); // Validation hatalarını toast ile göster
        });
      } else {
        toast("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Group</DialogTitle>
          <DialogDescription>Create a group</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group-name" className="text-right">
              Group Name
            </Label>
            <Input
              onChange={(e) => {
                setCreateGroup({
                  ...createGroup,
                  groupName: e.target.value,
                });
              }}
              id="group-name"
              value={createGroup.groupName}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              onChange={(e) => {
                setCreateGroup({
                  ...createGroup,
                  description: e.target.value,
                });
              }}
              id="description"
              value={createGroup.description}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleCreateGroup}
            className={cn({
              "flex items-center justify-center w-full gap-4": true,
              "pointer-events-none opacity-40": loading,
            })}
          >
            Save
            <span>
              {loading && <Loader className="animate-spin" />}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
