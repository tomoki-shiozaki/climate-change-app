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
import { TemperatureChartDescription } from "@/features/climate/components/TemperatureChartDescription";

const regionLabels: Record<string, string> = {
  "Northern Hemisphere": "北半球",
  "Southern hemisphere": "南半球",
  World: "世界",
};

export const TemperatureChart = () => {
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

  // データに含まれる地域名の配列を取得
  const regions = Object.keys(data);
  if (regions.length === 0) return <p>地域データがありません</p>;

  const chartData = selectedRegion ? data[selectedRegion] ?? [] : [];

  // SelectBox 用のオプション配列を作成
  // value: 内部的に扱う地域キー
  // label: ユーザーに表示する地域名（日本語ラベルがあればそれを使用）
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
      <TemperatureChartDescription />
    </div>
  );
};
