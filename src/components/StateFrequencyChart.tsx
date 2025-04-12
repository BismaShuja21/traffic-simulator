import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrafficData } from "../types";

const StateFrequencyChart: React.FC<{ data: TrafficData[] }> = ({ data }) => {
  const counts = data.reduce(
    (acc, curr) => {
      acc[curr.state]++;
      return acc;
    },
    { empty: 0, moderate: 0, congested: 0 }
  );

  const chartData = Object.entries(counts).map(([state, count]) => ({
    state,
    count,
  }));

  return (
    <ResponsiveContainer width="60%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="state" />
        <YAxis
          label={{ value: "Frequency", angle: -90, position: "insideLeft" }}
        />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="count"
          fill="#7B8B99"
          name="State Occurrence"
          barSize={"10%"}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StateFrequencyChart;
