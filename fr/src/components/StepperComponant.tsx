import React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router";
import updateItem from "../hooks/updateItem";
import { noteoperationApiClient } from "../services/OperationService";
import { useQueryClient } from "@tanstack/react-query";

interface StepperComponentProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
}

const steps = [
  "Clinique",
  "Paraclinique",
  "Examen demandé",
  "Bilan",
  "Ordonance",
  "Rendez-vous",
  "Paiement",
];

const StepperComponant: React.FC<StepperComponentProps> = ({
  activeStep,
  setActiveStep,
}) => {
  // Use React.FC and provide StepperComponentProps
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const { search } = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(search);
  const operation_id = queryParams.get("operation_id");
  const patient_id = queryParams.get("id");
  const queryClient = useQueryClient();
  const addMutation = updateItem({}, noteoperationApiClient);
  const isStepOptional = (step: number) => {
    return null;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setSkipped(newSkipped);
  };

  const handleStepClick = async (index: number) => {
    if (!operation_id) {
      await addMutation.mutateAsync(
        { data: {}, id: parseInt(patient_id) },
        {
          onSuccess: (data: any) => {
            navigate(`?id=${patient_id}&operation_id=${data.data}`, {
              replace: true,
            });
            queryClient.invalidateQueries({
              queryKey: ["Waitinglist"],
              exact: false,
            });
            setActiveStep(index);
          },
        }
      );
    } else setActiveStep(index);
  };
  const handleBack = () => {
    // Handle back logic here if needed
  };

  const handleSkip = () => {
    // Handle skip logic here if needed
  };

  const handleReset = () => {
    // Handle reset logic here if needed
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel
                {...labelProps}
                onClick={() => handleStepClick(index)} // Handle click event on step
                style={{ cursor: "pointer" }} // Make the step clickable
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default StepperComponant;
