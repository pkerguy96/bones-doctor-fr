import React, { useEffect, useState, useCallback } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_APPOINTMENTS } from "../constants";
import { AxiosError } from "axios";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import addGlobal from "../hooks/addGlobal";
import appointmentAPIClient from "../services/AppointmentService";
import PatientSearchAutocomplete from "./PatientSearchAutocomplete";

interface ModalComponentProps {
  open: boolean;
  onClose: () => void;
  dateTime: string;
}

const AppointmentModal: React.FC<ModalComponentProps> = ({
  open,
  onClose,
  dateTime,
}) => {
  const { showSnackbar } = useSnackbarStore();
  const queryClient = useQueryClient();

  const [patient, setPatient] = useState<any | null>(null);
  const [dateTimeValue, setDateTimeValue] = useState<string>("");
  const [note, setNote] = useState("");

  const addMutation = addGlobal({}, appointmentAPIClient);

  const handleNoteChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNote(event.target.value);
    },
    []
  );

  const handleDateTimeChange = useCallback(
    (newDateTime: moment.Moment | null) => {
      if (newDateTime) {
        setDateTimeValue(newDateTime.format("YYYY-MM-DDTHH:mm:ss"));
      }
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    if (!patient?.id || !dateTimeValue) {
      showSnackbar("Veuillez sélectionner un patient et une date", "warning");
      return;
    }

    const formData = {
      patient_id: patient.id,
      date: dateTimeValue,
      note,
    };

    try {
      await addMutation.mutateAsync(formData, {
        onSuccess: () => {
          showSnackbar("Le rendez-vous a été créé", "success");
          queryClient.invalidateQueries(CACHE_KEY_APPOINTMENTS);
          setPatient(null);
          setNote("");
          onClose();
        },
        onError: (error: AxiosError | Error) => {
          const message =
            error instanceof AxiosError
              ? error.response?.data?.message || "Une erreur est survenue"
              : error.message;
          showSnackbar(message, "warning");
        },
      });
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || "Une erreur est survenue"
          : error.message;
      showSnackbar(message, "warning");
    }
  }, [
    patient,
    dateTimeValue,
    note,
    addMutation,
    showSnackbar,
    queryClient,
    onClose,
  ]);

  useEffect(() => {
    if (open) {
      setDateTimeValue(moment(dateTime).format("YYYY-MM-DDTHH:mm:ss"));
    }
  }, [open, dateTime]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex justify-center items-center"
    >
      <Box
        sx={{ width: 400, bgcolor: "background.paper", p: 2 }}
        className="flex flex-col items-center gap-4 rounded-lg border-0"
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Détails du rendez-vous
        </Typography>
        <PatientSearchAutocomplete
          setPatient={setPatient}
          showExternalLabel={false}
        />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker
            value={moment(dateTimeValue)}
            ampm={false}
            sx={{ width: "100%" }}
            onChange={handleDateTimeChange}
          />
        </LocalizationProvider>
        <TextField
          id="large-text"
          label="Note"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={note}
          onChange={handleNoteChange}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Confirmer
        </Button>
      </Box>
    </Modal>
  );
};

export default AppointmentModal;
