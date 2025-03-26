import * as UI from "../../ui";
import { BaseWithInputInteraction } from "../base";

interface BaseTextProperties<
  TBaseInputValue,
  TRequired extends UI.BaseGeneric.Required,
> extends BaseWithInputInteraction<TRequired> {
  /**
   * A custom function to validate the input. It will be passed the current value of the input
   * and should return an error string or void (i.e. nothing) if the input is valid.
   *
   * If the component is marked as `required: false`, the callback will be passed `null`
   * if the input is empty.
   */
  validate: UI.Factory.Nullable<
    UI.Factory.NullableValidatorCallback<TBaseInputValue, TRequired>
  >;
  /**
   * A callback function that is called when the user presses enter while
   * the input is focused. It will be passed the current value of the input.
   *
   * If the component is marked as `required: false`, the callback will be passed `null`
   * if the input is empty.
   */
  onEnter: UI.Factory.Nullable<
    UI.Factory.NullableInputValueCallback<TBaseInputValue, TRequired>
  >;
  /**
   * The initial value of the input.
   */
  initialValue: UI.Factory.Nullable<TBaseInputValue>;
}

type BaseRequiredFields = "id";

interface TextProperties<TRequired extends UI.BaseGeneric.Required>
  extends BaseTextProperties<UI.BaseInputValue.Text, TRequired> {}

interface EmailProperties<TRequired extends UI.BaseGeneric.Required>
  extends BaseTextProperties<UI.BaseInputValue.Email, TRequired> {}

interface UrlProperties<TRequired extends UI.BaseGeneric.Required>
  extends BaseTextProperties<UI.BaseInputValue.Url, TRequired> {}

interface NumberProperties<TRequired extends UI.BaseGeneric.Required>
  extends BaseTextProperties<UI.BaseInputValue.Number, TRequired> {}

interface PasswordProperties<TRequired extends UI.BaseGeneric.Required>
  extends BaseTextProperties<UI.BaseInputValue.Password, TRequired> {}

interface TextAreaProperties<TRequired extends UI.BaseGeneric.Required>
  extends BaseTextProperties<UI.BaseInputValue.TextArea, TRequired> {}

interface JsonProperties<TRequired extends UI.BaseGeneric.Required>
  extends BaseTextProperties<UI.BaseInputValue.Json, TRequired> {}

type OptionalTextProperties<TRequired extends UI.BaseGeneric.Required> = Omit<
  TextProperties<TRequired>,
  BaseRequiredFields
>;

type OptionalEmailProperties<TRequired extends UI.BaseGeneric.Required> = Omit<
  EmailProperties<TRequired>,
  BaseRequiredFields
>;

type OptionalUrlProperties<TRequired extends UI.BaseGeneric.Required> = Omit<
  UrlProperties<TRequired>,
  BaseRequiredFields
>;

type OptionalNumberProperties<TRequired extends UI.BaseGeneric.Required> = Omit<
  NumberProperties<TRequired>,
  BaseRequiredFields
>;

type OptionalPasswordProperties<TRequired extends UI.BaseGeneric.Required> =
  Omit<PasswordProperties<TRequired>, BaseRequiredFields>;

type OptionalTextAreaProperties<TRequired extends UI.BaseGeneric.Required> =
  Omit<TextAreaProperties<TRequired>, BaseRequiredFields>;

type OptionalJsonProperties<TRequired extends UI.BaseGeneric.Required> = Omit<
  JsonProperties<TRequired>,
  BaseRequiredFields
>;

const defaultBaseProperties: OptionalTextProperties<UI.BaseGeneric.Required> = {
  initialValue: null,
  label: null,
  required: true,
  description: null,
  validate: null,
  onEnter: null,
  style: null,
};

const defaultNumberProperties: OptionalNumberProperties<UI.BaseGeneric.Required> =
  {
    initialValue: null,
    label: null,
    required: true,
    description: null,
    validate: null,
    onEnter: null,
    style: null,
  };

const defaultJsonProperties: OptionalJsonProperties<UI.BaseGeneric.Required> = {
  initialValue: null,
  label: null,
  required: true,
  description: null,
  validate: null,
  onEnter: null,
  style: null,
};

