//@ts-nocheck
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  IconButton,
  TableRow,
  TextField,
  Typography,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";

import AddIcon from "@mui/icons-material/Add";
import { useCallback, useMemo, useState } from "react";
import addGlobal from "../../hooks/addGlobal";
import {
  DeleteradioApiClient,
  fetchxrayfirststep,
  updateParacliniqueApiClient,
  xrayApiClient,
  XrayPreferencesByCategory,
  XrayProps,
  xraysWithCategoryApiClient,
} from "../../services/XrayService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { useNavigate } from "react-router";

import {
  CACHE_KEY_XraysWithCategory,
  CACHE_KEY_XraysWithCategoryBACK,
} from "../../constants";
import getGlobal from "../../hooks/getGlobal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { CliniquerensignementProps } from "./Cliniquerensignement";
import getGlobalById from "../../hooks/getGlobalById";
import CheckAction from "../../components/CheckAction";

import deleteItem from "../../hooks/deleteItem";
import { useQueryClient } from "@tanstack/react-query";

interface Field {
  type: string;
  name: string;
  price: number;
  note: string;
}

const RadioPage: React.FC<CliniquerensignementProps> = ({ onNext, onBack }) => {
  const [radiology, setRadiology] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarStore();
  const queryClient = useQueryClient();
  const queryParams = useMemo(() => new URLSearchParams(location.search), []);
  const patient_id = queryParams.get("id");
  const operation_id = queryParams.get("operation_id");
  const { data, isLoading } = getGlobal(
    {} as XrayPreferencesByCategory,
    CACHE_KEY_XraysWithCategory,
    xraysWithCategoryApiClient,
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
  const addMutation = addGlobal({} as XrayProps, xrayApiClient, undefined);
  const updateMutation = addGlobal(
    {} as XrayProps,
    updateParacliniqueApiClient
  );

  const radiologyChange = useCallback((value: string | null) => {
    setRadiology(value || "");
  }, []);

  const handleAddRow = useCallback(() => {
    if (!radiology) return;
    setFields((old) => [
      ...old,
      { type: radiology, name: "", price: 0, note: "" },
    ]);
    setRadiology("");
  }, [radiology]);

  const handleRemoveRow = useCallback((index: number) => {
    setFields((old) => old.filter((_current, _index) => _index !== index));
  }, []);

  const changeRadiologyName = useCallback(
    (value: string, type: string, index: number) => {
      const price = data[type]?.find((e: any) => e.name === value)?.price || 0;

      const newRows = [...fields].map((e, _index) => {
        if (index === _index) {
          e.price = price;
          e.name = value;
        }
        return e;
      });
      setFields(newRows);
    },
    [data, fields]
  );

  const changeRadiologyNote = useCallback(
    (value: string, index: number) => {
      const newRows = [...fields].map((e, _index) => {
        if (index === _index) {
          e.note = value;
        }
        return e;
      });
      setFields(newRows);
    },
    [fields]
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formatedxrays = [...fields].filter((carry) => carry.name);

    const formatedData: any = {
      patient_id: patient_id,
      operation_id: operation_id,
      xrays: formatedxrays,
    };
    if (create) {
      if (!formatedxrays.length) {
        showSnackbar("Veuillez choisir un type de radio", "error");
        return;
      }
      await addMutation.mutateAsync(formatedData, {
        onSuccess: (data: any) => {
          queryClient.invalidateQueries(CACHE_KEY_XraysWithCategoryBACK);
          navigate(`?id=${patient_id}&operation_id=${data.data}&withxrays`, {
            replace: true,
          });
          onNext();
        },
        onError: (error) => {
          console.log(error);
        },
      });
    } else {
      if (!formatedxrays.length) {
        await deleteItem(parseInt(operation_id!), DeleteradioApiClient);
        queryClient.invalidateQueries(CACHE_KEY_XraysWithCategoryBACK);
        onNext();
        return;
      }
      await updateMutation.mutateAsync(formatedData, {
        onSuccess: (data: any) => {
          queryClient.invalidateQueries(CACHE_KEY_XraysWithCategoryBACK);
          navigate(`?id=${patient_id}&operation_id=${data.data}&withxrays`, {
            replace: true,
          });

          onNext();
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }
  };

  const create = CheckAction(() => {
    setFields(
      HistoryXray.map((xray: any) => ({
        name: xray.xray_name,
        type: xray.xray_type,
        price: xray.price,
        note: "",
      }))
    );
  }, HistoryXray);

  if (isLoading || isLoading2) return <LoadingSpinner />;
  return (
    <Paper className="!p-6 w-full flex flex-col gap-4">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={submit}
        className="flex flex-col gap-6 relative"
      >
        <Tooltip title="Retour">
          <IconButton className="!absolute -top-1 left-0" onClick={onBack}>
            <KeyboardBackspaceOutlinedIcon
              color="primary"
              className="pointer-events-none"
              fill="currentColor"
            />
          </IconButton>
        </Tooltip>
        <Box className="flex justify-center">
          <Typography
            id="modal-modal-title"
            component="h2"
            className="text-center !text-2xl font-bold"
          >
            Diagnostic demandé
          </Typography>
        </Box>
        <Box className="flex flex-col items-center gap-6 flex-wrap">
          <Box className="w-full flex flex-wrap items-center gap-4">
            <FormControl className="flex-1">
              {/*     <InputLabel id="demo-simple-select-helper-label">
                Paraclinique
              </InputLabel> */}
              {/*    <Select
                className="w-full"
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={radiology}
                label="Paraclinique"
                onChange={radiologyChange}
              >
                {Object.keys(data).length > 0
                  ? Object.keys(data).map((radio, index) => (
                      <MenuItem key={`radio_${index}`} value={radio}>
                        {radio}
                      </MenuItem>
                    ))
                  : [
                      <MenuItem key="no-data" disabled>
                        Aucune donnée disponible
                      </MenuItem>,
                      <MenuItem
                        key="add-data"
                        onClick={() => navigate("/settings/xrays")}
                        style={{ color: "blue" }}
                      >
                        Ajouter des données
                      </MenuItem>,
                    ]}
              </Select> */}
              <Autocomplete
                className="w-full"
                id="demo-autocomplete-paraclinique"
                options={Object.keys(data)} // Use Object.keys(data) as the options
                getOptionLabel={(option) => option} // Define how to display options
                value={radiology || null} // Bind selected value
                onChange={(_event, newValue) => {
                  radiologyChange(newValue);
                }} // Handle change
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Paraclinique"
                    variant="outlined"
                    placeholder="Choisissez une option"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={`radio_${option}`}>
                    {option}
                  </li>
                )}
                noOptionsText={
                  <div>
                    <div style={{ padding: "8px 16px" }}>
                      Aucune donnée disponible
                    </div>
                    <div
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        padding: "8px 16px",
                      }}
                      onClick={() => navigate("/settings/xrays")}
                    >
                      Ajouter des données
                    </div>
                  </div>
                }
              />
            </FormControl>
            <Button
              className="!px-4 !py-2 !min-w-max !rounded-full"
              variant="outlined"
              onClick={handleAddRow}
            >
              <AddIcon />
            </Button>
          </Box>
          <Box className="w-full flex flex-col gap-2">
            <TableContainer
              component={Paper}
              elevation={0}
              className="border border-gray-300"
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead className="bg-gray-200">
                  <TableRow>
                    <TableCell width={300}>Operation</TableCell>

                    <TableCell>Note</TableCell>
                    <TableCell width={60} align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.length > 0 ? (
                    fields.map((carry, index) => (
                      <TableRow
                        key={index}
                        className="border-t border-gray-300"
                      >
                        <TableCell>
                          <FormControl className="w-full" size="medium">
                            <InputLabel id={`rows.${index}.name.label`}>
                              {carry.type}
                            </InputLabel>
                            <Select
                              labelId={`rows.${index}.name.label`}
                              label={carry.type}
                              id={`row.${index}.name`}
                              value={carry.name}
                              onChange={(e) =>
                                changeRadiologyName(
                                  e.target.value,
                                  carry.type,
                                  index
                                )
                              }
                            >
                              {data[carry.type]?.map(
                                (radio: any, _index: any) => (
                                  <MenuItem
                                    key={`radio_${_index}`}
                                    value={radio.name}
                                  >
                                    {radio.name}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <FormControl
                            className="w-full md:flex-1"
                            size="medium"
                          >
                            <TextField
                              id={`note_${index}`}
                              value={carry.note}
                              onChange={(e) =>
                                changeRadiologyNote(e.target.value, index)
                              }
                            />
                          </FormControl>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => handleRemoveRow(index)}>
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
                      <TableCell colSpan={3} align="center">
                        Désolé, aucun diagnostic pour le moment.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/*  <Box className="flex justify-between items-center">
              <h2 className="font-semibold text-base text-start">
                Montant Total
              </h2>
              <span className="font-semibold text-sm text-end">
                {fields.reduce((carry, current) => carry + current.price, 0)}{" "}
                MAD
              </span>
            </Box> */}
          </Box>
        </Box>
        <Box className="flex justify-between flex-row content-center">
          <Button
            className="w-full md:w-max !px-10 !py-3 rounded-lg "
            variant="outlined"
            onClick={() => {
              onNext();
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
      {/* <div
        id="page"
        className="hidden w-full flex-col gap-4 bg-white rounded-sm"
      >
        <div className="w-full flex flex-col gap-6">
          <div className="w-full flex gap-4 items-center flex-col">
            <p className="font-semibold">
              Fait a beni mellal Le {FormattedDate[0]}/{FormattedDate[1]}/
              {FormattedDate[2]}
            </p>
            <p className="font-semibold">
              Nom & Prenom: {row?.nom}
              {row?.prenom}
            </p>
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
              {printable.map((details: any, index: number) => (
                <div key={index}>
                  <h3 className="font-bold">
                    {index + 1}- {details}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}
    </Paper>
  );
};

export default RadioPage;
