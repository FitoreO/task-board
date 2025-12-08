import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";

type TaskEditModalProps = {
  open: boolean;
  initialName?: string;
  initialDescription?: string;
  onClose: () => void;
  onSubmit: (newName: string, newDescription: string) => void;
};

export default function UpdateTaskModal({
  open,
  initialName,
  initialDescription,
  onClose,
  onSubmit,
}: TaskEditModalProps) {
  const [name, setName] = useState(initialName ?? "");
  const [description, setDescription] = useState(initialDescription ?? "");
  const [errorUpdateNameText, setErrorUpdateNameText] = useState<string>("");
  const [errorUpdateDescriptionText, setErrorUpdateDescriptionText] =
    useState<string>("");

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
            onSubmit(name, description);
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
