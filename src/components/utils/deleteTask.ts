import { Task } from "../../App";

export const deleteTask = (
  lists: { id: number; tasks: Task[]; name?: string }[],
  listId: number,
  taskId: number
) => {
  return lists.map((list) =>
    list.id === listId
      ? {
          ...list,
          tasks: list.tasks.filter((task) => task.id !== taskId),
        }
      : list
  );
};
