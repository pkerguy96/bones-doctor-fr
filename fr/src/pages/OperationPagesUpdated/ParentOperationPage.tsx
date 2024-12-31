import { useState } from "react";
import StepperComponant from "../../components/StepperComponant";
import RadioPage from "./radioPage";
import BloodTest from "../OperationPages/BloodTest";
import AppointmentStepPage from "../OperationPages/AppointmentStepPage";
import VisiteValidation from "../OperationPages/VisiteValidation";
import ExamenDemander from "./ExamenDemander";
import Cliniquerensignement from "./Cliniquerensignement";
import OperationOrdonance from "./OperationOrdonance";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router";
import XrayDemand from "../OperationPages/XrayDemand";
import DocumentPage from "../OperationPages/DocumentPage";

const ParentOperationPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const queryClient = useQueryClient();

  const handleNext = (step?: number) => {
    setActiveStep((prevStep) => step ?? prevStep + 1);
    queryClient.clear();
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
    queryClient.clear();
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <StepperComponant activeStep={activeStep} setActiveStep={setActiveStep} />
      {activeStep === 0 && <XrayDemand onNext={handleNext} />}
      {activeStep === 1 && (
        <OperationOrdonance onNext={handleNext} onBack={handleBack} />
      )}
      {activeStep === 2 && (
        <BloodTest onNext={handleNext} onBack={handleBack} />
      )}
      {activeStep === 3 && (
        <DocumentPage onNext={handleNext} onBack={handleBack} />
      )}
      {activeStep === 4 && (
        <AppointmentStepPage onNext={handleNext} onBack={handleBack} />
      )}
      {activeStep === 5 && (
        <VisiteValidation onNext={handleNext} onBack={handleBack} />
      )}
      {/* {activeStep === 0 && (
        <Cliniquerensignement onNext={handleNext} onBack={handleBack} />
      )}
      {activeStep === 1 && (
        <RadioPage onNext={handleNext} onBack={handleBack} />
      )}
      {activeStep === 2 && (
        <ExamenDemander onNext={handleNext} onBack={handleBack} />
      )} */}
    </div>
  );
};

export default ParentOperationPage;
