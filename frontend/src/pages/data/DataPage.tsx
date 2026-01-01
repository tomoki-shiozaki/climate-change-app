import { PageLayout } from "@/components/layout/PageLayout";

const DataPage = () => {
  return (
    <PageLayout
      title="データについて"
      description="このページでは、使用している気候データの出典や内容、更新方法、注意事項について説明しています。"
    >
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">データソース</h2>
        <p className="text-gray-700 leading-relaxed">
          本アプリの気温データは{" "}
          <a
            href="https://ourworldindata.org/co2-and-greenhouse-gas-emissions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Our World in Data – CO₂ and Greenhouse Gas Emissions
          </a>{" "}
          ページから取得したデータセット（HadCRUT5、Met Office Hadley Centre
          提供）を基にしています。
        </p>
        <p className="text-gray-500 text-sm mt-2">
          ※ OWID のデータは CC BY 4.0 ライセンスのもと提供されています。
        </p>
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
