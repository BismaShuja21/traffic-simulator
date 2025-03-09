import React from "react";
import "./Info.css"; // Import the CSS file

const Info: React.FC = () => {
  return (
    <div className="info-container">
      {/* <h2 className="info-title">Traffic Simulation Process</h2> */}

      <h3>What does this porject do?</h3>
      <p>
        Road Traffic simulation models analyze and predict traffic status on a
        road. The simulation helps in understanding congestion patterns, and
        optimizing signal timings.
      </p>

      <h3>What is a Markov Chain?</h3>
      <p>
        A Markov Chain is a mathematical model describing a sequence of events
        where the next state depends only on the current state. Transitions
        between states are probabilistic.
      </p>

      <h3>States in the Markov Chain</h3>
      <div>
        <p>
          <strong>Empty (Low Traffic):</strong> Few or no vehicles on the road.
        </p>
        <p>
          <strong>Moderate (Medium Traffic):</strong> Some traffic but still
          flowing.
        </p>
        <p>
          <strong>Congested (High Traffic):</strong> Heavy traffic, slow
          movement.
        </p>
      </div>
    </div>
  );
};

export default Info;
