import { describe, it, expect } from "vitest";
import { hydrateFormData } from "./index";
import { UI, Generator } from "@composehq/ts-public";

describe("Render Hydrate Form Date", () => {
  it("should handle empty form data", () => {
    const { hydrated, tempFilesToDelete } = hydrateFormData(
      {},
      Generator.layout.stack([]),
      {}
    );

    expect(Object.keys(hydrated).length).toEqual(0);
    expect(tempFilesToDelete.length).toEqual(0);
  });

  it("should handle form data with text input", () => {
    const { hydrated, tempFilesToDelete } = hydrateFormData(
      { firstName: "John" },
      Generator.layout.stack([]),
      {}
    );

    expect(hydrated.firstName).toEqual("John");
    expect(tempFilesToDelete.length).toEqual(0);
  });

  it("should handle form data for date input", () => {
    const input = {
      birthday: {
        value: {
          day: 1,
          month: 1,
          year: 1990,
        },
        type: UI.TYPE.INPUT_DATE,
      },
    };

    const { hydrated } = hydrateFormData(input, Generator.layout.stack([]), {});

    expect(hydrated.birthday.jsDate).toBeInstanceOf(Date);
    expect(hydrated.birthday.jsDate.getUTCFullYear()).toBe(1990);
    expect(hydrated.birthday.jsDate.getUTCMonth()).toBe(0); // JavaScript months are 0-indexed
    expect(hydrated.birthday.jsDate.getUTCDate()).toBe(1);

    expect(hydrated.birthday.year).toBe(1990);
    expect(hydrated.birthday.month).toBe(1);
    expect(hydrated.birthday.day).toBe(1);
  });

  it("should handle form data for time input", () => {
    const input = {
      birthday: {
        value: {
          hour: 1,
          minute: 1,
        },
        type: UI.TYPE.INPUT_TIME,
      },
    };

    const { hydrated } = hydrateFormData(input, Generator.layout.stack([]), {});

    expect(hydrated.birthday.hour).toBe(1);
    expect(hydrated.birthday.minute).toBe(1);
  });

  it("should handle form data for date time input", () => {
    const input = {
      birthday: {
        value: {
          day: 1,
          month: 1,
          year: 1990,
          hour: 1,
          minute: 1,
        },
        type: UI.TYPE.INPUT_DATE_TIME,
      },
    };

    const { hydrated } = hydrateFormData(input, Generator.layout.stack([]), {});

    expect(hydrated.birthday.jsDate).toBeInstanceOf(Date);
    expect(hydrated.birthday.jsDate.getUTCFullYear()).toBe(1990);
    expect(hydrated.birthday.jsDate.getUTCMonth()).toBe(0); // JavaScript months are 0-indexed
    expect(hydrated.birthday.jsDate.getUTCDate()).toBe(1);
    expect(hydrated.birthday.jsDate.getUTCHours()).toBe(1);
    expect(hydrated.birthday.jsDate.getUTCMinutes()).toBe(1);

    expect(hydrated.birthday.year).toBe(1990);
    expect(hydrated.birthday.month).toBe(1);
    expect(hydrated.birthday.day).toBe(1);
    expect(hydrated.birthday.hour).toBe(1);
    expect(hydrated.birthday.minute).toBe(1);
  });

  it("should handle form data for checkbox input", () => {
    const input = {
      checked: true,
    };

    const { hydrated } = hydrateFormData(input, Generator.layout.stack([]), {});

    expect(hydrated.checked).toBe(true);
  });

  it("should handle form data for file drop", () => {
    const input = {
      profilePicture: [
        {
          fileId: "123",
          fileName: "profile.jpg",
          fileType: "image/jpeg",
        },
      ],
    };

    const tempFiles = { "123": new ArrayBuffer(8) };

    const { hydrated, tempFilesToDelete } = hydrateFormData(
      input,
      Generator.layout.stack([]),
      tempFiles
    );

    expect(Array.isArray(hydrated.profilePicture)).toBe(true);
    expect(hydrated.profilePicture.length).toBe(1);
    expect(Buffer.isBuffer(hydrated.profilePicture[0].buffer)).toBe(true);

    expect(hydrated.profilePicture[0].name).toBe("profile.jpg");
    expect(hydrated.profilePicture[0].type).toBe("image/jpeg");

    expect(tempFilesToDelete).toEqual(["123"]);
  });

  it("should handle form data for table v1", () => {
    const input = {
      table: [{ id: "1" }],
    };

    const tableData = [{ id: "1" }, { id: "2" }];

    const componentTree = Generator.layout.stack([
      Generator.input.table("table", tableData),
    ]);

    const { hydrated } = hydrateFormData(input, componentTree, {});

    expect(JSON.stringify(hydrated.table)).toEqual(
      JSON.stringify([{ id: "1" }])
    );
  });

  it("should handle form data for table v2", () => {
    const input = {
      table: {
        value: [0, 1],
        type: UI.TYPE.INPUT_TABLE,
      },
    };

    const tableData = [{ id: "1" }, { id: "2" }];

    const componentTree = Generator.layout.stack([
      Generator.input.table("table", tableData),
    ]);

    const { hydrated } = hydrateFormData(input, componentTree, {});

    expect(JSON.stringify(hydrated.table)).toEqual(JSON.stringify(tableData));
  });
});
