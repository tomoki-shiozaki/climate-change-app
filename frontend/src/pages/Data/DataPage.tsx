const DataPage = () => {
  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">データについて</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">データソース</h2>
        <p className="text-gray-600">
          本アプリの気温データは、Our World in Data が公開している
          データセットを基にしています。（元データ提供：Berkeley Earth）
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">利用しているデータの内容</h2>
        <p className="text-gray-600">
          年平均気温の長期推移データを使用し、国・地域ごとの比較ができるよう
          加工しています。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">更新について</h2>
        <p className="text-gray-600">
          現在は取得済みデータを使用していますが、将来的に自動更新を検討しています。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">注意事項</h2>
        <p className="text-gray-600">
          本アプリは学習・可視化を目的としており、研究用途での利用の場合は
          元データの出典を参照してください。
        </p>
      </section>
    </div>
  );
};

export default DataPage;
