import { useEffect } from "react";
import { type TaskList } from "../../types/task.types";
import { io } from "socket.io-client";

export const useKanbanSocket = (
  isLoggedIn: boolean,
  setLists: (fn: (prev: TaskList[]) => TaskList[]) => void,
  onNotification: (message: string) => void,
) => {
  useEffect(() => {
    if (!isLoggedIn) return;

    const socket = io("http://localhost:3000", { withCredentials: true });

    socket.on("taskCreated", (task) => {
      setLists((prev) =>
        prev.map((list) =>
          list.id === task.listId
            ? {
                ...list,
                tasks: list.tasks.some((taskId) => taskId.id === task.id)
                  ? list.tasks
                  : [...list.tasks, task],
              }
            : list,
        ),
      );
      onNotification(`task "${task.name}" successfully created`);
    });

    socket.on("taskUpdated", (updatedTask) => {
      setLists((prev) =>
        prev.map((list) => {
          const taskExists = list.tasks.some(
            (taskId) => taskId.id === updatedTask.id,
          );
          if (taskExists) {
            return {
              ...list,
              tasks: list.tasks.map((t) =>
                t.id === updatedTask.id ? updatedTask : t,
              ),
            };
          }
          return list;
        }),
      );
      onNotification(`task "${updatedTask.name}" successfully updated`);
    });

    socket.on("taskDeleted", ({ id }) => {
      setLists((prev) =>
        prev.map((list) => ({
          ...list,
          tasks: list.tasks.filter((taskId) => taskId.id !== id),
        })),
      );
      onNotification(`task successfully deleted`);
    });

    socket.on("taskMoved", (movedTask) => {
      setLists((prev) =>
        prev.map((list) => {
          const filteredTasks = list.tasks.filter(
            (taskId) => taskId.id !== movedTask.id,
          );
          if (list.id === movedTask.listId) {
            return { ...list, tasks: [...filteredTasks, movedTask] };
          }
          return { ...list, tasks: filteredTasks };
        }),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [isLoggedIn, setLists, onNotification]);
};
