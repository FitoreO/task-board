import { Task } from "../../App";

export const moveTask = (
  lists: { id: number; tasks: Task[] }[],
  taskId: number,
  sourceListId: number,
  targetListId: number,
  targetIndex?: number
): { id: number; tasks: Task[] }[] => {
  // shallow copy lists and tasks
  const updated = lists.map((list) => ({ ...list, tasks: [...list.tasks] }));

  const currentLocation = updated.find((l) => l.id === sourceListId);
  const newLocation = updated.find((l) => l.id === targetListId);

  let movedTask: Task | undefined;

  if (currentLocation) {
    const idx = currentLocation.tasks.findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      movedTask = currentLocation.tasks[idx];
      currentLocation.tasks.splice(idx, 1);
    }
  }

  if (newLocation && movedTask) {
    const insertAt = targetIndex ?? newLocation.tasks.length;
    newLocation.tasks.splice(insertAt, 0, movedTask);
  }

  return updated;
};
