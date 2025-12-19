import { Button, Typography, Modal, TextField } from "@mui/material";
import { useState } from "react";
import { type ListModalType } from "../types/list.types";
import { StyledModalBox } from "./StyledModalBox";

export default function ListModal({ open, onClose, onSubmit }: ListModalType) {
  const [name, setName] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setErrorText("A list name is required");
      return;
    }
    onSubmit(name);
    setName("");
    setErrorText("");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <StyledModalBox>
        <Typography variant="h6">Create a list</Typography>
        <TextField
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errorText) setErrorText("");
          }}
          fullWidth
          sx={{ mb: 2, mt: 1 }}
          required
          error={!!errorText}
          helperText={errorText}
        />
        <Button variant="contained" onClick={handleSubmit} fullWidth>
          Submit
        </Button>
      </StyledModalBox>
    </Modal>
  );
}
