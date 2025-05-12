import { ServerSortModel } from "./sortModel";

function sortByIsEqual(a: ServerSortModel, b: ServerSortModel) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every(
    (sort, index) =>
      sort.key === b[index].key && sort.direction === b[index].direction
  );
}

export { sortByIsEqual };
