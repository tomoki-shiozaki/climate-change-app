export const TemperatureChartExplanation = () => {
  return (
    <div className="space-y-2 text-base leading-relaxed text-gray-800">
      <p>
        このグラフは各地域（世界、北半球、南半球）の気温変化を示しています。
        Y軸の値は
        <span className="font-semibold">
          1861–1890年の平均気温を基準とした変化量 (°C)
        </span>
        です。
      </p>

      <p>
        値が正の場合は基準期間より高く、負の場合は低いことを表します。
        上限値・下限値は、観測や推定に伴う不確実性の範囲を示しています。
      </p>

      <p>グラフ左上の「地域選択」プルダウンで地域を変更できます。</p>
    </div>
  );
};
