//@ts-nocheck

import {
  Box,
  Button,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { AddoperationPreference } from "../../hooks/AddoperationPreference";
import {
  DeleteOperationsPrefApiClient,
  OperationPrefApiClient,
  OperationPreference,
} from "../../services/SettingsService";

import deleteItem from "../../hooks/deleteItem";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { useGlobalOperationPreference } from "../../hooks/getOperationPrefs";
import LoadingSpinner from "../LoadingSpinner";
import { AxiosError } from "axios";
import getGlobal from "../../hooks/getGlobal";
import { CACHE_KEY_OperationPref, referral } from "../../constants";
import addGlobal from "../../hooks/addGlobal";
const OperationsListSettings = () => {
  const { showSnackbar } = useSnackbarStore();

  const { data, refetch, isLoading } = getGlobal(
    {},
    CACHE_KEY_OperationPref,
    OperationPrefApiClient,
    undefined
  );
  const { control, handleSubmit, reset } = useForm<OperationPreference>();
  const Addmutation = addGlobal({}, OperationPrefApiClient);
  const addOperationMutation = AddoperationPreference(() => {
    reset({
      name: "",
      price: 0.0,
      code: "",
    });
  });
  const onSubmit = async (data: OperationPreference) => {
    await Addmutation.mutateAsync(
      {
        code: data.code,
        price: data.price,
        operation_type: data.name,
      },
      {
        onSuccess: () => {
          showSnackbar("L'Opération a été créé", "success");
          refetch();
        },
        onError: (error: any) => {
          const message =
            error instanceof AxiosError
              ? error.response?.data?.message
              : error.message;
          showSnackbar(message, "error");
        },
      }
    );
  };
  const onDelete = async (key: number) => {
    const response = await deleteItem(key, OperationPrefApiClient);
    if (response) {
      refetch();
      showSnackbar("La suppression d'Opération a réussi", "success");
    } else {
      showSnackbar("La suppression d'Opération a échoué", "error");
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
          Ajouter une opération
        </Typography>
      </Box>

      <Box className=" flex flex-col md:flex-row gap-4 flex-wrap ">
        {/* <p className=" text-start font-thin  text-sm md:text-lg">
          Entrez les détails de l'opération.
        </p> */}
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ">
          <label htmlFor="nom" className="w-full md:w-[200px]">
            Opération:
          </label>
          <FormControl className="w-full md:flex-1">
            <Controller
              defaultValue=""
              name="name"
              control={control}
              render={({ field }) => (
                <TextField {...field} id="name" label="Opération" />
              )}
            />
          </FormControl>
        </Box>
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center">
          <label htmlFor="nom" className="w-full md:w-[200px]">
            Prix:
          </label>
          <FormControl className="w-full md:flex-1">
            <Controller
              //@ts-ignore
              defaultValue={0.0}
              name="price"
              control={control}
              render={({ field }) => (
                <TextField {...field} id="price" type="number" label="Prix" />
              )}
            />
          </FormControl>
        </Box>
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center">
          <label htmlFor="nom" className="w-full md:w-[200px]">
            Code:
          </label>
          <FormControl className="w-full md:flex-1">
            <Controller
              name="code"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField {...field} id="code" label="Code" />
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
                <TableCell width={200}>code</TableCell>
                <TableCell width={200}>Prix</TableCell>
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
                      {row.operation_type}
                    </TableCell>
                    <TableCell component="th">{row.code}</TableCell>
                    <TableCell component="th">{row.price}</TableCell>
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
                      Désolé, aucune operation pour le moment.
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

export default OperationsListSettings;
