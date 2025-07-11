import { styled } from "@mui/material/styles/index.js";
import Button from "@mui/material/Button/index.js";

export const DeleteButton = styled(Button)({
  backgroundColor: '#4caf50',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#388e3c',
  },
});

export const CancelButton = styled(Button)({
  backgroundColor: '#f4511e',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#d32f2f',
  },
});
