import {
  Avatar,
  Box,
  Button,
  FormControl,
  Input,
  Paper,
  TextField,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import addGlobal from "../hooks/addGlobal";
import { AuthProfileServiceClient } from "../services/AuthService";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import { AxiosError } from "axios";
export interface Props {
  name: string;
  email: string;
  picture: File | null;
}

const AdminProfile = () => {
  const { showSnackbar } = useSnackbarStore();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const addmutation = addGlobal({} as Props, AuthProfileServiceClient, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const storedUserData = useMemo(() => {
    const data = localStorage.getItem("user_login");
    return data ? JSON.parse(data) : null;
  }, []);
  const userProfilePicture = storedUserData?.profile || null;
  const userData = storedUserData?.user || {};

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Props>({
    defaultValues: {
      name: userData?.nom || "",
      email: userData?.email || "",
    },
  });
  const customErrorMessages = {
    name: {
      required: "Le champ Nom est requis.",
    },
    email: {
      required: "Le champ Email est requis.",
    },
  };
  const onSubmit: SubmitHandler<Props> = useCallback(
    async (data) => {
      try {
        var form: any = new FormData();
        form.append("name", data.name);
        form.append("email", data.email);
        if (data.picture) {
          form.append("picture", data.picture);
        }
        await addmutation.mutateAsync(form, {
          onSuccess(data: any) {
            const user = JSON.parse(localStorage.getItem("user_login") || "{}");
            user.user = data.data;
            user.profile = data.profile;
            localStorage.setItem("user_login", JSON.stringify(user));
            showSnackbar("Utilisateur modifié avec succès", "success");
          },
          onError: (error: any) => {
            const message =
              error instanceof AxiosError
                ? error.response?.data?.message
                : error.message;
            showSnackbar(`Oops.. ${message}`, "error");
          },
        });
      } catch (error) {
        showSnackbar(`Oops.. ${error}`, "error");
      }
    },
    [addmutation]
  );
  return (
    <Paper className="p-4">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        className="w-full flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box className="w-full flex flex-col gap-4 items-center justify-center	">
          <Avatar
            alt="Remy Sharp"
            src={
              imageFile ? URL.createObjectURL(imageFile) : userProfilePicture
            }
            sx={{ width: 120, height: 120 }}
          />
          <Button variant="contained" component="label" className="!px-4 !py-3">
            Importer l'image
            <Controller
              control={control}
              name={"picture"}
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <Input
                    {...field}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onChange(event.target.files?.[0]);

                      setImageFile(event.target.files[0]);
                    }}
                    type="file"
                    inputProps={{
                      accept: "image/*",
                    }}
                    id="picture"
                    style={{ display: "none" }}
                  />
                );
              }}
            />
          </Button>
        </Box>
        <Box className="flex flex-col gap-4">
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center">
            <label htmlFor="name" className="w-full md:w-[200px]">
              Nom:
            </label>
            <FormControl className="w-full md:flex-1">
              <Controller
                name="name"
                control={control}
                rules={{ required: customErrorMessages.name.required }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="name"
                    label="name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center">
            <label htmlFor="name" className="w-full md:w-[200px]">
              Email:
            </label>
            <FormControl className="w-full md:flex-1">
              <Controller
                name="email"
                control={control}
                rules={{ required: customErrorMessages.email.required }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="email"
                    label="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
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
            Enregistrer
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AdminProfile;
