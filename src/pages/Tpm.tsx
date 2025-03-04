import React from "react";
import "./Tpm.css"; // Import the CSS file
import { TPM } from "../constants";

const Tpm: React.FC = () => {
  return (
    <div className="tpm-container">
      <h2 className="tpm-title">Transition Probability Matrix</h2>
      <table className="tpm-table">
        <thead>
          <tr>
            <th>Current State</th>
            <th>empty</th>
            <th>moderate</th>
            <th>congested</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(TPM).map(([state, transitions]) => (
            <tr key={state}>
              <td>{state}</td>
              <td>{transitions.empty.toFixed(2)}</td>
              <td>{transitions.moderate.toFixed(2)}</td>
              <td>{transitions.congested.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tpm;
