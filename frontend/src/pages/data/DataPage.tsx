import { PageLayout } from "@/components/layout/PageLayout";

const DataPage = () => {
  return (
    <PageLayout
      title="データについて"
      description="このページでは、使用している気候データの出典や内容、更新方法、注意事項について説明しています。"
    >
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
          </a>
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
          <p className="text-gray-800 mb-2">
            詳細ページ：{" "}
            <a
              href="https://ourworldindata.org/grapher/temperature-anomaly"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-500 underline"
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
            国別の年間 CO₂ 排出量データを使用しています。
          </p>
          <p className="text-gray-800 mb-2">
            詳細ページ：{" "}
            <a
              href="https://ourworldindata.org/grapher/annual-co-emissions-by-region"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-500 underline"
            >
              Annual CO₂ emissions by region
            </a>
          </p>
          <p className="text-sm text-gray-600 mt-2 border-t border-gray-200 pt-2">
            ※ CC BY 4.0 ライセンス
          </p>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">利用しているデータの内容</h2>
        <p className="text-gray-700 leading-relaxed">
          年平均気温の長期推移データを使用し、地域ごとの気温変化を可視化できるよう年次データを抽出して加工しています。
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">更新について</h2>
        <p className="text-gray-700 leading-relaxed">
          本アプリの気温データは、Our World in Data の API
          から定期的に取得し、自動的にデータベースを更新しています。これにより、常に最新のデータに基づいてグラフや比較を表示できます。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">注意事項</h2>
        <p className="text-gray-700 leading-relaxed">
          本アプリは学習・可視化を目的としており、正確な分析や研究目的で使用する場合は、必ず一次データおよび
          OWID の原典情報を参照してください。
        </p>
      </section>
    </PageLayout>
  );
};

export default DataPage;
