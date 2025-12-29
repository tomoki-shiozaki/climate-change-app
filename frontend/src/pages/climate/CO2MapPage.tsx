import React from "react";
import { CO2WorldMap } from "@/features/climate/components/CO2WorldMap";

const CO2MapPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-center text-2xl font-semibold mb-6">
        世界のCO₂排出量マップ
      </h1>

      <CO2WorldMap />
    </div>
  );
};

export default CO2MapPage;
