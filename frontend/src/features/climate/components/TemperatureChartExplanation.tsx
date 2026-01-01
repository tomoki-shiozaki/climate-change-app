export const TemperatureChartExplanation = () => {
  return (
    <div className="space-y-2 text-base leading-relaxed text-gray-800">
      <p>
        このグラフは各地域の気温変化を示しています。 Y軸の値は
        <span className="font-semibold">
          1861–1890年の平均気温を基準とした変化量 (°C)
        </span>
        です。
      </p>

      <p>
        値が正の場合は基準期間より高く、負の場合は低いことを表します。
        上限値・平均値・下限値の3本の線により、 年ごとの変動幅を確認できます。
      </p>
    </div>
  );
};
