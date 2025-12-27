import React from "react";
import { CO2WorldMap } from "@/features/climate/components/CO2WorldMap";

const CO2MapPage: React.FC = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <h1 style={{ textAlign: "center", margin: "1rem 0" }}>
        世界のCO₂排出量マップ
      </h1>
      <CO2WorldMap />
    </div>
  );
};

export default CO2MapPage;
