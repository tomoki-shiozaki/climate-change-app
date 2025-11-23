import ClimateChart from "../../components/chart/ClimateChart";

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">ダッシュボード</h1>
      <p className="mb-6 text-gray-600">地域ごとの気温推移グラフです。</p>
      <div className="bg-white p-4 rounded shadow">
        <ClimateChart />
      </div>
    </div>
  );
};

export default Dashboard;
