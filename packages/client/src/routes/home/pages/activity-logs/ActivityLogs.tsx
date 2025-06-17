import Button from "~/components/button";
import Icon from "~/components/icon";
import { useNavigate } from "@tanstack/react-router";
import { fetcher } from "~/utils/fetcher";
import { api } from "~/api";
import { useRef, useState } from "react";
import { m, u } from "@compose/ts";
import { CenteredSpinner } from "~/components/spinner";
import Table from "~/components/table";
import { UI } from "@composehq/ts-public";
import { Modal } from "~/components/modal";
import Json from "~/components/json";
import { useHomeStore } from "~/routes/home/utils/useHomeStore";
import { classNames } from "~/utils/classNames";
import { DateTimeInput, TextInput } from "~/components/input";
import { ComboboxMulti, ComboboxSingle } from "~/components/combobox";
import { InlineLink } from "~/components/inline-link";
import { Page } from "~/routes/home/components/page";

type Filters = {
  limit: number;
  offset: number;
  appRoute: string | null;
  userEmail: string | null;
  severity: m.Log.DB["severity"][];
  datetimeStart: u.date.DateTimeModel | null;
  datetimeEnd: u.date.DateTimeModel | null;
  message: string | null;
  type: m.Log.DB["type"] | null;
};

const INITIAL_FILTERS: Filters = {
  limit: 50,
  offset: 0,
  appRoute: null,
  userEmail: null,
  severity: [],
  datetimeStart: null,
  datetimeEnd: null,
  message: null,
  type: null,
};

function KeyValuePair({
  label,
  value,
}: {
  label: string;
  value: string | JSX.Element;
}) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      <h6 className="text-brand-neutral-2">{label}</h6>
      {typeof value === "string" ? <p>{value}</p> : value}
    </div>
  );
}

