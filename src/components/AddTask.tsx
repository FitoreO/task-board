import { Box, Card, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useBoardDrag } from "./hooks/useBoardDrag";
import UpdateTaskModal from "./UpdateTaskModal";
import { useState } from "react";
import { type AddTaskProps } from "../types/task.types";
import PersonIcon from "@mui/icons-material/Person";
import { flexColumn, singleLineEllipsis } from "../styles/flex";

export const ItemTypes = { BOARDTASK: "boardtask" };

function AddTask({
  id,
  sourceListId,
  deleteTask,
  updateTask,
  name,
  description,
  type,
  priority,
  taskTypes,
  priorities,
  creator,
}: AddTaskProps) {
  //makes task draggable between lists
  const { isDragging, drag } = useBoardDrag(ItemTypes.BOARDTASK, {
    id,
    sourceListId,
  });
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  // Give each priority level a color so it's easy to spot
  const priorityColors: Record<string, string> = {
    Critical: "#ff4d4d",
    High: "#ff9800",
    Medium: "#ffeb3b",
    Low: "#4caf50",
  };

  return (
    <div
      ref={(el) => {
        drag(el);
      }}
    >
      <Card
        sx={{
          opacity: isDragging ? 0.5 : 1,
          width: 130,
          height: 80,
          mt: 1,
          mx: "auto",
          ...flexColumn,
          p: 1,
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
                marginRight: "5px",
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
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this task?")
                ) {
                  deleteTask(sourceListId, id);
                }
              }}
              sx={{ p: 0 }}
            >
              <DeleteIcon sx={{ fontSize: "1.2rem" }} />
            </IconButton>
          </Box>
        </Box>
        <Typography sx={{ fontSize: "12px" }}>{description}</Typography>
        {creator && (
          <Tooltip title={`Created by: ${creator.name}`}>
            <IconButton
              sx={{
                ...flexColumn,
                marginLeft: "auto",
                marginRight: "-10px",
              }}
            >
              <PersonIcon />
            </IconButton>
          </Tooltip>
        )}
      </Card>
      <UpdateTaskModal
        open={isEditOpen}
        initialName={name}
        initialDescription={description}
        initialTaskType={type}
        initialPriority={priority}
        onClose={() => setIsEditOpen(false)}
        onSubmit={(newName, newDescription, newType, newPriority) => {
          updateTask(id, newName, newDescription, newType, newPriority);
          setIsEditOpen(false);
        }}
        taskTypes={taskTypes}
        priorities={priorities}
      />
    </div>
  );
}

export default AddTask;
