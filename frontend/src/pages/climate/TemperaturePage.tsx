import { TemperatureChart } from "@/features/climate/components/TemperatureChart";

const TemperaturePage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">
        世界・北半球・南半球の気温チャート
      </h1>
      <p className="mb-6 text-gray-600">
        世界、北半球、南半球それぞれの気温変化をグラフで表示しています。
      </p>
      <div className="bg-white p-4 rounded shadow">
        <TemperatureChart />
      </div>
    </div>
  );
};

export default TemperaturePage;
