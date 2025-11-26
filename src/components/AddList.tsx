import { Box, ButtonGroup, Card, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDrop } from "react-dnd";
import AddTask, { ItemTypes } from "./AddTask";
import TaskModal from "./TaskModal";
import { Task } from "../App";
import { useState } from "react";

export const ListItemTypes = { BOARDLIST: "boardList" };

type AddListProps = {
  list: { id: number; tasks: Task[]; name?: string };
  moveTask: (
    taskId: number,
    sourceListId: number,
    targetListId: number
  ) => void;
  addTask: (listId: number, name: string, description?: string) => void;
  deleteTask: (listId: number, taskId: number) => void;
  deleteList: (listId: number) => void;
  updateTask: (
    listId: number,
    taskId: number,
    newName: string,
    newDescription: string
  ) => void;
};

function AddList({
  list,
  moveTask,
  addTask,
  deleteTask,
  deleteList,
  updateTask,
}: AddListProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.BOARDTASK,
    drop: (item: { id: number; sourceListId: number }) => {
      moveTask(item.id, item.sourceListId, list.id);
    },
  }));

  return (
    <div ref={drop as unknown as React.Ref<HTMLDivElement>}>
      <Card
        sx={{ width: 150, height: 550, p: 1, backgroundColor: "#f9f9f9" }}
        elevation={2}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="subtitle2"
            sx={{
              textTransform: "capitalize",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {list.name}
          </Typography>

          <ButtonGroup>
            <IconButton
              sx={{ padding: "0px" }}
              onClick={() => setIsTaskModalOpen(true)}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              sx={{ padding: "0px" }}
              onClick={() => deleteList(list.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ButtonGroup>
        </Box>

        <Box>
          {list.tasks.map((task) => (
            <AddTask
              key={task.id}
              id={task.id}
              sourceListId={list.id}
              deleteTask={deleteTask}
              name={task.name}
              description={task.description}
              updateTask={updateTask}
            />
          ))}
        </Box>
        <TaskModal
          open={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSubmit={(name, description) => addTask(list.id, name, description)}
        />
      </Card>
    </div>
  );
}

export default AddList;
