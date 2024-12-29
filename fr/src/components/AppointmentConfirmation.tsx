import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import { APIClient } from "../services/Http";
import { AxiosError } from "axios";
import { CACHE_KEY_APPOINTMENTS } from "../constants";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbarStore } from "../zustand/useSnackbarStore";

interface ModalComponentProps {
  open: boolean;
  onClose: () => void;
  data: {
    id: number;
    patient_id: number;
    note: string;
    date: string;
    patient_name: string;
  };
}
const AppointmentConfirmation = ({
  open,
  onClose,
  data,
}: ModalComponentProps) => {
  const queryClient = useQueryClient();

  const { showSnackbar } = useSnackbarStore();
  const [date, time] = data?.date.split("T");

  const deleteAppointement = async () => {
    try {
      const apiclient = new APIClient("Appointment");
      await apiclient.DeleteOne(data?.id);
      queryClient.invalidateQueries(CACHE_KEY_APPOINTMENTS);
      showSnackbar("Le rendez-vous est supprimé", "warning");
    } catch (error: any) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : error.message;
      showSnackbar(message, "error");
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex justify-center items-center"
      >
        <Box
          sx={{ width: 400, bgcolor: "background.paper", p: 2 }}
          className="flex flex-col items-center gap-3 rounded-lg border-0"
        >
          <Box className=" w-full flex flex-row justify-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Détails du rendez-vous
            </Typography>
            <IconButton onClick={() => onClose()}>
              <ClearIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            label="patient_name"
            id="patient_name-text"
            value={data?.patient_name}
            disabled
          />

          <TextField
            id="large-text"
            label="date"
            value={`${date}  ${time}`}
            disabled
            fullWidth
          />

          <TextField
            id="large-text"
            label="Note"
            multiline
            value={data?.note ?? ""}
            rows={4}
            variant="outlined"
            disabled
            fullWidth
          />
          <Box className=" mx-4 w-full flex gap-4 justify-center	 ">
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={deleteAppointement}
            >
              Supprimer
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AppointmentConfirmation;
