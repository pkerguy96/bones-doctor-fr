import { CACHE_KEY_WAITINGLIST } from "../../constants";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { confirmDialog } from "../ConfirmDialog";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import deleteItem from "../../hooks/deleteItem";

import {
  decrementPatientApiClient,
  FetchWaitingList,
} from "../../services/WaitingroomService";
import { useNavigate } from "react-router";
import getGlobalv2 from "../../hooks/getGlobalv2";
import DataTable from "../DataTable";
import { useQueryClient } from "@tanstack/react-query";
import useUserRoles from "../../zustand/UseRoles";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import { useCallback, useMemo, useState } from "react";

const AppointmentsTableKpi = () => {
  const { showSnackbar } = useSnackbarStore();
  const queryClient = useQueryClient();
  const { can } = useUserRoles();
  const navigate = useNavigate();
  const dataHook = (page: number, searchQuery: string, rowsPerPage: number) =>
    getGlobalv2(
      {},
      CACHE_KEY_WAITINGLIST,
      FetchWaitingList,
      page,
      rowsPerPage,
      searchQuery,

      {
        refetchInterval: 5000, // Fetch data every 5 seconds
      }
    );

  const columns = useMemo(
    () => [
      {
        name: "id",
        label: "#",
        options: {
          display: false,
        },
      },

      {
        name: "patient_id",
        label: "#d",
        options: {
          display: false,
        },
      },
      {
        name: "count",
        label: "#d",
        options: {
          display: false,
        },
      },
      {
        name: "order",
        label: "Ordre",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (_value: any, tableMeta: any) => {
            return (
              tableMeta.tableState.rowsPerPage * tableMeta.tableState.page +
              tableMeta.rowIndex +
              1
            );
          },
        },
      },
      {
        name: "patient_name",
        label: "Nom",
        options: {
          filter: true,
          sort: true,
        },
      },

      {
        name: "waiting_time",
        label: "Temps d'attente",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "status",
        label: "Statut",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value: string) => {
            const color = {
              waiting: "info",
              pending: "warning",
              current: "success",
            }[value];
            //@ts-ignore
            return <Chip label={value} color={color} variant="outlined" />;
          },
        },
      },
      {
        name: "Actions",
        label: "Actions",
        options: {
          filter: true,
          sort: true,
          customBodyRender: () => (
            <Box className="w-max">
              {can(["detail_patient", "doctor"]) && (
                <Tooltip title="Information du patient">
                  <IconButton className="text-3xl btn-patient-info text-gray-950 hover:text-blue-700 cursor-pointer">
                    <FolderSharedOutlinedIcon color="info" fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Supprimer le patient de la salle d'attente">
                <IconButton className=" text-3xl btn-ordonance-delete text-gray-950 hover:text-blue-700 cursor-pointer">
                  <DeleteOutlineIcon
                    color="error"
                    className="pointer-events-none"
                    fill="currentColor"
                    fontSize="inherit"
                  />
                </IconButton>
              </Tooltip>
            </Box>
          ),
        },
      },
    ],
    [can]
  );
  const handleDeletePatient = async (patientId: string) => {
    confirmDialog(
      "Voulez-vous supprimer le patient de la salle d'attente ?",
      async () => {
        try {
          const deletionSuccessful = await deleteItem(
            parseInt(patientId),
            decrementPatientApiClient
          );
          if (deletionSuccessful) {
            queryClient.invalidateQueries(CACHE_KEY_WAITINGLIST, {
              exact: false,
            });
            showSnackbar(
              "La suppression du patient de la salle d'attente a été effectuée avec succès.",
              "success"
            );
          } else {
            showSnackbar(
              "La suppression du patient de la salle d'attente a échoué.",
              "error"
            );
          }
        } catch (error) {
          showSnackbar(
            `Une erreur s'est produite lors de la suppression: ${error}`,
            "error"
          );
        }
      }
    );
  };
  const handleRowClick = useCallback(
    (rowData: any, _meta: any, event: any) => {
      const patientId = rowData[1]; // Assuming patient ID is in rowData[1]
      if (
        event.target.closest(".btn-ordonance-delete") ||
        event.target.classList.contains("btn-ordonance-delete")
      ) {
        handleDeletePatient(rowData[0]); // Assuming ID is in rowData[0]
      } else if (
        event.target.closest(".btn-patient-info") ||
        event.target.classList.contains("btn-patient-info")
      ) {
        navigate(`/Patients/Details/${patientId}`);
      } else if (can(["doctor"])) {
        navigate(`/Patients/operations/?id=${patientId}`);
      }
    },
    [handleDeletePatient, navigate, can]
  );

  return (
    <DataTable
      title="Liste des patients dans la salle d'attente"
      noMatchMessage="Désolé, aucun patient n'est enregistré"
      columns={columns}
      dataHook={dataHook}
      options={{
        elevation: 0,
        searchPlaceholder: "Rechercher un patient",

        selectableRowsHideCheckboxes: true,
        onRowClick: handleRowClick,
      }}
    />
  );
};

export default AppointmentsTableKpi;
