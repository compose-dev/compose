import { m } from "@compose/ts";

type FormattedEnvironmentsById = Record<
  string,
  m.Environment.ApiAndDecryptableKeyOmittedDB & {
    appsByRoute: Record<
      string,
      m.Environment.ApiAndDecryptableKeyOmittedDB["apps"][number]
    >;
  }
>;

export { type FormattedEnvironmentsById };
