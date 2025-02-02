"use client";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { cn } from "../../../lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { createTaskDb } from "@/actions/task/add-task";
import { CircleIcon, Loader } from "lucide-react";
import { Task } from "@prisma/client";

export const createTaskSchema = z.object({
  taskName: z.string().min(3, "Task Name should be at least 3 characters long"),
});

export function AddTaskDialog({
  open,
  onOpenChange,
  userId,
  groupId,
  refreshTasks,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  groupId: string;
  refreshTasks: (newTask: Task) => void; // Yeni görev ekledikçe tasks güncelleme fonksiyonu
}) {
  const [createTask, setCreateTask] = useState({ taskName: "" });
  const [loading, setLoading] = useState(false);

  const handleCreateTask = async () => {
    try {
      setLoading(true);
      const validation = createTaskSchema.parse(createTask);
  
      // createTask objesinin eksiksiz olup olmadığını kontrol et
      const resp = await createTaskDb(validation, groupId, userId);
  
      if (resp.success) {
        toast(resp.message);
        
        // Eğer resp.task mevcutsa, TasksClient bileşenine yeni task'ı gönder
        if (resp.task) {
          refreshTasks(resp.task); // Yeni eklenen task'ı gönder
        }
      } else {
        toast.error(resp.message || "An error occurred while creating the task");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
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
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>Create a new task</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-name" className="text-right">
              Task Name
            </Label>
            <Input
              onChange={(e) => setCreateTask({ ...createTask, taskName: e.target.value })}
              id="task-name"
              value={createTask.taskName}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateTask} className={cn("flex items-center justify-center w-full gap-4", { "pointer-events-none opacity-40": loading })}>
            Save
            {loading && <Loader className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
