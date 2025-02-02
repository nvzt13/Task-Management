import { group } from 'console';
import { Group } from "@prisma/client";
import { createGroupSchema } from "../components/shared/groups/AddGroupDialog";
import { createTaskSchema } from "../components/shared/tasks/AddTaskDialog";
import { User } from "next-auth";
import { Dispatch, SetStateAction } from "react";
import { z } from 'zod'

export interface UserAvatarProps {
    user: User;
}

export interface AddGroupDialogProps {
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
}
export interface AddTaskDialogProps {
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    groupId: string
    userId: string
}


// createGroupType'ı sonra çıkarın
export interface CreateGroupType extends z.infer<typeof createGroupSchema> {}
export interface CreateTaskType extends z.infer<typeof createTaskSchema> {}

export interface GroupHeaderProps {
    group: Group;
    isAdmin: boolean;
}

export interface GroupUsersListProps {
    groupUsers: User[];
    currentUserId: string;
    currentGroupId: string
    isAdmin : boolean
}