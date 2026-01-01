export const CO2MapExplanation = () => {
  return (
    <div className="space-y-2 text-base leading-relaxed text-gray-800">
      <p>
        このマップは、各国の
        <span className="font-semibold">CO₂排出量の規模</span>
        を地理的に可視化したものです。
      </p>

      <p>
        国ごとに色分けされており、色が濃いほど
        <span className="font-semibold">CO₂排出量が多い</span>
        ことを示します。これにより、地域間の排出量の違いを直感的に比較できます。
      </p>

      <p>
        マップを通じて、排出量が特定の地域や国に集中していることや、
        世界全体での分布傾向を把握することができます。
      </p>
    </div>
  );
};
