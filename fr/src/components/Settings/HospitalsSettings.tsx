import {
  Box,
  FormControl,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
  OperationPrefApiClient,
  OperationPreference,
} from "../../services/SettingsService";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { CACHE_KEY_Hospitals, CACHE_KEY_OperationPref } from "../../constants";
import getGlobal from "../../hooks/getGlobal";
import { Hospital, hospitalApiClient } from "../../services/HospitalService";
import LoadingSpinner from "../LoadingSpinner";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import deleteItem from "../../hooks/deleteItem";
import addGlobal from "../../hooks/addGlobal";
import { AxiosError } from "axios";

const HospitalsSettings = () => {
  const { showSnackbar } = useSnackbarStore();
  const addMutation = addGlobal({} as Hospital, hospitalApiClient);
  const { data, refetch, isLoading } = getGlobal(
    {} as Hospital,
    CACHE_KEY_Hospitals,
    hospitalApiClient,
    undefined
  );
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<Hospital>({
    defaultValues: {
      name: "",
      address: "",
      contact_info: "",
    },
  });

  const onSubmit = async (data: Hospital) => {
    await addMutation.mutateAsync(data, {
      onSuccess: () => {
        showSnackbar("Clinique a été créé", "success");
        refetch();
      },
      onError: (error: any) => {
        const message =
          error instanceof AxiosError
            ? error.response?.data?.message
            : error.message;
        showSnackbar(message, "error");
      },
    });
  };
  const onDelete = async (key: number) => {
    const response = await deleteItem(key, hospitalApiClient);
    if (response) {
      refetch();
      showSnackbar("La suppression de clinique a réussi", "success");
    } else {
      showSnackbar("La suppression de clinique a échoué", "error");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box
      className="flex flex-col w-full gap-6"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box className="flex justify-center">
        <Typography
          id="modal-modal-title"
          component="h2"
          className="text-center !text-2xl font-medium"
        >
          Ajouter une clinique
        </Typography>
      </Box>

      <Box className=" flex flex-col md:flex-row gap-4 flex-wrap">
        {/* <p className=" text-start font-thin  text-sm md:text-lg">
          Entrez les détails de clinique.
        </p> */}
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ">
          <label htmlFor="name" className="w-full md:w-[200px]">
            Nom de clinique:
          </label>
          <FormControl className="w-full md:flex-1">
            <Controller
              defaultValue=""
              name="name"
              control={control}
              render={({ field }) => (
                <TextField {...field} id="name" label="hôpital" />
              )}
            />
          </FormControl>
        </Box>
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center">
          <label htmlFor="address" className="w-full md:w-[200px]">
            Adresse:
          </label>
          <FormControl className="w-full md:flex-1">
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="address"
                  type="text"
                  label="Adresse"
                />
              )}
            />
          </FormControl>
        </Box>
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center">
          <label htmlFor="nom" className="w-full md:w-[200px]">
            Telephone:
          </label>
          <FormControl className="w-full md:flex-1">
            <Controller
              name="contact_info"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField {...field} id="contact_info" label="Telephone" />
              )}
            />
          </FormControl>
        </Box>
      </Box>
      <Box className="flex">
        <Button
          type="submit"
          variant="contained"
          className="w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto"
        >
          Ajouter
        </Button>
      </Box>
      <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
        <TableContainer
          component={Paper}
          elevation={0}
          className="border border-gray-300"
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className="bg-gray-200">
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Adresse</TableCell>
                <TableCell>Telephone</TableCell>
                <TableCell width={60} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.length ? (
                data.map((row, index) => (
                  <TableRow key={index} className="border-t border-gray-300">
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell component="th">{row.address}</TableCell>
                    <TableCell component="th">{row.contact_info}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => onDelete(row.id)}>
                        <DeleteOutlineIcon
                          color="error"
                          className="pointer-events-none"
                          fill="currentColor"
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-t border-gray-300">
                  <TableCell
                    colSpan={4}
                    align="center"
                    className="!text-gray-600 p-4"
                  >
                    <p className="text-lg">
                      Désolé, aucune clinique pour le moment.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default HospitalsSettings;
