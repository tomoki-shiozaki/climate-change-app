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
import { fetchTemperatureData } from "@/features/climate/api/climateApi";
import type { TemperatureData } from "@/types/models/climate";
import { Loading, SelectBox } from "@/components/common";

const regionLabels: Record<string, string> = {
  "Northern Hemisphere": "北半球",
  "Southern hemisphere": "南半球",
  World: "世界",
};

export const ClimateChart = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("");

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

  const options = regions.map((region) => ({
    value: region,
    label: regionLabels[region] || region,
  }));

  return (
    <div>
      {/* 地域選択 */}
      <SelectBox
        id="region-select"
        label="地域選択"
        options={options}
        value={selectedRegion}
        onChange={setSelectedRegion}
      />

      {/* チャート */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            label={{
              value: "基準平均からの変化 (°C)",
              angle: -90,
              position: "insideLeft",
            }}
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

      {/* 説明文 */}
      <div className="mt-4 p-4 bg-gray-50 border-l-4 border-blue-400 text-gray-700 rounded">
        <p className="mb-2">
          このグラフは各地域の気温変化を示しています。Y軸の値は
          <span className="font-medium">
            1861–1890年の平均気温を基準とした変化量 (°C)
          </span>{" "}
          です。
        </p>
        <p className="mb-2">
          値が正の場合は基準期間より高く、負の場合は低いことを表します。
          上限値、平均値、下限値の3本の線で、年ごとの変動幅がわかります。
        </p>
        <p className="text-sm text-gray-500">
          データ出典:{" "}
          <a
            href="https://ourworldindata.org/co2-and-greenhouse-gas-emissions"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600"
          >
            Our World in Data – CO₂ and Greenhouse Gas Emissions
          </a>
        </p>
      </div>
    </div>
  );
};
