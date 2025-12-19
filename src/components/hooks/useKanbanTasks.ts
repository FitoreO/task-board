export const useKanbanTasks = () => {
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

  const deleteTaskHandler = async (taskId: number) => {
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
    addTaskHandler,
    updateTaskHandler,
    deleteTaskHandler,
    moveTaskHandler,
  };
};
