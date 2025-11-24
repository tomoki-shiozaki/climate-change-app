import React from "react";

const About: React.FC = () => {
  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        このサイトについて
      </h1>

      <section className="mb-6">
        <p className="text-gray-600 leading-relaxed">
          本アプリは、世界の気温データの長期変化を可視化することで、
          気候変動や地域ごとの差を理解することを目的としています。
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">データについて</h2>
        <p className="text-gray-600 leading-relaxed">
          使用しているデータは{" "}
          <a
            href="https://ourworldindata.org/co2-and-greenhouse-gas-emissions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Our World in Data (HadCRUT5)
          </a>{" "}
          から取得しており、1861–1890年を基準とした気温異常を表示しています。
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">使い方</h2>
        <p className="text-gray-600 leading-relaxed">
          ダッシュボードでは地域ごとの気温変化をグラフで確認でき、
          データページで詳細情報や更新状況を確認できます。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">注意事項</h2>
        <p className="text-gray-600 leading-relaxed">
          本アプリは学習・可視化を目的としており、研究や公式分析で使用する場合は、
          必ず一次データおよび OWID の原典情報を参照してください。
        </p>
      </section>
    </div>
  );
};

export default About;
