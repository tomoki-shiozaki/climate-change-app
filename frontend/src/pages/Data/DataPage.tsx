const DataPage = () => {
  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">データについて</h1>

      {/* データソース */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">データソース</h2>
        <p className="text-gray-600 leading-relaxed">
          本アプリの気温データは、{" "}
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

      {/* 利用しているデータの内容 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">利用しているデータの内容</h2>
        <p className="text-gray-600 leading-relaxed">
          年平均気温の長期推移データを使用し、地域ごとの気温変化を可視化できるよう
          年次データを抽出して加工しています。
        </p>
      </section>

      {/* 更新について */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">更新について</h2>
        <p className="text-gray-600 leading-relaxed">
          本アプリの気温データは、Our World in Data の API から定期的に取得し、
          自動的にデータベースを更新しています。
          これにより、常に最新のデータに基づいてグラフや比較を表示できます。
        </p>
      </section>

      {/* 注意事項 */}
      <section>
        <h2 className="text-xl font-semibold mb-2">注意事項</h2>
        <p className="text-gray-600 leading-relaxed">
          本アプリは学習・可視化を目的としており、正確な分析や研究目的で使用する場合は、
          必ず一次データおよび OWID の原典情報を参照してください。
        </p>
      </section>
    </div>
  );
};

export default DataPage;
