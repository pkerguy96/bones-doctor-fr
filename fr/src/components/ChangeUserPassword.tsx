import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Paper,
  Box,
  Button,
  FormControl,
  Typography,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import addGlobal from "../hooks/addGlobal";
import { ChangePasswordApiClient } from "../services/AuthService";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import { AxiosError } from "axios";

const ChangeUserPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { showSnackbar } = useSnackbarStore();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const addmutation = addGlobal({} as any, ChangePasswordApiClient);
  const currentPassword = watch("password");
  const newPassword = watch("newPassword");

  const onSubmit = async (data: any) => {
    if (currentPassword !== newPassword) {
      showSnackbar("Les mots de passe ne correspondent pas.", "error");
      return;
    }

    await addmutation.mutateAsync(
      {
        new_password: data.newPassword,
        new_password_confirmation: data.newPassword,
      },
      {
        onSuccess: (data: any) => {
          showSnackbar(data.message, "success");
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

  return (
    <Paper className="p-4">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        className="w-full flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box className="flex justify-center">
          <Typography
            id="modal-modal-title"
            component="h2"
            className="text-center !text-2xl font-bold"
          >
            Changer le mot de passe
          </Typography>
        </Box>
        <Box className="flex flex-col gap-4">
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center">
            <label htmlFor="password" className="w-full md:w-[200px]">
              Nouveau mot de passe
            </label>
            <FormControl className="w-full md:flex-1" variant="outlined">
              <InputLabel htmlFor="password">Mot de passe</InputLabel>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: "Le mot de passe est requis" }}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "Masquer le mot de passe"
                              : "Afficher le mot de passe"
                          }
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Mot de passe"
                    error={!!errors.password}
                  />
                )}
              />
            </FormControl>
            {errors.password && (
              <Typography color="error">
                {errors.password.message &&
                typeof errors.password.message === "string"
                  ? errors.password.message
                  : ""}
              </Typography>
            )}
          </Box>
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center">
            <label htmlFor="newPassword" className="w-full md:w-[200px]">
              Confirmer mot de passe
            </label>
            <FormControl className="w-full md:flex-1" variant="outlined">
              <InputLabel htmlFor="newPassword">
                Confirmer mot de passe
              </InputLabel>
              <Controller
                name="newPassword"
                control={control}
                defaultValue=""
                rules={{
                  required: "Le nouveau mot de passe est requis",
                  validate: (value) =>
                    value === currentPassword ||
                    "Les mots de passe doivent correspondre",
                }}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showNewPassword
                              ? "Masquer le nouveau mot de passe"
                              : "Afficher le nouveau mot de passe"
                          }
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Nouveau mot de passe"
                    error={!!errors.newPassword}
                  />
                )}
              />
            </FormControl>
            {errors.newPassword && (
              <Typography color="error">
                {errors.newPassword.message &&
                typeof errors.newPassword.message === "string"
                  ? errors.newPassword.message
                  : ""}
              </Typography>
            )}
          </Box>
        </Box>
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

export default ChangeUserPassword;
