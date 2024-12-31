//@ts-nocheck

import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  BodySides,
  CACHE_KEY_XrayPreferences,
  CACHE_KEY_XraysWithCategoryBACK,
  ViewTypes,
  XRayTypes,
} from "../../constants";
import { useLocation, useNavigate } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import addGlobal from "../../hooks/addGlobal";
import {
  XrayProps,
  fetchxrayfirststep,
  updateXrayClientApi,
  xrayApiClient,
} from "../../services/XrayService";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import getGlobal from "../../hooks/getGlobal";
import {
  XrayPreferenceApiClient,
  XrayPreferencesResponse,
} from "../../services/SettingsService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";
import useOperationStore from "../../zustand/usePatientOperation";
import updateItem from "../../hooks/updateItem";
import { noteoperationApiClient } from "../../services/OperationService";
import getGlobalById from "../../hooks/getGlobalById";
import CheckAction from "../../components/CheckAction";

const XrayDemand = ({ onNext }) => {
  const { addOrUpdateOperation, findPatientById, clearPatientOperation } =
    useOperationStore();

  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarStore();
  const addMutation = addGlobal({} as XrayProps, xrayApiClient, undefined);
  const checkMutation = updateItem({}, noteoperationApiClient);
  const hasCalledNext = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const patient_id = queryParams.get("id");
  const operation_id = queryParams.get("operation_id");
  const [xrays, setXrays] = useState([]);
  const [patient, _] = useState(findPatientById(patient_id));
  const { data, refetch, isLoading } = getGlobal(
    {} as XrayPreferencesResponse,
    CACHE_KEY_XrayPreferences,
    XrayPreferenceApiClient,
    undefined
  );
  const { data: HistoryXray, isLoading: isLoading2 } = operation_id
    ? getGlobalById(
        {} as any,
        CACHE_KEY_XraysWithCategoryBACK,
        fetchxrayfirststep,
        { refetchOnWindowFocus: false },
        parseInt(operation_id!)
      )
    : {};
  const updateMutation = updateItem({} as any, updateXrayClientApi);
  if (!patient_id) {
    return (
      <Typography variant="h6" color="error" align="center">
        Quelque chose s'est mal passé, veuillez refaire les étapes, si cela ne
        fonctionne pas, signalez ce bug au développeur.
      </Typography>
    );
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<XrayProps>();

  const onSubmit = async (data: XrayProps) => {
    const dataWithId = { ...xrays, patient_id };
    const payload = {
      patient_id,
      xrays, // Grouped X-rays
      note: data.note, // Optional note
    };
    if (create) {
      if (!xrays.length) {
        return showSnackbar(
          "Veuillez sélectionner au moins une radiographie",
          "warning"
        );
      }
      await addMutation.mutateAsync(payload, {
        onSuccess: (data: any) => {
          const operationId = data.data;

          navigate(`?id=${patient_id}&operation_id=${operationId}&withxrays`, {
            replace: true,
          });
          queryClient.invalidateQueries({
            queryKey: ["Waitinglist"],
            exact: false,
          });
          addOrUpdateOperation(operationId, patient_id);
          onNext();
        },
      });
    } else {
      await updateMutation.mutateAsync(
        { data: payload, id: Number(operation_id) },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(CACHE_KEY_XraysWithCategoryBACK);
            queryClient.invalidateQueries({
              queryKey: ["Waitinglist"],
              exact: false,
            });
            addOrUpdateOperation(operation_id, patient_id);
            navigate(
              `?id=${patient_id}&operation_id=${operation_id}${
                xrays.length ? "&withxrays" : ""
              }`,
              {
                replace: true,
              }
            );
            onNext();
          },
        }
      );
    }
  };

  const addRow = () => {
    const { body_side, view_type, xray_name } = getValues();
    if (!xray_name) {
      showSnackbar("Choisissez au moins une radiographie", "error");
      return;
    }
    if (!view_type || !view_type.length) {
      showSnackbar("Choisissez au moins un Type de vue", "error");
      return;
    }
    setXrays([
      ...xrays,
      { body_side, view_type, xray_name: [xray_name], id: xrays.length },
    ]);
    reset({ xray_name: [], view_type: [], body_side: [] });
  };

  const removeXRay = (id) => {
    setXrays((old) => old.filter((e) => e.id !== id));
  };
  const handleSkip = async () => {
    if (operation_id) return onNext();
    checkMutation.mutateAsync(
      { data: {}, id: parseInt(patient_id) },
      {
        onSuccess: (data: any) => {
          navigate(`?id=${patient_id}&operation_id=${data.data}`, {
            replace: true,
          });
          queryClient.invalidateQueries({
            queryKey: ["Waitinglist"],
            exact: false,
          });
          onNext();
        },
        onError: () => {
          console.log("errorrrr");
        },
      }
    );
  };

  const create = CheckAction(() => {
    setXrays(
      HistoryXray?.xray.map((xray: any, index: number) => ({
        id: index,
        body_side: xray.body_side ? xray.body_side.split(",") : [],
        view_type: xray.view_type ? xray.view_type.split(",") : [],
        xray_name: [xray.xray_name],
      }))
    );
    setValue("note", HistoryXray?.note);
    clearPatientOperation(patient_id);
  }, HistoryXray);

  useEffect(() => {
    if (patient && create) {
      const timeoutId = setTimeout(() => {
        const url = `?operation_id=${patient.operationId}&id=${patient.patientId}&withxrays`;
        navigate(url, {
          replace: true,
        });
        onNext(1);
      }, 500); // 500ms delay

      return () => clearTimeout(timeoutId);
    }
  }, [patient, create]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <Paper className="!p-6 w-full flex flex-col gap-4">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Box className="lg:col-span-3 flex justify-between">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Radiographie demandée
          </Typography>
        </Box>
        <Box className="flex gap-4 flex-wrap flex-col lg:flex-row lg:items-center">
          <Box className="w-full lg:w-0 lg:flex-1 flex flex-col gap-2 md:flex-row md:flex-wrap items-center">
            <FormControl className="w-full md:flex-1">
              <Controller
                name="xray_name"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    className="bg-white"
                    id="tags-filled"
                    options={data.map((option) => option.xray_name)}
                    value={field.value || ""}
                    getOptionLabel={(option) => {
                      return String(option);
                    }}
                    onChange={(event, newValue) =>
                      field.onChange(newValue || "")
                    }
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Type de radiographie"
                        sx={autocompleteStyles}
                      />
                    )}
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box className="w-full lg:w-0 lg:flex-1 flex flex-col gap-2 md:flex-row md:flex-wrap items-center">
            <FormControl className="w-full md:flex-1">
              <Controller
                name="view_type"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    className="bg-white"
                    multiple
                    id="tags-filled"
                    options={ViewTypes.map((option) => option.title)}
                    defaultValue={[]}
                    value={field.value || []}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    freeSolo
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                          <Chip
                            variant="outlined"
                            label={option}
                            key={key}
                            {...tagProps}
                          />
                        );
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Type de vue"
                        sx={autocompleteStyles}
                      />
                    )}
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box className="w-full lg:w-0 lg:flex-1 flex flex-col gap-2 md:flex-row md:flex-wrap items-center">
            <FormControl className="w-full md:flex-1">
              <Controller
                name="body_side"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    className="bg-white"
                    multiple
                    id="tags-filled"
                    options={BodySides.map((option) => option.title)}
                    defaultValue={[]}
                    value={field.value || []}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    freeSolo
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                          <Chip
                            variant="outlined"
                            label={option}
                            key={key}
                            {...tagProps}
                          />
                        );
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Côté du corps"
                        sx={autocompleteStyles}
                      />
                    )}
                  />
                )}
              />
            </FormControl>
          </Box>
          <Button
            sx={{ borderRadius: 16 }}
            variant="outlined"
            className="block !py-2"
            onClick={addRow}
          >
            <AddIcon />
          </Button>
        </Box>
        <Box>
          <TableContainer
            component={Paper}
            elevation={0}
            className="border border-gray-300"
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className="bg-gray-200">
                <TableRow>
                  <TableCell>Radiographie</TableCell>
                  <TableCell>Vue</TableCell>
                  <TableCell>Côté</TableCell>
                  <TableCell style={{ width: 100 }} align="center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {xrays.map((row) => (
                  <TableRow key={row.id} className="border-t border-gray-300">
                    <TableCell component="th" scope="row">
                      {row.xray_name.join(", ")}
                    </TableCell>
                    <TableCell>{row.view_type?.join(", ")}</TableCell>
                    <TableCell>{row.body_side?.join(", ") ?? ""}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => removeXRay(row.id)}>
                        <DeleteOutlineIcon
                          color="error"
                          className="pointer-events-none"
                          fill="currentColor"
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center">
          <FormControl className="w-full md:flex-1">
            <Controller
              name="note"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  id="outlined-required"
                  multiline
                  rows={3}
                  label="Note"
                  error={!!errors.note}
                  helperText={errors.note?.message}
                />
              )}
            />
          </FormControl>
        </Box>
        <Box className="flex justify-between flex-row mt-5 content-center">
          <Button
            className="w-full md:w-max !px-10 !py-3 rounded-lg "
            variant="outlined"
            onClick={() => {
              handleSkip();
            }}
          >
            <p className="text-sm ">Passer</p>
          </Button>
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
//TODO make this global
const autocompleteStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0.23)",
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
    "&:hover fieldset": {
      borderColor: "dark",
    },
    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
    },
  },
};
export default XrayDemand;
