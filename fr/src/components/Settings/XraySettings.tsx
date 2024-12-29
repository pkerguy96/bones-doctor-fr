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
  Autocomplete,
  Chip,
  IconButton,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  OperationPreference,
  XrayPreference,
  XrayPreferenceApiClient,
  XrayPreferencesResponse,
} from "../../services/SettingsService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { AddoperationPreference } from "../../hooks/AddoperationPreference";
import { AxiosError } from "axios";
import deleteItem from "../../hooks/deleteItem";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useGlobalOperationPreference } from "../../hooks/getOperationPrefs";
import getGlobal from "../../hooks/getGlobal";
import {
  CACHE_KEY_xrayCategory,
  CACHE_KEY_XrayPreferences,
} from "../../constants";
import addGlobal from "../../hooks/addGlobal";
import LoadingSpinner from "../LoadingSpinner";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  categoryXrayApiClient,
  deleteCategoryApiClient,
} from "../../services/XrayService";
interface Category {
  id: number;
  name: string;
}
interface xrayProps {
  xray_type: string;
  price: number;
  xray_category: string[];
}
const XraySettings = () => {
  const { showSnackbar } = useSnackbarStore();
  const { data, refetch, isLoading } = getGlobal(
    {} as XrayPreferencesResponse,
    CACHE_KEY_XrayPreferences,
    XrayPreferenceApiClient,
    undefined
  );
  const {
    data: categorys,
    isLoading: isLoading2,
    refetch: refetch2,
  } = getGlobal(
    {} as Category,
    CACHE_KEY_xrayCategory,
    categoryXrayApiClient,
    undefined
  );

  const addmutation = addGlobal({}, XrayPreferenceApiClient);
  const { control, handleSubmit, reset } = useForm<xrayProps>();

  const onSubmit = async (data: xrayProps) => {
    await addmutation.mutateAsync(
      {
        xray_category: data.xray_category,
        xray_type: data.xray_type,
        price: data.price,
      },
      {
        onSuccess: () => {
          showSnackbar("L'Opération a été créé", "success");
          reset();
          refetch();
          refetch2();
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
  const categoryDelete = async (key: number) => {
    const response = await deleteItem(key, deleteCategoryApiClient);

    if (response) {
      refetch2();
      showSnackbar("La catégorie supprimée avec succès", "success");
    } else {
      showSnackbar("La suppression de catégorie a échoué", "error");
    }
  };
  const onDelete = async (key: number) => {
    const response = await deleteItem(key, XrayPreferenceApiClient);

    if (response) {
      refetch();
      showSnackbar("La suppression de la Radiographie a réussi", "success");
    } else {
      showSnackbar("La suppression de la Radiographie a échoué", "error");
    }
  };

  if (isLoading || isLoading2) return <LoadingSpinner />;
  return (
    <Box
      className="flex flex-col w-full h-full p-4 gap-4"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="font-light text-gray-600 text-md md:text-xl text-center">
        Ajouter une radiographie
      </p>
      <p className=" text-start font-thin  text-sm md:text-lg">
        Entrez les détails de la paraclinique.
      </p>
      <Box className=" flex flex-col md:flex-row gap-4 flex-wrap ">
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ">
          <label htmlFor="nom" className="w-full md:w-[160px]">
            Catégorie:
          </label>
          <FormControl className="w-full md:flex-1">
            <Controller
              name="xray_category"
              control={control}
              render={({ field }) => (
                <Autocomplete<Category | string, false, false, true>
                  freeSolo
                  options={categorys ?? []}
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : categorys?.find((c) => c.name === field.value) || ""
                  }
                  onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                      field.onChange(newValue);
                    } else if (newValue && newValue.name) {
                      field.onChange(newValue.name);
                    } else {
                      field.onChange("");
                    }
                  }}
                  onInputChange={(event, inputValue) => {
                    field.onChange(inputValue);
                  }}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") return option;
                    return option.name || "";
                  }}
                  renderOption={(props, option) => (
                    <li
                      {...props}
                      key={typeof option === "string" ? option : option.id}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span>
                          {typeof option === "string" ? option : option.name}
                        </span>
                        {typeof option !== "string" && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(event) => {
                              event.stopPropagation();
                              categoryDelete(option.id);
                            }}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
                        )}
                      </div>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Sélectionnez ou saisissez une catégorie"
                    />
                  )}
                  noOptionsText="Aucune catégorie disponible"
                />
              )}
            />
          </FormControl>
        </Box>
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ">
          <label htmlFor="nom" className="w-full md:w-[160px]">
            Radiographie:
          </label>
          <FormControl className="w-full md:flex-1">
            <Controller
              defaultValue=""
              name="xray_type"
              control={control}
              render={({ field }) => (
                <TextField {...field} id="xray_type" label="Radiographie" />
              )}
            />
          </FormControl>
        </Box>
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center">
          <label htmlFor="price" className="w-full md:w-[160px]">
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

        <Box className="flex ml-auto mt-4">
          <Button
            type="submit"
            variant="contained"
            className="w-full md:w-max !px-8 !py-2 rounded-lg "
          >
            Ajouter
          </Button>
        </Box>
      </Box>
      <TableContainer className="w-full max-h-[400px] flex-wrap overflow-auto border border-gray-300">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow className="bg-gray-300 !rounded-2xl	sticky top-0 z-10">
              <TableCell>
                <strong>Nom de la catégorie</strong>
              </TableCell>
              <TableCell>
                <strong>Nom de la radiographie</strong>
              </TableCell>

              <TableCell>
                <strong>Prix</strong>
              </TableCell>
              <TableCell className="w-20" />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((xray: XrayPreference, index: number) => (
              <TableRow key={index}>
                <TableCell>{xray.category}</TableCell>
                <TableCell>{xray.xray_type}</TableCell>

                <TableCell>{xray.price} MAD</TableCell>
                <TableCell className="w-20">
                  <Button
                    onClick={() => onDelete(xray.id!)}
                    className="w-max mx-auto"
                    variant="outlined"
                    color="error"
                    disabled={xray.id === undefined}
                  >
                    <DeleteOutlineIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
const autocompleteStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0.23)",
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.23)", // Ensures the border is visible when not focused
    },
    "&:hover fieldset": {
      borderColor: "dark", // Darker border on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "primary.main", // Border color on focus
    },
  },
};
export default XraySettings;
