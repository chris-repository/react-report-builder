import { ICompatibilityRequest, IGraphNode, IGraphReportCompatibility, INotOptimizedReportResponse, IOptimizedReportResponse, IReportRequest, IReportRequestSortings } from 'peekdata-datagateway-api-sdk';
import { all, put, select, take, takeLatest } from 'redux-saga/effects';
import { rows } from 'src/ReportBuilder/constants/rows';
import { ISelectedGraphNode } from 'src/ReportBuilder/models/graph';
import { peekdataApi } from 'src/ReportBuilder/services/api';
import { IAction } from 'src/ReportBuilder/state/action';
import { actionTypes, changeLimitRowsTo, changeStartWithRow, compatibilityChecked, csvFileLoaded, dataFullLoaded, dataOptimizedLoaded, dimensionsLoaded, filtersLoaded, generateReportRequest, graphNamesLoaded, ILoadGraphNodesPayloadRequest, loadGraphNames, loadGraphNodes, loadScopeNames, metricsLoaded, reportRequestGenerated, scopeNamesLoaded, selectGraphNode, selectLoaded, setFilters, setSelectedDimensions, setSelectedMetrics } from 'src/ReportBuilder/state/actions';
import { IReportBuilderState } from 'src/ReportBuilder/state/reducers';
import { IScopeNamesState } from 'src/ReportBuilder/state/reducers/scopeNames';
import { getRequestDateRangesFilters, getRequestOptions, getRequestSingleKeysFilters, getRequestSingleValuesFilters, getRequestSortedOptions } from 'src/ReportBuilder/utils/RequestUtils';
import v4 from 'uuid/v4';
import { FilterTypes, IFilter } from '../models/filter';

// #region -------------- Load report request -------------------------------------------------------------------

export function* onLoadReportRequest(action: IAction<Partial<IReportRequest>>) {
  try {
    const reportRequest = action.payload;

    if (!reportRequest) {
      yield put(loadScopeNames());
      return;
    }

    const { scopeName, graphName, dimensions, metrics, sortings, filters, options } = reportRequest;
    const optionsRows = options && options.rows;
    const startWithRow = optionsRows && optionsRows.startWithRow;
    const limitRowsTo = optionsRows && optionsRows.limitRowsTo;

    yield put(loadScopeNames(true));
    yield take(actionTypes.scopeNamesLoaded);

    yield put(loadGraphNames(scopeName));
    yield take(actionTypes.graphNamesLoaded);

    const selectedDimensions = getSelectedDimensions(dimensions, sortings);
    const selectedMetrics = getSelectedMetrics(metrics, sortings);

    yield put(loadGraphNodes({
      selectedGraph: graphName,
      selectedDimensions,
      selectedMetrics,
    }));

    yield take(actionTypes.dimensionsLoaded);
    yield put(filtersLoaded(filters));

    yield put(selectGraphNode(null));
    yield take(actionTypes.compatibilityChecked);

    yield put(changeStartWithRow(startWithRow !== undefined && startWithRow !== null ? Number(startWithRow) : rows.startWithRow));
    yield put(changeLimitRowsTo(limitRowsTo !== undefined && limitRowsTo !== null ? Number(limitRowsTo) : rows.limitRowsTo));
    yield put(reportRequestGenerated(reportRequest));
  } catch (error) {
    console.error(error);
  }
}

const getSelectedDimensions = (dimensions: string[], sortings: IReportRequestSortings): ISelectedGraphNode[] =>
  dimensions && dimensions.map(value => ({
    value,
    sorting: getSorting(sortings, value, 'dimensions'),
  }));

const getSelectedMetrics = (metrics: string[], sortings: IReportRequestSortings): ISelectedGraphNode[] =>
  metrics && metrics.map(value => ({
    value,
    sorting: getSorting(sortings, value, 'metrics'),
  }));

const getSorting = (sortings: IReportRequestSortings, value: string, key: string) => {
  const sorting =
    sortings &&
    sortings[key] &&
    sortings[key].find(d => d.key === value);

  if (!sorting) {
    return null;
  }

  return sorting && sorting.direction ? sorting.direction : null;
};

// #endregion

// #region -------------- Generate report request -------------------------------------------------------------------

