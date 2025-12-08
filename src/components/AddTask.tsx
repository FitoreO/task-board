import { Box, Card, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useBoardDrag } from "./hooks/useBoardDrag";
import UpdateTaskModal from "./UpdateTaskModal";
import { useState } from "react";
import { singleLineEllipsis } from "./AddList";

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
  type?: string;
  priority?: string;
};

function AddTask({
  id,
  sourceListId,
  deleteTask,
  updateTask,
  name,
  description,
  type,
  priority,
}: AddTaskProps) {
  const { isDragging, drag } = useBoardDrag(ItemTypes.BOARDTASK, {
    id,
    sourceListId,
  });
  const [isEditOpen, setIsEditOpen] = useState(false);

  const priorityColors: Record<string, string> = {
    Critical: "#ff4d4d",
    High: "#ff9800",
    Medium: "#ffeb3b",
    Low: "#4caf50",
  };

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
          p: 1,
          backgroundColor: isDragging ? "#dbd7cfff" : "#fff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "3px",
          }}
        >
          <Typography sx={{ fontSize: "10px" }}>#{type}</Typography>
          <Tooltip title={priority}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "2px",
                backgroundColor: priority
                  ? priorityColors[priority]
                  : "transparent",
              }}
            />
          </Tooltip>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Tooltip title={name}>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: "bold",
                ...singleLineEllipsis,
                maxWidth: "90px",
              }}
            >
              {name}
            </Typography>
          </Tooltip>
          <Box sx={{ marginTop: "-5px" }}>
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
        <Typography sx={{ fontSize: "12px" }}>{description}</Typography>
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
