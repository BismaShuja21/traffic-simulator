import React from "react";

interface TrafficStateProps {
  state: "empty" | "moderate" | "congested";
}

const TrafficState: React.FC<TrafficStateProps> = ({ state }) => {
  const getColor = () => {
    switch (state) {
      case "empty":
        return "bg-green-500";
      case "moderate":
        return "bg-yellow-500";
      case "congested":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className={`w-24 h-24 rounded-full ${getColor()} flex items-center justify-center text-white text-lg font-bold`}
    >
      {state.toUpperCase()}
    </div>
  );
};

export default TrafficState;
