/**
 * CO2排出量に応じた色を返す
 * @param value CO2排出量
 * @returns CO2量に対応した16進カラーコード
 */
export const getCO2Color = (value: number): string =>
  value > 10000000000 // 100億トン以上（中国クラス）
    ? "#800026"
    : value > 5000000000 // 50億トン以上（アメリカクラス）
    ? "#BD0026"
    : value > 1000000000 // 10億トン以上
    ? "#E31A1C"
    : value > 500000000 // 5億トン以上
    ? "#FC4E2A"
    : value > 100000000 // 1億トン以上
    ? "#FD8D3C"
    : "#FEB24C"; // それ以下
