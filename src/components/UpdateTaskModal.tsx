import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { type TaskEditModalProps } from "../types/task.types";

export default function UpdateTaskModal({
  open,
  initialName,
  initialDescription,
  initialTaskType,
  initialPriority,
  onClose,
  onSubmit,
  taskTypes,
  priorities,
}: TaskEditModalProps) {
  const [name, setName] = useState<string>(initialName ?? "");
  const [description, setDescription] = useState<string>(
    initialDescription ?? "",
  );
  const [errorUpdateNameText, setErrorUpdateNameText] = useState<string>("");
  const [errorUpdateDescriptionText, setErrorUpdateDescriptionText] =
    useState<string>("");
  const [selectedTaskType, setSelectedTaskType] = useState<string>(
    initialTaskType ?? "",
  );
  const [selectedPriority, setSelectedPriority] = useState<string>(
    initialPriority ?? "",
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Task Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errorUpdateNameText) setErrorUpdateNameText("");
          }}
          margin="dense"
          required
          error={!!errorUpdateNameText}
          helperText={errorUpdateNameText}
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errorUpdateDescriptionText) setErrorUpdateDescriptionText("");
          }}
          multiline
          rows={2}
          slotProps={{
            htmlInput: {
              maxLength: 80,
            },
          }}
          required
          error={!!errorUpdateDescriptionText}
          helperText={errorUpdateDescriptionText}
        />
        <Select
          fullWidth
          value={selectedTaskType}
          onChange={(e) => setSelectedTaskType(e.target.value)}
          sx={{ mb: 2 }}
        >
          {taskTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>

        <Select
          fullWidth
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          sx={{ mb: 2 }}
        >
          {priorities.map((priority) => (
            <MenuItem key={priority} value={priority}>
              {priority}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (!name.trim()) {
              setErrorUpdateNameText("Task name is required");
              return;
            }
            if (!description.trim()) {
              setErrorUpdateDescriptionText("Description is required");
              return;
            }
            onSubmit(name, description, selectedTaskType, selectedPriority);
            onClose();
            setErrorUpdateNameText("");
            setErrorUpdateDescriptionText("");
          }}
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
