import {
  ErrorResponse,
  SuccessResponse,
} from "node_modules/@compose/ts/dist/request";
import { useCallback, useEffect, useRef, useState } from "react";

interface Options<SuccessT, ErrorT> {
  fetchOnMount: boolean;
  initialData: SuccessT;
  onError: (error: ErrorResponse<ErrorT>) => void;
}

type BaseFetchResult<SuccessT> = {
  data: SuccessT | undefined;
  loading: boolean;
  refetch: () => Promise<void>;
  didInitialFetch: React.MutableRefObject<boolean>;
};

type FetchResult<SuccessT, ErrorT> =
  | (BaseFetchResult<SuccessT> & { didError: false; error: undefined })
  | (BaseFetchResult<SuccessT> & {
      didError: true;
      error: ErrorResponse<ErrorT>;
    });

function useFetch<SuccessT, ErrorT>(
  apiFunction: () =>
    | Promise<SuccessResponse<SuccessT> | ErrorResponse<ErrorT>>
    | SuccessResponse<SuccessT>
    | ErrorResponse<ErrorT>,
  options: Partial<Options<SuccessT, ErrorT>> = {}
): FetchResult<SuccessT, ErrorT> {
  const [data, setData] = useState<SuccessT | undefined>(options.initialData);
  const [error, setError] = useState<ErrorResponse<ErrorT> | undefined>(
    undefined
  );

  const [didError, setDidError] = useState(false);
  const [loading, setLoading] = useState(options.fetchOnMount !== false);

  const didInitialFetch = useRef(false);

  const fetchData = useCallback(async () => {
    didInitialFetch.current = true;

    setDidError(false);
    setLoading(true);

    const response = await apiFunction();

    if (response.didError) {
      setError(response);
      setDidError(true);
      setLoading(false);

      if (options.onError) {
        options.onError(response);
      }

      return;
    }

    setData(response.data);
    setLoading(false);
  }, [apiFunction, options]);

  useEffect(() => {
    if (didInitialFetch.current) {
      return;
    }

    // Always fetch on mount unless fetchOnMount is explicitly set to false.
    if (options.fetchOnMount !== false) {
      didInitialFetch.current = true;
      fetchData();
    }
  }, [fetchData, options.fetchOnMount]);

  return {
    data,
    error,
    didError,
    loading,
    refetch: fetchData,
    didInitialFetch,
  } as FetchResult<SuccessT, ErrorT>;
}

function makeErrorResponse<ErrorT extends { message: string }>(
  data: ErrorT
): ErrorResponse<ErrorT> {
  return {
    didError: true,
    data,
    statusCode: 400,
  };
}

export { useFetch as use, makeErrorResponse as makeError };
