import { PageLayout } from "@/components/layout/PageLayout";
import { TemperatureChart } from "@/features/climate/components/TemperatureChart";
import { Card, CardContent } from "@/components/ui/card";

const TemperaturePage = () => {
  return (
    <PageLayout
      title="世界・北半球・南半球の気温チャート"
      description="世界、北半球、南半球それぞれの気温変化をグラフで表示しています。"
    >
      <Card>
        <CardContent>
          <TemperatureChart />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default TemperaturePage;
