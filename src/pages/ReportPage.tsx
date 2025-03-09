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

  // Traffic State Distribution (%)
  const totalEntries = trafficData.length;
  const emptyPercentage = ((stateCounts.empty / totalEntries) * 100).toFixed(2);
  const moderatePercentage = (
    (stateCounts.moderate / totalEntries) *
    100
  ).toFixed(2);
  const congestedPercentage = (
    (stateCounts.congested / totalEntries) *
    100
  ).toFixed(2);

  // Traffic Stability Indicator (Number of state transitions)
  const transitions = trafficData.reduce((count, curr, index) => {
    if (index > 0 && trafficData[index - 1].state !== curr.state) {
      return count + 1;
    }
    return count;
  }, 0);

  // Congestion Probability (%)
  const congestionProbability = (
    (stateCounts.congested / totalEntries) *
    100
  ).toFixed(2);

  // Efficiency Score (Exit to Arrival Ratio)
  const efficiencyScore =
    totalVehicles > 0 ? ((totalExits / totalVehicles) * 100).toFixed(2) : "N/A";

  return (
    <div className="report-container">
      <h2 className="report-title">Traffic Simulation Report</h2>
      <div className="report-content">
        <table className="report-table">
          <tbody>
            <tr>
              <td>
                <strong>Total Simulation Time:</strong>
              </td>
              <td>{totalTime} seconds</td>
            </tr>
            <tr>
              <td>
                <strong>Total Vehicles Arrived:</strong>
              </td>
              <td>{totalVehicles}</td>
            </tr>
            <tr>
              <td>
                <strong>Total Vehicles Exited:</strong>
              </td>
              <td>{totalExits}</td>
            </tr>
            <tr>
              <td>
                <strong>Net Vehicles on Road:</strong>
              </td>
              <td>{netVehicles}</td>
            </tr>
            <tr>
              <td>
                <strong>Average Arrival Rate:</strong>
              </td>
              <td>{averageArrivalRate} vehicles/sec</td>
            </tr>
            <tr>
              <td>
                <strong>Average Exit Rate:</strong>
              </td>
              <td>{averageExitRate} vehicles/sec</td>
            </tr>
            <tr>
              <td>
                <strong>Peak Traffic State:</strong>
              </td>
              <td>{peakTrafficState.toUpperCase()}</td>
            </tr>
            <tr>
              <td colSpan={2}>
                <h3>Additional Insights</h3>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Traffic State Distribution:</strong>
              </td>
              <td>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                  <li>
                    <strong>Empty:</strong> {emptyPercentage}%
                  </li>
                  <li>
                    <strong>Moderate:</strong> {moderatePercentage}%
                  </li>
                  <li>
                    <strong>Congested:</strong> {congestedPercentage}%
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Traffic Stability Indicator:</strong>
              </td>
              <td>{transitions} transitions</td>
            </tr>
            <tr>
              <td>
                <strong>Congestion Probability:</strong>
              </td>
              <td>{congestionProbability}%</td>
            </tr>
            <tr>
              <td>
                <strong>Efficiency Score:</strong>
              </td>
              <td>{efficiencyScore}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportPage;
