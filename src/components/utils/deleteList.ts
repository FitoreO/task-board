import { Task } from "../../App";

export const deleteList = (
  lists: { id: number; tasks: Task[] }[],
  listId: number
) => {
  return lists.filter((list) => list.id !== listId);
};
