import React, { useState, useEffect } from "react";
import { Tabs, Tab, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import Chart from "../components/Chart";
import Controls from "../components/Controls";
import ReportPage from "./ReportPage";
import "./Simulation.css";
import MarkovChain from "./MarkovChain";
import Info from "./Info";
import { TrafficData, ReportData, StateTraffic, TPMType } from "../types";
import Tpm from "./Tpm";
import { getTrafficParameters } from "../utils/helper";

const TrafficSimulation: React.FC = () => {
  const [running, setRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);
  const [tab, setTab] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>(
    "Simulation not started"
  );
  const [stateTransitions, setStateTransitions] = useState<
    Record<string, Record<string, number>>
  >({
    empty: { empty: 0, moderate: 0, congested: 0 },
    moderate: { empty: 0, moderate: 0, congested: 0 },
    congested: { empty: 0, moderate: 0, congested: 0 },
  });
  const [dynamicTPM, setDynamicTPM] = useState<TPMType>({
    empty: { empty: 0, moderate: 0, congested: 0 },
    moderate: { empty: 0, moderate: 0, congested: 0 },
    congested: { empty: 0, moderate: 0, congested: 0 },
  });
  const [mode, setMode] = useState<"static" | "dynamic">("dynamic");

  const updateTransitions = (
    prevState: StateTraffic,
    newState: StateTraffic
  ) => {
    setStateTransitions((prev) => ({
      ...prev,
      [prevState]: {
        ...prev[prevState],
        [newState]: prev[prevState][newState] + 1,
      },
    }));
  };

  const calculateDynamicTPM = () => {
    const newTPM: TPMType = {
      empty: { empty: 0, moderate: 0, congested: 0 },
      moderate: { empty: 0, moderate: 0, congested: 0 },
      congested: { empty: 0, moderate: 0, congested: 0 },
    };

    Object.keys(stateTransitions).forEach((state) => {
      const totalTransitions = Object.values(
        stateTransitions[state as StateTraffic]
      ).reduce((acc, val) => acc + val, 0);

      Object.keys(stateTransitions[state as StateTraffic]).forEach(
        (nextState) => {
          newTPM[state as StateTraffic][nextState as StateTraffic] =
            totalTransitions > 0
              ? stateTransitions[state as StateTraffic][
                  nextState as StateTraffic
                ] / totalTransitions
              : 0;
        }
      );
    });

    return newTPM;
  };

  useEffect(() => {
    if (mode === "dynamic") {
      setDynamicTPM(calculateDynamicTPM());
    }
  }, [stateTransitions, mode]);

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

  //for dynamic
  const getDynamicTrafficParameters = (recentData: TrafficData[]) => {
    const recentEntries = recentData.slice(-10);

    const totalArrivals = recentEntries.reduce(
      (acc, d) => acc + d.vehiclesArrived,
      0
    );
    const totalExits = recentEntries.reduce(
      (acc, d) => acc + d.vehiclesExited,
      0
    );
    const avgArrivalRate = totalArrivals / (recentEntries.length || 1);
    const avgExitRate = totalExits / (recentEntries.length || 1);

    return {
      lambdaArrival: Math.max(0.1, Math.min(1, avgArrivalRate / 10)),
      lambdaExit: Math.max(0.1, Math.min(1, avgExitRate / 10)),
    };
  };

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);

      const lastState: { totalVehicles: number; state: StateTraffic } =
        trafficData.length
          ? trafficData[trafficData.length - 1]
          : { totalVehicles: 0, state: "empty" };

      const { lambdaArrival, lambdaExit } =
        mode === "dynamic"
          ? getDynamicTrafficParameters(trafficData)
          : getTrafficParameters(lastState.state);

      const arrivals = poissonRandom(lambdaArrival);
      const exits = Math.min(
        poissonRandom(lambdaExit),
        lastState.totalVehicles
      );
      const totalVehicles = lastState.totalVehicles + arrivals - exits;

      let nextState: StateTraffic;
      if (totalVehicles < 5) nextState = "empty";
      else if (totalVehicles < 12) nextState = "moderate";
      else nextState = "congested";

      updateTransitions(lastState.state, nextState);

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
  }, [running, trafficData, time, mode]);

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
      <header className="header">
        <h1 className="header-title">Road Traffic Simulation</h1>
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

      <main className="main-content">
        <div className="content-wrapper">
          {tab === 0 && <Info />}
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
              <RadioGroup
                row
                value={mode}
                onChange={(e) =>
                  setMode(e.target.value as "static" | "dynamic")
                }
              >
                <FormControlLabel
                  value="static"
                  control={<Radio />}
                  label="Static TPM"
                />
                <FormControlLabel
                  value="dynamic"
                  control={<Radio />}
                  label="Dynamic TPM"
                />
              </RadioGroup>
              <p className="status-message">{statusMessage}</p>
              <Chart data={trafficData} />
            </div>
          )}
          {tab === 2 && report && (
            <ReportPage
              totalTime={report.totalTime}
              totalVehicles={report.totalVehicles}
              totalExits={report.totalExits}
              trafficData={trafficData}
            />
          )}
          {tab === 3 && (
            <Tpm
              useDefault={mode === "static"}
              tpm={mode === "dynamic" ? dynamicTPM : undefined}
            />
          )}
          {tab === 4 && (
            <MarkovChain tpm={mode === "dynamic" ? dynamicTPM : undefined} />
          )}
        </div>
      </main>
    </div>
  );
};

export default TrafficSimulation;
