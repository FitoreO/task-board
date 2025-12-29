import { useState, useEffect } from "react";
import { type TaskList } from "../../types/task.types";

export const useKanbanLists = (isLoggedIn: boolean) => {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(true);
      fetch("http://localhost:3000/lists", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => setLists(data))
        .catch((err) => console.error("Failed to load lists:", err))
        .finally(() => setIsLoading(false));
    }
  }, [isLoggedIn]);

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

  return {
    lists,
    setLists,
    isLoading,
    addListHandler,
    deleteListHandler,
  };
};
