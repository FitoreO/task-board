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
import { type TaskModalType } from "../types/task.types";
import { StyledModalBox } from "./StyledModalBox";

export default function TaskModal({
  open,
  onClose,
  onSubmit,
  taskTypes,
  priorities,
}: TaskModalType) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedTaskType, setSelectedTaskType] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");

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
      <StyledModalBox>
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
          displayEmpty
        >
          <MenuItem value="">
            <em>Select a type</em>
          </MenuItem>
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
          displayEmpty
        >
          <MenuItem value="">
            <em>Select priority</em>
          </MenuItem>
          {priorities.map((priority) => (
            <MenuItem key={priority} value={priority}>
              {priority}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={handleSubmit} fullWidth>
          Submit
        </Button>
      </StyledModalBox>
    </Modal>
  );
}
