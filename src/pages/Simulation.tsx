import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import Chart from "../components/Chart";
import Controls from "../components/Controls";
import ReportPage from "./ReportPage";
import Tpm from "./Tpm";
import "./Simulation.css"; // Import the CSS file
import MarkovChain from "./MarkovChain";

interface TrafficData {
  time: number;
  vehiclesArrived: number;
  vehiclesExited: number;
  totalVehicles: number;
  vehicles: number;
  state: "empty" | "moderate" | "congested";
}
interface ReportData {
  totalTime: number;
  totalVehicles: number;
  totalExits: number;
}

const TrafficSimulation: React.FC = () => {
  const [running, setRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);
  const [tab, setTab] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>(
    "Simulation not started"
  );

  // Poisson process for arrivals and exits
  const poissonProcess = (lambda: number): number =>
    Math.random() < lambda ? 1 : 0;

  // Transition Probability Matrix (TPM) for state changes
  const TPM: Record<string, Record<string, number>> = {
    empty: { empty: 0.7, moderate: 0.3, congested: 0.0 },
    moderate: { empty: 0.2, moderate: 0.6, congested: 0.2 },
    congested: { empty: 0.0, moderate: 0.3, congested: 0.7 },
  };

  const getNextState = (
    currentState: "empty" | "moderate" | "congested"
  ): "empty" | "moderate" | "congested" => {
    const rand = Math.random();
    let cumulative = 0;
    for (let state in TPM[currentState]) {
      cumulative += TPM[currentState][state];
      if (rand <= cumulative)
        return state as "empty" | "moderate" | "congested";
    }
    return currentState;
  };

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);

      const lambdaArrival = 0.5;
      const lambdaExit = 0.3; // Vehicles exiting probability

      const arrivals = poissonProcess(lambdaArrival);
      const exits = poissonProcess(lambdaExit);
      const lastState = trafficData.length
        ? trafficData[trafficData.length - 1]
        : { totalVehicles: 0, state: "empty" };

      // Ensure vehicles exiting doesn't exceed current vehicles on road
      const validExits = Math.min(exits, lastState.totalVehicles);

      // Update vehicle count
      const totalVehicles = lastState.totalVehicles + arrivals - validExits;
      const nextState = getNextState(
        lastState.state as "empty" | "moderate" | "congested"
      );

      setTrafficData((prev) => [
        ...prev,
        {
          time,
          vehiclesArrived: arrivals,
          vehiclesExited: validExits,
          vehicles: totalVehicles,
          totalVehicles,
          state: nextState,
        },
      ]);

      setStatusMessage(
        `Time: ${time}s | Arrivals: ${arrivals} | Exits: ${validExits} | On Road: ${totalVehicles} | Traffic: ${nextState.toUpperCase()}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [running, trafficData, time]);

  const stopSimulation = () => {
    setRunning(false);
    setReport({
      totalTime: time,
      totalVehicles: trafficData.reduce((acc, d) => acc + d.vehiclesArrived, 0),
      totalExits: trafficData.reduce((acc, d) => acc + d.vehiclesExited, 0),
    });
    setStatusMessage("Simulation stopped. Check the report tab for results.");
  };

  const resetSimulation = () => {
    setRunning(false);
    setTime(0);
    setTrafficData([]);
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1 className="header-title">Traffic Simulation at Intersections</h1>
        {/* Tabs in the second row */}
        <Tabs
          value={tab}
          onChange={(_e, newValue) => setTab(newValue)}
          variant="fullWidth"
          className="tabs"
          textColor="inherit"
          indicatorColor="primary"
        >
          <Tab label="Simulation" className="text-white" />
          <Tab label="Report" className="text-white" />
          <Tab label="TPM" className="text-white" />
          <Tab label="Markov Chain" />
        </Tabs>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Simulation Tab */}
          {tab === 0 && (
            <div className="space-y-4">
              <Controls
                running={running}
                onStart={() => {
                  setRunning(true);
                  setStatusMessage("Simulation started...");
                }}
                onStop={stopSimulation}
                onReset={resetSimulation}
              />
              {/* Display live status updates */}
              <p className="status-message">{statusMessage}</p>
              <Chart data={trafficData} />
            </div>
          )}

          {/* Report Tab */}
          {tab === 1 && report && (
            <ReportPage
              totalTime={report.totalTime}
              totalVehicles={report.totalVehicles}
              totalExits={report.totalExits}
              trafficData={trafficData}
            />
          )}

          {/* TPM Tab */}
          {tab === 2 && <Tpm />}
          {tab === 3 && <MarkovChain />}
        </div>
      </main>
    </div>
  );
};

export default TrafficSimulation;