export function* onGenerateReportRequest() {
  try {
    const { scopeNames, graphNames, selectedDimensions, selectedMetrics, filters, limitRowsTo, startWithRow }: IReportBuilderState = yield select(state => state);

    const scopeName = scopeNames && scopeNames.selectedScope;
    const graphName = graphNames && graphNames.selectedGraph;

    const dimensions = getRequestOptions(selectedDimensions);
    const metrics = getRequestOptions(selectedMetrics);
    const sortedDimensions = getRequestSortedOptions(selectedDimensions);
    const sortedMetrics = getRequestSortedOptions(selectedMetrics);
    const dateRanges = getRequestDateRangesFilters(filters);
    const singleKeys = getRequestSingleKeysFilters(filters);
    const singleValues = getRequestSingleValuesFilters(filters);

    const request: IReportRequest = {
      scopeName,
      graphName,
      requestID: v4(),
      consumerInfo: {
        ApplicationName: 'Peekdata-Report-Builder-Demo',
      },
      metrics,
    };

    if (dimensions && dimensions.length > 0) {
      request.dimensions = dimensions;
    }

    if (dateRanges && dateRanges.length > 0) {
      request.filters = {
        ...request.filters,
        dateRanges,
      };
    }

    if (singleKeys && singleKeys.length > 0) {
      request.filters = {
        ...request.filters,
        singleKeys,
      };
    }

    if (singleValues && singleValues.length > 0) {
      request.filters = {
        ...request.filters,
        singleValues,
      };
    }

    if (sortedDimensions && sortedDimensions.length > 0) {
      request.sortings = {
        ...request.sortings,
        dimensions: sortedDimensions,
      };
    }

    if (sortedMetrics && sortedMetrics.length > 0) {
      request.sortings = {
        ...request.sortings,
        metrics: sortedMetrics,
      };
    }

    request.options = {
      rows: {
        limitRowsTo: limitRowsTo !== null && limitRowsTo !== undefined ? limitRowsTo.toString() : rows.limitRowsTo.toString(),
        startWithRow: startWithRow !== null && startWithRow !== undefined ? startWithRow.toString() : rows.startWithRow.toString(),
      },
    };

    yield put(reportRequestGenerated(request));
  } catch (error) { }
}

// #endregion

// #region -------------- Load scope names -------------------------------------------------------------------

export function* onLoadScopeNames() {
  try {
    const scopeNames: string[] = yield peekdataApi.graph.getScopeNames();

    yield put(scopeNamesLoaded({
      data: scopeNames,
      isFetching: false,
      error: null,
      errorTimestamp: null,
    }));
  } catch (error) {
    yield put(scopeNamesLoaded({
      data: null,
      isFetching: false,
      error: error.message,
      errorTimestamp: new Date(),
    }));
  }
}

// #endregion

// #region -------------- Load graph names -------------------------------------------------------------------

export function* onLoadGraphNames(action: IAction<string>) {
  try {
    const graphNames: string[] = yield peekdataApi.graph.getGraphNames(action.payload);

    yield put(graphNamesLoaded({
      data: graphNames,
      isFetching: false,
      error: null,
      errorTimestamp: null,
    }));
  } catch (error) {
    yield put(graphNamesLoaded({
      data: null,
      isFetching: false,
      error: error.message,
      errorTimestamp: new Date(),
    }));
  }
}

// #endregion

// #region -------------- Load dimensions -------------------------------------------------------------------

export function* onLoadDimensions(action: IAction<ILoadGraphNodesPayloadRequest>) {
  try {
    const scopeNames: IScopeNamesState = yield select((state: IReportBuilderState) => state.scopeNames);
    const selectedScope = scopeNames && scopeNames.selectedScope;
    const { selectedGraph, selectedDimensions } = action.payload;

    const dimensions: IGraphNode[] = yield peekdataApi.graph.getDimensions(selectedScope, selectedGraph);

    yield put(dimensionsLoaded({
      data: dimensions,
      isFetching: false,
      error: null,
      errorTimestamp: null,
    }));

    if (selectedDimensions) {
      yield put(setSelectedDimensions(selectedDimensions));
    }
  } catch (error) {
    yield put(dimensionsLoaded({
      data: null,
      isFetching: false,
      error: error.message,
      errorTimestamp: new Date(),
    }));
  }
}

// #endregion

// #region -------------- Load metrics -------------------------------------------------------------------

export function* onLoadMetrics(action: IAction<ILoadGraphNodesPayloadRequest>) {
  try {
    const scopeNames: IScopeNamesState = yield select((state: IReportBuilderState) => state.scopeNames);
    const selectedScope = scopeNames && scopeNames.selectedScope;
    const { selectedGraph, selectedMetrics } = action.payload;

    const metrics: IGraphNode[] = yield peekdataApi.graph.getMetrics(selectedScope, selectedGraph);

    yield put(metricsLoaded({
      data: metrics,
      isFetching: false,
      error: null,
      errorTimestamp: null,
    }));

    if (selectedMetrics) {
      yield put(setSelectedMetrics(selectedMetrics));
    }
  } catch (error) {
    yield put(metricsLoaded({
      data: null,
      isFetching: false,
      error: error.message,
      errorTimestamp: new Date(),
    }));
  }
}

// #endregion

// #region -------------- Check compatibility -------------------------------------------------------------------

