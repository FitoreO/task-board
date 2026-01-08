import { useState, useEffect } from "react";
import { type User } from "../../types/user.types";
import { type Task } from "../../types/task.types";

export const useKanbanMetadata = (isLoggedIn: boolean) => {
  const [taskTypes, setTaskTypes] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | "">("");
  const [allTasks, setAllTasks] = useState<Task[]>([]);

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
    fetch("http://localhost:3000/task-types")
      .then((res) => res.json())
      .then(setTaskTypes)
      .catch((err) => console.error("Failed to load task types:", err));

    fetch("http://localhost:3000/priorities")
      .then((res) => res.json())
      .then(setPriorities)
      .catch((err) => console.error("Failed to load priorities:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/tasks", { credentials: "include" })
      .then((res) => res.json())
      .then(setAllTasks)
      .catch((err) => console.error("Failed to load all tasks:", err));
  }, []);

  return {
    taskTypes,
    priorities,
    selectedType,
    setSelectedType,
    selectedPriority,
    setSelectedPriority,
    allUsers,
    selectedUser,
    setSelectedUser,
    allTasks,
  };
};
