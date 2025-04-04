import React from "react";
import "./MarkovChain.css";
import MC from "../assets/MC.svg"; // Adjust path if necessar
import { TPMType } from "../types";

interface MarkovChainProps {
  tpm?: TPMType;
}

const MarkovChain: React.FC<MarkovChainProps> = ({ tpm }) => {
  return (
    <div className="markov-container">
      <h2 className="markov-title">🚦 Markov Chain Visualization</h2>
      <img src={MC} alt="Markov Chain Visualization" width="600" height="400" />

      {/* empty -> empty */}
      <p
        style={{
          backgroundColor: "#2d3748",
          position: "absolute",
          width: 34,
          top: 624,
          left: 449,
        }}
      >
        {tpm ? tpm.empty.empty.toFixed(2) : 0.7}
      </p>
      {/* empty -> moderate */}
      <p
        style={{
          backgroundColor: "#2d3748",
          position: "absolute",
          width: 34,
          top: 424,
          left: 468,
        }}
      >
        {tpm ? tpm.empty.moderate.toFixed(2) : 0.3}
      </p>
      {/* moderate -> empty */}
      <p
        style={{
          backgroundColor: "#2d3748",
          position: "absolute",
          width: 34,
          top: 444,
          left: 545,
        }}
      >
        {tpm ? tpm.moderate.empty.toFixed(2) : 0.2}
      </p>
      {/* moderate -> moderate */}
      <p
        style={{
          backgroundColor: "#2d3748",
          position: "absolute",
          width: 34,
          top: 265,
          left: 615,
        }}
      >
        {tpm ? tpm.moderate.moderate.toFixed(2) : 0.6}
      </p>
      {/* moderate -> congested */}
      <p
        style={{
          backgroundColor: "#2d3748",
          position: "absolute",
          width: 34,
          top: 444,
          left: 670,
        }}
      >
        {tpm ? tpm.moderate.congested.toFixed(2) : 0.2}
      </p>
      {/* congested -> moderate */}
      <p
        style={{
          backgroundColor: "#2d3748",
          position: "absolute",
          width: 34,
          top: 424,
          left: 760,
        }}
      >
        {tpm ? tpm.congested.moderate.toFixed(2) : 0.4}
      </p>
      {/* congested -> congested */}
      <p
        style={{
          backgroundColor: "#2d3748",
          position: "absolute",
          width: 34,
          top: 624,
          left: 800,
        }}
      >
        {tpm ? tpm.congested.congested.toFixed(2) : 0.6}
      </p>
    </div>
  );
};

export default MarkovChain;
