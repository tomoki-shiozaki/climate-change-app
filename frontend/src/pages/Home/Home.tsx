import React from "react";

const Home: React.FC = () => {
  return (
    <div className="px-6 py-16 text-center max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">気候変動データダッシュボード</h1>

      <p className="text-lg text-gray-600 leading-relaxed mb-10">
        このアプリは、世界の気候変動に関するデータをわかりやすく可視化し、
        地域ごとの動向を比較できるツールです。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {/* 気温データ */}
        <div className="p-6 rounded-2xl shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-2">気温データ</h2>
          <p className="text-gray-500 text-sm">
            年度ごとの気温変化をグラフで確認できます。
          </p>
        </div>

        {/* CO₂排出量 */}
        <div className="p-6 rounded-2xl shadow-md bg-white opacity-70">
          <h2 className="text-xl font-semibold mb-2">CO₂排出量（予定）</h2>
          <p className="text-gray-500 text-sm">
            国・地域ごとの排出量推移を可視化（今後追加予定）
          </p>
        </div>

        {/* 再エネ利用 */}
        <div className="p-6 rounded-2xl shadow-md bg-white opacity-70">
          <h2 className="text-xl font-semibold mb-2">再エネ利用（予定）</h2>
          <p className="text-gray-500 text-sm">
            再生可能エネルギー利用率の変化を表示（今後追加予定）
          </p>
        </div>
      </div>

      <p className="text-gray-500 mt-12 text-sm">
        ※
        現在は「気温データ」のみ表示しています。他の項目は今後のアップデートで追加予定です。
      </p>
    </div>
  );
};

export default Home;
