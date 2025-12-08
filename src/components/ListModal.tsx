import { Box, Button, Typography, Modal, TextField } from "@mui/material";
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

export default function ListModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}) {
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
      <Box sx={style}>
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
      </Box>
    </Modal>
  );
}
