import React from "react";
import "./ReportPage.css"; // Import the CSS file

interface ReportPageProps {
  totalTime: number;
  totalVehicles: number;
  totalExits: number;
  trafficData: {
    state: "empty" | "moderate" | "congested";
  }[];
}

const ReportPage: React.FC<ReportPageProps> = ({
  totalTime,
  totalVehicles,
  totalExits,
  trafficData,
}) => {
  const averageArrivalRate =
    totalTime > 0 ? (totalVehicles / totalTime).toFixed(2) : "N/A";
  const averageExitRate =
    totalTime > 0 ? (totalExits / totalTime).toFixed(2) : "N/A";
  const netVehicles = totalVehicles - totalExits;

  // Determine the most frequent traffic state
  const stateCounts = trafficData.reduce(
    (acc, { state }) => {
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    },
    { empty: 0, moderate: 0, congested: 0 } as Record<
      "empty" | "moderate" | "congested",
      number
    >
  );

  const peakTrafficState = Object.keys(stateCounts).reduce((a, b) =>
    stateCounts[a as keyof typeof stateCounts] >
    stateCounts[b as keyof typeof stateCounts]
      ? a
      : b
  );

  return (
    <div className="report-container">
      <h2 className="report-title">Traffic Simulation Report</h2>
      <div className="report-content">
        <p>
          <strong>Total Simulation Time:</strong> {totalTime} seconds
        </p>
        <p>
          <strong>Total Vehicles Arrived:</strong> {totalVehicles}
        </p>
        <p>
          <strong>Total Vehicles Exited:</strong> {totalExits}
        </p>
        <p>
          <strong>Net Vehicles on Road:</strong> {netVehicles}
        </p>
        <p>
          <strong>Average Arrival Rate:</strong> {averageArrivalRate}{" "}
          vehicles/sec
        </p>
        <p>
          <strong>Average Exit Rate:</strong> {averageExitRate} vehicles/sec
        </p>
        <p>
          <strong>Peak Traffic State:</strong> {peakTrafficState.toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default ReportPage;
