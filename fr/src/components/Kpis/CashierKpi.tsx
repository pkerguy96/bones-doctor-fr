import { Box } from "@mui/material";
import { CACHE_KEY_Cachier, CACHE_KEY_CachierNumber } from "../../constants";
import getGlobal from "../../hooks/getGlobal";
import {
  CashierNumber,
  CashierNumberKpiClient,
  TotalcachierAmount,
} from "../../services/KpisService";
import LoadingSpinner from "../LoadingSpinner";
import LinechartKPI from "./LinechartKPI";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { useMemo } from "react";

const CashierKpi = () => {
  const { data: totalCachierData, isLoading: isLoadingCachier } = getGlobal(
    {} as any,
    CACHE_KEY_Cachier,
    TotalcachierAmount,
    undefined
  );
  const { data: cashierNumberData, isLoading: isLoadingCashierNumber } =
    getGlobal(
      {} as CashierNumber,
      CACHE_KEY_CachierNumber,
      CashierNumberKpiClient,
      undefined
    );

  const labels = useMemo(
    () => totalCachierData && Object.keys(totalCachierData),
    [totalCachierData]
  );
  const dataset1 = useMemo(
    () => ({
      labels: labels || [],
      datasets: [
        {
          label: "Recettes en espèces",
          data: totalCachierData ? Object.values(totalCachierData) : [],
          borderColor: "rgb(59 130 246)",
          backgroundColor: "rgb(59 130 246)",
        },
      ],
    }),
    [labels, totalCachierData]
  );
  if (isLoadingCachier || isLoadingCashierNumber) return <LoadingSpinner />;
  return (
    <Box className="flex flex-col !w-full h-full py-2 gap-6">
      <Box className="!w-full flex flex-row justify-between items-center pt-4 px-6">
        <Box className="flex flex-col gap-1 mr-auto my-auto">
          <p className="text-xl font-semibold mr-auto">Caisse</p>
          <p className="text-3xl font-semibold">{cashierNumberData || 0} MAD</p>
        </Box>
        <Box className="aspect-square shadow-md w-14 flex items-center justify-center rounded-full bg-blue-500">
          <PointOfSaleIcon
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

export default CashierKpi;
