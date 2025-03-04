import React from "react";
import Button from "./Button";
import "./Control.css"; // Import the CSS file

interface ControlsProps {
  running: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  running,
  onStart,
  onStop,
  onReset,
}) => {
  return (
    <div className="controls">
      <Button onClick={onStart} disabled={running} label="Start" />
      <Button onClick={onStop} disabled={!running} label="Stop" />
      <Button onClick={onReset} disabled={running} label="Reset" />
    </div>
  );
};

export default Controls;
