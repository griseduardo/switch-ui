import { fireEvent, render, waitFor } from "@testing-library/react";
import { expect } from "chai";

import SearchInput from "./SearchInput";

describe("SearchInput", () => {
  const options = [
    { label: "Opção 1", value: 1 },
    { label: "Opção 2", value: 2 },
    { label: "Opção 3", value: 3 },
  ];
  it("deve exibir a lista de opções filtradas após a digitação", async () => {
    const setSelectedValue = () => {};

    const { getByPlaceholderText, queryByText } = render(
      <SearchInput options={options} label="Buscar" setSelectedValue={setSelectedValue} />,
    );

    const inputElement = getByPlaceholderText("Buscar") as HTMLInputElement;

    fireEvent.change(inputElement, { target: { value: "Opção" } });

    await waitFor(() => {
      expect(queryByText("Opção 1")).to.exist;
      expect(queryByText("Opção 2")).to.exist;
      expect(queryByText("Opção 3")).to.exist;
    });
  });

  it("deve selecionar uma opção ao clicar nela", async () => {
    let selectedValue = "";

    const setSelectedValue = (value: string) => {
      selectedValue = value;
    };

    const { getByPlaceholderText, getByText } = render(
      <SearchInput options={options} label="Buscar" setSelectedValue={setSelectedValue} />,
    );

    const inputElement = getByPlaceholderText("Buscar") as HTMLInputElement;

    fireEvent.change(inputElement, { target: { value: "Opção" } });

    await waitFor(() => {
      const optionElement = getByText("Opção 1");
      fireEvent.click(optionElement);
      expect(selectedValue).to.equal(1);
    });
  });

  it("deve limpar a seleção e a entrada ao clicar no ícone de limpar", async () => {
    let selectedValue = "Opção 1";

    const setSelectedValue = (value: string) => {
      selectedValue = value;
    };

    const { getByTestId, queryByText } = render(
      <SearchInput
        options={options}
        label="Buscar"
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
      />,
    );

    const clearIcon = getByTestId("clear-icon");

    expect(queryByText("Opção 1")).to.exist;

    fireEvent.click(clearIcon);

    await waitFor(() => {
      expect(selectedValue).to.equal("");
    });
  });
});
