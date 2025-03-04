import { describe, expectTypeOf, test } from "vitest";
import * as generator from "../../../generator";
import * as datetime from "../datetime";
import * as ComposeFile from "../composeFile";
import { DataRow as TableDataRow } from "../table";

describe("ui.form types", () => {
  test("empty form", () => {
    generator.layout.form("form", [], {
      onSubmit: (data) => {
        expectTypeOf(data).toEqualTypeOf<{}>();
      },
    });
  });
  test("single text input form", () => {
    generator.layout.form("form", generator.input.text("text-input"), {
      onSubmit: (data) => {
        expectTypeOf(data).toEqualTypeOf<{ "text-input": string }>();
      },
    });
  });
  test("single text input form, not required", () => {
    generator.layout.form(
      "form",
      generator.input.text("text-input", { required: false }),
      {
        onSubmit: (data) => {
          expectTypeOf(data).toEqualTypeOf<{ "text-input": string | null }>();
        },
      }
    );
  });
  test("single element form, not an input", () => {
    generator.layout.form("form", generator.display.text("text-input"), {
      onSubmit: (data) => {
        expectTypeOf(data).toEqualTypeOf<{}>();
      },
    });
  });
  test("single element form, basic cond", () => {
    generator.layout.form(
      "form",
      generator.dynamic.cond(3 > 2, {
        true: generator.input.text("true"),
        false: generator.input.text("false"),
      }),
      {
        onSubmit: (data) => {
          expectTypeOf(data).toEqualTypeOf<
            {} | { true?: string | undefined } | { false?: string | undefined }
          >();
        },
      }
    );
  });

  test("multi element form", () => {
    generator.layout.form(
      "form",
      [
        generator.input.text("name"),
        generator.input.email("email"),
        generator.input.date("date", { required: false }),
        generator.input.dateTime("datetime"),
        generator.input.fileDrop("files", { required: false }),
      ],
      {
        onSubmit: (data) => {
          expectTypeOf(data).toEqualTypeOf<{
            name: string;
            email: string;
            date: datetime.DateRepresentationWithJsDate | null;
            datetime: datetime.DateTimeRepresentationWithJsDate;
            files: ComposeFile.Type[];
          }>();
        },
      }
    );
  });

  test("multi element form, nested", () => {
    generator.layout.form(
      "form",
      [
        generator.input.text("name"),
        generator.input.email("email"),
        generator.input.date("date", { required: false }),
        generator.layout.stack([
          generator.layout.row(generator.input.dateTime("datetime")),
          generator.input.fileDrop("files", { required: false }),
        ]),
      ],
      {
        onSubmit: (data) => {
          expectTypeOf(data).toEqualTypeOf<{
            name: string;
            email: string;
            date: datetime.DateRepresentationWithJsDate | null;
            datetime: datetime.DateTimeRepresentationWithJsDate;
            files: ComposeFile.Type[];
          }>();
        },
      }
    );
  });

  test("multi element form, nested with conditional", () => {
    generator.layout.form(
      "form",
      [
        generator.input.text("name"),
        generator.input.email("email"),
        generator.input.date("date", { required: false }),
        generator.layout.stack([
          generator.layout.row(generator.input.dateTime("datetime")),
          generator.input.fileDrop("files", { required: false }),
        ]),
        generator.layout.card(
          generator.dynamic.cond(3 > 2, {
            true: generator.input.text("cond"),
            false: generator.input.checkbox("cond"),
          })
        ),
      ],
      {
        onSubmit: (data) => {
          expectTypeOf(data).toEqualTypeOf<{
            name: string;
            email: string;
            date: datetime.DateRepresentationWithJsDate | null;
            datetime: datetime.DateTimeRepresentationWithJsDate;
            files: ComposeFile.Type[];
            cond: string | boolean | undefined;
          }>();
        },
      }
    );
  });

  test("form with spread operator on output", () => {
    generator.layout.form(
      "form",
      [
        generator.input.text("name"),
        generator.input.text("name2"),
        generator.input.text("name3"),
        generator.layout.stack([
          generator.input.text("name4"),
          generator.input.text("name5"),
        ]),
      ],
      {
        onSubmit: ({ name, ...data }) => {
          expectTypeOf(name).toEqualTypeOf<string>();
          expectTypeOf(data).toEqualTypeOf<{
            name2: string;
            name3: string;
            name4: string;
            name5: string;
          }>();
        },
      }
    );
  });

  test("performance test, 50+ inputs, extreme nesting, etc.", () => {
    generator.layout.form(
      "form",
      [
        generator.input.text("name"),
        generator.input.text("name2", { required: false }),
        generator.input.text("name3", { required: true }),
        generator.input.text("name4"),
        generator.input.text("name5", { required: false }),
        generator.input.text("name6", { required: true }),
        generator.input.text("name7"),
        generator.input.text("name8", { required: false }),
        generator.input.text("name9", { required: true }),
        generator.input.text("name10"),
        generator.input.text("name11", { required: false }),
        generator.input.text("name12", { required: true }),
        generator.input.text("name13"),
        generator.input.text("name14", { required: false }),
        generator.input.text("name15", { required: true }),
        generator.input.text("name16"),
        generator.input.text("name17", { required: false }),
        generator.input.text("name18", { required: true }),
        generator.input.text("name19"),
        generator.input.text("name20", { required: false }),
        generator.input.text("name21", { required: true }),
        generator.input.text("name22"),
        generator.input.text("name23", { required: false }),
        generator.input.text("name24", { required: true }),
        generator.input.text("name25"),
        generator.input.text("name26", { required: false }),
        generator.input.text("name27", { required: true }),
        generator.input.text("name28"),
        generator.input.text("name29", { required: false }),
        generator.input.text("name30", { required: true }),
        generator.input.email("email"),
        generator.input.email("email2", { required: false }),
        generator.input.email("email3", { required: true }),
        generator.input.url("url"),
        generator.input.url("url2", { required: false }),
        generator.input.url("ur3", { required: true }),
        generator.input.textArea("text-area"),
        generator.input.textArea("text-area2", { required: false }),
        generator.input.textArea("text-area3", { required: true }),
        generator.input.table("table", [{ a: 1 }]),
        generator.input.time("time"),
        generator.input.time("time2", { required: false }),
        generator.input.time("time3", { required: true }),
        generator.input.date("date", { required: false }),
        generator.layout.stack([
          generator.layout.row(generator.input.dateTime("datetime")),
          generator.input.fileDrop("files", { required: false }),
        ]),
        generator.layout.card(
          generator.dynamic.cond(3 > 2, {
            true: generator.input.text("cond"),
            false: generator.input.checkbox("cond"),
          })
        ),
        generator.input.number("number"),
        generator.input.number("number2", { required: false }),
        generator.input.number("number3", { required: true }),
        generator.input.password("password"),
        generator.input.password("password2", { required: false }),
        generator.input.password("password3", { required: true }),
        generator.input.checkbox("checkbox"),
        generator.input.radioGroup("radio-group", [
          "basic",
          "pro",
          "enterprise",
        ] as const),
        generator.input.selectBox("select-box", [
          "basic",
          "pro",
          "enterprise",
        ] as const),
        generator.input.multiSelectBox("multiselect-box", [
          "basic",
          "pro",
          "enterprise",
        ] as const),
        generator.display.code("code"),
        generator.layout.stack(
          generator.layout.stack([
            generator.layout.stack(
              generator.layout.stack([
                generator.layout.stack(
                  generator.layout.stack([
                    generator.layout.stack(
                      generator.layout.stack([
                        generator.layout.stack(
                          generator.layout.stack([
                            generator.layout.stack(
                              generator.layout.stack([
                                generator.layout.stack(
                                  generator.layout.stack([
                                    generator.layout.stack(
                                      generator.layout.stack([
                                        generator.layout.stack(
                                          generator.layout.stack([
                                            generator.input.text("nestedText"),
                                          ])
                                        ),
                                      ])
                                    ),
                                  ])
                                ),
                              ])
                            ),
                          ])
                        ),
                      ])
                    ),
                  ])
                ),
              ])
            ),
          ])
        ),
      ],
      {
        onSubmit: (data) => {
          expectTypeOf(data).toEqualTypeOf<{
            name: string;
            name2: string | null;
            name3: string;
            name4: string;
            name5: string | null;
            name6: string;
            name7: string;
            name8: string | null;
            name9: string;
            name10: string;
            name11: string | null;
            name12: string;
            name13: string;
            name14: string | null;
            name15: string;
            name16: string;
            name17: string | null;
            name18: string;
            name19: string;
            name20: string | null;
            name21: string;
            name22: string;
            name23: string | null;
            name24: string;
            name25: string;
            name26: string | null;
            name27: string;
            name28: string;
            name29: string | null;
            name30: string;
            email: string;
            email2: string | null;
            email3: string;
            url: string;
            url2: string | null;
            ur3: string;
            "text-area": string;
            "text-area2": string | null;
            "text-area3": string;
            table: TableDataRow[];
            time: datetime.TimeRepresentation;
            time2: datetime.TimeRepresentation | null;
            time3: datetime.TimeRepresentation;
            date: datetime.DateRepresentationWithJsDate | null;
            datetime: datetime.DateTimeRepresentationWithJsDate;
            files: ComposeFile.Type[];
            cond: string | boolean | undefined;
            number: number;
            number2: number | null;
            number3: number;
            password: string;
            password2: string | null;
            password3: string;
            checkbox: boolean;
            "radio-group": "basic" | "pro" | "enterprise";
            "select-box": "basic" | "pro" | "enterprise";
            "multiselect-box": ("basic" | "pro" | "enterprise")[];
            nestedText: string;
          }>();
        },
      }
    );
  });
});
