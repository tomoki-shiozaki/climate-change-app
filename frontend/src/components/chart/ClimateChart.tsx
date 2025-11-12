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

  const [data, setData] = useState<TemperatureData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetchTemperatureData(token)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Loading />;
  if (!data.length) return <p>No data available</p>;

  // Rechartsに合わせた形式にそのまま使用
  const chartData = data.map((item) => ({
    year: item.year,
    upper: item.upper,
    lower: item.lower,
    global_average: item.global_average,
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
  );
};

export default ClimateChart;
