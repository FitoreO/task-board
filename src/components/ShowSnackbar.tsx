import * as React from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";

interface SnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

export default function ShowSnackbar({
  open,
  onClose,
  message,
}: SnackbarProps) {
  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      message={message}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      slotProps={{
        content: {
          sx: {
            bgcolor: "green",
            textAlign: "center",
            width: "100%",
            "& .MuiSnackbarContent-message": {
              width: "inherit",
              textAlign: "center",
              textTransform: "capitalize",
            },
          },
        },
      }}
    />
  );
}
