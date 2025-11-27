import { Box, Card, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useBoardDrag } from "./hooks/useBoardDrag";
import UpdateTaskModal from "./UpdateTaskModal";
import { useState } from "react";

export const ItemTypes = { BOARDTASK: "boardtask" };

type AddTaskProps = {
  id: number;
  sourceListId: number;
  deleteTask: (listId: number, taskId: number) => void;
  updateTask: (
    listId: number,
    taskId: number,
    newName: string,
    newDescription: string,
  ) => void;
  name?: string;
  description?: string;
};

function AddTask({
  id,
  sourceListId,
  deleteTask,
  updateTask,
  name,
  description,
}: AddTaskProps) {
  const { isDragging, drag } = useBoardDrag(ItemTypes.BOARDTASK, {
    id,
    sourceListId,
  });
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div ref={drag as unknown as React.Ref<HTMLDivElement>}>
      <Card
        sx={{
          opacity: isDragging ? 0.5 : 1,
          width: 130,
          height: 80,
          mt: 1,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 1,
          backgroundColor: isDragging ? "#dbd7cfff" : "#fff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "18px", textTransform: "capitalize" }}>
            {name}
          </Typography>
          <Box>
            <IconButton onClick={() => setIsEditOpen(true)} sx={{ p: 0 }}>
              <EditIcon sx={{ fontSize: "1.2rem" }} />
            </IconButton>
            <IconButton
              onClick={() => deleteTask(sourceListId, id)}
              sx={{ p: 0 }}
            >
              <DeleteIcon sx={{ fontSize: "1.2rem" }} />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="subtitle2">{description}</Typography>
      </Card>
      <UpdateTaskModal
        open={isEditOpen}
        initialName={name}
        initialDescription={description}
        onClose={() => setIsEditOpen(false)}
        onSubmit={(newName: string, newDescription: string) => {
          updateTask(sourceListId, id, newName, newDescription);
          setIsEditOpen(false);
        }}
      />
    </div>
  );
}

export default AddTask;
