import { PageLayout } from "@/components/layout/PageLayout";
import {
  TemperatureChart,
  TemperatureChartExplanation,
  TemperatureDataSource,
} from "@/features/climate/components";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const TemperaturePage = () => {
  return (
    <PageLayout
      title="世界・北半球・南半球の気温チャート"
      description="世界、北半球、南半球それぞれの気温変化をグラフで表示しています。"
    >
      {/* グラフ本体 */}
      <Card>
        <CardContent>
          <TemperatureChart />
        </CardContent>

        <CardFooter>
          <TemperatureDataSource />
        </CardFooter>
      </Card>

      {/* 説明カード */}
      <Card>
        <CardContent>
          <TemperatureChartExplanation />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default TemperaturePage;
