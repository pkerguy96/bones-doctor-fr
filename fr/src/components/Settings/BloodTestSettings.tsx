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
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { XrayPreferencesResponse } from "../../services/SettingsService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { AxiosError } from "axios";
import deleteItem from "../../hooks/deleteItem";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import getGlobal from "../../hooks/getGlobal";
import { CACHE_KEY_BloodTestPreference } from "../../constants";
import addGlobal from "../../hooks/addGlobal";
import LoadingSpinner from "../LoadingSpinner";
import { bloodTestprefApiClient } from "../../services/BloodTest";

interface xrayProps {
  title: string;
  price?: number;
  code?: string;
  delai?: string;
}
const BloodTestSettings = () => {
  const { showSnackbar } = useSnackbarStore();
  const { data, refetch, isLoading } = getGlobal(
    {} as XrayPreferencesResponse,
    CACHE_KEY_BloodTestPreference,
    bloodTestprefApiClient,
    undefined
  );

  const addmutation = addGlobal({}, bloodTestprefApiClient);
  const { control, handleSubmit, reset } = useForm<xrayProps>();

  const onSubmit = async (data: xrayProps) => {
    await addmutation.mutateAsync(
      {
        title: data.title,
        price: data.price,
        code: data.code,
        delai: data.delai,
      },
      {
        onSuccess: () => {
          showSnackbar("L'Opération a été créé", "success");
          reset();
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
    const response = await deleteItem(key, bloodTestprefApiClient);

    if (response) {
      refetch();
      showSnackbar("La suppression de la Radiographie a réussi", "success");
    } else {
      showSnackbar("La suppression de la Radiographie a échoué", "error");
    }
  };

  if (isLoading) return <LoadingSpinner />;
  return (
    <Box
      className="flex flex-col w-full h-full p-4 gap-4"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="font-light text-gray-600 text-md md:text-xl text-center">
        Ajouter des analyses de laboratoire
      </p>
      <p className=" text-start font-thin  text-sm md:text-lg">
        Entrez les informations des analyses.
      </p>
      <Box className=" flex flex-col md:flex-row gap-4 flex-wrap ">
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ">
          <label htmlFor="nom" className="w-full md:w-[160px]">
            Titre:
          </label>
          <FormControl className="w-full md:flex-1">
            <Controller
              defaultValue=""
              name="title"
              control={control}
              render={({ field }) => (
                <TextField {...field} id="title" label="Titre" />
              )}
            />
          </FormControl>
        </Box>
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ">
          <label htmlFor="nom" className="w-full md:w-[160px]">
            Code:
          </label>
          <FormControl className="w-full md:flex-1">
            <Controller
              defaultValue=""
              name="code"
              control={control}
              render={({ field }) => (
                <TextField {...field} id="code" label="Code" />
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
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center">
          <label htmlFor="price" className="w-full md:w-[160px]">
            Délai:
          </label>
          <FormControl className="w-full md:flex-1">
            <Controller
              //@ts-ignore
              defaultValue=""
              name="delai"
              control={control}
              render={({ field }) => (
                <TextField {...field} id="delai" type="text" label="Délai" />
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
                <strong>Titre</strong>
              </TableCell>
              <TableCell>
                <strong>Code</strong>
              </TableCell>

              <TableCell>
                <strong>Prix</strong>
              </TableCell>
              <TableCell>
                <strong>Délai</strong>
              </TableCell>
              <TableCell className="w-20" />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((xray: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{xray.title}</TableCell>
                <TableCell>{xray.code}</TableCell>

                <TableCell>{xray.price} MAD</TableCell>
                <TableCell>{xray.delai}</TableCell>
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
export default BloodTestSettings;
