export const TemperatureDataSource = () => {
  return (
    <p className="text-sm text-gray-600">
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
  );
};
