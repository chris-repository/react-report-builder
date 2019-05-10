export let defaultRows = {
  offset: 0,
  limit: 100,
};

export function setRowsDefaultOffset(rowsOffset: number) {
  defaultRows.offset = rowsOffset;
}

export function setRowsDefaultLimit(rowsLimit: number) {
  defaultRows.limit = rowsLimit;
}
