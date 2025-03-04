import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import RenderText from "./RenderText";
import { Generator } from "@composehq/ts-public";
import { transformComponent } from "~/utils/appStore/transformComponent.testUtils";

describe("RenderText", () => {
  test("renders plain text correctly", async () => {
    const { model } = transformComponent(Generator.display.text("hello world"));

    render(
      <RenderText
        text={model}
        color={model.model.properties.color}
        size={model.model.properties.size}
        style={null}
      />
    );
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  test("renders blue text correctly", () => {
    const { model } = transformComponent(
      Generator.display.text("hello world", {
        style: { color: "#0000FF" },
      })
    );

    render(
      <RenderText
        text={model}
        color={model.model.properties.color}
        size={model.model.properties.size}
        style={null}
      />
    );
    expect(screen.getByText("hello world")).toBeInTheDocument();
    expect(screen.getByText("hello world")).toHaveStyle({ color: "#0000FF" });
  });

  test("renders nested blue text correctly", () => {
    const { model } = transformComponent(
      Generator.display.text(
        Generator.display.text("hello world", {
          style: { color: "#0000FF" },
        })
      )
    );

    render(
      <RenderText
        text={model}
        color={model.model.properties.color}
        size={model.model.properties.size}
        style={null}
      />
    );
    expect(screen.getByText("hello world")).toBeInTheDocument();
    expect(screen.getByText("hello world")).toHaveStyle({ color: "#0000FF" });
  });

  test("renders a number correctly", () => {
    const { model } = transformComponent(Generator.display.text(123));

    render(
      <RenderText
        text={model}
        color={model.model.properties.color}
        size={model.model.properties.size}
        style={null}
      />
    );
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  test("renders an array of text correctly", () => {
    const { model } = transformComponent(
      Generator.display.text(["hello", "world"])
    );

    render(
      <RenderText
        text={model}
        color={model.model.properties.color}
        size={model.model.properties.size}
        style={null}
      />
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByText("world")).toBeInTheDocument();
  });

  test("renders a list of nested text components correctly", () => {
    const { model } = transformComponent(
      Generator.display.text([
        "hello",
        Generator.display.text("world", {
          style: { color: "#0000FF" },
        }),
        123,
      ])
    );

    render(
      <RenderText
        text={model}
        color={model.model.properties.color}
        size={model.model.properties.size}
        style={null}
      />
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByText("world")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("world")).toHaveStyle({ color: "#0000FF" });
  });

  test("renders text with size param set correctly", () => {
    const { model } = transformComponent(
      Generator.display.text("hello world", { size: "xl" })
    );

    render(
      <RenderText
        text={model}
        color={model.model.properties.color}
        size={model.model.properties.size}
        style={null}
      />
    );

    expect(screen.getByText("hello world")).toBeInTheDocument();
    expect(screen.getByText("hello world")).toHaveClass("text-xl");
  });

  test("renders text with color param set correctly", () => {
    const { model } = transformComponent(
      Generator.display.text("hello world", { color: "primary" })
    );

    render(
      <RenderText
        text={model}
        color={model.model.properties.color}
        size={model.model.properties.size}
        style={null}
      />
    );

    expect(screen.getByText("hello world")).toBeInTheDocument();
    expect(screen.getByText("hello world")).toHaveClass("text-brand-primary");
  });

  test("renders nested text with color set correctly", () => {
    const { model } = transformComponent(
      Generator.display.text(
        ["hello world", Generator.display.text("BIG TEXT", { size: "xl" })],
        { color: "primary" }
      )
    );

    render(
      <RenderText
        text={model}
        color={model.model.properties.color}
        size={model.model.properties.size}
        style={null}
      />
    );

    expect(screen.getByText("hello world")).toBeInTheDocument();
    expect(screen.getByText("hello world")).toHaveClass("text-brand-primary");
    expect(screen.getByText("BIG TEXT")).toHaveClass("text-xl");
    expect(screen.getByText("BIG TEXT")).not.toHaveClass("text-brand-neutral");
  });
});
