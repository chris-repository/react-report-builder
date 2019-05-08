import { IReportFilterDateRange, IReportFilterSingleKey, IReportFilterSingleValue, IReportRequestSortKey } from 'peekdata-datagateway-api-sdk';
import { FilterTypes, IFilter } from 'src/ReportBuilder/models/filter';
import { ISelectedGraphNode } from 'src/ReportBuilder/models/graph';

/**
 * Returns array of strings
 * @param options
 */
export function getRequestOptions(options: ISelectedGraphNode[]): string[] {
  if (!options || options.length === 0) {
    return [];
  }

  return options
    .filter(option => option.value)
    .map(option => option.value);
}

/**
 * Returns array of options with sorting
 * @param options
 */
export function getRequestSortedOptions(options: ISelectedGraphNode[]): IReportRequestSortKey[] {
  if (!options || options.length === 0) {
    return [];
  }

  return options
    .filter(option => option.sorting)
    .map(option => ({
      key: option.value,
      direction: option.sorting,
    }));
}

/**
 * Returns date ranges filters
 * @param filters
 */
export function getRequestDateRangesFilters(filters: IFilter[]): IReportFilterDateRange[] {
  if (!filters || filters.length === 0) {
    return [];
  }

  return filters
    .filter(({ key, filterType, from, to }) => key && filterType === FilterTypes.DateRanges && from && to)
    .map(({ key, from, to }) => ({ key, from, to }));
}

/**
 * Returns single keys filters
 * @param filters
 */
export function getRequestSingleKeysFilters(filters: IFilter[]): IReportFilterSingleKey[] {
  if (!filters || filters.length === 0) {
    return [];
  }

  return filters
    .filter(({ key, filterType, operation, values }) => key && filterType === FilterTypes.SingleKeys && operation && values)
    .map(({ key, operation, values }) => ({
      key,
      operation,
      values: values.replace(/;{2,}/g, ';').replace(/^;/, '').replace(/[;]$/, '').split(';'),
    }));
}

/**
 * Returns single values filters
 * @param filters
 */
export function getRequestSingleValuesFilters(filters: IFilter[]): IReportFilterSingleValue[] {
  if (!filters || filters.length === 0) {
    return [];
  }

  return filters
    .filter(({ keys, filterType, operation, value }) => keys && keys.length > 0 && filterType === FilterTypes.SingleValues && operation && value && value.trim() !== '')
    .map(({ keys, operation, value }) => ({
      keys,
      operation,
      value,
    }));
}
