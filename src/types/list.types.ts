import { Task } from "./task.types";

export type AddListProps = {
  list: { id: number; tasks: Task[]; name?: string };
  moveTask: (...args: any[]) => void;
  addTask: (
    listId: number,
    name: string,
    description?: string,
    type?: string,
    priority?: string,
  ) => void;
  deleteTask: (listId: number, taskId: number) => void;
  deleteList: (listId: number) => void;
  updateTask: (
    listId: number,
    taskId: number,
    newName: string,
    newDescription: string,
    newType?: string,
    newPriority?: string,
  ) => void;
  taskTypes: string[];
  priorities: string[];
};

export type ListModalType = {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
};
