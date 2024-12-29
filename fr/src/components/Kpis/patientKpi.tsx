import { useEffect, useState } from "react";
import ReferralPatient from "./ReferralPatient";
import TotalpatientsKpi from "./TotalpatientsKpi";
import LoadingSpinner from "../LoadingSpinner";

const PatientKpi = () => {
  return (
    <>
      <TotalpatientsKpi setLoading={""} />
      <ReferralPatient setLoading={""} />
    </>
  );
};

export default PatientKpi;
