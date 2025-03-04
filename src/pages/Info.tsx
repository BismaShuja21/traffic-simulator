import React from "react";
import "./Info.css"; // Import the CSS file

const Info: React.FC = () => {
  return (
    <div className="info-container">
      {/* <h2 className="info-title">Traffic Simulation Process</h2> */}

      <h3>What is Traffic Simulation?</h3>
      <p>
        Traffic simulation models analyze and predict vehicle movement at
        intersections. The simulation helps in understanding congestion
        patterns, optimizing signal timings, and evaluating road design changes.
      </p>

      <h3>What is a Markov Chain?</h3>
      <p>
        A Markov Chain is a mathematical model describing a sequence of events
        where the next state depends only on the current state. Transitions
        between states are probabilistic.
      </p>

      <h3>States in the Markov Chain</h3>
      <ul>
        <li>
          <strong>Empty (Low Traffic):</strong> Few or no vehicles at the
          intersection.
        </li>
        <li>
          <strong>Moderate (Medium Traffic):</strong> Some traffic but still
          flowing.
        </li>
        <li>
          <strong>Congested (High Traffic):</strong> Heavy traffic, slow
          movement.
        </li>
      </ul>
    </div>
  );
};

export default Info;
