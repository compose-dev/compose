import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import NumberInput from "./NumberInput";

function setup(initialValue: string | null = null) {
  let value = initialValue;

  const setValue = (val: string | null) => {
    value = val;

    rerender(
      <NumberInput
        label="enter your age"
        value={value}
        setValue={setValue}
        testId="number-input"
      />
    );
  };

  const { rerender } = render(
    <NumberInput
      label="enter your age"
      value={value}
      setValue={setValue}
      testId="number-input"
    />
  );

  return { input: screen.getByTestId("number-input"), getValue: () => value };
}

describe("NumberInput", () => {
  test("renders a number correctly", async () => {
    const { input, getValue } = setup();

    expect(input).toBeInTheDocument();

    await userEvent.type(input, "5");
    expect(getValue()).toBe("5");

    await userEvent.type(input, "9");
    expect(getValue()).toBe("59");
  });

  test("renders empty as null", async () => {
    const { input, getValue } = setup();

    await userEvent.type(input, "59");
    expect(getValue()).toBe("59");

    await userEvent.type(input, "{backspace}");
    expect(getValue()).toBe("5");

    await userEvent.type(input, "{backspace}");
    expect(getValue()).toBe(null);
  });

  test("does not allow non-numeric characters", async () => {
    const { input, getValue } = setup();

    await userEvent.type(input, "59");
    expect(getValue()).toBe("59");

    await userEvent.type(input, "a:'!@#$%^&*()_+:\\;'<>?,/");
    expect(getValue()).toBe("59");
  });

  test("allows only one decimal point", async () => {
    const { input, getValue } = setup();

    await userEvent.type(input, "59");
    expect(getValue()).toBe("59");

    await userEvent.type(input, ".");
    expect(getValue()).toBe("59.");

    await userEvent.type(input, "1");
    expect(getValue()).toBe("59.1");

    await userEvent.type(input, "2");
    expect(getValue()).toBe("59.12");

    await userEvent.type(input, ".");
    expect(getValue()).toBe("59.12");
  });
});
