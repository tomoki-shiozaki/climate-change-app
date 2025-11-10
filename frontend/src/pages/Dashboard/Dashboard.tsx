import ClimateChart from "../../components/chart/ClimateChart";

const Dashboard = () => {
  return (
    <div>
      <h1>ダッシュボード</h1>
      <p>地域ごとの気温推移グラフです。</p>
      <ClimateChart />
    </div>
  );
};

export default Dashboard;
