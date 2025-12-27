import { render, screen, fireEvent } from "@testing-library/react";
import { CO2WorldMap } from "@/features/climate/components/CO2WorldMap";
import { useQuery } from "@tanstack/react-query";

// react-query の useQuery をモック
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

// 型安全にモックを取得
const mockedUseQuery = vi.mocked(useQuery);

describe("CO2WorldMap", () => {
  const co2DataMock = {
    2024: { JPN: 1_200_000_000, USA: 5_500_000_000 },
    2023: { JPN: 1_100_000_000, USA: 5_400_000_000 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ロード中はLoadingを表示する", () => {
    // 型安全に mockReturnValue を使う
    mockedUseQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    }); // 必要に応じて型キャスト

    render(<CO2WorldMap />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("取得エラー時はエラーメッセージを表示する", () => {
    mockedUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    } as any);

    render(<CO2WorldMap />);
    expect(screen.getByText(/CO2データの取得に失敗/)).toBeInTheDocument();
  });

  it("データがある場合はスライダーと再生ボタンが表示される", async () => {
    mockedUseQuery.mockReturnValue({
      data: co2DataMock,
      isLoading: false,
      isError: false,
    } as any);

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
