export interface TrafficData {
  time: number;
  vehiclesArrived: number;
  vehiclesExited: number;
  totalVehicles: number;
  vehicles: number;
  state: StateTraffic;
}
export interface ReportData {
  totalTime: number;
  totalVehicles: number;
  totalExits: number;
}

export type StateTraffic = "empty" | "moderate" | "congested";

export type TransitionProbabilities = {
  [key in StateTraffic]: number;
};

export type TPMType = {
  [key in StateTraffic]: TransitionProbabilities;
};
