import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import Chart from "../components/Chart";
import Controls from "../components/Controls";
import ReportPage from "./ReportPage";
import Tpm from "./Tpm";
import "./Simulation.css"; // Import the CSS file
import MarkovChain from "./MarkovChain";
import Info from "./Info";

interface TrafficData {
  time: number;
  vehiclesArrived: number;
  vehiclesExited: number;
  totalVehicles: number;
  vehicles: number;
  state: StateTraffic;
}
interface ReportData {
  totalTime: number;
  totalVehicles: number;
  totalExits: number;
}

type StateTraffic = "empty" | "moderate" | "congested";

const TrafficSimulation: React.FC = () => {
  const [running, setRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);
  const [tab, setTab] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>(
    "Simulation not started"
  );

  // Transition Probability Matrix (TPM) for state changes based on which arrival rates amd exits rates are calculated
  // const TPM: Record<string, Record<string, number>> = {
  //   empty: { empty: 0.7, moderate: 0.3, congested: 0.0 },
  //   moderate: { empty: 0.2, moderate: 0.6, congested: 0.2 },
  //   congested: { empty: 0.0, moderate: 0.3, congested: 0.7 },
  // };

  const poissonRandom = (lambda: number) => {
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    return k - 1;
  };

  const getTrafficParameters = (state: "empty" | "moderate" | "congested") => {
    switch (state) {
      case "empty":
        return { lambdaArrival: 0.7, lambdaExit: 0.3 };
      case "moderate":
        return { lambdaArrival: 0.5, lambdaExit: 0.5 };
      case "congested":
        return { lambdaArrival: 0.4, lambdaExit: 0.6 };
      default:
        return { lambdaArrival: 0.5, lambdaExit: 0.5 };
    }
  };

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);

      const lastState = trafficData.length
        ? trafficData[trafficData.length - 1]
        : { totalVehicles: 0, state: "empty" };

      const { lambdaArrival, lambdaExit } = getTrafficParameters(
        lastState.state as StateTraffic
      );

      const arrivals = poissonRandom(lambdaArrival);
      const exits = Math.min(
        poissonRandom(lambdaExit),
        lastState.totalVehicles
      );

      const totalVehicles = lastState.totalVehicles + arrivals - exits;

      // More accurate state transition based on vehicle count
      let nextState: "empty" | "moderate" | "congested";
      if (totalVehicles < 5) nextState = "empty";
      else if (totalVehicles < 12) nextState = "moderate";
      else nextState = "congested";

      setTrafficData((prev) => [
        ...prev,
        {
          time,
          vehiclesArrived: arrivals,
          vehiclesExited: exits,
          totalVehicles,
          vehicles: totalVehicles,
          state: nextState,
        },
      ]);

      setStatusMessage(
        `Time: ${time}s | Arrivals: ${arrivals} | Exits: ${exits} | On Road: ${totalVehicles} | Traffic: ${nextState.toUpperCase()}`
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
        <h1 className="header-title">Road Traffic Simulation</h1>
        {/* Tabs in the second row */}
        <Tabs
          value={tab}
          onChange={(_e, newValue) => setTab(newValue)}
          variant="fullWidth"
          className="tabs"
          textColor="inherit"
          indicatorColor="primary"
        >
          <Tab label="Info" />
          <Tab label="Simulation" className="text-white" />
          <Tab label="Report" className="text-white" />
          <Tab label="TPM" className="text-white" />
          <Tab label="Markov Chain" />
        </Tabs>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* {Info Tab} */}
          {tab === 0 && <Info />}
          {/* Simulation Tab */}
          {tab === 1 && (
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
          {tab === 2 && report && (
            <ReportPage
              totalTime={report.totalTime}
              totalVehicles={report.totalVehicles}
              totalExits={report.totalExits}
              trafficData={trafficData}
            />
          )}

          {/* TPM Tab */}
          {tab === 3 && <Tpm />}
          {tab === 4 && <MarkovChain />}
        </div>
      </main>
    </div>
  );
};

export default TrafficSimulation;
