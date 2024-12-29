import { Box } from "@mui/material";
import { CACHE_KEY_CanceledApppointments } from "../../constants";
import getGlobal from "../../hooks/getGlobal";
import {
  CanceledAppointmentsKpiClient,
  CanceledappointmentsCount,
} from "../../services/KpisService";
import LoadingSpinner from "../LoadingSpinner";
import LinechartKPI from "./LinechartKPI";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { useMemo } from "react";

const CanceledAppointmentsKpi = ({ dataset }: { dataset?: any }) => {
  const { data, isLoading } = getGlobal(
    {} as CanceledappointmentsCount,
    CACHE_KEY_CanceledApppointments,
    CanceledAppointmentsKpiClient,
    undefined
  );

  const labels = useMemo(
    () => (dataset ? Object.keys(dataset) : []),
    [dataset]
  );
  const dataset1 = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Rendez-vous annulés",
          data: dataset ? Object.values(dataset) : [],
          borderColor: "rgb(239 68 68)",
          backgroundColor: "rgb(239 68 68)",
        },
      ],
    }),
    [labels, dataset]
  );
  if (isLoading) return <LoadingSpinner />;
  return (
    <Box className="flex flex-col !w-full h-full py-2 gap-6">
      <Box className="!w-full flex flex-row justify-between items-center pt-4 px-6">
        <Box className="flex flex-col gap-1 mr-auto my-auto">
          <p className="text-xl font-semibold mr-auto">Rendez-vous annulés</p>
          <p className="text-3xl font-semibold">{data}</p>
        </Box>
        <Box className="aspect-square shadow-md w-14 flex items-center justify-center rounded-full bg-red-500">
          <EventBusyIcon
            sx={{
              fontSize: "2rem",
              color: "white",
            }}
          />
        </Box>
      </Box>

      <LinechartKPI dataset={dataset1} />
    </Box>
  );
};

export default CanceledAppointmentsKpi;
