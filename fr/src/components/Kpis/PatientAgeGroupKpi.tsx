import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import getGlobal from "../../hooks/getGlobal";
import { AgeData, PatientsAgeGroupKpiClient } from "../../services/KpisService";
import { CACHE_KEY_Agegroup } from "../../constants";
import LoadingSpinner from "../LoadingSpinner";
import { useMemo } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const PatientAgeGroupKpi = () => {
  const { data: age, isLoading } = getGlobal(
    {} as AgeData,
    CACHE_KEY_Agegroup,
    PatientsAgeGroupKpiClient,
    { staleTime: 360000 }
  );

  const options = {
    layout: {
      padding: {
        bottom: 2,
      },
    },
  };
  const labels = ["0-20", "21-30", "31-40", "41-50", "51-60"];

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Nombre des patients",
          data: age
            ? age.map(
                (item: { age_group: string; count: number }) => item.count
              )
            : [],
          backgroundColor: [
            "#170087",
            "#005dcd",
            "#49dbf2",
            "#e34676",
            "#842cbc",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "#170087",
            "#005dcd",
            "#49dbf2",
            "#e34676",
            "#842cbc",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }),
    [age]
  );
  if (isLoading) return <LoadingSpinner />;
  return <Doughnut data={data} options={options} />;
};

export default PatientAgeGroupKpi;
