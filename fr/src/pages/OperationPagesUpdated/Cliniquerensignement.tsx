//@ts-nocheck
import {
  Paper,
  Box,
  Typography,
  FormControl,
  TextField,
  Button,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import updateItem from "../../hooks/updateItem";
import { noteoperationApiClient } from "../../services/OperationService";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import getGlobalById from "../../hooks/getGlobalById";
import { CACHE_KEY_operationNote } from "../../constants";
import {
  editnoteApiclient,
  getnoteApiClient,
} from "../../services/XrayService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useEffect, useState } from "react";
import CheckAction from "../../components/CheckAction";

interface Props {
  note: string;
}
export interface CliniquerensignementProps {
  onNext: () => void;
  onBack: () => void;
}
const Cliniquerensignement: React.FC<CliniquerensignementProps> = ({
  onNext,
  onBack,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queryParams = new URLSearchParams(location.search);
  const patient_id = queryParams.get("id");
  const operation_id = queryParams.get("operation_id");
  if (!patient_id) {
    throw new Error("Patient ID is required and must not be null");
  }

  const { data, isLoading } = operation_id
    ? getGlobalById(
        {} as any,
        CACHE_KEY_operationNote,
        getnoteApiClient,
        undefined,
        parseInt(operation_id!)
      )
    : {};
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<Props>();
  const addMutation = updateItem({}, noteoperationApiClient);
  const editMutation = updateItem({}, editnoteApiclient);
  const onSubmit = async (data: any) => {
    try {
      if (create) {
        addMutation.mutateAsync(
          {
            data: { note: data.note, operation: operation_id },
            id: parseInt(patient_id),
          },
          {
            onSuccess: (data: any) => {
              navigate(`?id=${patient_id}&operation_id=${data.data}`, {
                replace: true,
              });
              queryClient.invalidateQueries(CACHE_KEY_operationNote);

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
      } else {
        editMutation.mutateAsync(
          {
            data: {
              note: data.note,
              operation_id: operation_id,
            },
            id: parseInt(patient_id),
          },
          {
            onSuccess: () => {
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
      }
    } catch (error) {}
  };
  const handleSkip = async () => {
    if (operation_id) return onNext();
    addMutation.mutateAsync(
      { data: { note: "" }, id: parseInt(patient_id) },
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
    setValue("note", data.note);
  }, data);

  if (isLoading) return <LoadingSpinner />;
  return (
    <Paper className="!p-6 w-full flex flex-col gap-4">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        <Box className="flex justify-center">
          <Typography
            id="modal-modal-title"
            component="h2"
            className="text-center !text-2xl font-bold"
          >
            Renseignement clinique
          </Typography>
        </Box>
        <Box className="flex flex-col gap-4">
          <Box className="w-full flex flex-col gap-2">
            <label htmlFor="note" className="w-full">
              Note
            </label>
            <FormControl className="w-full md:flex-1">
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="outlined-required"
                    multiline
                    rows={3}
                    label="Note"
                    value={field.value}
                    error={!!errors.note}
                    helperText={errors.note?.message}
                  />
                )}
              />
            </FormControl>
          </Box>
        </Box>
        <Box className="flex justify-between flex-row content-center">
          <Button
            className="w-full md:w-max !px-10 !py-3 rounded-lg "
            variant="outlined"
            onClick={handleSkip}
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

export default Cliniquerensignement;
