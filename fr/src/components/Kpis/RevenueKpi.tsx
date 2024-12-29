import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import getGlobal from "../../hooks/getGlobal";
import { Revenue, TotalRevenueKpiClient } from "../../services/KpisService";
import { CACHE_KEY_RevenueKpi } from "../../constants";
import LoadingSpinner from "../LoadingSpinner";
import { useMemo } from "react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const RevenueKpi = () => {
  const { data: newdata, isLoading } = getGlobal(
    {} as Revenue,
    CACHE_KEY_RevenueKpi,
    TotalRevenueKpiClient,
    {
      staleTime: 3600000, // 1 hour
    }
  );

  const labels = useMemo(
    () => (newdata ? Object.keys(newdata[0]) : []),
    [newdata]
  );

  // Memoized chart data
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Le mois dernier",
          data: newdata ? Object.values(newdata[0]) : [],
          backgroundColor: "#015093",
        },
        {
          label: "Le mois en cours",
          data: newdata ? Object.values(newdata[1]) : [],
          backgroundColor: "#528f8a",
        },
      ],
    }),
    [labels, newdata]
  );

  // Chart options
  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
      },
    }),
    []
  );
  if (isLoading) return <LoadingSpinner />;
  return <Bar options={options} data={data} />;
};

export default RevenueKpi;
