import {
  VerticalTimeline,
  VerticalTimelineElement,
  //@ts-ignore
} from "react-vertical-timeline-component";
import { Operation } from "../../services/OperationService";

import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import LoadingSpinner from "../LoadingSpinner";
import { useMemo } from "react";

import { Box } from "@mui/material";

interface OperationVerticalTimelineProps {
  Operations: Operation[];
  isLoading: boolean;
}

const OperationVerticalTimeline = ({
  Operations,
  isLoading,
}: OperationVerticalTimelineProps) => {
  if (isLoading) return <LoadingSpinner />;
  const Operationtimeline = useMemo(
    () => (
      <Box className="max-h-[500px] overflow-auto rounded-md bg-[#f5f5f5] p-4">
        <VerticalTimeline className="!w-full !m-0">
          {Operations.map((operation: Operation) =>
            operation.operation_type.map(
              (operation_type: any, index: number) => (
                <VerticalTimelineElement
                  key={index}
                  className="vertical-timeline-element--work"
                  date={operation_type.date}
                  contentStyle={{
                    borderTop: "3px solid #76c5bf",
                  }}
                  dateClassName="custom-date-color !py-0 lg:!py-[.7rem]"
                  contentArrowStyle={{
                    borderRight: "8px solid  #76c5bf",
                  }}
                  iconStyle={{ background: "#76c5bf", color: "#fff" }}
                  icon={<VaccinesOutlinedIcon />}
                >
                  <div key={index} className="flex flex-col">
                    <div className="flex gap-1">
                      <h6>{index + 1}.</h6>
                      <h4 className="vertical-timeline-element-subtitle">
                        {operation_type.operation_type}
                      </h4>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <div className="flex gap-1">
                        <h6>Source:</h6>
                        <span>{operation_type.source}</span>
                      </div>
                      <div className="flex gap-1">
                        <h6>Prix:</h6>
                        <span>{operation_type.price} MAD</span>
                      </div>
                    </div>
                  </div>
                </VerticalTimelineElement>
              )
            )
          )}
        </VerticalTimeline>
      </Box>
    ),
    [Operations]
  );
  return Operationtimeline;
};
export default OperationVerticalTimeline;
