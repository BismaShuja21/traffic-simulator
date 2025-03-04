import React from "react";
import { Tabs, Tab } from "@mui/material";

interface TabsProps {
  value: number;
  onChange: (newValue: number) => void;
}

const CustomTabs: React.FC<TabsProps> = ({ value, onChange }) => {
  return (
    <Tabs value={value} onChange={(newValue) => onChange(newValue)}>
      <Tab label="Simulation" />
      <Tab label="Report" />
    </Tabs>
  );
};

export default CustomTabs;
