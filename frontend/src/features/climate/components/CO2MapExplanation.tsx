export const CO2MapExplanation = () => {
  return (
    <div className="space-y-2 text-base leading-relaxed text-gray-800">
      <p>
        このマップは、各国の
        <span className="font-semibold">CO₂排出量（年間総量）</span>
        を地理的に可視化したものです。
      </p>

      <p>
        国ごとに色分けされており、色が濃いほど
        <span className="font-semibold">CO₂排出量が多い</span>
        ことを示します。これにより、地域間の排出量の違いを直感的に比較できます。
      </p>

      <p>
        マップ下部中央の年スライダーバーで、CO₂排出量の年推移を確認できます。
        「再生」ボタンを使うと、変化を自動再生で見ることも可能です。
      </p>
    </div>
  );
};
