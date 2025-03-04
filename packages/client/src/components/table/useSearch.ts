// import { useState, useEffect } from "react";
// import { u } from "@compose/ts";

// import { TableColumn, TableRow } from "./constants";

// function doSearch<T extends TableRow>(
//   data: T[],
//   columns: TableColumn[],
//   search: string
// ): T[] {
//   const matches: T[] = [];
//   const searchTerms = search.toLowerCase().split(/\s+/);

//   const columnsByKey = columns.reduce(
//     (acc, column) => {
//       acc[column.accessorKey] = column;
//       return acc;
//     },
//     {} as Record<string, TableColumn>
//   );

//   for (let i = 0; i < data.length; i++) {
//     let matchScore = 0;

//     for (const key in data[i]) {
//       const value = data[i][key];

//       if (!value) {
//         continue;
//       }

//       let stringValue: string = "";

//       const format = key in columnsByKey ? columnsByKey[key].format : undefined;

//       if (format === "date") {
//         try {
//           const date = u.date.fromISOString(value as string);
//           stringValue = u.date.toString(
//             date,
//             u.date.SerializedFormat["LLL d, yyyy"]
//           );
//         } catch (e) {
//           continue;
//         }
//       } else if (format === "datetime") {
//         try {
//           const date = u.date.fromISOString(value as string);
//           stringValue =
//             u.date.toString(date, u.date.SerializedFormat["LLL d, yyyy"]) +
//             ", " +
//             u.date.toString(date, u.date.SerializedFormat["h:mm a"]);
//         } catch (e) {
//           continue;
//         }
//       } else if (typeof value === "string") {
//         stringValue = value.toLowerCase();
//       } else if (typeof value === "number" || typeof value === "boolean") {
//         stringValue = value.toString().toLowerCase();
//       } else {
//         try {
//           stringValue = JSON.stringify(value).toLowerCase();
//         } catch (e) {
//           continue;
//         }
//       }

//       for (const term of searchTerms) {
//         if (stringValue.includes(term)) {
//           matchScore += 1;
//           break;
//         }
//       }
//     }

//     if (matchScore >= searchTerms.length) {
//       matches.push(data[i]);
//     }
//   }

//   return matches;
// }

// function useSearch<T extends TableRow>(data: T[], columns: TableColumn[]) {
//   const [search, setSearch] = useState<string | null>(null);
//   const [results, setResults] = useState<T[]>(data);

//   //   useEffect(() => {
//   //     if (!search || search.length < 3) {
//   //       setResults(data);
//   //       return;
//   //     }

//   //     const abortController = new AbortController();
//   //     const signal = abortController.signal;

//   //     const searchAsync = async () => {
//   //       try {
//   //         const promise = new Promise<T[]>((resolve, reject) => {
//   //           if (signal.aborted) {
//   //             reject(new Error("Search aborted"));
//   //           }
//   //           resolve(doSearch(data, columns, search));
//   //         });

//   //         const searchResults = await promise;
//   //         if (!signal.aborted) {
//   //           setResults(searchResults);
//   //         }
//   //       } catch (error) {
//   //         if (error instanceof Error && error.name !== "AbortError") {
//   //           console.error("Search error:", error);
//   //         }
//   //       }
//   //     };

//   //     searchAsync();

//   //     return () => {
//   //       abortController.abort();
//   //     };
//   //   }, [search, data, columns]);

//   return {
//     search,
//     setSearch,
//     results,
//   };
// }

// export { useSearch };
