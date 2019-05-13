import { INotOptimizedReportResponse, IOptimizedReportResponse, IReportRequest } from 'peekdata-datagateway-api-sdk';
import { IFilter } from 'src/ReportBuilder/models/filter';
import { IDimension, IMetric, ISelectedGraphNode } from 'src/ReportBuilder/models/graph';
import { ITranslations } from 'src/ReportBuilder/models/translations';
import { IAsyncState } from 'src/ReportBuilder/state/action';
import { ICompatibilityState } from './compatibility';
import { IGraphNamesState } from './graphNames';
import { IScopeNamesState } from './scopeNames';

// #region -------------- Interfaces -------------------------------------------------------------------

export interface IReportBuilderState {
  dataFull: IAsyncState<INotOptimizedReportResponse>;
  dataOptimized: IAsyncState<IOptimizedReportResponse>;
  dimensions: IAsyncState<IDimension[]>;
  compatibility: ICompatibilityState;
  file: IAsyncState<string>;
  filters: IFilter[];
  graphNames: IGraphNamesState;
  limitRowsTo: number;
  startWithRow: number;
  metrics: IAsyncState<IMetric[]>;
  request: IReportRequest;
  scopeNames: IScopeNamesState;
  select: IAsyncState<string>;
  selectedDimensions: ISelectedGraphNode[];
  selectedMetrics: ISelectedGraphNode[];
  translations: ITranslations;
}

// #endregion
