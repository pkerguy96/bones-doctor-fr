import { Box } from "@mui/material";
import RevenueKpi from "../components/Kpis/RevenueKpi";
import TotalAppointmentsKpi from "../components/Kpis/TotalAppointmentsKpi";
import CanceledAppointmentsKpi from "../components/Kpis/CanceledAppointmentsKpi";
import PatientAgeGroupKpi from "../components/Kpis/PatientAgeGroupKpi";
import AppointmentsTableKpi from "../components/Kpis/AppointmentsTableKpi";
import CashierKpi from "../components/Kpis/CashierKpi";
import { useNavigate } from "react-router";
import getGlobal from "../hooks/getGlobal";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  CACHE_KEY_MonthlyAppointments,
  CACHE_KEY_CanceledMonthlyAppointments,
  CACHE_KEY_AvgWaitingRoom,
} from "../constants";
import {
  NewAppointments,
  MonthlyAppointmentsKpiClient,
  CanceledAppointments,
  CanceledMonthlyAppointmentsKpiClient,
  getAvgWaitingRoomApiClient,
  AvgWaitingRoom,
} from "../services/KpisService";
import useUserRoles from "../zustand/UseRoles";
import PatientKpi from "../components/Kpis/patientKpi";
import PaymentRateKpi from "../components/Kpis/paymentRateKpi";
import AppointmentCancelRate from "../components/Kpis/AppointmentCancelRate";

const DashboardKpiPage = () => {
  const navigate = useNavigate();
  const { can } = useUserRoles();

  const { data, isLoading } = getGlobal(
    {} as NewAppointments,
    CACHE_KEY_MonthlyAppointments,
    MonthlyAppointmentsKpiClient,
    { staleTime: 30000 }
  );
  const { data: data1, isLoading: isLoading1 } = getGlobal(
    {} as CanceledAppointments,
    CACHE_KEY_CanceledMonthlyAppointments,
    CanceledMonthlyAppointmentsKpiClient,
    { staleTime: 300000 }
  );
  const { data: data2, isLoading: isLoading2 } = getGlobal(
    {} as AvgWaitingRoom,
    CACHE_KEY_AvgWaitingRoom,
    getAvgWaitingRoomApiClient,
    { staleTime: 300000 }
  );

  if (isLoading || isLoading1 || isLoading2) return <LoadingSpinner />;

  return (
    <Box className="flex flex-col gap-6">
      <Box className="grid grid-rows-1 grid-cols-1 lg:grid-cols-12 gap-6">
        <Box className="!w-full shadow-md lg:col-span-4 bg-white text-gray-950">
          <CashierKpi />
        </Box>
        <Box
          className="!w-full shadow-md lg:col-span-4 bg-white text-gray-950 cursor-pointer"
          onClick={() => navigate("/Appointmens/table")}
        >
          <TotalAppointmentsKpi dataset={data} />
        </Box>
        <Box className="!w-full shadow-md lg:col-span-4 bg-white text-gray-950">
          <CanceledAppointmentsKpi dataset={data1} />
        </Box>
      </Box>
      <Box className="grid grid-rows-1 grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Box className="flex flex-col gap-6 lg:col-span-8">
          <Box className="w-full bg-white shadow-md text-gray-950 flex flex-col overflow-hidden">
            <h1 className="text-xl font-semibold p-6">Salle d'attente</h1>
            <AppointmentsTableKpi />
          </Box>
          {can(["doctor"]) && (
            <Box className="!w-full bg-white shadow-md text-gray-950 flex flex-col p-6 gap-3 overflow-hidden">
              <h1 className="text-xl font-semibold">Graphique des revenus</h1>
              <RevenueKpi />
            </Box>
          )}
        </Box>
        <Box className="flex flex-col gap-6 lg:col-span-4">
          <Box className="!w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-lg rounded-lg text-white flex flex-col p-6 gap-4 overflow-hidden">
            <h1 className="text-2xl font-bold">Temps moyen de traitement</h1>
            <p className="text-xl font-semibold text-center">
              {data2.formatted_time}
            </p>
          </Box>
          <Box className="!w-full bg-white shadow-md lg:col-span-6 text-gray-950 flex flex-col p-6 gap-3 overflow-hidden">
            <h1 className="text-xl font-semibold">Groupe d’âge des patients</h1>
            <PatientAgeGroupKpi />
          </Box>
          <Box className="w-full bg-white shadow-md lg:col-span-6 text-gray-950 flex flex-col p-6 gap-3 overflow-hidden">
            <PatientKpi />
          </Box>
          <Box className="w-full bg-white shadow-md lg:col-span-6 text-gray-950 flex flex-col p-6 gap-3 overflow-hidden">
            <PaymentRateKpi />
          </Box>
          <Box className="w-full bg-white shadow-md lg:col-span-6 text-gray-950 flex flex-col p-6 gap-3 overflow-hidden">
            <AppointmentCancelRate />
          </Box>
        </Box>
      </Box>

      <Box className="flex w-full "></Box>
    </Box>
  );
};

export default DashboardKpiPage;