/**
 * Generate a text input component.
 *
 * ```typescript
 * // Basic example
 * page.add(() =>
 *  ui.textInput("name", {
 *    onEnter: (text) => {
 *      page.toast(`Hello ${text}!`);
 *    },
 *  })
 * );
 *
 * // Part of a form
 * page.add(() =>
 *  ui.form(
 *    "form",
 *    [
 *      ui.textInput("name"),
 *      ui.emailInput("email")
 *    ],
 *    {
 *      onSubmit: (formData) => {
 *        const { name, email } = formData;
 *        page.toast(`Hello ${name}! Your email is ${email}.`);
 *      },
 *    }
 *  )
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/text-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalTextProperties<TRequired>>} properties - Optional properties to configure the text input component.
 * @param {OptionalTextProperties<TRequired>["label"]} properties.label - Label to display above the text input.
 * @param {OptionalTextProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalTextProperties<TRequired>["required"]} properties.required - Whether the text input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalTextProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalTextProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the text input is focused.
 * @param {OptionalTextProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the text input. Defaults to `null`.
 * @param {OptionalTextProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the text input HTML element.
 * @returns The configured text input component.
 */
function text<TId extends UI.BaseGeneric.Id, TRequired extends true>(
  id: TId,
  properties?: Partial<OptionalTextProperties<TRequired>>
): UI.OutputOmittedComponents.InputText<TId, TRequired>;

/**
 * Generate a text input component.
 *
 * ```typescript
 * // Basic example
 * page.add(() =>
 *  ui.textInput("name", {
 *    onEnter: (text) => {
 *      page.toast(`Hello ${text}!`);
 *    },
 *  })
 * );
 *
 * // Part of a form
 * page.add(() =>
 *  ui.form(
 *    "form",
 *    [
 *      ui.textInput("name"),
 *      ui.emailInput("email")
 *    ],
 *    {
 *      onSubmit: (formData) => {
 *        const { name, email } = formData;
 *        page.toast(`Hello ${name}! Your email is ${email}.`);
 *      },
 *    }
 *  )
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/text-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalTextProperties<TRequired>>} properties - Optional properties to configure the text input component.
 * @param {OptionalTextProperties<TRequired>["label"]} properties.label - Label to display above the text input.
 * @param {OptionalTextProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalTextProperties<TRequired>["required"]} properties.required - Whether the text input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalTextProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalTextProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the text input is focused.
 * @param {OptionalTextProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the text input. Defaults to `null`.
 * @param {OptionalTextProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the text input HTML element.
 * @returns The configured text input component.
 */
function text<TId extends UI.BaseGeneric.Id, TRequired extends false>(
  id: TId,
  properties?: Partial<OptionalTextProperties<TRequired>>
): UI.OutputOmittedComponents.InputText<TId, TRequired>;

function text<
  TId extends UI.BaseGeneric.Id,
  TRequired extends UI.BaseGeneric.Required,
