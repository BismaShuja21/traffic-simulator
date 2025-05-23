import React from "react";
import "./Tpm.css";
import { TPMType } from "../types";
import { TPM } from "../constants";

interface TpmProps {
  tpm?: TPMType;
  useDefault?: boolean; // renamed from "default"
}

const Tpm: React.FC<TpmProps> = ({ tpm = TPM, useDefault = false }) => {
  const dataToRender = useDefault ? TPM : tpm;

  return (
    <div>
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
            {Object.entries(dataToRender).map(([state, transitions]) => (
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
      {useDefault ? (
        <>
          <h3>Key Insights</h3>
          <p>
            Traffic rarely jumps from Empty to Congested directly. Self-loops
            indicate how likely a state remains unchanged. The model helps in
            predicting how traffic will behave over time.
          </p>
          <p>
            The sum of each row should equal 1, indicating that all possible
            transitions from a given state are accounted for.
          </p>
          <h3>Why is This Important?</h3>
          <p>
            Understanding traffic patterns using Markov Chains helps in
            designing better traffic light timings, reducing congestion and wait
            times, and improving road efficiency.
          </p>
        </>
      ) : (
        <>
          <h3>Key Insights</h3>
          <p>
            Traffic rarely jumps from Empty to Congested directly. Higher
            proability indicates how likely a state remains unchanged. TPM helps
            in predicting how traffic will behave over time.
          </p>
          <p>
            The sum of each row should equal 1, indicating that all possible
            transitions from a given state are accounted for.
          </p>
          <h3>Why is This Important?</h3>
          <p>
            Understanding traffic patterns using Markov Chains and TPM help in
            designing better traffic light timings, reducing congestion and wait
            times, and improving road efficiency.
          </p>
        </>
      )}
    </div>
  );
};

export default Tpm;
