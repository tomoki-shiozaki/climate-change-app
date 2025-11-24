import React from "react";

const About: React.FC = () => {
  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        このサイトについて
      </h1>

      <section className="mb-6">
        <p className="text-gray-600 leading-relaxed">
          このアプリは、世界の気温データをグラフで可視化し、
          気候変動や地域ごとの差を直感的に理解することを目的としています。
        </p>
      </section>

      <section className="mb-6">
        <p className="text-gray-600 leading-relaxed">
          使用している気温データは{" "}
          <a
            href="https://ourworldindata.org/co2-and-greenhouse-gas-emissions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Our World in Data
          </a>{" "}
          から取得しています。
        </p>
      </section>

      <section>
        <p className="text-gray-600 leading-relaxed">
          ダッシュボードで地域ごとの気温変化を確認したり、
          データページで詳細情報や更新状況を確認することができます。
        </p>
      </section>
    </div>
  );
};

export default About;
