import { m, u } from "@compose/ts";
import { UI } from "@composehq/ts-public";
import { useEffect, useState } from "react";
import Button from "~/components/button";
import { ComboboxMulti, ComboboxSingle } from "~/components/combobox";
import { DateTimeInput, TextInput } from "~/components/input";
import Json from "~/components/json";
import { Modal } from "~/components/modal";
import { CenteredSpinner } from "~/components/spinner";
import Table from "~/components/table";
import { Page } from "~/routes/home/components/page";
import { useHomeStore } from "~/routes/home/utils/useHomeStore";
import { classNames } from "~/utils/classNames";
import UnknownError from "../../components/errors/UnknownError";
import { usePageOfActivityLogsQuery } from "~/utils/queries/usePageOfActivityLogsQuery";

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

function AllEvents() {
  const { environments } = useHomeStore();

  const [modalContent, setModalContent] = useState<Omit<
    m.Log.DB,
    "id" | "companyId"
  > | null>(null);

  const {
    data,
    status,
    fetchStatus,
    refetch,
    error,
    filters,
    updateFilters,
    applyFilters,
    prevFilters,
  } = usePageOfActivityLogsQuery();

  useEffect(() => {
    if (status === "pending" && fetchStatus === "idle") {
      refetch();
    }
  }, [status, fetchStatus, refetch]);

  return (
    <>
      {status === "pending" && <CenteredSpinner />}
      {status === "error" && <UnknownError errorMessage={error.message} />}
      {status === "success" && (
        <>
          <div className="flex flex-col gap-6 self-stretch">
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
                  updateFilters({
                    ...filters,
                    offset: 0,
                  });
                  applyFilters();
                }}
                disabled={
                  fetchStatus === "fetching" ||
                  JSON.stringify(prevFilters) === JSON.stringify(filters)
                }
              >
                Apply filters
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-6 self-stretch">
            <Page.Subtitle>Data</Page.Subtitle>
            <Table.Root
              id="audit-logs"
              data={data?.logs ?? []}
              loading={
                fetchStatus === "fetching"
                  ? UI.Stale.OPTION.UPDATE_DISABLED
                  : false
              }
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
        </>
      )}
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
    </>
  );
}

export default AllEvents;