>(
  id: TId,
  properties: Partial<OptionalTextProperties<TRequired>> = {}
): UI.OutputOmittedComponents.InputText<TId, TRequired> {
  const mergedProperties = { ...defaultBaseProperties, ...properties };

  return {
    model: {
      id,
      label: mergedProperties.label,
      description: mergedProperties.description,
      required: mergedProperties.required as TRequired,
      hasValidateHook: mergedProperties.validate !== null,
      properties: {
        initialValue: mergedProperties.initialValue,
        hasOnEnterHook: mergedProperties.onEnter !== null,
      },
      style: mergedProperties.style,
    },
    hooks: {
      validate: mergedProperties.validate,
      onEnter: mergedProperties.onEnter,
    },
    type: UI.TYPE.INPUT_TEXT,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

/**
 * Generate an email input component, which enforces the input to be a valid email address.
 *
 * ```typescript
 * // Basic example
 * page.add(() => ui.emailInput("email", {
 *   onEnter: (email) => {
 *     page.toast(`You typed ${email}`);
 *   },
 * }));
 *
 * // Part of a form
 * page.add(() =>
 *  ui.form("form", [ui.textInput("name"), ui.emailInput("email")], {
 *    onSubmit: (formData) => {
 *      const { name, email } = formData;
 *      page.toast(`Hello ${name}! Your email is ${email}.`);
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/email-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalEmailProperties<TRequired>>} properties - Optional properties to configure the email input component.
 * @param {OptionalEmailProperties<TRequired>["label"]} properties.label - Label to display above the email input.
 * @param {OptionalEmailProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalEmailProperties<TRequired>["required"]} properties.required - Whether the email input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalEmailProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalEmailProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the email input is focused.
 * @param {OptionalEmailProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the email input. Defaults to `null`.
 * @param {OptionalEmailProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the email input HTML element.
 * @returns The configured email input component.
 */
function email<TId extends UI.BaseGeneric.Id, TRequired extends true>(
  id: TId,
  properties?: Partial<OptionalEmailProperties<TRequired>>
): UI.OutputOmittedComponents.InputEmail<TId, TRequired>;

/**
 * Generate an email input component, which enforces the input to be a valid email address.
 *
 * ```typescript
 * // Basic example
 * page.add(() => ui.emailInput("email", {
 *   onEnter: (email) => {
 *     page.toast(`You typed ${email}`);
 *   },
 * }));
 *
 * // Part of a form
 * page.add(() =>
 *  ui.form("form", [ui.textInput("name"), ui.emailInput("email")], {
 *    onSubmit: (formData) => {
 *      const { name, email } = formData;
 *      page.toast(`Hello ${name}! Your email is ${email}.`);
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/email-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalEmailProperties<TRequired>>} properties - Optional properties to configure the email input component.
 * @param {OptionalEmailProperties<TRequired>["label"]} properties.label - Label to display above the email input.
 * @param {OptionalEmailProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalEmailProperties<TRequired>["required"]} properties.required - Whether the email input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalEmailProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalEmailProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the email input is focused.
 * @param {OptionalEmailProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the email input. Defaults to `null`.
 * @param {OptionalEmailProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the email input HTML element.
 * @returns The configured email input component.
 */
function email<TId extends UI.BaseGeneric.Id, TRequired extends false>(
  id: TId,
  properties?: Partial<OptionalEmailProperties<TRequired>>
): UI.OutputOmittedComponents.InputEmail<TId, TRequired>;

function email<
  TId extends UI.BaseGeneric.Id,
  TRequired extends UI.BaseGeneric.Required,
>(
  id: TId,
  properties: Partial<OptionalEmailProperties<TRequired>> = {}
): UI.OutputOmittedComponents.InputEmail<TId, TRequired> {
  const mergedOptions = { ...defaultBaseProperties, ...properties };

  return {
    model: {
      id,
      label: mergedOptions.label,
      description: mergedOptions.description,
      required: mergedOptions.required as TRequired,
      hasValidateHook: mergedOptions.validate !== null,
      properties: {
        initialValue: mergedOptions.initialValue,
        hasOnEnterHook: mergedOptions.onEnter !== null,
      },
      style: mergedOptions.style,
    },
    hooks: {
      validate: mergedOptions.validate,
      onEnter: mergedOptions.onEnter,
    },
    type: UI.TYPE.INPUT_EMAIL,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

/**
 * Generate a url input component, which enforces the input to be a valid url.
 *
 * ```typescript
 * // Basic example
 * page.add(() => ui.urlInput("url", {
 *   onEnter: (url) => {
 *     page.toast(`You typed ${url}`);
 *   },
 * }));
 *
 * // Part of a form
 * page.add(() =>
 *  ui.form("form", [ui.textInput("websiteName"), ui.urlInput("url")], {
 *    onSubmit: (formData) => {
 *      const { websiteName, url } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/url-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalUrlProperties<TRequired>>} properties - Optional properties to configure the url input component.
 * @param {OptionalUrlProperties<TRequired>["label"]} properties.label - Label to display above the url input.
 * @param {OptionalUrlProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalUrlProperties<TRequired>["required"]} properties.required - Whether the url input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalUrlProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalUrlProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the url input is focused.
 * @param {OptionalUrlProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the url input. Defaults to `null`.
 * @param {OptionalUrlProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the url input HTML element.
 * @returns The configured url input component.
 */
function url<TId extends UI.BaseGeneric.Id, TRequired extends true>(
  id: TId,
  properties?: Partial<OptionalUrlProperties<TRequired>>
): UI.OutputOmittedComponents.InputUrl<TId, TRequired>;

/**
 * Generate a url input component, which enforces the input to be a valid url.
 *
 * ```typescript
 * // Basic example
 * page.add(() => ui.urlInput("url", {
 *   onEnter: (url) => {
 *     page.toast(`You typed ${url}`);
 *   },
 * }));
 *
 * // Part of a form
 * page.add(() =>
 *  ui.form("form", [ui.textInput("websiteName"), ui.urlInput("url")], {
 *    onSubmit: (formData) => {
 *      const { websiteName, url } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/url-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalUrlProperties<TRequired>>} properties - Optional properties to configure the url input component.
 * @param {OptionalUrlProperties<TRequired>["label"]} properties.label - Label to display above the url input.
 * @param {OptionalUrlProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalUrlProperties<TRequired>["required"]} properties.required - Whether the url input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalUrlProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalUrlProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the url input is focused.
 * @param {OptionalUrlProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the url input. Defaults to `null`.
 * @param {OptionalUrlProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the url input HTML element.
 * @returns The configured url input component.
 */
function url<TId extends UI.BaseGeneric.Id, TRequired extends false>(
  id: TId,
  properties?: Partial<OptionalUrlProperties<TRequired>>
): UI.OutputOmittedComponents.InputUrl<TId, TRequired>;

function url<
  TId extends UI.BaseGeneric.Id,
  TRequired extends UI.BaseGeneric.Required,
>(
  id: TId,
  properties: Partial<OptionalUrlProperties<TRequired>> = {}
): UI.OutputOmittedComponents.InputUrl<TId, TRequired> {
  const mergedProperties = { ...defaultBaseProperties, ...properties };

  return {
    model: {
      id,
      label: mergedProperties.label,
      description: mergedProperties.description,
      required: mergedProperties.required as TRequired,
      hasValidateHook: mergedProperties.validate !== null,
      properties: {
        initialValue: mergedProperties.initialValue,
        hasOnEnterHook: mergedProperties.onEnter !== null,
      },
      style: mergedProperties.style,
    },
    hooks: {
      validate: mergedProperties.validate,
      onEnter: mergedProperties.onEnter,
    },
    type: UI.TYPE.INPUT_URL,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

/**
 * Generate a number input component, which enforces the input to be a valid number.
 *
 * ```typescript
 * // Basic example
 * page.add(() => ui.numberInput("number", {
 *   onEnter: (number) => {
 *     page.toast(`You typed ${number}`);
 *   },
 * }));
 *
 * // Part of a form
 * page.add(() =>
 *  ui.form("form", [ui.textInput("name"), ui.numberInput("age")], {
 *    onSubmit: (formData) => {
 *      const { name, age } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/number-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalNumberProperties<TRequired>>} properties - Optional properties to configure the number input component.
 * @param {OptionalNumberProperties<TRequired>["label"]} properties.label - Label to display above the number input.
 * @param {OptionalNumberProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalNumberProperties<TRequired>["required"]} properties.required - Whether the number input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalNumberProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalNumberProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the number input is focused.
 * @param {OptionalNumberProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the number input. Defaults to `null`.
 * @param {OptionalNumberProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the number input HTML element.
 * @returns The configured number input component.
 */
function number<TId extends UI.BaseGeneric.Id, TRequired extends true>(
  id: TId,
  properties?: Partial<OptionalNumberProperties<TRequired>>
): UI.OutputOmittedComponents.InputNumber<TId, TRequired>;

/**
 * Generate a number input component, which enforces the input to be a valid number.
 *
 * ```typescript
 * // Basic example
 * page.add(() => ui.numberInput("number", {
 *   onEnter: (number) => {
 *     page.toast(`You typed ${number}`);
 *   },
 * }));
 *
 * // Part of a form
 * page.add(() =>
 *  ui.form("form", [ui.textInput("name"), ui.numberInput("age")], {
 *    onSubmit: (formData) => {
 *      const { name, age } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/number-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalNumberProperties<TRequired>>} properties - Optional properties to configure the number input component.
 * @param {OptionalNumberProperties<TRequired>["label"]} properties.label - Label to display above the number input.
 * @param {OptionalNumberProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalNumberProperties<TRequired>["required"]} properties.required - Whether the number input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalNumberProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalNumberProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the number input is focused.
 * @param {OptionalNumberProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the number input. Defaults to `null`.
 * @param {OptionalNumberProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the number input HTML element.
 * @returns The configured number input component.
 */
function number<TId extends UI.BaseGeneric.Id, TRequired extends false>(
  id: TId,
  properties?: Partial<OptionalNumberProperties<TRequired>>
): UI.OutputOmittedComponents.InputNumber<TId, TRequired>;

function number<
  TId extends UI.BaseGeneric.Id,
  TRequired extends UI.BaseGeneric.Required,
>(
  id: TId,
  properties: Partial<OptionalNumberProperties<TRequired>> = {}
): UI.OutputOmittedComponents.InputNumber<TId, TRequired> {
  const mergedProperties = { ...defaultNumberProperties, ...properties };

  return {
    model: {
      id,
      label: mergedProperties.label,
      description: mergedProperties.description,
      required: mergedProperties.required as TRequired,
      hasValidateHook: mergedProperties.validate !== null,
      properties: {
        initialValue: mergedProperties.initialValue,
        hasOnEnterHook: mergedProperties.onEnter !== null,
      },
      style: mergedProperties.style,
    },
    hooks: {
      validate: mergedProperties.validate,
      onEnter: mergedProperties.onEnter,
    },
    type: UI.TYPE.INPUT_NUMBER,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

/**
 * Generate a password input component, which will obscure the input.
 *
 * ```typescript
 * // Basic example
 * page.add(() => ui.passwordInput("password", {
 *   onEnter: (password) => {
 *     page.toast(`You typed ${password}`);
 *   },
 * }));
 *
 * // Part of a form
 * page.add(() =>
 *  ui.form("form", [ui.textInput("username"), ui.passwordInput("password")], {
 *    onSubmit: (formData) => {
 *      const { username, password } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/password-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalPasswordProperties<TRequired>>} properties - Optional properties to configure the password input component.
 * @param {OptionalPasswordProperties<TRequired>["label"]} properties.label - Label to display above the password input.
 * @param {OptionalPasswordProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalPasswordProperties<TRequired>["required"]} properties.required - Whether the password input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalPasswordProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalPasswordProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the password input is focused.
 * @param {OptionalPasswordProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the password input. Defaults to `null`.
 * @param {OptionalPasswordProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the password input HTML element.
 * @returns The configured password input component.
 */
function password<TId extends UI.BaseGeneric.Id, TRequired extends true>(
  id: TId,
  properties?: Partial<OptionalPasswordProperties<TRequired>>
): UI.OutputOmittedComponents.InputPassword<TId, TRequired>;

/**
 * Generate a password input component, which will obscure the input.
 *
 * ```typescript
 * // Basic example
 * page.add(() => ui.passwordInput("password", {
 *   onEnter: (password) => {
 *     page.toast(`You typed ${password}`);
 *   },
 * }));
 *
 * // Part of a form
 * page.add(() =>
 *  ui.form("form", [ui.textInput("username"), ui.passwordInput("password")], {
 *    onSubmit: (formData) => {
 *      const { username, password } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/password-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalPasswordProperties<TRequired>>} properties - Optional properties to configure the password input component.
 * @param {OptionalPasswordProperties<TRequired>["label"]} properties.label - Label to display above the password input.
 * @param {OptionalPasswordProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalPasswordProperties<TRequired>["required"]} properties.required - Whether the password input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalPasswordProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalPasswordProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the password input is focused.
 * @param {OptionalPasswordProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the password input. Defaults to `null`.
 * @param {OptionalPasswordProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the password input HTML element.
 * @returns The configured password input component.
 */
function password<TId extends UI.BaseGeneric.Id, TRequired extends false>(
  id: TId,
  properties?: Partial<OptionalPasswordProperties<TRequired>>
): UI.OutputOmittedComponents.InputPassword<TId, TRequired>;

function password<
  TId extends UI.BaseGeneric.Id,
  TRequired extends UI.BaseGeneric.Required,
>(
  id: TId,
  properties: Partial<OptionalPasswordProperties<TRequired>> = {}
): UI.OutputOmittedComponents.InputPassword<TId, TRequired> {
  const mergedProperties = { ...defaultBaseProperties, ...properties };

  return {
    model: {
      id,
      label: mergedProperties.label,
      description: mergedProperties.description,
      required: mergedProperties.required as TRequired,
      hasValidateHook: mergedProperties.validate !== null,
      properties: {
        initialValue: mergedProperties.initialValue,
        hasOnEnterHook: mergedProperties.onEnter !== null,
      },
      style: mergedProperties.style,
    },
    hooks: {
      validate: mergedProperties.validate,
      onEnter: mergedProperties.onEnter,
    },
    type: UI.TYPE.INPUT_PASSWORD,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

/**
 * Generate a text area input component, which will allow the user to enter multiple lines of text.
 *
 * ```typescript
 * // Basic example
 * page.add(() => ui.textArea("feedback", {
 *   onEnter: (feedback) => {
 *     page.toast(`You typed ${feedback}`);
 *   },
 * }));
 *
 * // Part of a form
 * page.add(() =>
 *  ui.form("form", [ui.numberInput("rating"), ui.textArea("feedback")], {
 *    onSubmit: (formData) => {
 *      const { rating, feedback } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/text-area documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalTextAreaProperties<TRequired>>} properties - Optional properties to configure the text area component.
 * @param {OptionalPasswordProperties<TRequired>["label"]} properties.label - Label to display above the text area.
 * @param {OptionalPasswordProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalPasswordProperties<TRequired>["required"]} properties.required - Whether the text area is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalPasswordProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalPasswordProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the text area is focused.
 * @param {OptionalPasswordProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the text area. Defaults to `null`.
 * @param {OptionalPasswordProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the text area HTML element.
 * @returns The configured text area component.
 */
function textArea<TId extends UI.BaseGeneric.Id, TRequired extends true>(
  id: TId,
  properties?: Partial<OptionalTextAreaProperties<TRequired>>
): UI.OutputOmittedComponents.InputTextArea<TId, TRequired>;

/**
 * Generate a text area input component, which will allow the user to enter multiple lines of text.
 *
 * ```typescript
 * // Basic example
 * page.add(() => ui.textArea("feedback", {
 *   onEnter: (feedback) => {
 *     page.toast(`You typed ${feedback}`);
 *   },
 * }));
 *
 * // Part of a form
 * page.add(() =>
 *  ui.form("form", [ui.numberInput("rating"), ui.textArea("feedback")], {
 *    onSubmit: (formData) => {
 *      const { rating, feedback } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/text-area documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalTextAreaProperties<TRequired>>} properties - Optional properties to configure the text area component.
 * @param {OptionalPasswordProperties<TRequired>["label"]} properties.label - Label to display above the text area.
 * @param {OptionalPasswordProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalPasswordProperties<TRequired>["required"]} properties.required - Whether the text area is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalPasswordProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalPasswordProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the text area is focused.
 * @param {OptionalPasswordProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the text area. Defaults to `null`.
 * @param {OptionalPasswordProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the text area HTML element.
 * @returns The configured text area component.
 */
function textArea<TId extends UI.BaseGeneric.Id, TRequired extends false>(
  id: TId,
  properties?: Partial<OptionalTextAreaProperties<TRequired>>
): UI.OutputOmittedComponents.InputTextArea<TId, TRequired>;

function textArea<
  TId extends UI.BaseGeneric.Id,
  TRequired extends UI.BaseGeneric.Required,
>(
  id: TId,
  properties: Partial<OptionalTextAreaProperties<TRequired>> = {}
): UI.OutputOmittedComponents.InputTextArea<TId, TRequired> {
  const mergedProperties = { ...defaultBaseProperties, ...properties };

  return {
    model: {
      id,
      label: mergedProperties.label,
      description: mergedProperties.description,
      required: mergedProperties.required as TRequired,
      hasValidateHook: mergedProperties.validate !== null,
      properties: {
        initialValue: mergedProperties.initialValue,
        hasOnEnterHook: mergedProperties.onEnter !== null,
      },
      style: mergedProperties.style,
    },
    hooks: {
      validate: mergedProperties.validate,
      onEnter: mergedProperties.onEnter,
    },
    type: UI.TYPE.INPUT_TEXT_AREA,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

/**
 * Generate a JSON input component, which will allow the user to edit JSON data..
 *
 * ```typescript
 * // Basic example
 * page.add(() => ui.jsonInput("json", {
 *   onEnter: (json) => {
 *     console.log(json);
 *   },
 * }));
 *
 * // Part of a form
 * page.add(() =>
 *  ui.form("form", [ui.jsonInput("featureFlags")], {
 *    onSubmit: (formData) => {
 *      const { featureFlags } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/json-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalJsonProperties<TRequired>>} properties - Optional properties to configure the JSON input component.
 * @param {OptionalJsonProperties<TRequired>["label"]} properties.label - Label to display above the JSON input.
 * @param {OptionalJsonProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalJsonProperties<TRequired>["required"]} properties.required - Whether the JSON input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalJsonProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalJsonProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the JSON input is focused.
 * @param {OptionalJsonProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the JSON input. Defaults to `null`.
 * @param {OptionalJsonProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the JSON input HTML element.
 * @returns The configured JSON input component.
 */
function json<TId extends UI.BaseGeneric.Id, TRequired extends true>(
  id: TId,
  properties?: Partial<OptionalJsonProperties<TRequired>>
): UI.OutputOmittedComponents.InputJson<TId, TRequired>;

/**
 * Generate a JSON input component, which will allow the user to edit JSON data..
 *
 * ```typescript
 * // Basic example
 * page.add(() => ui.jsonInput("json", {
 *   onEnter: (json) => {
 *     console.log(json);
 *   },
 * }));
 *
 * // Part of a form
 * page.add(() =>
 *  ui.form("form", [ui.jsonInput("featureFlags")], {
 *    onSubmit: (formData) => {
 *      const { featureFlags } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/json-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalJsonProperties<TRequired>>} properties - Optional properties to configure the JSON input component.
 * @param {OptionalJsonProperties<TRequired>["label"]} properties.label - Label to display above the JSON input.
 * @param {OptionalJsonProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalJsonProperties<TRequired>["required"]} properties.required - Whether the JSON input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalJsonProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalJsonProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the JSON input is focused.
 * @param {OptionalJsonProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the JSON input. Defaults to `null`.
 * @param {OptionalJsonProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the JSON input HTML element.
 * @returns The configured JSON input component.
 */
function json<TId extends UI.BaseGeneric.Id, TRequired extends false>(
  id: TId,
  properties?: Partial<OptionalJsonProperties<TRequired>>
): UI.OutputOmittedComponents.InputJson<TId, TRequired>;

function json<
  TId extends UI.BaseGeneric.Id,
  TRequired extends UI.BaseGeneric.Required,
>(
  id: TId,
  properties: Partial<OptionalJsonProperties<TRequired>> = {}
): UI.OutputOmittedComponents.InputJson<TId, TRequired> {
  const mergedProperties = { ...defaultJsonProperties, ...properties };

  return {
    model: {
      id,
      label: mergedProperties.label,
      description: mergedProperties.description,
      required: mergedProperties.required as TRequired,
      hasValidateHook: mergedProperties.validate !== null,
      properties: {
        initialValue: mergedProperties.initialValue,
        hasOnEnterHook: mergedProperties.onEnter !== null,
      },
      style: mergedProperties.style,
    },
    hooks: {
      validate: mergedProperties.validate,
      onEnter: mergedProperties.onEnter,
    },
    type: UI.TYPE.INPUT_JSON,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

export { text, email, url, number, password, textArea, json };
