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
            href="https://ourworldindata.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Our World in Data (OWID)
          </a>{" "}
          が公開しているデータセットを基にしています。 元データは Berkeley Earth
          によって提供されています。
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
          現在は取得済みデータ（ローカル保存）を使用していますが、 将来的に OWID
          の更新に合わせて自動更新できる仕組みを検討しています。
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