export function* onCheckCompatibility() {
  try {
    const { scopeNames, graphNames, selectedDimensions, selectedMetrics }: IReportBuilderState = yield select(state => state);

    const scopeName = scopeNames && scopeNames.selectedScope;
    const graphName = graphNames && graphNames.selectedGraph;

    const dimensions = getRequestOptions(selectedDimensions);
    const metrics = getRequestOptions(selectedMetrics);

    const compatibilityRequest: ICompatibilityRequest = {
      scopeName,
      graphName,
      requestID: v4(),
      consumerInfo: {
        ApplicationName: 'Peekdata-Report-Builder-Demo',
      },
      dimensions,
      metrics,
    };

    const compatibility: IGraphReportCompatibility = yield peekdataApi.compatibility.getCompatibleNodes(compatibilityRequest);

    if (compatibility && compatibility.reason) {
      throw new Error(compatibility.reason);
    }

    yield put(compatibilityChecked({
      data: compatibility,
      isFetching: false,
      error: null,
      errorTimestamp: null,
    }));

    const filtersState: IFilter[] = yield select((state: IReportBuilderState) => state.filters);
    const compatibilityDimensions = compatibility.dimensions.map(dimension => dimension.name);
    const compatibilityFilters: IFilter[] = [];

    for (const filter of filtersState) {
      let isCompatible = false;

      if (!filter.filterType) {
        compatibilityFilters.push(filter);
      } else if (filter.filterType === FilterTypes.DateRanges || filter.filterType === FilterTypes.SingleKeys) {
        for (const dimension of compatibilityDimensions) {
          if (filter.key === dimension) {
            isCompatible = true;
            break;
          }
        }

        if (isCompatible || !filter.key) {
          compatibilityFilters.push(filter);
        }
      } else if (filter.filterType === FilterTypes.SingleValues) {
        isCompatible = true;

        for (const key of filter.keys) {
          if (compatibilityDimensions.indexOf(key) === -1) {
            isCompatible = false;
            break;
          }
        }

        if (isCompatible || !filter.keys || filter.keys.length < 1) {
          compatibilityFilters.push(filter);
        }
      }
    }

    yield put(setFilters(compatibilityFilters));
    yield put(generateReportRequest());
  } catch (error) {
    yield put(compatibilityChecked({
      data: null,
      isFetching: false,
      error: error.message,
      errorTimestamp: new Date(),
    }));
  }
}

// #endregion

// #region -------------- Load data full -------------------------------------------------------------------

export function* onLoadDataFull(action: IAction<IReportRequest>) {
  try {
    const dataFull: INotOptimizedReportResponse = yield peekdataApi.data.getData(action.payload);

    yield put(dataFullLoaded({
      data: dataFull,
      isFetching: false,
      error: null,
      errorTimestamp: null,
    }));
  } catch (error) {
    yield put(dataFullLoaded({
      data: null,
      isFetching: false,
      error: error.message,
      errorTimestamp: new Date(),
    }));
  }
}

// #endregion

// #region -------------- Load data optimized -------------------------------------------------------------------

export function* onLoadDataOptimized(action: IAction<IReportRequest>) {
  try {
    const dataOptimized: IOptimizedReportResponse = yield peekdataApi.data.getDataOptimized(action.payload);

    yield put(dataOptimizedLoaded({
      data: dataOptimized,
      isFetching: false,
      error: null,
      errorTimestamp: null,
    }));
  } catch (error) {
    yield put(dataOptimizedLoaded({
      data: null,
      isFetching: false,
      error: error.message,
      errorTimestamp: new Date(),
    }));
  }
}

// #endregion

// #region -------------- Load csv file -------------------------------------------------------------------

export function* onLoadCsvFile(action: IAction<IReportRequest>) {
  try {
    const file: string = yield peekdataApi.data.getCSV(action.payload);

    yield put(csvFileLoaded({
      data: file,
      isFetching: false,
      error: null,
      errorTimestamp: null,
    }));
  } catch (error) {
    yield put(csvFileLoaded({
      data: null,
      isFetching: false,
      error: error.message,
      errorTimestamp: new Date(),
    }));
  }
}

// #endregion

// #region -------------- Load select -------------------------------------------------------------------

export function* onLoadSelect(action: IAction<IReportRequest>) {
  try {
    const selectStr: string = yield peekdataApi.data.getSelect(action.payload);

    yield put(selectLoaded({
      data: selectStr,
      isFetching: false,
      error: null,
      errorTimestamp: null,
    }));
  } catch (error) {
    yield put(selectLoaded({
      data: null,
      isFetching: false,
      error: error.message,
      errorTimestamp: new Date(),
    }));
  }
}

// #endregion

export function* rootSaga() {
  yield all([
    takeLatest(actionTypes.loadReportRequest, onLoadReportRequest),
    takeLatest(actionTypes.generateReportRequest, onGenerateReportRequest),
    takeLatest(actionTypes.loadScopeNames, onLoadScopeNames),
    takeLatest(actionTypes.loadGraphNames, onLoadGraphNames),
    takeLatest(actionTypes.loadGraphNodes, onLoadDimensions),
    takeLatest(actionTypes.loadGraphNodes, onLoadMetrics),
    takeLatest(actionTypes.selectOption, onCheckCompatibility),
    takeLatest(actionTypes.unselectOption, onCheckCompatibility),
    takeLatest(actionTypes.loadDataOptimized, onLoadDataOptimized),
    takeLatest(actionTypes.loadDataFull, onLoadDataFull),
    takeLatest(actionTypes.loadCsvFile, onLoadCsvFile),
    takeLatest(actionTypes.loadSelect, onLoadSelect),
  ]);
}
