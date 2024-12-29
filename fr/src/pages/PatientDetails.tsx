import { Box } from "@mui/material";
import { useState } from "react";
import "react-vertical-timeline-component/style.min.css";
import { useParams } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import AppointmentVerticalTimeline from "../components/PatientDetails/AppointmentVerticalTimeline";
import PatientsdetailsComponent from "../components/PatientsdetailsComponent";
import React from "react";
import OperationVerticalTimeline from "../components/PatientDetails/OperationVerticalTimeline";
import getGlobalById from "../hooks/getGlobalById";
import patientdetailsApiClient, {
  Patientinfo,
} from "../services/PatientDetailsService";
import { CACHE_KEY_PatientDetails } from "../constants";
import RenseignementsVerticalTimeline from "../components/PatientDetails/RenseignementsVerticalTimeline";
const PatientDetails = React.memo(() => {
  const [activeBtn, setActiveBtn] = useState("three");

  const { id } = useParams();
  if (!id) {
    return <div>No ID specified.</div>;
  }
  const { data, isLoading } = id
    ? getGlobalById(
        {} as Patientinfo,
        [CACHE_KEY_PatientDetails, id],
        patientdetailsApiClient,
        undefined,
        parseInt(id)
      )
    : { data: null, isLoading: true };
  const handleBtnClick = (ButtonName: string) => {
    setActiveBtn(ButtonName);
  };
  if (isLoading) {
    return <LoadingSpinner />;
  }
  const { appointments, operations, operationNotes } = data;

  return (
    <>
      <Box className="parent w-full flex flex-col gap-4">
        <PatientsdetailsComponent info={data} isLoading={isLoading} />
        <Box className="w-full bg-white shadow-md gap-4 flex flex-col rounded-lg p-4">
          <Box className="w-full rounded-md overflow-hidden flex">
            {["one", "three", "four"].map((btnName) => (
              <Box
                key={btnName}
                component={"button"}
                className="px-4 py-2 flex-1 text-center cursor-pointer"
                sx={{
                  color: activeBtn === btnName ? "#fff" : "#9ea8b2",
                  backgroundColor:
                    activeBtn === btnName ? "#76c5bf" : "#f5f5f5",
                }}
                onClick={() => handleBtnClick(btnName)}
              >
                {btnName === "one"
                  ? "Rendez-vous"
                  : btnName === "three"
                  ? "Opérations"
                  : "Renseignements"}
              </Box>
            ))}
          </Box>
          {activeBtn === "one" && (
            <>
              {appointments?.length === 0 ? (
                <p className="flex justify-center font-bold">
                  Aucun rendez-vous enregistré pour ce patient.
                </p>
              ) : (
                <AppointmentVerticalTimeline
                  Appointments={appointments}
                  isLoading={isLoading}
                />
              )}
            </>
          )}

          {activeBtn === "three" && (
            <>
              {operations?.length === 0 ? (
                <p className="flex justify-center font-bold">
                  Aucune opération enregistrée pour ce patient.
                </p>
              ) : (
                <OperationVerticalTimeline
                  Operations={operations}
                  isLoading={isLoading}
                />
              )}
            </>
          )}
          {activeBtn === "four" && (
            <>
              {operationNotes?.length === 0 ? (
                <p className="flex justify-center font-bold">
                  Aucune opération enregistrée pour ce patient.
                </p>
              ) : (
                <RenseignementsVerticalTimeline
                  Operations={operationNotes}
                  isLoading={isLoading}
                />
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
});

export default PatientDetails;
