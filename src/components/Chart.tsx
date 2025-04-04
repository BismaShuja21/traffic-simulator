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
  vehicles: number;
}

interface ChartProps {
  data: TrafficData[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          label={{
            value: "Time (seconds)",
            position: "bottom",
            offset: -9,
          }}
        />
        <YAxis
          label={{ value: "Arrivals", angle: -90, position: "insideLeft" }}
        />
        <Tooltip />
        <Legend align="center" />
        <Line
          type="monotone"
          dataKey="vehicles"
          stroke="#8884d8"
          name="Vehicle Arrivals Over Time"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
