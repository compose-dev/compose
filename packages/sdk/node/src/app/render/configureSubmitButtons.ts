/**
 * Tests for this file are via the appRunner tests.
 */

import { Generator, UI } from "@composehq/ts-public";
import { UIRenderStaticLayout } from "../constants";
import { ComponentTree } from "../utils";
import { v4 as uuid } from "uuid";

function configureSubmitButtonsRecursive(
  layout: UIRenderStaticLayout,
  _hideSubmitButton: boolean
): UIRenderStaticLayout {
  let hideSubmitButton = _hideSubmitButton;

  // First, check if this is a submit button leaf node and handle accordingly.
  if (layout.type === UI.TYPE.BUTTON_FORM_SUBMIT) {
    if (hideSubmitButton) {
      return Generator.display.none();
    }

    return layout;
  }

  // If this branch is a form component leaf node, check if it has a
  // submit button. If it doesn't, check if we should add one.
  if (layout.type === UI.TYPE.LAYOUT_FORM) {
    hideSubmitButton = layout.model.properties.hideSubmitButton === true;

    const submitButton = ComponentTree.findByType(
      layout,
      UI.TYPE.BUTTON_FORM_SUBMIT
    );

    if (submitButton === null) {
      if (hideSubmitButton) {
        return layout;
      }

      const newChildren = [
        ...(Array.isArray(layout.model.children)
          ? layout.model.children
          : [layout.model.children]),
        Generator.button.formSubmit(uuid(), { label: "Submit" }),
      ];

      return {
        ...layout,
        model: { ...layout.model, children: newChildren },
      };
    }

    if (!hideSubmitButton) {
      return layout;
    }

    // If we reach this point, it means we've found a submit button and the
    // user wants to hide it. Instead of returning, we'll continue the function
    // execution so that we recurse through the layout and remove the submit
    // buttons from the form.
  }

  if (layout.interactionType === UI.INTERACTION_TYPE.LAYOUT) {
    const newChildren = Array.isArray(layout.model.children)
      ? [
          ...layout.model.children.map((child) =>
            configureSubmitButtonsRecursive(child, hideSubmitButton)
          ),
        ]
      : configureSubmitButtonsRecursive(
          layout.model.children as UIRenderStaticLayout,
          hideSubmitButton
        );

    // @ts-expect-error union type error
    return {
      ...layout,
      model: { ...layout.model, children: newChildren },
    };
  }

  return layout;
}

/**
 * Check if we need to add/remove submit buttons from forms in the layout. If so, do it.
 */
function configureSubmitButtons(
  layout: UIRenderStaticLayout
): UIRenderStaticLayout {
  const hideSubmitButton =
    layout.type === UI.TYPE.LAYOUT_FORM &&
    layout.model.properties.hideSubmitButton === true;

  return configureSubmitButtonsRecursive(layout, hideSubmitButton);
}

export { configureSubmitButtons };
