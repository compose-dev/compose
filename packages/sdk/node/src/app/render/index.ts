import { UIRenderLayout, UIRenderStaticLayout } from "../constants";
import { UI, Generator } from "@composehq/ts-public";
import { validateStaticLayout } from "./validate";
import { diffStaticLayouts } from "./diff";
import { ComponentTree, TableState } from "../utils";
import { configureSubmitButtons } from "./configureSubmitButtons";
import { configureTablePagination } from "./configureTablePagination";
import { awaitPromises } from "./awaitPromises";

async function generateStaticLayout<ReturnData>(
  layout: UIRenderLayout<ReturnData>,
  resolveRender: (data: ReturnData) => void,
  renderId: string,
  tableState: TableState.Class
): Promise<UIRenderStaticLayout> {
  let executed = undefined;

  if (typeof layout === "function") {
    executed = await layout({
      resolve: (data?: ReturnData) => resolveRender(data as ReturnData),
    });
  } else {
    executed = layout;
  }

  if (executed === null || executed === undefined) {
    return Generator.display.none();
  }

  const processed = await configureTablePagination(
    configureSubmitButtons(executed),
    renderId,
    tableState
  );

  await awaitPromises(processed);

  return processed;
}

async function getFormInputErrors(
  formData: Record<string, any>,
  staticLayout: UIRenderStaticLayout
) {
  const inputErrors: Record<string, UI.ValidatorErrorResponseType> = {};
  let hasErrors = false;

  for (const inputComponentId in formData) {
    const inputComponent = ComponentTree.findById(
      staticLayout,
      inputComponentId
    );

    if (
      inputComponent === null ||
      inputComponent.interactionType !== UI.INTERACTION_TYPE.INPUT ||
      inputComponent.hooks.validate === null
    ) {
      continue;
    }

    const inputValidatorResponse = await inputComponent.hooks.validate(
      // @ts-expect-error some error
      formData[inputComponentId]
    );

    if (typeof inputValidatorResponse === "string") {
      hasErrors = true;
      inputErrors[inputComponentId] = inputValidatorResponse;
      // @ts-expect-error false is a valid response but not typed on purpose.
    } else if (inputValidatorResponse === false) {
      hasErrors = true;
      inputErrors[inputComponentId] = "Invalid value";
    }
  }

  if (hasErrors) {
    return inputErrors;
  }

  return null;
}

async function getFormError(
  component: UI.OutputOmittedComponents.LayoutForm,
  formData: Record<string, any>
) {
  if (component.hooks.validate === null) {
    return null;
  }

  const formValidatorResponse = await component.hooks.validate(formData);

  if (typeof formValidatorResponse === "string") {
    return formValidatorResponse;
    // @ts-expect-error false is a valid response but not typed on purpose.
  } else if (formValidatorResponse === false) {
    return "Invalid value";
  }

  return null;
}

function hydrateFormData(
  formData: Record<string, any>,
  componentTree: UIRenderStaticLayout,
  tempFiles: Record<string, ArrayBuffer>
) {
  const hydrated: Record<string, any> = {};
  const tempFilesToDelete: string[] = [];

  for (const key in formData) {
    try {
      const data = formData[key];

      // We'll try to guess if this is a file upload input by
      // checking if the data generally matches the expected type.
      if (Array.isArray(data) && typeof data[0].fileId === "string") {
        hydrated[key] = data.map((file: any) => {
          tempFilesToDelete.push(file.fileId);
          return {
            buffer: Buffer.from(tempFiles[file.fileId]),
            name: file.fileName,
            type: file.fileType,
          };
        });
        continue;
      }

      // We're switching to a new formData model that contains a value
      // and type. This allows to apply transformations to the value
      // depending on the type.
      if (
        typeof formData[key] === "object" &&
        formData[key] !== null &&
        "value" in formData[key] &&
        "type" in formData[key] &&
        Object.keys(formData[key]).length === 2
      ) {
        if (formData[key].type === UI.TYPE.INPUT_DATE) {
          if (formData[key].value === null) {
            hydrated[key] = null;
          } else {
            const { day, month, year } = formData[key].value;
            hydrated[key] = {
              jsDate: new Date(Date.UTC(year, month - 1, day)),
              year,
              month,
              day,
            };
          }
        } else if (formData[key].type === UI.TYPE.INPUT_TIME) {
          if (formData[key].value === null) {
            hydrated[key] = null;
          } else {
            const { hour, minute } = formData[key].value;
            hydrated[key] = {
              hour,
              minute,
            };
          }
        } else if (formData[key].type === UI.TYPE.INPUT_DATE_TIME) {
          if (formData[key].value === null) {
            hydrated[key] = null;
          } else {
            const { day, month, year, hour, minute } = formData[key].value;
            hydrated[key] = {
              jsDate: new Date(Date.UTC(year, month - 1, day, hour, minute)),
              year,
              month,
              day,
              hour,
              minute,
            };
          }
        } else if (formData[key].type === UI.TYPE.INPUT_TABLE) {
          const component = ComponentTree.findById(componentTree, key);

          if (component && component.type === UI.TYPE.INPUT_TABLE) {
            if (
              component.model.properties.selectMode ===
              UI.Table.SELECTION_RETURN_TYPE.ID
            ) {
              hydrated[key] = formData[key].value;
            } else if (
              component.model.properties.selectMode ===
              UI.Table.SELECTION_RETURN_TYPE.INDEX
            ) {
              hydrated[key] = formData[key].value.map(
                (index: string | number) =>
                  typeof index === "string" ? parseInt(index) : index
              );
            } else {
              let rows: any[] = [];
              const primaryKey = component.model.properties.primaryKey;

              if (primaryKey === undefined) {
                rows = formData[key].value.map((index: number) => {
                  return component.model.properties.data[index];
                });
              } else {
                let primaryKeyMap: Record<string | number, any> = {};

                for (const value of formData[key].value) {
                  primaryKeyMap[value] = true;
                }

                rows = component.model.properties.data.filter(
                  (row) => row[primaryKey] in primaryKeyMap
                );
              }

              hydrated[key] = rows;
            }
          } else {
            throw new Error(
              "An error occurred while trying to hydrate a table input: could not find the table within the component tree"
            );
          }
        } else if (formData[key].type === UI.TYPE.INPUT_JSON) {
          hydrated[key] = JSON.parse(formData[key].value);
        } else {
          hydrated[key] = formData[key].value;
        }

        continue;
      }

      // Fallback where we just pass the value through.
      hydrated[key] = formData[key];
    } catch (error) {
      hydrated[key] = formData[key];
    }
  }

  return { hydrated, tempFilesToDelete };
}

export {
  generateStaticLayout,
  validateStaticLayout,
  diffStaticLayouts,
  getFormInputErrors,
  getFormError,
  hydrateFormData,
};
