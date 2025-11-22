import { useQuery } from "@tanstack/react-query";
import { useErrorContext } from "../../context/ErrorContext";
import { fetchTemperatureDataWithError } from "../../api/fakeApi";

export const ClimateChartTest = () => {
  const { error } = useErrorContext();

  // 500 エラーを意図的に発生させる useQuery
  useQuery({
    queryKey: ["temperatureDataTest"],
    queryFn: fetchTemperatureDataWithError,
    retry: false,
  });

  return (
    <div>
      <h3>ClimateChart Test</h3>
      {error ? <p>Global Error: {error}</p> : <p>No error yet</p>}
    </div>
  );
};
