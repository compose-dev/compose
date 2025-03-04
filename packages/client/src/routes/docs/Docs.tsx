/**
 * This page renders examples that are embedded as iframes in our documentation.
 */

import { useSearch } from "@tanstack/react-router";
import { DOC_TYPE } from "./type";
import * as Components from "./components";
import * as Guides from "./guides";
import * as Website from "./website";
import * as PageActions from "./pageActions";
import { theme } from "~/utils/theme";
import * as GetStarted from "./getStarted";
import { useEffect } from "react";

import BrowserWrapper from "./BrowserWrapper";

function Docs() {
  const type = useSearch({
    from: "/docs",
    select: (search) => search.type,
  });

  const isDark = useSearch({
    from: "/docs",
    select: (search) => {
      return search.isDark === "TRUE";
    },
  });

  const { updatePreference } = theme.use();

  useEffect(() => {
    if (isDark) {
      updatePreference(theme.SCHEME_PREFERENCE.DARK, false);
    } else {
      updatePreference(theme.SCHEME_PREFERENCE.LIGHT, false);
    }
  }, [isDark, updatePreference]);

  if (!type || type in DOC_TYPE === false) {
    return (
      <BrowserWrapper>
        <div className="p-8">Not found</div>
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["get-started-fundamentals-add-ui"]) {
    return (
      <BrowserWrapper>
        <GetStarted.Fundamentals.AddUI />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["get-started-fundamentals-control-layout"]) {
    return (
      <BrowserWrapper>
        <GetStarted.Fundamentals.ControlLayout />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["get-started-fundamentals-style-components"]) {
    return (
      <BrowserWrapper>
        <GetStarted.Fundamentals.StyleComponents />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["get-started-fundamentals-inputs"]) {
    return (
      <BrowserWrapper>
        <GetStarted.Fundamentals.InputComponents />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["get-started-fundamentals-forms"]) {
    return (
      <BrowserWrapper>
        <GetStarted.Fundamentals.Forms />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["get-started-fundamentals-awaited-ui"]) {
    return (
      <BrowserWrapper>
        <GetStarted.Fundamentals.AwaitedUI />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["get-started-fundamentals-state"]) {
    return (
      <BrowserWrapper>
        <GetStarted.Fundamentals.State />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["get-started-fundamentals-feedback-and-loading"]) {
    return (
      <BrowserWrapper>
        <GetStarted.Fundamentals.FeedbackAndLoading />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["guides-form"]) {
    return (
      <BrowserWrapper>
        <Guides.Form />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["guides-styling-layout"]) {
    return (
      <BrowserWrapper>
        <Guides.StylingLayout />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["guides-styling-positioning"]) {
    return (
      <BrowserWrapper>
        <Guides.StylingPositioning />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-layout-stack"]) {
    return (
      <BrowserWrapper>
        <Components.Layout.Stack />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-layout-row"]) {
    return (
      <BrowserWrapper>
        <Components.Layout.Row />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-layout-card"]) {
    return (
      <BrowserWrapper>
        <Components.Layout.Card />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-layout-distributed-row"]) {
    return (
      <BrowserWrapper>
        <Components.Layout.DistributedRow />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-display-text"]) {
    return (
      <BrowserWrapper>
        <Components.Display.Text />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-display-text-nested"]) {
    return (
      <BrowserWrapper>
        <Components.Display.TextNested />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-display-text-appearance"]) {
    return (
      <BrowserWrapper>
        <Components.Display.TextAppearance />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-display-header"]) {
    return (
      <BrowserWrapper>
        <Components.Display.Header />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-display-header-appearance"]) {
    return (
      <BrowserWrapper>
        <Components.Display.HeaderAppearance />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-display-markdown"]) {
    return (
      <BrowserWrapper>
        <Components.Display.Markdown />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-display-image"]) {
    return (
      <BrowserWrapper>
        <Components.Display.Image />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-display-json"]) {
    return (
      <BrowserWrapper>
        <Components.Display.Json />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-display-pdf"]) {
    return (
      <BrowserWrapper>
        <Components.Display.PDF />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-display-pdf-default-scroll"]) {
    return (
      <BrowserWrapper>
        <Components.Display.PDFDefaultScroll />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-display-pdf-horizontal-scroll"]) {
    return (
      <BrowserWrapper>
        <Components.Display.PDFHorizontalScroll />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-display-pdf-annotation"]) {
    return (
      <BrowserWrapper>
        <Components.Display.PDFAnnotation />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-display-spinner"]) {
    return (
      <BrowserWrapper>
        <Components.Display.Spinner />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-display-code-js"]) {
    return (
      <BrowserWrapper>
        <Components.Display.CodeJS />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-display-code-python"]) {
    return (
      <BrowserWrapper>
        <Components.Display.CodePython />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-button"]) {
    return (
      <BrowserWrapper>
        <Components.Input.Button />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-button-appearance"]) {
    return (
      <BrowserWrapper>
        <Components.Input.ButtonAppearance />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-button-custom-style"]) {
    return (
      <BrowserWrapper>
        <Components.Input.ButtonCustomStyle />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-text"]) {
    return (
      <BrowserWrapper>
        <Components.Input.Text />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-textarea"]) {
    return (
      <BrowserWrapper>
        <Components.Input.TextArea />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-email"]) {
    return (
      <BrowserWrapper>
        <Components.Input.Email />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-password"]) {
    return (
      <BrowserWrapper>
        <Components.Input.Password />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-url"]) {
    return (
      <BrowserWrapper>
        <Components.Input.Url />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-number"]) {
    return (
      <BrowserWrapper>
        <Components.Input.Number />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-select"]) {
    return (
      <BrowserWrapper>
        <Components.Input.Select />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-multi-select"]) {
    return (
      <BrowserWrapper>
        <Components.Input.MultiSelect />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-radio-group"]) {
    return (
      <BrowserWrapper>
        <Components.Input.RadioGroup />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-table"]) {
    return (
      <BrowserWrapper>
        <Components.Input.Table.Default />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-table-actions"]) {
    return (
      <BrowserWrapper>
        <Components.Input.Table.Actions />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-dataframe"]) {
    return (
      <BrowserWrapper>
        <Components.Input.Table.Default />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-filedrop"]) {
    return (
      <BrowserWrapper>
        <Components.Input.FileDrop />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-date"]) {
    return (
      <BrowserWrapper>
        <Components.Input.Date />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-checkbox"]) {
    return (
      <BrowserWrapper>
        <Components.Input.Checkbox />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-time"]) {
    return (
      <BrowserWrapper>
        <Components.Input.Time />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["components-input-datetime"]) {
    return (
      <BrowserWrapper>
        <Components.Input.DateTime />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["page-actions-confirm-modal"]) {
    return (
      <BrowserWrapper>
        <PageActions.ConfirmModal />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["page-actions-loading"]) {
    return (
      <BrowserWrapper>
        <PageActions.LoadingExample />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["page-actions-modal-close"]) {
    return (
      <BrowserWrapper>
        <PageActions.ModalClose />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["page-actions-modal"]) {
    return (
      <BrowserWrapper>
        <PageActions.Modal />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["page-actions-toast"]) {
    return (
      <BrowserWrapper>
        <PageActions.ToastExample />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["website-new-user-app"]) {
    return (
      <BrowserWrapper className="!rounded-none">
        <Website.NewUserApp />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["website-simple-table-app"]) {
    return (
      <BrowserWrapper className="!rounded-none">
        <Website.SimpleTableApp />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["website-modal-form-app"]) {
    return (
      <BrowserWrapper className="!rounded-none">
        <Website.ModalFormApp />
      </BrowserWrapper>
    );
  }

  if (type === DOC_TYPE["website-data-labeling-app"]) {
    return (
      <BrowserWrapper className="!rounded-none">
        <Website.DataLabelingApp />
      </BrowserWrapper>
    );
  }

  if (
    type === DOC_TYPE["bar-chart-component"] ||
    type === DOC_TYPE["bar-chart-group-data"] ||
    type === DOC_TYPE["bar-chart-aggregate-data"] ||
    type === DOC_TYPE["bar-chart-kitchen-sink"] ||
    type === DOC_TYPE["bar-chart-advanced-series"] ||
    type === DOC_TYPE["bar-chart-simple-series"]
  ) {
    return (
      <BrowserWrapper className="!rounded-none">
        <Components.Chart.BarChart type={type} />
      </BrowserWrapper>
    );
  }
}

export default Docs;
