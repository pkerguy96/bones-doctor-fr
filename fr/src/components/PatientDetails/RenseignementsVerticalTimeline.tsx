import { useMemo } from "react";

import {
  VerticalTimeline,
  VerticalTimelineElement,
  //@ts-ignore
} from "react-vertical-timeline-component";

import LoadingSpinner from "../LoadingSpinner";
import { Box } from "@mui/material";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

export interface OperationNote {
  note: string;
  date: string;
}
interface RenseignementsVerticalTimelineProps {
  Operations: OperationNote[];
  isLoading: boolean;
}
const RenseignementsVerticalTimeline: React.FC<
  RenseignementsVerticalTimelineProps
> = ({ Operations, isLoading }) => {
  if (isLoading) return <LoadingSpinner />;

  const Operationtimeline = useMemo(
    () => (
      <Box className="max-h-[500px] overflow-auto rounded-md bg-[#f5f5f5] p-4">
        <VerticalTimeline className="!w-full !m-0">
          {Operations.map((op: any, index: number) => (
            <VerticalTimelineElement
              key={index}
              className="vertical-timeline-element--work"
              date={op.date}
              contentStyle={{
                borderTop: "3px solid #76c5bf",
              }}
              dateClassName="custom-date-color !py-0 lg:!py-[.7rem]"
              contentArrowStyle={{
                borderRight: "8px solid  #76c5bf",
              }}
              iconStyle={{ background: "#76c5bf", color: "#fff" }}
              icon={<EditNoteOutlinedIcon />}
            >
              <div key={index} className="flex flex-col">
                <div className="flex gap-1">
                  <h6>{index + 1}.</h6>
                  <h4 className="vertical-timeline-element-subtitle">
                    {op.note}
                  </h4>
                </div>
              </div>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </Box>
    ),
    [Operations]
  );
  return Operationtimeline;
};

export default RenseignementsVerticalTimeline;
