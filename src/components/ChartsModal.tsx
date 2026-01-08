import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Chart from "./TasksStatisticsChart";
import { Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

type ModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export default function ChartsModal({ open, setOpen }: ModalProps) {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ textAlign: "center", fontWeight: 700, fontSize: "18px" }}
          >
            Ticket Age Distribution
          </Typography>
          <Chart />
        </Box>
      </Modal>
    </div>
  );
}
