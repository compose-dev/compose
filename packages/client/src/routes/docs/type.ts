const DOC_TYPE = {
  "get-started-fundamentals-add-ui": "get-started-fundamentals-add-ui",
  "get-started-fundamentals-control-layout":
    "get-started-fundamentals-control-layout",
  "get-started-fundamentals-style-components":
    "get-started-fundamentals-style-components",
  "get-started-fundamentals-inputs": "get-started-fundamentals-inputs",
  "get-started-fundamentals-forms": "get-started-fundamentals-forms",
  "get-started-fundamentals-state": "get-started-fundamentals-state",
  "get-started-fundamentals-awaited-ui": "get-started-fundamentals-awaited-ui",
  "get-started-fundamentals-feedback-and-loading":
    "get-started-fundamentals-feedback-and-loading",
  "guides-form": "guides-form",
  "guides-styling-layout": "guides-styling-layout",
  "guides-styling-positioning": "guides-styling-positioning",
  "components-layout-stack": "components-layout-stack",
  "components-layout-row": "components-layout-row",
  "components-layout-card": "components-layout-card",
  "components-layout-distributed-row": "components-layout-distributed-row",
  "components-input-button": "components-input-button",
  "components-input-button-appearance": "components-input-button-appearance",
  "components-input-button-custom-style":
    "components-input-button-custom-style",
  "components-input-text": "components-input-text",
  "components-input-textarea": "components-input-textarea",
  "components-input-email": "components-input-email",
  "components-input-password": "components-input-password",
  "components-input-url": "components-input-url",
  "components-input-number": "components-input-number",
  "components-input-select": "components-input-select",
  "components-input-multi-select": "components-input-multi-select",
  "components-input-radio-group": "components-input-radio-group",
  "components-input-table": "components-input-table",
  "components-input-table-actions": "components-input-table-actions",
  "components-input-dataframe": "components-input-dataframe",
  "components-input-filedrop": "components-input-filedrop",
  "components-input-date": "components-input-date",
  "components-input-checkbox": "components-input-checkbox",
  "components-input-time": "components-input-time",
  "components-input-datetime": "components-input-datetime",
  "components-display-text": "components-display-text",
  "components-display-text-appearance": "components-display-text-appearance",
  "components-display-text-nested": "components-display-text-nested",
  "components-display-header": "components-display-header",
  "components-display-header-appearance":
    "components-display-header-appearance",
  "components-display-markdown": "components-display-markdown",
  "components-display-json": "components-display-json",
  "components-display-image": "components-display-image",
  "components-display-spinner": "components-display-spinner",
  "components-display-code-js": "components-display-code-js",
  "components-display-code-python": "components-display-code-python",
  "components-display-pdf": "components-display-pdf",
  "components-display-pdf-default-scroll":
    "components-display-pdf-default-scroll",
  "components-display-pdf-horizontal-scroll":
    "components-display-pdf-horizontal-scroll",
  "components-display-pdf-annotation": "components-display-pdf-annotation",
  "components-dynamic-condition": "components-dynamic-cond",
  "page-actions-confirm-modal": "page-actions-confirm-modal",
  "page-actions-modal": "page-actions-modal",
  "page-actions-modal-close": "page-actions-modal-close",
  "page-actions-toast": "page-actions-toast",
  "page-actions-loading": "page-actions-loading",
  "website-new-user-app": "website-new-user-app",
  "website-simple-table-app": "website-simple-table-app",
  "website-modal-form-app": "website-modal-form-app",
  "website-data-labeling-app": "website-data-labeling-app",
  "bar-chart-component": "bar-chart-component",
  "bar-chart-group-data": "bar-chart-group-data",
  "bar-chart-aggregate-data": "bar-chart-aggregate-data",
  "bar-chart-simple-series": "bar-chart-simple-series",
  "bar-chart-advanced-series": "bar-chart-advanced-series",
  "bar-chart-kitchen-sink": "bar-chart-kitchen-sink",
} as const;

type DocType = (typeof DOC_TYPE)[keyof typeof DOC_TYPE];

export { DOC_TYPE, type DocType };
