import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { fetchTemperatureData } from "../../api/climate";
import type { TemperatureData } from "../../types/models/climate";
import { Loading } from "../common";

const ClimateChart = () => {
  const { token } = useAuthContext();

  const [data, setData] = useState<TemperatureData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      return; // ログインしていなければ何もしない
    }

    fetchTemperatureData(token)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Loading />;
  if (!data.length) return <p>No data available</p>;

  // Rechartsに合わせた形式へ変換
  const chartData = data.map((item) => ({
    year: item.year,
    value: item.value,
    region: item.region.name,
  }));

  return (
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
        <Line
          type="monotone"
          dataKey="value"
          stroke="#007bff"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ClimateChart;
