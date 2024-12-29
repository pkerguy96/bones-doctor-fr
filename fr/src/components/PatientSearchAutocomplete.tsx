import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Autocomplete,
  TextField,
  FormControl,
  Box,
  MenuItem,
} from "@mui/material";
import LoadingSpinner from "./LoadingSpinner";
import useDebounce from "../hooks/useDebounce";
import addGlobal from "../hooks/addGlobal";
import {
  PatientNameWaitingRoom,
  FetchPatientsWaitingRoom,
} from "../services/WaitingroomService";

interface PatientSearchAutocompleteProps {
  label?: string;
  setPatient: (patient: { id: number; name: string } | null) => void;
  defaultValue?: { id: number; name: string } | null;
  className?: string;
  labelClassName?: string;
  formControlClassName?: string;
  onOptionsChange?: (options: { id: number; name: string }[]) => void;
  showExternalLabel?: boolean;
  options?: { id: number; name: string; phone?: string }[];
  ApiClient?: (params: {
    searchQuery: string;
  }) => Promise<{ data: { id: number; name: string }[] }>;
  empty?: string;
}

const PatientSearchAutocomplete: React.FC<PatientSearchAutocompleteProps> = ({
  label = "Rechercher un patient",
  empty = "Aucun patient trouvé",
  setPatient,
  defaultValue = null,
  labelClassName,
  showExternalLabel = true,
  formControlClassName,
  onOptionsChange,
  options = [],
  ApiClient = FetchPatientsWaitingRoom,
}) => {
  const [localOptions, setLocalOptions] = useState(options);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(defaultValue);
  const [isLoading, setLoading] = useState(false);
  const searchMutation = addGlobal({} as PatientNameWaitingRoom, ApiClient);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (options.length) {
      setLocalOptions(options);
    }
  }, [options]);

  const noOptionsText = useMemo(() => {
    if (isLoading || debouncedSearchQuery.length === 0) {
      return label;
    }
    return localOptions.length === 0 ? empty : "";
  }, [isLoading, debouncedSearchQuery, localOptions]);

  const handleInputChange = useCallback((_, newInputValue) => {
    setSearchQuery(newInputValue);
  }, []);

  const handleChange = useCallback(
    (_, newValue) => {
      setSelectedPatient(newValue);
      setPatient(newValue);
    },
    [setPatient]
  );

  useEffect(() => {
    const fetchPatients = async () => {
      if (!debouncedSearchQuery) {
        setLocalOptions([]);
        onOptionsChange?.([]);
        return;
      }
      setLoading(true);
      try {
        const response = (await searchMutation.mutateAsync({
          searchQuery: debouncedSearchQuery,
        })) as { data: { id: number; name: string }[] };

        const patients = response?.data ?? [];
        setLocalOptions(patients);
        onOptionsChange?.(patients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (defaultValue) {
      setSelectedPatient(defaultValue);
    }
  }, [defaultValue]);

  return (
    <>
      {showExternalLabel && (
        <label
          htmlFor="patient-search"
          className={labelClassName || "w-full md:w-[200px]"}
        >
          {label}
        </label>
      )}
      <FormControl className={formControlClassName || "w-full md:flex-1"}>
        <Autocomplete
          value={selectedPatient}
          disablePortal
          options={localOptions}
          noOptionsText={noOptionsText}
          getOptionLabel={(option) => option.name || ""}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          sx={{ width: "100%" }}
          loading={isLoading}
          loadingText={<LoadingSpinner size="2rem" />}
          onInputChange={handleInputChange}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} label={label} />}
          renderOption={(props, option) => (
            <MenuItem
              component="li"
              {...props}
              className="flex flex-row items-center gap-6 w-full px-4 py-2"
            >
              <span>{option.name}</span>
              <span style={{ color: "#888" }}>{option.phone ?? ""}</span>
            </MenuItem>
          )}
        />
      </FormControl>
    </>
  );
};

export default PatientSearchAutocomplete;
