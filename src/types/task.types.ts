export type Task = {
  id: number;
  name?: string;
  description?: string;
  type?: string;
  priority?: string;
};

export type TaskList = {
  id: number;
  name: string;
  tasks: Task[];
  createdBy?: number;
  creator?: {
    id: number;
    name: string | null;
    email: string;
  };
  createdAt: string;
};

export type AddTaskProps = {
  id: number;
  sourceListId: number;
  deleteTask: (listId: number, taskId: number) => void;
  updateTask: (
    listId: number,
    taskId: number,
    newName: string,
    newDescription: string,
    newType?: string,
    newPriority?: string,
  ) => void;
  name?: string;
  description?: string;
  type?: string;
  priority?: string;
  taskTypes: string[];
  priorities: string[];
};

export type TaskModalType = {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    description: string,
    type: string,
    priority: string,
  ) => void;
  taskTypes: string[];
  priorities: string[];
};

export type TaskEditModalProps = {
  open: boolean;
  initialName?: string;
  initialDescription?: string;
  initialTaskType?: string;
  initialPriority?: string;
  onClose: () => void;
  onSubmit: (
    newName: string,
    newDescription: string,
    newType?: string,
    newPriority?: string,
  ) => void;

  taskTypes: string[];
  priorities: string[];
};
