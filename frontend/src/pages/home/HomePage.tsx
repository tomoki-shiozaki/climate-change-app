import React from "react";
import { HomeLayout } from "@/components/layout/HomeLayout";
import { CardLink } from "@/components/common/CardLink";

const HomePage: React.FC = () => {
  return (
    <HomeLayout
      title="気候変動データアプリ"
      description="このアプリは、世界の気候変動に関するデータをわかりやすく可視化し、
      地域ごとの動向を比較できるツールです。"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 気温データ */}
        <CardLink to="/climate/temperature">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            気温データ
          </h2>
          <p className="text-gray-500 text-sm">
            年度ごとの気温変化をグラフで確認できます。
          </p>
        </CardLink>

        {/* CO₂排出量 */}
        <CardLink to="/climate/co2">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            CO₂排出量
          </h2>
          <p className="text-gray-500 text-sm">
            国・地域ごとの排出量推移を可視化
          </p>
        </CardLink>
      </div>
    </HomeLayout>
  );
};

export default HomePage;
