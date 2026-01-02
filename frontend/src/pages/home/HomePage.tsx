import React from "react";
import { Link } from "react-router-dom";
import { HomeLayout } from "@/components/layout/HomeLayout";

const HomePage: React.FC = () => {
  return (
    <HomeLayout
      title="気候変動データアプリ"
      description="このアプリは、世界の気候変動に関するデータをわかりやすく可視化し、
      地域ごとの動向を比較できるツールです。"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 気温データ */}
        <Link
          to="/climate/temperature"
          className="p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition block"
        >
          <h2 className="text-xl font-semibold mb-2">気温データ</h2>
          <p className="text-gray-500 text-sm">
            年度ごとの気温変化をグラフで確認できます。
          </p>
        </Link>

        {/* CO₂排出量 */}
        <Link
          to="/climate/co2"
          className="p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition block"
        >
          <h2 className="text-xl font-semibold mb-2">CO₂排出量</h2>
          <p className="text-gray-500 text-sm">
            国・地域ごとの排出量推移を可視化
          </p>
        </Link>

        {/* 再エネ利用 */}
        <div className="p-6 rounded-2xl shadow-md bg-white opacity-70">
          <h2 className="text-xl font-semibold mb-2">再エネ利用（予定）</h2>
          <p className="text-gray-500 text-sm">
            再生可能エネルギー利用率の変化を表示（今後追加予定）
          </p>
        </div>
      </div>
    </HomeLayout>
  );
};

export default HomePage;
