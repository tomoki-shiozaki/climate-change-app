import { PageLayout } from "@/components/layout/PageLayout";

const DataPage = () => {
  return (
    <PageLayout
      title="データについて"
      description="このページでは、使用している気候データの出典や内容、更新方法、注意事項について説明しています。"
    >
      {/* データソースセクション */}
      <section className="mb-6 leading-relaxed">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          データソース
        </h2>

        <p className="mb-6 text-gray-800">
          気温データ、CO₂排出量データはいずれも{" "}
          <a
            href="https://ourworldindata.org/co2-and-greenhouse-gas-emissions"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-500 underline"
          >
            Our World in Data – CO₂ and Greenhouse Gas Emissions
          </a>{" "}
          から取得しています。
        </p>

        {/* 気温データカード */}
        <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            気温データ
          </h3>
          <p className="text-gray-800 mb-2">
            年平均気温の長期推移データ（HadCRUT5、Met Office Hadley
            Centre提供）を使用しています。
          </p>
          <p className="text-gray-800 mb-2">単位: ℃、対象期間: 1850年から。</p>
          <p className="text-sm text-blue-500 underline mb-1">
            詳細ページ:{" "}
            <a
              href="https://ourworldindata.org/grapher/temperature-anomaly"
              target="_blank"
              rel="noopener noreferrer"
            >
              Temperature anomaly
            </a>
          </p>
          <p className="text-sm text-gray-600 mt-2 border-t border-gray-200 pt-2">
            ※ CC BY 4.0 ライセンス
          </p>
        </div>

        {/* CO₂排出量データカード */}
        <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            CO₂排出量データ
          </h3>
          <p className="text-gray-800 mb-2">
            国別の年間 CO₂ 排出量データ（領域ベース）を使用しています。
            <br />
            ※ 輸入品由来の排出や国際航空・国際船舶は含まれません。
            <br />
            単位: トン、対象期間: 1750年から。
          </p>
          <p className="text-sm text-blue-500 underline mb-1">
            詳細ページ:{" "}
            <a
              href="https://ourworldindata.org/grapher/annual-co-emissions-by-region"
              target="_blank"
              rel="noopener noreferrer"
            >
              Annual CO₂ emissions by region
            </a>
          </p>
          <p className="text-sm text-gray-600 mt-2 border-t border-gray-200 pt-2">
            ※ CC BY 4.0 ライセンス
          </p>
        </div>
      </section>

      {/* データ概要セクション */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          データの概要
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Our World in Data
          の気候データを取得し、必要な情報を抽出・整理してグラフや地図などで可視化しています。
        </p>
      </section>

      {/* 更新セクション */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          更新について
        </h2>
        <p className="text-gray-700 leading-relaxed">
          このアプリで使用している気候データは、Our World in Data
          から定期的に取得して更新しています。常に最新のデータに基づき、 気温や
          CO₂ 排出量の変化などを確認できます。
        </p>
      </section>

      {/* 注意事項セクション */}
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">注意事項</h2>
        <p className="text-gray-700 leading-relaxed">
          本アプリは学習・可視化を目的としており、正確な分析や研究目的で使用する場合は、必ず一次データおよび
          OWID の原典情報を参照してください。
        </p>
      </section>
    </PageLayout>
  );
};

export default DataPage;
