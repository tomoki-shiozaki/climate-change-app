export const TemperatureChartDescription = () => (
  <div className="mt-4 p-4 bg-gray-50 border-l-4 border-blue-400 text-gray-700 rounded">
    <p className="mb-2">
      このグラフは各地域の気温変化を示しています。Y軸の値は
      <span className="font-medium">
        1861–1890年の平均気温を基準とした変化量 (°C)
      </span>{" "}
      です。
    </p>
    <p className="mb-2">
      値が正の場合は基準期間より高く、負の場合は低いことを表します。
      上限値、平均値、下限値の3本の線で、年ごとの変動幅がわかります。
    </p>
    <p className="text-sm text-gray-500">
      データ出典:{" "}
      <a
        href="https://ourworldindata.org/co2-and-greenhouse-gas-emissions"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-blue-600"
      >
        Our World in Data – CO₂ and Greenhouse Gas Emissions
      </a>
    </p>
  </div>
);