export default function ActivityLogs() {
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState<Omit<
    m.Log.DB,
    "id" | "companyId"
  > | null>(null);
  const { environments } = useHomeStore();

  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const filtersRef = useRef<Filters>(INITIAL_FILTERS);
  const [prevFilters, setPrevFilters] = useState<Filters>(INITIAL_FILTERS);

  const { data, loading, refetch, error, didError } = fetcher.use(async () => {
    const response = await api.routes.getPageOfLogs({
      ...filtersRef.current,
      datetimeStart: filtersRef.current.datetimeStart
        ? u.date.fromDateTimeModel(filtersRef.current.datetimeStart)
        : null,
      datetimeEnd: filtersRef.current.datetimeEnd
        ? u.date.fromDateTimeModel(filtersRef.current.datetimeEnd)
        : null,
    });

    if (response.didError) {
      return response;
    }

    return {
      ...response,
      data: {
        ...response.data,
        logs: response.data.logs.map((log) => ({
          ...log,
          createdAtUTC: u.date.toString(
            u.date.fromISOString(log.createdAt as unknown as string),
            u.date.SerializedFormat["LLL d, yyyy h:mm a"],
            true
          ),
        })),
      },
    };
  });

  function updateFilters(newFilters: Partial<typeof filters>) {
    setFilters({
      ...filters,
      ...newFilters,
    });
    filtersRef.current = {
      ...filtersRef.current,
      ...newFilters,
    };
  }

  function applyFilters() {
    updateFilters({
      offset: 0,
    });
    setPrevFilters({ ...filters, offset: 0 });
    refetch();
  }

  return (
    <Page.Root width="lg">
      <Page.Title>Activity Logs</Page.Title>

      {loading && !data && <CenteredSpinner />}
      {modalContent !== null && (
        <Modal.Root
          isOpen={true}
          width="xl"
          onClose={() => setModalContent(null)}
        >
          <Modal.CloseableHeader onClose={() => setModalContent(null)}>
            Log Details
          </Modal.CloseableHeader>
          <Modal.Body>
            <div className="flex flex-col gap-6 w-full mt-2">
              <div className="flex flex-row items-start gap-4">
                <KeyValuePair
                  label="Local timestamp"
                  value={`${u.date.toString(
                    u.date.fromISOString(
                      modalContent.createdAt as unknown as string
                    ),
                    u.date.SerializedFormat["LLL d, yyyy"]
                  )}, ${u.date.toString(
                    u.date.fromISOString(
                      modalContent.createdAt as unknown as string
                    ),
                    u.date.SerializedFormat["h:mm a"]
                  )}`}
                />
                <KeyValuePair
                  label="UTC timestamp"
                  value={`${u.date.toString(
                    u.date.fromISOString(
                      modalContent.createdAt as unknown as string
                    ),
                    u.date.SerializedFormat["LLL d, yyyy"],
                    true
                  )}, ${u.date.toString(
                    u.date.fromISOString(
                      modalContent.createdAt as unknown as string
                    ),
                    u.date.SerializedFormat["h:mm a"],
                    true
                  )} UTC`}
                />
              </div>
              <div className="flex flex-row items-start gap-4">
                <KeyValuePair
                  label="User Email"
                  value={modalContent.userEmail ?? "Unknown"}
                />
                <KeyValuePair label="App route" value={modalContent.appRoute} />
              </div>
              <div className="flex flex-row items-start gap-4">
                <KeyValuePair
                  label="Environment name"
                  value={
                    modalContent.environmentId
                      ? environments[modalContent.environmentId].name
                      : "Unknown"
                  }
                />
                <KeyValuePair
                  label="Severity"
                  value={
                    <div>
                      <div
                        className={classNames(
                          "inline-flex items-center px-1.5 py-0.5 rounded-brand text-xs font-medium max-h-fit h-fit",
                          {
                            "red-tag": modalContent.severity === "fatal",
                            "orange-tag": modalContent.severity === "error",
                            "yellow-tag": modalContent.severity === "warn",
                            "slate-tag": modalContent.severity === "info",
                            "pink-tag": modalContent.severity === "debug",
                            "blue-tag": modalContent.severity === "trace",
                          }
                        )}
                      >
                        {modalContent.severity}
                      </div>
                    </div>
                  }
                />
              </div>
              <div className="flex flex-row items-start gap-4">
                <KeyValuePair
                  label="Source"
                  value={
                    <div>
                      <div
                        className={classNames(
                          "inline-flex items-center px-1.5 py-0.5 rounded-brand text-xs font-medium max-h-fit h-fit",
                          {
                            "green-tag": modalContent.type === "system",
                            "orange-tag": modalContent.type === "user",
                          }
                        )}
                      >
                        {modalContent.type}
                      </div>
                    </div>
                  }
                />
              </div>
              <div className="border-b border-brand-neutral" />
              <KeyValuePair label="Message" value={modalContent.message} />
              <div className="border-b border-brand-neutral" />
              <KeyValuePair
                label="Additional data"
                value={
                  modalContent.data ? (
                    <Json
                      label={null}
                      description={null}
                      json={modalContent.data}
                    />
                  ) : (
                    "No additional data"
                  )
                }
              />
            </div>
          </Modal.Body>
        </Modal.Root>
      )}
      {didError && error.data.type !== "invalid-plan" && (
        <div className="w-full flex justify-center mt-24">
          <div className="bg-brand-overlay p-4 rounded-brand border border-brand-neutral flex flex-col gap-4 max-w-xl">
            <div className="flex flex-row items-center gap-2">
              <Icon
                name="exclamation-circle"
                color="brand-error-heavy"
                size="1.5"
              />
              <h4 className="text-brand-error-heavy">Error fetching logs</h4>
            </div>
            <p>{error.data.message}</p>
          </div>
        </div>
      )}
      {didError && error.data.type === "invalid-plan" && (
        <div className="w-full flex justify-center mt-24">
          <div className="border-brand-neutral border p-4 rounded-md flex flex-col gap-4 max-w-lg shadow bg-brand-overlay">
            <div className="flex flex-row items-center gap-2">
              <Icon
                name="exclamation-circle"
                color="brand-warning-heavy"
                size="1.5"
                stroke="semi-bold"
              />
              <h4 className="text-brand-warning-heavy">
                Unlock Activity Logs and more with a Pro plan
              </h4>
            </div>
            <p className="text-brand-neutral">
              The pro plan enables teams to build and use apps together, collect
              activity logs, implement granular permissions, and more.
            </p>
            <Button
              variant="warning"
              onClick={() => navigate({ to: "/home/settings" })}
            >
              Upgrade to Pro
            </Button>
          </div>
        </div>
      )}
      {!didError && (
        <div className="flex flex-col w-full gap-6">
          <Page.Subtitle>Filters</Page.Subtitle>
          <div className="flex flex-row gap-6">
            <div className="flex-1 max-w-md">
              <TextInput
                label="App route"
                value={filters.appRoute}
                setValue={(val) => updateFilters({ appRoute: val })}
              />
            </div>
            <div className="flex-1 max-w-md">
              <TextInput
                label="User email"
                value={filters.userEmail}
                setValue={(val) => updateFilters({ userEmail: val })}
              />
            </div>
            <div className="flex-1 max-w-md">
              <ComboboxMulti
                label="Severity"
                value={filters.severity}
                setValue={(internalValue) =>
                  updateFilters({ severity: internalValue })
                }
                options={[
                  { label: "Trace", value: "trace" },
                  { label: "Debug", value: "debug" },
                  { label: "Info", value: "info" },
                  { label: "Warn", value: "warn" },
                  { label: "Error", value: "error" },
                  { label: "Fatal", value: "fatal" },
                ]}
                disabled={false}
                id="severity"
              />
            </div>
          </div>
          <div className="flex flex-row gap-6">
            <div className="flex-1 max-w-md">
              <DateTimeInput
                label="Start datetime (UTC)"
                value={filters.datetimeStart}
                setValue={(val) => updateFilters({ datetimeStart: val })}
              />
            </div>
            <div className="flex-1 max-w-md">
              <DateTimeInput
                label="End datetime (UTC)"
                value={filters.datetimeEnd}
                setValue={(val) => updateFilters({ datetimeEnd: val })}
              />
            </div>
            <div className="flex-1 max-w-md">
              <TextInput
                label="Message"
                placeholder="Search messages"
                value={filters.message}
                setValue={(val) => updateFilters({ message: val })}
              />
            </div>
          </div>
          <div className="flex flex-row gap-6">
            <div className="flex-1 max-w-[32%]">
              <ComboboxSingle
                label="Source"
                disabled={false}
                value={filters.type}
                setValue={(val) => updateFilters({ type: val })}
                options={[
                  {
                    label: "System",
                    value: "system",
                    description: "Logs generated automatically by Compose",
                  },
                  {
                    label: "User",
                    value: "user",
                    description:
                      "Logs generated manually via an event from the SDK.",
                  },
                ]}
                id="source"
              />
            </div>
          </div>
          <div className="flex w-full justify-end">
            <Button
              variant="primary"
              onClick={() => {
                setFilters({
                  ...filters,
                  offset: 0,
                });
                applyFilters();
              }}
              disabled={
                loading ||
                JSON.stringify(prevFilters) === JSON.stringify(filters)
              }
            >
              Apply filters
            </Button>
          </div>
        </div>
      )}
      {!didError && (
        <div className="flex flex-col gap-6 w-full">
          <Page.Subtitle>Data</Page.Subtitle>
          <Table.Root
            id="audit-logs"
            data={data?.logs ?? []}
            loading={loading ? UI.Stale.OPTION.UPDATE_DISABLED : false}
            density="compact"
            columns={[
              {
                id: "severity",
                label: "Severity",
                accessorKey: "severity",
                width: "90px",
                pinnedWidth: 90,
                format: "tag",
                tagColors: {
                  trace: {
                    color: "blue",
                    originalValue: "trace",
                  },
                  debug: {
                    color: "pink",
                    originalValue: "debug",
                  },
                  info: {
                    color: "gray",
                    originalValue: "info",
                  },
                  warn: {
                    color: "yellow",
                    originalValue: "warn",
                  },
                  error: {
                    color: "orange",
                    originalValue: "error",
                  },
                  fatal: {
                    color: "red",
                    originalValue: "fatal",
                  },
                },
                overflow: "ellipsis",
              },
              {
                id: "source",
                label: "Source",
                accessorKey: "type",
                width: "100px",
                pinnedWidth: 100,
                format: "tag",
                tagColors: {
                  system: {
                    color: "green",
                    originalValue: "system",
                  },
                  user: {
                    color: "orange",
                    originalValue: "user",
                  },
                },
                overflow: "ellipsis",
              },
              {
                id: "timestamp",
                label: "Timestamp (UTC)",
                accessorKey: "createdAtUTC",
                width: "210px",
                pinnedWidth: 210,
                overflow: "ellipsis",
              },
              {
                id: "userEmail",
                label: "User Email",
                accessorKey: "userEmail",
                width: "240px",
                pinnedWidth: 240,
                overflow: "ellipsis",
              },
              {
                id: "appRoute",
                label: "App Route",
                accessorKey: "appRoute",
                width: "200px",
                pinnedWidth: 200,
                overflow: "ellipsis",
              },
              {
                id: "message",
                label: "Message",
                accessorKey: "message",
                width: "1000px",
                pinnedWidth: 200,
                overflow: "ellipsis",
              },
            ]}
            actions={[{ label: "View Details" }]}
            onTableRowActionHook={(rowIdx) => {
              if (data?.logs[rowIdx]) {
                setModalContent(data.logs[rowIdx]);
              }
            }}
            enableRowSelection={false}
            rowSelections={{}}
            setRowSelections={() => {}}
            allowMultiSelection={false}
            onTablePageChangeHook={(_, offset) => {
              updateFilters({
                offset,
              });
              refetch();
            }}
            totalRecords={data?.totalRecords ?? Infinity}
            paginated={true}
            searchable={false}
            filterable={false}
            sortable={false}
            pageSize={filters.limit}
            offset={filters.offset}
          />
        </div>
      )}
      {!didError && (
        <div className="flex flex-col gap-6 w-full">
          <Page.Subtitle>Learn more</Page.Subtitle>
          <p>
            Learn more about how to collect audit logs from your Compose Apps in
            the{" "}
            <InlineLink url="https://docs.composehq.com/page-actions/log">
              docs
            </InlineLink>
            .
          </p>
        </div>
      )}
    </Page.Root>
  );
}
