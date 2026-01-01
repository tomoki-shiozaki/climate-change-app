import { PageLayout } from "@/components/layout/PageLayout";
import { TemperatureChart } from "@/features/climate/components/TemperatureChart";

const TemperaturePage = () => {
  return (
    <PageLayout
      title="世界・北半球・南半球の気温チャート"
      description="世界、北半球、南半球それぞれの気温変化をグラフで表示しています。"
    >
      <div className="bg-white p-4 rounded shadow">
        <TemperatureChart />
      </div>
    </PageLayout>
  );
};

export default TemperaturePage;
