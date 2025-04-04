import { StateTraffic } from "../types";

export const getTrafficParameters = (state: StateTraffic) => {
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
