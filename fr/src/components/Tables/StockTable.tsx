import { Tooltip, IconButton, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import DataTable from "../DataTable";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { confirmDialog } from "../ConfirmDialog";
import { CACHE_KEY_Products } from "../../constants";
import { StockApiClient } from "../../services/StockService";
import getGlobalv2 from "../../hooks/getGlobalv2";
import { useQueryClient } from "@tanstack/react-query";
import deleteItem from "../../hooks/deleteItem";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import useUserRoles from "../../zustand/UseRoles";

import { useCallback } from "react";

const stockTable = () => {
  const navigate = useNavigate();
  const { can } = useUserRoles();

  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarStore();

  const columns = [
    { name: "id", label: "Id", options: { display: false } },
    {
      name: "bar_code",
      label: "Code à barres",
      options: { filter: true, sort: true },
    },
    {
      name: "product_name",
      label: "Désignation",
      options: { filter: true, sort: true },
    },

    {
      name: "product_family",
      label: "Famille",
      options: { filter: true, sort: true },
    },
    {
      name: "product_nature",
      label: "Nature",
      options: { filter: true, sort: true },
    },
    { name: "qte", label: "Quantité", options: { filter: true, sort: true } },
    {
      name: "min_stock",
      label: "Min Quantité",
      options: { filter: true, sort: true },
    },
    {
      name: "StockActions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: any, tableMeta: any) => {
          const StockID = tableMeta.rowData[0]; // id

          return (
            <Box className="w-max">
              {can(["add_stock", "doctor"]) ? (
                <Tooltip title="Ajouter du stock" arrow>
                  <IconButton
                    className="btn-stock-add text-gray-950 hover:text-blue-700 cursor-pointer"
                    onClick={() => navigate(`/Stock/product?id=${StockID}`)}
                  >
                    <Inventory2OutlinedIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
              {can(["modify_product", "doctor"]) ? (
                <Tooltip title="Modifier le stock" arrow>
                  <IconButton
                    className="btn-patient-edit text-gray-950 hover:text-blue-700 cursor-pointer"
                    onClick={() => navigate(`/Stock/ajouter?id=${StockID}`)}
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
              {can(["delete_product", "doctor"]) ? (
                <Tooltip title="Supprimer le produit" arrow>
                  <IconButton
                    className="btn-patient-delete text-gray-950 hover:text-blue-700 cursor-pointer"
                    onClick={() => handleStockDelete(StockID)}
                  >
                    <DeleteOutlineIcon color="error" />
                  </IconButton>
                </Tooltip>
              ) : null}
            </Box>
          );
        },
      },
    },
  ];

  const handleStockDelete = async (id: any) => {
    confirmDialog("Voulez-vous vraiment supprimer le produit ?", async () => {
      try {
        const deletionSuccessful = await deleteItem(id, StockApiClient);
        if (deletionSuccessful) {
          queryClient.invalidateQueries(CACHE_KEY_Products);
          showSnackbar("La suppression du produit a réussi", "success");
        } else {
          showSnackbar("La suppression du produit a échoué", "error");
        }
      } catch (error) {
        showSnackbar(
          `Erreur lors de la suppression du produit: ${error}`,
          "error"
        );
      }
    });
  };

  const dataHook = (page: number, searchQuery: string, rowsPerPage: number) =>
    getGlobalv2(
      {},
      CACHE_KEY_Products,
      StockApiClient,
      page,
      rowsPerPage,
      searchQuery,
      undefined
    );
  const rowClassGenerator = useCallback((row: any) => {
    const qte = row[5];
    const minStock = row[6];

    if (qte <= minStock) {
      return "row-red";
    } else if (qte > minStock && qte <= minStock * 1.5) {
      return "row-yellow";
    }
    return "";
  }, []);

  return (
    <>
      {can([
        "access_product",
        "doctor",
        "add_product",
        "delete_product",
        "modify_product",
      ]) ? (
        <Box className="relative">
          <DataTable
            title="Liste des produits"
            noMatchMessage="Désolé, aucun produit n'est dans nos données."
            columns={columns}
            dataHook={dataHook}
            options={{
              searchPlaceholder: "Rechercher un produit",
              customToolbar: () => {
                return can(["add_product", "doctor"]) ? (
                  <Tooltip title="Nouveau produit">
                    <IconButton onClick={() => navigate("/Stock/ajouter")}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                ) : null;
              },
              selectableRowsHideCheckboxes: true,
              setRowProps: (row) => {
                const className = rowClassGenerator(row);

                return { className };
              },
              onRowClick: (s: any, _m: any, e: any) => {},
            }}
          />
        </Box>
      ) : (
        <div style={{ textAlign: "center", color: "red", marginTop: "20px" }}>
          Vous n'avez pas la permission de consulter cette page.
        </div>
      )}
    </>
  );
};

export default stockTable;
