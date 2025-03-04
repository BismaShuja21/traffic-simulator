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
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="vehicles"
          stroke="#8884d8"
          name="Vehicle Arrivals"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
