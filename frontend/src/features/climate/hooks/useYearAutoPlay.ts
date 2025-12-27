import { useState, useEffect } from "react";

export const useYearAutoPlay = ({
  initialYear,
  maxYear,
  isPlaying,
}: {
  initialYear: number;
  maxYear: number;
  isPlaying: boolean;
}) => {
  const [year, setYear] = useState(initialYear);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setYear((prev) => Math.min(prev + 1, maxYear));
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, maxYear]);

  return [year, setYear] as const;
};
