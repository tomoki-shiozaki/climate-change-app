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

const ClimateChart = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  // 🔥 TanStack Query を使ったデータ取得
  const { data, isLoading, isError } = useQuery<TemperatureData>({
    queryKey: ["temperatureData"],
    queryFn: fetchTemperatureData,
  });

  // データが取得できたら「初期地域」を自動セット
  useEffect(() => {
    if (!data) return;
    if (!selectedRegion) {
      const regions = Object.keys(data);
      if (regions.length > 0) setSelectedRegion(regions[0]);
    }
  }, [data, selectedRegion]);

  // ローディング
  if (isLoading) return <Loading />;

  // エラー
  if (isError) return <p>Failed to load data</p>;

  if (!data) return <p>No data available</p>;

  const regions = Object.keys(data);
  if (regions.length === 0) return <p>No region data</p>;

  const chartData = selectedRegion ? data[selectedRegion] ?? [] : [];

  return (
    <div>
      {/* 地域選択 */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="region-select" style={{ marginRight: "0.5rem" }}>
          Select Region:
        </label>
        <select
          id="region-select"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
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
          <Line type="monotone" dataKey="upper" stroke="#ff0000" name="Upper" />
          <Line
            type="monotone"
            dataKey="global_average"
            stroke="#0000ff"
            name="Global Avg"
          />
          <Line type="monotone" dataKey="lower" stroke="#00aa00" name="Lower" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClimateChart;
