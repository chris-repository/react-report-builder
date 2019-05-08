import { combineReducers } from 'redux';
import { IReportBuilderState } from 'src/ReportBuilder/state/reducers';
import { compatibility } from './reducers/compatibility';
import { dataFull } from './reducers/dataFull';
import { dataOptimized } from './reducers/dataOptimized';
import { dimensions } from './reducers/dimensions';
import { file } from './reducers/file';
import { filters } from './reducers/filters';
import { graphNames } from './reducers/graphNames';
import { getLimitRowsTo } from './reducers/limitRowsTo';
import { metrics } from './reducers/metrics';
import { request } from './reducers/request';
import { scopeNames } from './reducers/scopeNames';
import { select } from './reducers/select';
import { selectedDimensions } from './reducers/selectedDimensions';
import { selectedMetrics } from './reducers/selectedMetrics';
import { getStartWithRow } from './reducers/startWithRow';

// #region -------------- Reducer -------------------------------------------------------------------

export const rootReducer = combineReducers<IReportBuilderState>({
  dataFull,
  dataOptimized,
  dimensions,
  compatibility,
  file,
  filters,
  graphNames,
  limitRowsTo: getLimitRowsTo,
  startWithRow: getStartWithRow,
  metrics,
  request,
  scopeNames,
  select,
  selectedDimensions,
  selectedMetrics,
});

// #endregion
