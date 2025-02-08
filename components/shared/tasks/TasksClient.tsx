"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, CheckCircleIcon, CircleIcon } from "lucide-react";
import React, { useState } from "react";
import { AddTaskDialog } from "./AddTaskDialog";
import { Task } from "@prisma/client";
import { cn } from "@/lib/utils";
import { updateTask } from "@/actions/task/update-task";
import { Loader2Icon } from "lucide-react"; // Loader Iconu
import { toast } from "sonner";

const TasksClient = ({
  tasks,
  isAdmin,
  userId,
  groupId,
  isHimself, // Kullanıcı kendi profiline bakıyor mu kontrolü
}: {
  tasks: Task[];
  isAdmin: boolean;
  userId: string;
  groupId: string;
  isHimself: boolean;
}) => {
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [displayTasks, setDisplayTasks] = useState<Task[]>(tasks);
  const [currentLoadingTaskId, setCurrentLoadingTaskId] = useState<string>("");

  // Task tamamlanma durumunu değiştirir
  const toggleTaskCompletion = async (task: Task) => {
    setCurrentLoadingTaskId(task.id); // Task güncellenirken loading state

    const updatedTask = { ...task, isCompleted: !task.isCompleted };

    // Sunucuya task durumu güncellemesi gönder
    const response = await updateTask(task.id, userId, updatedTask.isCompleted);

    if (response.success) {
      // Task durumu güncellendikten sonra state'i güncelle
      setDisplayTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
      );
      toast("Task updated successfully!");
    } else {
      // Hata durumunda, loading state'ini sıfırla
      toast(response.message);
    }

    setCurrentLoadingTaskId(""); // Loading state'i sıfırla
  };

  // Taskları yenileme fonksiyonu
  const refreshTasks = (newTask: Task) => {
    setDisplayTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div className="flex flex-col p-6 bg-gray-50 rounded-lg shadow-lg space-y-6">
      <AddTaskDialog
        open={addTaskDialogOpen}
        userId={userId}
        groupId={groupId}
        onOpenChange={setAddTaskDialogOpen}
        refreshTasks={refreshTasks} // Yeni görev ekleme sonrası güncelleme
        isHimself={isHimself}
      />

      {(isAdmin || isHimself) && (
        <div className="flex items-center justify-end">
          <Button
            onClick={() => setAddTaskDialogOpen(true)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-600 text-white transition-transform transform hover:scale-105 shadow-md"
          >
            <PlusIcon className="w-5 h-5" />
            Add Task
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {displayTasks.length === 0 ? (
          <div className="text-center text-gray-500 italic">
            No tasks found!
          </div>
        ) : (
          displayTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTaskCompletion(task)}
              className={cn(
                "flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer",
                {
                  "bg-green-50 border-l-4 border-green-400": task.isCompleted,
                  "bg-gray-50 border-l-4 border-gray-200": !task.isCompleted,
                }
              )}
            >
              <div className="flex items-center space-x-3">
                {task.isCompleted ? (
                  <CheckCircleIcon className="text-green-500 w-6 h-6" />
                ) : (
                  <CircleIcon className="text-gray-400 w-6 h-6" />
                )}

                <div
                  className={cn("font-medium", {
                    "line-through text-gray-400": task.isCompleted,
                    "text-gray-700": !task.isCompleted,
                  })}
                >
                  {task.title}
                </div>
              </div>

              {currentLoadingTaskId === task.id && (
                <div className="ml-2">
                  <Loader2Icon className="animate-spin text-blue-500 w-6 h-6" />
                </div>
              )}

              <div className="text-sm text-right text-gray-400">
                {task.isCompleted ? "Completed" : "Pending"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksClient;
