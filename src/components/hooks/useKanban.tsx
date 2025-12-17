import { useState, useEffect } from "react";
import { type TaskList } from "../../types/task.types";
import { type User } from "../../types/user.types";
import { io } from "socket.io-client";

export const useKanban = (isLoggedIn: boolean) => {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [taskTypes, setTaskTypes] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | "">("");

  // Load all users
  useEffect(() => {
    if (isLoggedIn) {
      fetch("http://localhost:3000/users/all-users", {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("No users found");
          return res.json();
        })
        .then((users) => setAllUsers(users))
        .catch((err) => console.error("Failed to load users", err));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const socket = io("http://localhost:3000", { withCredentials: true });

    socket.on("taskCreated", (task) => {
      setLists((prev) =>
        prev.map((list) =>
          list.id === task.listId
            ? {
                ...list,
                tasks: list.tasks.some((t) => t.id === task.id)
                  ? list.tasks
                  : [...list.tasks, task],
              }
            : list,
        ),
      );
    });

    socket.on("taskUpdated", (updatedTask) => {
      setLists((prev) =>
        prev.map((list) => {
          // If task exists on this list - update it
          const taskExists = list.tasks.some((t) => t.id === updatedTask.id);
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
    });

    socket.on("taskDeleted", ({ id }) => {
      setLists((prev) =>
        prev.map((list) => ({
          ...list,
          tasks: list.tasks.filter((t) => t.id !== id),
        })),
      );
    });

    socket.on("taskMoved", (movedTask) => {
      setLists((prev) =>
        prev.map((list) => {
          // remove from all lists first
          const filteredTasks = list.tasks.filter((t) => t.id !== movedTask.id);

          // add in the target list
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
  }, [isLoggedIn]);

  // Load lists
  useEffect(() => {
    if (isLoggedIn) {
      fetch("http://localhost:3000/lists", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => setLists(data))
        .catch((err) => console.error("Failed to load lists:", err));
    }
  }, [isLoggedIn]);

  // Load task types and priorities
  useEffect(() => {
    fetch("http://localhost:3000/task-types")
      .then((res) => res.json())
      .then(setTaskTypes)
      .catch((err) => console.error("Failed to load task types:", err));

    fetch("http://localhost:3000/priorities")
      .then((res) => res.json())
      .then(setPriorities)
      .catch((err) => console.error("Failed to load priorities:", err));
  }, []);

  const addListHandler = async (name: string) => {
    try {
      const res = await fetch("http://localhost:3000/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      const newList = await res.json();
      setLists((prev) => [...prev, { ...newList, tasks: [] }]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to add list:", err);
    }
  };

  const deleteListHandler = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/lists/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete list");

      setLists((prev) => prev.filter((list) => list.id !== id));
    } catch (err) {
      console.error("Failed to delete list:", err);
    }
  };

  const addTaskHandler = async (
    listId: number,
    name: string,
    description?: string,
    type?: string,
    priority?: string,
  ) => {
    try {
      const res = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          listId,
          type,
          priority,
        }),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const updateTaskHandler = async (
    taskId: number,
    newName: string,
    newDescription: string,
    newType?: string,
    newPriority?: string,
  ) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          type: newType,
          priority: newPriority,
        }),
      });

      if (!res.ok) throw new Error("Failed to update task");
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const deleteTaskHandler = async (listId: number, taskId: number) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete task");
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const moveTaskHandler = async (
    taskId: number,
    sourceListId: number,
    targetListId: number,
    targetIndex?: number,
  ) => {
    const res = await fetch(`http://localhost:3000/tasks/${taskId}/move`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetListId, targetIndex, sourceListId }),
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to move task");
  };

  return {
    lists,
    isModalOpen,
    setIsModalOpen,
    isLoggedIn,
    taskTypes,
    priorities,
    selectedType,
    setSelectedType,
    selectedPriority,
    setSelectedPriority,
    allUsers,
    selectedUser,
    setSelectedUser,
    addListHandler,
    deleteListHandler,
    addTaskHandler,
    updateTaskHandler,
    deleteTaskHandler,
    moveTaskHandler,
  };
};
