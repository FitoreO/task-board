import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  border: "2px solid #000",
  padding: theme.spacing(4),
}));
