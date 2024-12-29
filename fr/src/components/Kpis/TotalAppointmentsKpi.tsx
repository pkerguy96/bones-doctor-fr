import getGlobal from "../../hooks/getGlobal";
import AppointmentsKpiClient, {
  appointmentsCount,
} from "../../services/KpisService";
import { CACHE_KEY_AppointmentsCount } from "../../constants";
import LoadingSpinner from "../LoadingSpinner";

import { Box } from "@mui/material";
import LinechartKPI from "./LinechartKPI";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useMemo } from "react";

const TotalAppointmentsKpi = ({ dataset }: { dataset?: any }) => {
  const { data, isLoading } = getGlobal(
    {} as appointmentsCount,
    CACHE_KEY_AppointmentsCount,
    AppointmentsKpiClient,
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
          label: "Rendez-vous",
          data: dataset ? Object.values(dataset) : [],
          borderColor: "rgb(168 85 247)",
          backgroundColor: "rgb(168 85 247)",
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
          <p className="text-xl font-semibold mr-auto">Rendez-vous total</p>
          <p className="text-3xl font-semibold">{data}</p>
        </Box>
        <Box className="aspect-square shadow-md w-14 flex items-center justify-center rounded-full bg-purple-500">
          <EventAvailableIcon
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

export default TotalAppointmentsKpi;
