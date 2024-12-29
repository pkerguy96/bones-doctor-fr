import {
  Paper,
  Box,
  FormControl,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
  AddOutsourceOperationForm,
  SearchHospitalApiClient,
} from "../../services/OutsourceOperationService";
import addGlobal from "../../hooks/addGlobal";
import { hospitalOperationApiClient } from "../../services/HospitalService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import PatientSearchAutocomplete from "../../components/PatientSearchAutocomplete";
import { useMemo } from "react";

interface TransformedOutsourceOperation {
  operation_id: any; // Nullable
  hospital_id?: number;
  patient_id?: number;
  operation_type: string;
  description: string;
  operation_date: string;
  total_price: number;
  amount_paid: number;
  fee: number;
  patient?: { id: number; name: string } | null; // Selected patient
  hospital?: { id: number; name: string } | null;
}
const AddOutsourceOperation = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarStore();
  const navigate = useNavigate();

  const defaultValues: AddOutsourceOperationForm = useMemo(
    () => ({
      patient: null,
      hospital: null,
      operation_type: "",
      description: "",
      operation_date: new Date().toISOString().split("T")[0],
      total_price: 0,
      amount_paid: 0,
      fee: 0,
    }),
    []
  );
  const addmutation = addGlobal(
    {} as AddOutsourceOperationForm,
    hospitalOperationApiClient
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddOutsourceOperationForm>({
    defaultValues,
  });

  const onSubmit = async (data: AddOutsourceOperationForm) => {
    const transformedData: TransformedOutsourceOperation = {
      operation_id: null,
      hospital_id: data.hospital?.id || 0,
      patient_id: data.patient?.id || 0,
      operation_type: data.operation_type,
      description: data.description,
      operation_date: data.operation_date,
      total_price: Number(data.total_price),
      amount_paid: Number(data.amount_paid),
      fee: Number(data.fee),
    };

    try {
      await addmutation.mutateAsync(transformedData, {
        onSuccess: () => {
          showSnackbar("Opération créée avec succès", "success");
          queryClient.invalidateQueries(["CACHE_KEY_Hospitaloperations"]);
          navigate("/External");
        },
        onError: (Error: any) => {
          console.log(Error.response.data.message);

          showSnackbar(Error.response.data.message, "error");
        },
      });
    } catch (error) {}
  };

  return (
    <Paper className="p-4">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-6"
      >
        <Box className="flex justify-center">
          <Typography
            id="modal-modal-title"
            component="h2"
            className="text-center !text-2xl font-bold"
          >
            Ajouter une opération
          </Typography>
        </Box>

        <Box className="w-full flex flex-col gap-4">
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
            <label htmlFor="patient" className="w-full md:w-[200px]">
              Patient
            </label>
            <FormControl className="w-full md:flex-1">
              <Controller
                name="patient"
                control={control}
                rules={{ required: "Veuillez sélectionner un patient." }}
                render={({ field }) => (
                  <PatientSearchAutocomplete
                    setPatient={field.onChange}
                    showExternalLabel={false}
                  />
                )}
              />
            </FormControl>
          </Box>

          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
            <label htmlFor="hospital" className="w-full md:w-[200px]">
              Clinique
            </label>
            <FormControl className="w-full md:flex-1">
              <Controller
                name="hospital"
                control={control}
                rules={{ required: "Veuillez sélectionner un clinique." }}
                render={({ field }) => (
                  <PatientSearchAutocomplete
                    label="Rechercher un clinique"
                    setPatient={field.onChange}
                    showExternalLabel={false}
                    ApiClient={SearchHospitalApiClient as any}
                    empty={"Aucun clinique trouvé"}
                  />
                )}
              />
            </FormControl>
          </Box>

          {/* Operation Type */}
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
            <label htmlFor="operation_type" className="w-full md:w-[200px]">
              Type d'opération
            </label>
            <FormControl className="w-full md:flex-1">
              <Controller
                name="operation_type"
                control={control}
                rules={{ required: "Veuillez entrer le type d'opération." }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="operation_type"
                    label="Type d'opération"
                    error={!!errors.operation_type}
                    helperText={errors.operation_type?.message}
                  />
                )}
              />
            </FormControl>
          </Box>

          {/* Description */}
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
            <label htmlFor="description" className="w-full md:w-[200px]">
              Description
            </label>
            <FormControl className="w-full md:flex-1">
              <Controller
                name="description"
                control={control}
                rules={{ required: "Veuillez entrer une description." }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="description"
                    label="Description"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </FormControl>
          </Box>

          {/* Date */}
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
            <label htmlFor="date" className="w-full md:w-[200px]">
              Date
            </label>
            <FormControl className="w-full md:flex-1">
              <Controller
                name="operation_date"
                control={control}
                rules={{ required: "Veuillez sélectionner une date." }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="operation_date"
                    type="date"
                    error={!!errors.operation_date}
                    helperText={errors.operation_date?.message}
                  />
                )}
              />
            </FormControl>
          </Box>

          {/* total_price */}
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
            <label htmlFor="total_price" className="w-full md:w-[200px]">
              Prix ​​total
            </label>
            <FormControl className="w-full md:flex-1">
              <Controller
                name="total_price"
                control={control}
                rules={{ required: "Veuillez entrer le prix." }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="total_price"
                    label="Prix"
                    type="number"
                    error={!!errors.total_price}
                    helperText={errors.total_price?.message}
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
            <label htmlFor="total_price" className="w-full md:w-[200px]">
              Les honoraires
            </label>
            <FormControl className="w-full md:flex-1">
              <Controller
                name="fee"
                control={control}
                rules={{ required: "Veuillez entrer le prix." }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="fee"
                    label="honoraires"
                    type="number"
                    error={!!errors.fee}
                    helperText={errors.fee?.message}
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
            <label htmlFor="amount_paid" className="w-full md:w-[200px]">
              Montant payé
            </label>
            <FormControl className="w-full md:flex-1">
              <Controller
                name="amount_paid"
                control={control}
                rules={{ required: "Veuillez entrer le prix." }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="amount_paid"
                    label="Prix"
                    type="number"
                    error={!!errors.amount_paid}
                    helperText={errors.amount_paid?.message}
                  />
                )}
              />
            </FormControl>
          </Box>
        </Box>
        {/* Submit Button */}
        <Box className="flex">
          <Button
            type="submit"
            variant="contained"
            className="w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto"
          >
            Enregistrer
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddOutsourceOperation;
