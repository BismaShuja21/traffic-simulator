import React from "react";
import "./MarkovChain.css";
import MC from "../assets/MC.svg"; // Adjust path if necessar

const MarkovChain: React.FC = () => {
  return (
    <div className="markov-container">
      <h2 className="markov-title">🚦 Markov Chain Visualization</h2>
      <img src={MC} alt="Markov Chain Visualization" width="600" height="400" />
    </div>
  );
};

export default MarkovChain;
