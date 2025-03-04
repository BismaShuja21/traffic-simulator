import React from "react";
import { TPM } from "../constants";
import "./MarkovChain.css";

const MarkovChain: React.FC = () => {
  return (
    <div className="markov-container">
      <h2 className="markov-title">🚦 Markov Chain Visualization</h2>
      <svg width="600" height="400">
        {/* Nodes */}
        <circle
          cx="100"
          cy="200"
          r="40"
          fill="#4CAF50"
          stroke="#fff"
          strokeWidth="2"
        />
        <text x="100" y="205" textAnchor="middle" fill="#fff" fontSize="14">
          Empty
        </text>

        <circle
          cx="300"
          cy="100"
          r="40"
          fill="#FFC107"
          stroke="#000"
          strokeWidth="2"
        />
        <text x="300" y="105" textAnchor="middle" fill="#000" fontSize="14">
          Moderate
        </text>

        <circle
          cx="500"
          cy="200"
          r="40"
          fill="#F44336"
          stroke="#fff"
          strokeWidth="2"
        />
        <text x="500" y="205" textAnchor="middle" fill="#fff" fontSize="14">
          Congested
        </text>

        {/* Arrows with Probabilities */}
        {/* Empty → Moderate */}
        <line
          x1="140"
          y1="200"
          x2="260"
          y2="120"
          stroke="white"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
        <text x="190" y="160" fill="white" fontSize="14">
          {" "}
          {TPM.empty.moderate * 100}%{" "}
        </text>

        {/* Moderate → Empty */}
        <line
          x1="260"
          y1="120"
          x2="140"
          y2="200"
          stroke="white"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
        <text x="190" y="140" fill="white" fontSize="14">
          {" "}
          {TPM.moderate.empty * 100}%{" "}
        </text>

        {/* Moderate → Congested */}
        <line
          x1="340"
          y1="120"
          x2="460"
          y2="200"
          stroke="white"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
        <text x="400" y="160" fill="white" fontSize="14">
          {" "}
          {TPM.moderate.congested * 100}%{" "}
        </text>

        {/* Congested → Moderate */}
        <line
          x1="460"
          y1="200"
          x2="340"
          y2="120"
          stroke="white"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
        <text x="400" y="140" fill="white" fontSize="14">
          {" "}
          {TPM.congested.moderate * 100}%{" "}
        </text>

        {/* Self-loops */}
        <path
          d="M100 160 A30 30 0 1 1 99 159"
          stroke="white"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrow)"
        />
        <text x="75" y="140" fill="white" fontSize="14">
          {" "}
          {TPM.empty.empty * 100}%{" "}
        </text>

        <path
          d="M300 60 A30 30 0 1 1 299 59"
          stroke="black"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrow)"
        />
        <text x="275" y="40" fill="black" fontSize="14">
          {" "}
          {TPM.moderate.moderate * 100}%{" "}
        </text>

        <path
          d="M500 160 A30 30 0 1 1 499 159"
          stroke="white"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrow)"
        />
        <text x="475" y="140" fill="white" fontSize="14">
          {" "}
          {TPM.congested.congested * 100}%{" "}
        </text>

        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <polygon points="0,0 10,5 0,10" fill="white" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default MarkovChain;
