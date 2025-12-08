import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function TaskModal({
  open,
  onClose,
  onSubmit,
  taskTypes,
  priorities,
}: {
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
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTaskType, setSelectedTaskType] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) return;
    onSubmit(name, description, selectedTaskType, selectedPriority);
    setName("");
    setDescription("");
    setSelectedTaskType("");
    setSelectedPriority("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6">Create a task</Typography>

        <TextField
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ mb: 2, mt: 1 }}
          required
        />

        <TextField
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          multiline
          rows={2}
          required
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

        <Button variant="contained" onClick={handleSubmit} fullWidth>
          Submit
        </Button>
      </Box>
    </Modal>
  );
}
