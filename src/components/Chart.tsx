import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrafficData {
  time: number;
  [key: string]: any; // to allow dynamic access like vehiclesArrived, etc.
}

interface ChartProps {
  data: TrafficData[];
  dataKey: string;
  title: string;
  yLabel?: string;
  color?: string;
}

const Chart: React.FC<ChartProps> = ({
  data,
  dataKey,
  title,
  yLabel,
  color,
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
        <XAxis
          dataKey="time"
          label={{
            value: "Time (seconds)",
            position: "bottom",
            offset: -9,
          }}
        />
        <YAxis
          label={{
            value: yLabel || title,
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip />
        <Legend align="center" />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color || "#8884d8"}
          strokeWidth={1.5}
          name={title}
          dot={false}
          strokeOpacity={0.6}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
