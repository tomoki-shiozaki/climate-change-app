import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTemperatureData } from "../../api/climate";
import type { TemperatureData } from "../../types/models/climate";
import { Loading } from "../common";

const regionLabels: Record<string, string> = {
  "Northern Hemisphere": "北半球",
  "Southern hemisphere": "南半球",
  World: "世界",
};

const ClimateChart = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  // 🔥 TanStack Query v5
  const { data, isLoading, isError } = useQuery<TemperatureData>({
    queryKey: ["temperatureData"],
    queryFn: fetchTemperatureData,
    retry: false,
  });

  // データ取得後、初期地域を Northern Hemisphere にセット
  useEffect(() => {
    if (!data) return;
    if (!selectedRegion) {
      if (data["World"]) {
        setSelectedRegion("World");
      } else {
        const regions = Object.keys(data);
        if (regions.length > 0) setSelectedRegion(regions[0]);
      }
    }
  }, [data, selectedRegion]);

  if (isLoading) return <Loading />;
  if (isError) return <p>データの取得に失敗しました</p>;
  if (!data) return <p>データがありません</p>;

  const regions = Object.keys(data);
  if (regions.length === 0) return <p>地域データがありません</p>;

  const chartData = selectedRegion ? data[selectedRegion] ?? [] : [];

  return (
    <div>
      {/* 地域選択 */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="region-select" style={{ marginRight: "0.5rem" }}>
          地域選択:
        </label>
        <select
          id="region-select"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {regionLabels[region] || region}
            </option>
          ))}
        </select>
      </div>

      {/* チャート */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            label={{ value: "気温 (°C)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          <Line
            dataKey="upper"
            stroke="#ff4d4f"
            name="上限値"
            type="monotone"
          />
          <Line
            dataKey="global_average"
            stroke="#faad14"
            name="平均値"
            type="monotone"
          />
          <Line
            dataKey="lower"
            stroke="#1890ff"
            name="下限値"
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClimateChart;
