import { useState, useEffect } from "react";
import { type TaskList } from "../../types/task.types";

type User = {
  id: number;
  email: string;
  name: string;
  lists: any[];
  tasks: any[];
};

export const useKanban = () => {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [taskTypes, setTaskTypes] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | "">("");

  // Auth check
  useEffect(() => {
    fetch("http://localhost:3000/users/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((user) => {
        setUser(user);
        setIsLoggedIn(true);
      })
      .catch(() => setIsLoggedIn(false))
      .finally(() => setAuthLoading(false));
  }, []);

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
    if (!user) return;

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

      const newTask = await res.json();

      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? { ...list, tasks: [...list.tasks, newTask] }
            : list,
        ),
      );
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const updateTaskHandler = async (
    listId: number,
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
      const updatedTask = await res.json();

      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? {
                ...list,
                tasks: list.tasks.map((task) =>
                  task.id === taskId ? updatedTask : task,
                ),
              }
            : list,
        ),
      );
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

      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? { ...list, tasks: list.tasks.filter((t) => t.id !== taskId) }
            : list,
        ),
      );
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
      body: JSON.stringify({ targetListId, targetIndex }),
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to move task");
    const updatedTask = await res.json();

    setLists((prev) =>
      prev.map((list) => {
        if (list.id === sourceListId) {
          return { ...list, tasks: list.tasks.filter((t) => t.id !== taskId) };
        }
        if (list.id === targetListId) {
          const insertAt = targetIndex ?? list.tasks.length;
          const newTasks = [...list.tasks];
          newTasks.splice(insertAt, 0, updatedTask);
          return { ...list, tasks: newTasks };
        }
        return list;
      }),
    );
  };

  return {
    lists,
    isModalOpen,
    setIsModalOpen,
    isLoggedIn,
    setIsLoggedIn,
    taskTypes,
    priorities,
    selectedType,
    setSelectedType,
    selectedPriority,
    setSelectedPriority,
    user,
    authLoading,
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
