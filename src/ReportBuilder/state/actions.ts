import { IGraphNode, IGraphReportCompatibility, INotOptimizedReportResponse, IOptimizedReportResponse, IReportFilters, IReportRequest, ReportColumnType } from 'peekdata-datagateway-api-sdk';
import { FilterOptionTypes, IFilter } from 'src/ReportBuilder/models/filter';
import { ISelectedGraphNode } from 'src/ReportBuilder/models/graph';
import { IAction, IAsyncState } from 'src/ReportBuilder/state/action';
import { ITranslations } from '../models/translations';

// #region -------------- Action types -------------------------------------------------------------------

export const actionTypes = {
  loadScopeNames: 'reportBuilder/LOAD_SCOPE_NAMES',
  scopeNamesLoaded: 'reportBuilder/SCOPE_NAMES_LOADED',
  loadGraphNames: 'reportBuilder/LOAD_GRAPH_NAMES',
  graphNamesLoaded: 'reportBuilder/GRAPH_NAMES_LOADED',
  loadGraphNodes: 'reportBuilder/LOAD_GRAPH_NODES',
  dimensionsLoaded: 'reportBuilder/DIMENSIONS_LOADED',
  setSelectedDimensions: 'reportBuilder/SET_SELECTED_DIMENSIONS',
  metricsLoaded: 'reportBuilder/METRICS_LOADED',
  setSelectedMetrics: 'reportBuilder/SET_SELECTED_METRICS',
  addOption: 'reportBuilder/ADD_OPTION',
  selectOption: 'reportBuilder/SELECT_OPTION',
  unselectOption: 'reportBuilder/UNSELECT_OPTION',
  compatibilityChecked: 'reportBuilder/COMPATIBILITY_CHECKED',
  sortOrder: 'reportBuilder/SORT_ORDER',
  sortEnd: 'reportBuilder/SORT_END',
  addFilter: 'reportBuilder/ADD_FILTER',
  filtersLoaded: 'reportBuilder/FILTERS_LOADED',
  removeFilter: 'reportBuilder/REMOVE_FILTER',
  setFilters: 'reportBuilder/SET_FILTERS',
  selectFilterOption: 'reportBuilder/SELECT_FILTER_OPTION',
  changeFilterInput: 'reportBuilder/CHANGE_FILTER_INPUT',
  changeLimitRowsTo: 'reportBuilder/CHANGE_LIMIT_ROWS_TO',
  changeStartWithRow: 'reportBuilder/CHANGE_START_WITH_ROW',
  loadReportRequest: 'reportBuilder/LOAD_REPORT_REQUEST',
  generateReportRequest: 'reportBuilder/GENERATE_REPORT_REQUEST',
  reportRequestGenerated: 'reportBuilder/REPORT_REQUEST_GENERATED',
  loadSelect: 'reportBuilder/LOAD_SELECT',
  selectLoaded: 'reportBuilder/SELECT_LOADED',
  loadDataOptimized: 'reportBuilder/LOAD_DATA_OPTIMIZED',
  dataOptimizedLoaded: 'reportBuilder/DATA_OPTIMIZED_LOADED',
  loadDataFull: 'reportBuilder/LOAD_DATA_FULL',
  dataFullLoaded: 'reportBuilder/DATA_FULL_LOADED',
  loadCsvFile: 'reportBuilder/LOAD_CSV_FILE',
  csvFileLoaded: 'reportBuilder/CSV_FILE_LOADED',
  setTranslations: 'reportBuilder/SET_TRANSLATIONS',
  expandReportOptions: 'reportBuilder/EXPAND_REPORT_OPTIONS',
};

// #endregion

// #region -------------- Scope actions -------------------------------------------------------------------

export function loadScopeNames(payload?: boolean): IAction {
  return {
    type: actionTypes.loadScopeNames,
    payload,
  };
}

export function scopeNamesLoaded(payload: IAsyncState<string[]>): IAction {
  return {
    type: actionTypes.scopeNamesLoaded,
    payload,
  };
}

// #endregion

// #region -------------- Graph actions -------------------------------------------------------------------

export function loadGraphNames(payload: string): IAction {
  return {
    type: actionTypes.loadGraphNames,
    payload,
  };
}

export function graphNamesLoaded(payload: IAsyncState<string[]>): IAction {
  return {
    type: actionTypes.graphNamesLoaded,
    payload,
  };
}

// #endregion

// #region -------------- Dimensions/Metrics actions -------------------------------------------------------------------

export interface ILoadGraphNodesPayloadRequest {
  selectedGraph: string;
  selectedDimensions?: ISelectedGraphNode[];
  selectedMetrics?: ISelectedGraphNode[];
}

export interface ISelectGraphNodePayload {
  value: string;
  optionType: ReportColumnType;
}

export interface ISortOrderGraphNodePayload {
  selectedOption: ISelectedGraphNode;
  optionType: ReportColumnType;
}

export interface ISortGraphNodePayload {
  oldIndex: number;
  newIndex: number;
  optionType: ReportColumnType;
}

export function loadGraphNodes(payload: ILoadGraphNodesPayloadRequest): IAction {
  return {
    type: actionTypes.loadGraphNodes,
    payload,
  };
}

