import { renderHook, act } from "@testing-library/react";
import { useYearAutoPlay } from "@/features/climate/hooks/useYearAutoPlay";

describe("useYearAutoPlay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("初期値が正しく設定される", () => {
    const { result } = renderHook(() =>
      useYearAutoPlay({ initialYear: 2024, maxYear: 2030, isPlaying: false })
    );

    const [year] = result.current;
    expect(year).toBe(2024);
  });

  it("isPlaying=true の場合に年が自動で増える", () => {
    const { result } = renderHook(() =>
      useYearAutoPlay({ initialYear: 2024, maxYear: 2026, isPlaying: true })
    );

    const [, setYear] = result.current;

    // 最初は初期値
    expect(result.current[0]).toBe(2024);

    // 500ms 経過で 1 年進む
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current[0]).toBe(2025);

    // さらに 500ms 経過で 1 年進む
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current[0]).toBe(2026);

    // 最大年に達したらそれ以上進まない
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current[0]).toBe(2026);

    // 任意で setYear を直接呼んでも変更できる
    act(() => {
      setYear(2020);
    });
    expect(result.current[0]).toBe(2020);
  });

  it("isPlaying=false の場合は年が増えない", () => {
    const { result } = renderHook(() =>
      useYearAutoPlay({ initialYear: 2024, maxYear: 2030, isPlaying: false })
    );

    expect(result.current[0]).toBe(2024);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // isPlaying=false のため増えない
    expect(result.current[0]).toBe(2024);
  });
});
