import React from "react";
import { Box } from "@mui/material";
import Chart from "./Chart"; // adjust import path if needed

type ChartSectionProps = {
  title: string;
  description: string;
  data: any[];
  dataKey: string;
  color: string;
};

const ChartSection: React.FC<ChartSectionProps> = ({
  title,
  description,
  data,
  dataKey,
  color,
}) => {
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <h3>{description}</h3>
      <Chart data={data} dataKey={dataKey} title={title} color={color} />
    </Box>
  );
};

export default ChartSection;
