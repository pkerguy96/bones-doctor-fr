import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Autocomplete,
  TextField,
  FormControl,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import useDebounce from "../hooks/useDebounce";
import addGlobal from "../hooks/addGlobal";
import { bloodTestpreflistApiClient } from "../services/BloodTest";

interface BloodTestSearchAutocompleteProps {
  label?: string;
  setBloodTest: (
    bloodTest: { code: string; title: string; price?: number } | null
  ) => void;
  defaultValue?: { code: string; title: string; price?: number } | null;
  className?: string;
  labelClassName?: string;
  formControlClassName?: string;

  showExternalLabel?: boolean;
  options?: { code: string; title: string; price?: number }[];
  ApiClient?: (params: {
    searchQuery: string;
  }) => Promise<{ data: { code: string; title: string; price?: number }[] }>;
  empty?: string;
}

const BloodTestSearchAutocomplete: React.FC<
  BloodTestSearchAutocompleteProps
> = ({
  label = "Rechercher une analyse",
  empty = "Aucune analyse trouvée",
  setBloodTest,
  defaultValue = null,
  labelClassName,
  showExternalLabel = true,
  formControlClassName,

  options = [],
  ApiClient = bloodTestpreflistApiClient,
}) => {
  const [localOptions, setLocalOptions] = useState(options);
  const [value, setValue] = useState(defaultValue);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const searchMutation = addGlobal({}, ApiClient);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const noOptionsText = useMemo(() => {
    if (isLoading) {
      return "Chargement...";
    }
    if (debouncedSearchQuery.length === 0) {
      return label;
    }
    return localOptions.length === 0 ? empty : "";
  }, [isLoading, debouncedSearchQuery, localOptions]);

  const handleInputChange = useCallback((_, newInputValue) => {
    setSearchQuery(newInputValue);
  }, []);

  const handleChange = useCallback(
    (_, newValue) => {
      setBloodTest(newValue);
    },
    [setBloodTest]
  );

  useEffect(() => {
    const fetchBloodTests = async () => {
      if (!debouncedSearchQuery) {
        setLocalOptions([]);
        return;
      }
      setLoading(true);
      try {
        const response = (await searchMutation.mutateAsync({
          searchQuery: debouncedSearchQuery,
        })) as { data: { code: string; title: string; price?: number }[] };

        const bloodTests = response?.data ?? [];

        setLocalOptions(bloodTests);
      } catch (error) {
        console.error("Error fetching blood tests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBloodTests();
  }, [debouncedSearchQuery]);

  return (
    <>
      {showExternalLabel && (
        <label
          htmlFor="blood-test-search"
          className={labelClassName || "w-full md:w-[200px]"}
        >
          {label}
        </label>
      )}
      <FormControl className={formControlClassName || "w-full md:flex-1"}>
        <Autocomplete
          value={value}
          disablePortal
          options={localOptions}
          noOptionsText={noOptionsText}
          getOptionLabel={(option) => option.code + " - " + option.title}
          sx={{ width: "100%" }}
          loading={isLoading}
          loadingText={<CircularProgress size="1.5rem" />}
          onInputChange={handleInputChange}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} label={label} />}
          renderOption={(props, option) => {
            return (
              <MenuItem {...props} className="flex items-center gap-6 w-full">
                <div>{option.title}</div>
                <div style={{ color: "#888" }}>
                  {option.code ? `Code: ${option.code}` : "N/A"}
                </div>
              </MenuItem>
            );
          }}
        />
      </FormControl>
    </>
  );
};

export default BloodTestSearchAutocomplete;
