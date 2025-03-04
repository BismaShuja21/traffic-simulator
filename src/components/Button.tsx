import React from "react";

interface ButtonProps {
  onClick: () => void;
  disabled: boolean;
  label: string;
}
const Button: React.FC<ButtonProps> = ({ onClick, label, disabled }) => {
  return (
    <button
      style={{ width: "10%", marginRight: 10, marginLeft: 10 }}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
