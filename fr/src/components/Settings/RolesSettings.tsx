//@ts-nocheck
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useCallback, useRef } from "react";
import addGlobal from "../../hooks/addGlobal";
import {
  CreateRole,
  CreateRoleApiClient,
  DeleteRoleApiClient,
  UserRoleData,
  getUsersWithRolesClient,
} from "../../services/RolesService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { AxiosError } from "axios";
import getGlobal from "../../hooks/getGlobal";
import { CACHE_KEY_UsersRolePermission } from "../../constants";
import LoadingSpinner from "../LoadingSpinner";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import deleteItem from "../../hooks/deleteItem";
const RolesSettings = () => {
  const useref = useRef<HTMLInputElement>(null);
  const Addmutation = addGlobal({} as CreateRole, CreateRoleApiClient);
  const { data, isLoading, refetch } = getGlobal(
    {} as UserRoleData,
    CACHE_KEY_UsersRolePermission,
    getUsersWithRolesClient,
    undefined
  );
  const { showSnackbar } = useSnackbarStore();

  const onSubmit = async () => {
    const value = useref?.current?.value;

    if (value) {
      await Addmutation.mutateAsync(
        { rolename: value },
        {
          onSuccess(data: any) {
            showSnackbar(data?.message, "success");
            refetch();
          },
          onError(error: any) {
            const message =
              error instanceof AxiosError
                ? error.response?.data?.message
                : error.message;
            showSnackbar(message, "error");
          },
        }
      );
    } else {
      showSnackbar("fill the form first", "error");
    }
  };
  const deleteRole = useCallback(async ($id: number) => {
    const roledelte = await deleteItem($id, DeleteRoleApiClient);
    if (roledelte) {
      showSnackbar("Le rôle a été supprimé.", "info");
      refetch();
    } else {
      showSnackbar(
        "Oups, quelque chose s'est mal passé.",

        "error"
      );
    }
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box className="flex flex-col w-full gap-6" component="form">
      <Box className="flex justify-center">
        <Typography
          id="modal-modal-title"
          component="h2"
          className="text-center !text-2xl font-medium"
        >
          Gestion des Rôles
        </Typography>
      </Box>

      <Box className=" flex flex-col md:flex-row gap-4 flex-wrap ">
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ">
          <label htmlFor="nom" className="w-full md:w-[200px]">
            Rôle:
          </label>
          <Box className="w-full md:flex-1">
            <TextField
              inputRef={useref}
              name="rolename"
              fullWidth
              id="outlined-basic"
              label="Role"
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>
      <Box className="flex">
        <Button
          onClick={() => onSubmit()}
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
                <TableCell width={300}>infirmière ayant ce rôle</TableCell>
                <TableCell>Date</TableCell>
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
                      {row.rolename}
                    </TableCell>
                    <TableCell component="th">
                      {row.patients.map((patient, patientIndex) => (
                        <span key={patientIndex}>
                          {patient.nom}
                          {patientIndex !== row.patients.length - 1 && ", "}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell component="th">{row.created_at}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => deleteRole(row.id)}>
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
                      Désolé, aucun role pour le moment.
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

export default RolesSettings;