export function dimensionsLoaded(payload: IAsyncState<IGraphNode[]>): IAction {
  return {
    type: actionTypes.dimensionsLoaded,
    payload,
  };
}

export function addGraphNode(payload: ReportColumnType): IAction {
  return {
    type: actionTypes.addOption,
    payload,
  };
}

export function selectGraphNode(payload: ISelectGraphNodePayload): IAction {
  return {
    type: actionTypes.selectOption,
    payload,
  };
}

export function unselectGraphNode(payload: ISelectGraphNodePayload): IAction {
  return {
    type: actionTypes.unselectOption,
    payload,
  };
}

export function compatibilityChecked(payload: IAsyncState<IGraphReportCompatibility>): IAction {
  return {
    type: actionTypes.compatibilityChecked,
    payload,
  };
}

export function sortOrder(payload: ISortOrderGraphNodePayload): IAction {
  return {
    type: actionTypes.sortOrder,
    payload,
  };
}

export function sortEnd(payload: ISortGraphNodePayload): IAction {
  return {
    type: actionTypes.sortEnd,
    payload,
  };
}

export function setSelectedDimensions(payload: ISelectedGraphNode[]): IAction {
  return {
    type: actionTypes.setSelectedDimensions,
    payload,
  };
}

export function metricsLoaded(payload: IAsyncState<IGraphNode[]>): IAction {
  return {
    type: actionTypes.metricsLoaded,
    payload,
  };
}

export function setSelectedMetrics(payload: ISelectedGraphNode[]): IAction {
  return {
    type: actionTypes.setSelectedMetrics,
    payload,
  };
}

// #endregion

// #region-------------- Filter actions-------------------------------------------------------------------

export interface ISelectFilter {
  filter: IFilter;
  selectedItem: string | string[];
  optionType: FilterOptionTypes;
}

export interface IChangeFilterInput {
  filter: IFilter;
  name: string;
  value: string;
}

export function addFilter(): IAction {
  return {
    type: actionTypes.addFilter,
  };
}

export function filtersLoaded(payload: IReportFilters): IAction {
  return {
    type: actionTypes.filtersLoaded,
    payload,
  };
}

export function selectFilterOption(payload: ISelectFilter): IAction {
  return {
    type: actionTypes.selectFilterOption,
    payload,
  };
}

export function changeFilterInput(payload: IChangeFilterInput): IAction {
  return {
    type: actionTypes.changeFilterInput,
    payload,
  };
}

export function removeFilter(payload: IFilter): IAction {
  return {
    type: actionTypes.removeFilter,
    payload,
  };
}

export function setFilters(payload: IFilter[]): IAction {
  return {
    type: actionTypes.setFilters,
    payload,
  };
}

// #endregion

// #region-------------- Limit rows actions-------------------------------------------------------------------

export function changeLimitRowsTo(payload: number): IAction {
  return {
    type: actionTypes.changeLimitRowsTo,
    payload,
  };
}

export function changeStartWithRow(payload: number): IAction {
  return {
    type: actionTypes.changeStartWithRow,
    payload,
  };
}

// #endregion

// #region-------------- Request actions-------------------------------------------------------------------

export function loadReportRequest(payload: Partial<IReportRequest>): IAction {
  return {
    type: actionTypes.loadReportRequest,
    payload,
  };
}

export function generateReportRequest(): IAction {
  return {
    type: actionTypes.generateReportRequest,
  };
}

export function reportRequestGenerated(payload: Partial<IReportRequest>): IAction {
  return {
    type: actionTypes.reportRequestGenerated,
    payload,
  };
}

export function loadSelect(payload: IReportRequest): IAction {
  return {
    type: actionTypes.loadSelect,
    payload,
  };
}

export function selectLoaded(payload: IAsyncState<string>): IAction {
  return {
    type: actionTypes.selectLoaded,
    payload,
  };
}

export function loadDataOptimized(payload: IReportRequest): IAction {
  return {
    type: actionTypes.loadDataOptimized,
    payload,
  };
}

export function dataOptimizedLoaded(payload: IAsyncState<IOptimizedReportResponse>): IAction {
  return {
    type: actionTypes.dataOptimizedLoaded,
    payload,
  };
}

export function loadDataFull(payload: IReportRequest): IAction {
  return {
    type: actionTypes.loadDataFull,
    payload,
  };
}

export function dataFullLoaded(payload: IAsyncState<INotOptimizedReportResponse>): IAction {
  return {
    type: actionTypes.dataFullLoaded,
    payload,
  };
}

export function loadCsvFile(payload: IReportRequest): IAction {
  return {
    type: actionTypes.loadCsvFile,
    payload,
  };
}

export function csvFileLoaded(payload: IAsyncState<string>): IAction {
  return {
    type: actionTypes.csvFileLoaded,
    payload,
  };
}

// #endregion

// #region -------------- Translations -------------------------------------------------------------------

export function setTranslations(payload: Partial<ITranslations>) {
  return {
    type: actionTypes.setTranslations,
    payload,
  };
}

// #endregion

export function expandReportOptions() {
  return {
    type: actionTypes.expandReportOptions,
  };
}
