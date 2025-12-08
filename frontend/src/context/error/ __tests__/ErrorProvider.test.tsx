import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorProvider } from "../ErrorProvider";
import { useErrorContext } from "../useErrorContext";

// テスト用の子コンポーネント
const TestComponent = () => {
  const { error, setError, clearError } = useErrorContext();

  return (
    <div>
      <span data-testid="error">{error ?? "no-error"}</span>
      <button onClick={() => setError("test error")}>Set Error</button>
      <button onClick={clearError}>Clear Error</button>
    </div>
  );
};

describe("ErrorProvider", () => {
  it("provides default null error", () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    expect(screen.getByTestId("error").textContent).toBe("no-error");
  });

  it("updates error when setError is called", () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    fireEvent.click(screen.getByText("Set Error"));
    expect(screen.getByTestId("error").textContent).toBe("test error");
  });

  it("clears error when clearError is called", () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    // まずエラーを設定
    fireEvent.click(screen.getByText("Set Error"));
    expect(screen.getByTestId("error").textContent).toBe("test error");

    // クリア
    fireEvent.click(screen.getByText("Clear Error"));
    expect(screen.getByTestId("error").textContent).toBe("no-error");
  });
});
