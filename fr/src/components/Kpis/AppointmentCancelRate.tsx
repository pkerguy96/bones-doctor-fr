import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { CACHE_KEY_CancellationRateKpi } from "../../constants";
import { getCancellationRateApiClient } from "../../services/KpisService";
import LoadingSpinner from "../LoadingSpinner";
import getGlobal from "../../hooks/getGlobal";
import React from "react";

const CancellationRateKpi = () => {
  const { data: apiData, isLoading } = getGlobal(
    {} as any,
    CACHE_KEY_CancellationRateKpi,
    getCancellationRateApiClient,
    { staleTime: 360000 }
  );

  // Memoize calculations
  const { totalAppointments, canceledAppointments, cancellationRate } =
    useMemo(() => {
      if (!apiData) {
        return {
          totalAppointments: 0,
          canceledAppointments: 0,
          cancellationRate: 0,
        };
      }

      const totalAppointments = parseFloat(apiData.totalAppointments || 0);
      const canceledAppointments = parseFloat(
        apiData.canceledAppointments || 0
      );
      const cancellationRate = parseFloat(apiData.cancellationRate || 0);

      return { totalAppointments, canceledAppointments, cancellationRate };
    }, [apiData]);

  // Memoize chart data
  const chartData = useMemo(() => {
    const completedAppointments =
      totalAppointments > 0 ? totalAppointments - canceledAppointments : 0;
    return {
      labels: ["Rendez-vous annulés", "Rendez-vous complétés"],
      datasets: [
        {
          label: "Appointments",
          data: [canceledAppointments, completedAppointments],
          backgroundColor: ["#EF4444", "#1E3A8A"],
          borderColor: ["#CBD5E1", "#CBD5E1"],
          borderWidth: 1,
        },
      ],
    };
  }, [canceledAppointments, totalAppointments]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <h1 className="text-xl font-semibold w-max">
          Taux d'annulation total des rendez-vous
        </h1>
        <p className="text-xl font-semibold text-red-600 w-max">
          {cancellationRate.toFixed(2)}%
        </p>
      </div>
      <Doughnut
        data={chartData}
        options={{ layout: { padding: { bottom: 2 } } }}
      />
    </div>
  );
};

export default React.memo(CancellationRateKpi);
