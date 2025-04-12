import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Box,
} from "@mui/material";
// import Chart from "../components/Chart";
import Controls from "../components/Controls";
import ReportPage from "./ReportPage";
import "./Simulation.css";
import MarkovChain from "./MarkovChain";
import Info from "./Info";
import { TrafficData, ReportData, StateTraffic, TPMType } from "../types";
import Tpm from "./Tpm";
import { getTrafficParameters } from "../utils/helper";
import StateFrequencyChart from "../components/StateFrequencyChart";
import ChartSection from "../components/ChartSection";

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
  const [lambdaArrival1, setLambdaArrival1] = useState<number>();
  const [lambdaExit1, setLambdaExit1] = useState<number>();

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
      lambdaArrival: Math.max(0.1, Math.min(2, avgArrivalRate / 0.65)),
      lambdaExit: Math.max(0.1, Math.min(1, avgExitRate / 1.5)),
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
        mode === "dynamic" && lambdaArrival1 == null && lambdaExit1 == null
          ? getDynamicTrafficParameters(trafficData)
          : lambdaArrival1 != null && lambdaExit1 != null
          ? { lambdaArrival: lambdaArrival1, lambdaExit: lambdaExit1 }
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

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#D3D3D3 !important", // Light grey
      },
      "&:hover fieldset": {
        borderColor: "#D3D3D3 !important",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#D3D3D3 !important",
      },
    },
    "& label": {
      color: "#D3D3D3",
    },
    "& label.Mui-focused": {
      color: "#D3D3D3",
    },
    input: {
      color: "white",
    },
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
                style={{
                  justifyContent: "space-between",
                  width: "100%",
                  paddingBottom: "10px",
                  paddingTop: "10px",
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
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
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  width="45%"
                  gap={2}
                >
                  <TextField
                    type="number"
                    label="Arrival Rate (λ)"
                    value={lambdaArrival1}
                    onChange={(e) =>
                      setLambdaArrival1(parseFloat(e.target.value))
                    }
                    sx={textFieldStyles}
                  />
                  <TextField
                    type="number"
                    label="Exit Rate (μ)"
                    value={lambdaExit1}
                    onChange={(e) => setLambdaExit1(parseFloat(e.target.value))}
                    sx={textFieldStyles}
                  />
                </Box>
              </RadioGroup>

              <p className="status-message">{statusMessage}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartSection
                  title="Vehicles Arrived"
                  description="Shows the number of vehicles arriving at each simulation timestep."
                  data={trafficData}
                  dataKey="vehiclesArrived"
                  color="#4A90E2"
                />

                <ChartSection
                  title="Vehicles Exited"
                  description="Displays how many vehicles exited the road during each timestep."
                  data={trafficData}
                  dataKey="vehiclesExited"
                  color="#F5A623"
                />

                <ChartSection
                  title="Total Vehicles"
                  description="Shows the number of vehicles on the road at each simulation timestep."
                  data={trafficData}
                  dataKey="totalVehicles"
                  color="#D0021B"
                />

                <ChartSection
                  title="Traffic State (0=Empty, 1=Moderate, 2=Congested)"
                  description="Visualizes the categorized traffic state at each point in time."
                  data={trafficData.map((d) => ({
                    ...d,
                    stateNumeric:
                      d.state === "empty" ? 0 : d.state === "moderate" ? 1 : 2,
                  }))}
                  dataKey="stateNumeric"
                  color="#9013FE"
                />
                <div style={{ width: 20, height: 40 }} />
                <h3 className="text-sm text-gray-500">
                  Shows the frequency of transitions between states.
                </h3>
                <div
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "35%" }}>
                    <p style={{ textAlign: "justify", paddingLeft: "50px" }}>
                      This bar chart highlights which traffic state occurred
                      most frequently over time. It helps in identifying whether
                      the simulation mostly experienced light, moderate, or
                      heavy traffic conditions. Use this insight to evaluate the
                      efficiency of road usage or to test different TPM
                      strategies.
                    </p>
                  </div>
                  <StateFrequencyChart data={trafficData} />
                </div>
              </div>
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
