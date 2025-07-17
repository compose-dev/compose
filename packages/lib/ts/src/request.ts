type Method = "PUT" | "POST" | "GET" | "DELETE";
type ResponseType =
  | "json"
  | "blob"
  | "raw"
  | "text"
  | "arrayBuffer"
  | "formData";

interface Options {
  route: string;
  method?: Method;
  responseType?: ResponseType;
  body?: FormData | object | null;
  abortController?: AbortController | null;
  forwardLog?: ((title: string, properties: object) => void) | null;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

type RequiredOptions = Required<Options>;

const DEFAULT_OPTIONS: RequiredOptions = {
  route: "",
  method: "GET",
  responseType: "json",
  body: null,
  abortController: null,
  forwardLog: null,
  headers: {
    "Content-Type": "application/json",
  },
  params: {},
};

interface SuccessResponse<SuccessBody> {
  data: SuccessBody;
  statusCode: number;
  didError: false;
}

interface ErrorResponse<ErrorBody> {
  data: ErrorBody;
  statusCode: number;
  didError: true;
}

async function request<SuccessBody, ErrorBody>(
  requestOptions: Options
): Promise<SuccessResponse<SuccessBody> | ErrorResponse<ErrorBody>> {
  const options: RequiredOptions = {
    ...DEFAULT_OPTIONS,
    ...requestOptions,
    headers: {
      ...DEFAULT_OPTIONS.headers,
      ...(requestOptions.headers === undefined ? {} : requestOptions.headers),
    },
  };

  let hydratedRoute = options.route;
  for (const key in options.params) {
    hydratedRoute = hydratedRoute.replace(`:${key}`, options.params[key]);
  }

  const start = Date.now();

  const body =
    options.body === null || options.body instanceof FormData
      ? options.body
      : JSON.stringify(options.body);

  const signal = options.abortController
    ? { signal: options.abortController.signal }
    : {};

  const response = await fetch(hydratedRoute, {
    headers: options.headers,
    method: options.method,
    body,
    ...signal,
  });

  let data = null;
  if (options.responseType === "json") {
    data = await response.json();
  }

  if (options.responseType === "blob") {
    data = await response.blob();
  }

  if (options.responseType === "text") {
    data = await response.text();
  }

  if (options.responseType === "arrayBuffer") {
    data = await response.arrayBuffer();
  }

  if (options.responseType === "formData") {
    data = await response.formData();
  }

  const fnResponse = {
    data,
    statusCode: response.status,
    didError: !response.ok,
  };

  if (options.forwardLog !== null) {
    const end = Date.now();

    let logData = data;
    if (options.responseType === "blob") {
      logData = "OMITTED BLOB RESPONSE";
    }

    options.forwardLog(
      `Finished request to: ${hydratedRoute} in ${end - start}ms`,
      {
        timestamp: end,
        durationMs: end - start,
        data: logData,
        statusCode: fnResponse.statusCode,
        didError: fnResponse.didError,
        requestBody: options.body,
      }
    );
  }

  return fnResponse;
}

export { request, ErrorResponse, SuccessResponse };
