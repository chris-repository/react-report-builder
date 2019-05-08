import { ReportFilterOperationType } from 'peekdata-datagateway-api-sdk';

export interface IFilter {
  filterType?: FilterTypes;
  key?: string;
  keys?: string[];
  from?: string;
  to?: string;
  operation?: ReportFilterOperationType;
  value?: string;
  values?: string;
}

export enum FilterTypes {
  DateRanges = 'Date Range',
  SingleKeys = 'Single Key',
  SingleValues = 'Single Value',
}

export enum FilterOptionTypes {
  Key = 'key',
  FilterType = 'filterType',
  Operation = 'operation',
}
