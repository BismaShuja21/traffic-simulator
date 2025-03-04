import { useState, useEffect } from "react";

interface TrafficData {
  time: number;
  vehicles: number;
  state: "empty" | "moderate" | "congested";
}

interface ReportData {
  totalTime: number;
  totalVehicles: number;
}

const useTrafficSimulation = () => {
  const [running, setRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);

  const poissonArrival = (lambda: number): boolean => Math.random() < lambda;

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
      const lambda = 0.5;
      const arrival = poissonArrival(lambda) ? 1 : 0;
      const lastState = trafficData.length
        ? trafficData[trafficData.length - 1].state
        : "empty";
      const nextState = getNextState(lastState);
      setTrafficData((prev) => [
        ...prev,
        { time, vehicles: arrival, state: nextState },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, [running, trafficData, time]);

  const startSimulation = () => {
    setRunning(true);
    setTime(0);
    setTrafficData([]);
    setReport(null);
  };

  const stopSimulation = () => {
    setRunning(false);
    setReport({
      totalTime: time,
      totalVehicles: trafficData.reduce((acc, d) => acc + d.vehicles, 0),
    });
  };

  return {
    running,
    time,
    trafficData,
    report,
    startSimulation,
    stopSimulation,
  };
};

export default useTrafficSimulation;
