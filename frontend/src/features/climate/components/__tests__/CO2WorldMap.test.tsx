import { render, screen, fireEvent } from "@testing-library/react";
import { CO2WorldMap } from "@/features/climate/components/CO2WorldMap";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type { CO2DataByYear } from "@/features/climate/types/climate";

// react-query の useQuery をモック
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

const mockedUseQuery = vi.mocked(useQuery);

// CO2データのサンプル
const co2DataMock: CO2DataByYear = {
  2024: { JPN: 1_200_000_000, USA: 5_500_000_000 },
  2023: { JPN: 1_100_000_000, USA: 5_400_000_000 },
};

// テスト用の最小限モック
const createQueryResult = (
  overrides?: Partial<UseQueryResult<CO2DataByYear, unknown>>
): UseQueryResult<CO2DataByYear, unknown> =>
  ({
    data: undefined,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    isFetching: false,
    refetch: vi.fn(),
    remove: vi.fn(),
    ...overrides,
  } as unknown as UseQueryResult<CO2DataByYear, unknown>);

describe("CO2WorldMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ロード中はLoadingを表示する", () => {
    mockedUseQuery.mockReturnValue(createQueryResult({ isLoading: true }));

    render(<CO2WorldMap />);

    // role="status" の要素が存在することをチェック
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });

  it("取得エラー時はエラーメッセージを表示する", () => {
    mockedUseQuery.mockReturnValue(createQueryResult({ isError: true }));

    render(<CO2WorldMap />);
    expect(screen.getByText(/CO2データの取得に失敗/)).toBeInTheDocument();
  });

  it("データがある場合はスライダーと再生ボタンが表示される", () => {
    mockedUseQuery.mockReturnValue(
      createQueryResult({ data: co2DataMock, isSuccess: true })
    );

    render(<CO2WorldMap />);

    // 年スライダー
    const slider = screen.getByRole("slider") as HTMLInputElement;
    expect(slider.value).toBe("2024");

    // 再生ボタン
    const playButton = screen.getByRole("button", { name: /再生/i });
    expect(playButton).toBeInTheDocument();

    // スライダー操作
    fireEvent.change(slider, { target: { value: "2023" } });
    expect(slider.value).toBe("2023");

    // 再生ボタン操作
    fireEvent.click(playButton);
    expect(playButton.textContent).toBe("停止");
  });
});
