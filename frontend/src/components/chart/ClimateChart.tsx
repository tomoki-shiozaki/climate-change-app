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
import { useAuthContext } from "../../context/AuthContext";
import { fetchTemperatureData } from "../../api/climate";
import type { TemperatureData } from "../../types/models/climate";
import { Loading } from "../common";

const ClimateChart = () => {
  const { token } = useAuthContext();

  const [data, setData] = useState<TemperatureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  // データ取得
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    fetchTemperatureData(token)
      .then((res) => {
        setData(res);
        // 初期選択地域を最初の地域に設定
        const regions = Object.keys(res);
        if (regions.length > 0) setSelectedRegion(regions[0]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Loading />;
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
