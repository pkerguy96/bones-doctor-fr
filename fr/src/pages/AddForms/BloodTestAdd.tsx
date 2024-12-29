import {
  Paper,
  Box,
  FormControl,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import addGlobal from "../../hooks/addGlobal";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { bloodTestApiClient, BloodTestProps } from "../../services/BloodTest";
import { useNavigate } from "react-router";
import PatientSearchAutocomplete from "../../components/PatientSearchAutocomplete";
import usePrint from "../PrintGlobal";
import BloodTestSearchAutocomplete from "../../components/BloodTestSearchAutocomplete";

const BloodTestAdd = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>();
  const [analyse, setAnalyse] = useState<any>(NaN);
  const [fields, setFields] = useState([]);
  const { print, Printable } = usePrint();

  const addMutation = addGlobal({} as BloodTestProps, bloodTestApiClient);

  const handleAddRow = () => {
    if (Number.isNaN(analyse)) return;
    setFields((old) => [...old, analyse]);
    setAnalyse(NaN);
  };

  const handleRemoveRow = (index) => {
    setFields((old) => old.filter((current, _index) => _index !== index));
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    const formdata = {
      operation_id: null,
      patient_id: patient.id,
      blood_test: fields,
    };

    try {
      addMutation.mutateAsync(formdata, {
        onSuccess: (data: any) => {
          print(() => navigate("/bloodtest"));
        },
        onError: (error) => {
          console.log(error);
        },
      });
    } catch (error) {}
  };

  return (
    <Paper className="p-4">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={onSubmit}
        className="w-full flex flex-col gap-6"
      >
        <Box className="flex justify-center">
          <Typography
            id="modal-modal-title"
            component="h2"
            className="text-center !text-2xl font-bold"
          >
            Ajouter un bilan
          </Typography>
        </Box>

        <Box className="w-full flex flex-col gap-4">
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
            <PatientSearchAutocomplete
              setPatient={setPatient}
              label="Rechercher un patient"
            />
          </Box>
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
            <label htmlFor="nom" className="w-full md:w-[200px]">
              Analyses
            </label>
            <FormControl className="flex-1">
              <BloodTestSearchAutocomplete
                showExternalLabel={false}
                setBloodTest={(value) => {
                  setAnalyse(value);
                }}
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
                  <TableCell width={100}>Code</TableCell>
                  <TableCell>Analyse</TableCell>
                  <TableCell width={200}>Prix</TableCell>
                  <TableCell width={200}>Délai</TableCell>
                  <TableCell width={60} align="center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.length ? (
                  fields.map((carry, index) => (
                    <TableRow key={index} className="border-t border-gray-300">
                      <TableCell>{carry.code}</TableCell>
                      <TableCell>{carry.title}</TableCell>
                      <TableCell>
                        {carry.price} {carry.price ? "MAD" : "n/a"}
                      </TableCell>
                      <TableCell>
                        {carry.delai === null || carry.delai === ""
                          ? "n/a"
                          : carry.delai}
                      </TableCell>
                      <TableCell>
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
                    <TableCell
                      colSpan={3}
                      align="center"
                      className="!text-gray-600 p-4"
                    >
                      <p className="text-lg">
                        Désolé, aucun analyse pour le moment.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
      <Printable
        name={patient?.name}
        items={fields}
        render={(item, index) => (
          <div key={index}>
            <h3 className="font-bold">
              {index + 1}- {item.title} {"  "} ({item.code})
            </h3>
          </div>
        )}
      />
    </Paper>
  );
};

export default BloodTestAdd;
