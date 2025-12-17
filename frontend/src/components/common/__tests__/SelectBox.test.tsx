import { render, screen, fireEvent } from "@testing-library/react";
import { SelectBox } from "@/components/common/SelectBox";

describe("SelectBox", () => {
  const options = [
    { value: "world", label: "World" },
    { value: "north", label: "North Hemisphere" },
  ];

  it("ラベルとオプションが表示される", () => {
    render(
      <SelectBox
        id="region"
        label="Region"
        options={options}
        value="world"
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Region")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "World" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "North Hemisphere" })
    ).toBeInTheDocument();
  });

  it("選択変更時に onChange が呼ばれる", () => {
    const onChange = vi.fn();

    render(
      <SelectBox
        id="region"
        label="Region"
        options={options}
        value="world"
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "north" },
    });

    expect(onChange).toHaveBeenCalledWith("north");
  });
});
