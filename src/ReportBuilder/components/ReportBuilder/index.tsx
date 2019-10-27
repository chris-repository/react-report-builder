import Collapse from '@kunukn/react-collapse';
import cx from "classnames";
import { IReportRequest, PeekdataApi, ReportColumnType } from 'peekdata-datagateway-api-sdk';
import React, { Fragment, ReactNode } from 'react';
import { connect } from 'react-redux';
import { FilterControls } from 'src/ReportBuilder/components/FilterControls';
import { GraphDropDowns } from 'src/ReportBuilder/components/GraphDropDowns';
import { ReportOptionsList } from 'src/ReportBuilder/components/ReportOptionsList';
import { ReportTabs } from 'src/ReportBuilder/components/ReportTabs';
import { RowsLimitInput } from 'src/ReportBuilder/components/RowsLimitInput';
import { Spinner } from 'src/ReportBuilder/components/Spinner';
import { ViewDropDowns } from 'src/ReportBuilder/components/ViewDropDowns';
import { defaultRows, setRowsDefaultLimit, setRowsDefaultOffset } from 'src/ReportBuilder/constants/rows';
import { IDimension, IMetric, ISelectedGraphNode } from 'src/ReportBuilder/models/graph';
import { ITranslations } from 'src/ReportBuilder/models/translations';
import { setPeekdataApi } from 'src/ReportBuilder/services/api';
import { IAsyncState } from 'src/ReportBuilder/state/action';
import { addGraphNode, changeLimitRowsTo, changeStartWithRow, expandReportOptions, generateReportRequest, ILoadGraphNodesPayloadRequest, ISelectGraphNodePayload, ISortGraphNodePayload, ISortOrderGraphNodePayload, loadGraphNames, loadGraphNodes, loadReportRequest, selectGraphNode, setTranslations, sortEnd, sortOrder, unselectGraphNode } from 'src/ReportBuilder/state/actions';
import { IReportBuilderState } from 'src/ReportBuilder/state/reducers';
import { ICompatibilityState } from 'src/ReportBuilder/state/reducers/compatibility';
import { IReportOptionsState } from 'src/ReportBuilder/state/reducers/reportOptions';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IStateProps {
  dimensions: IAsyncState<IDimension[]>;
  metrics: IAsyncState<IMetric[]>;
  selectedDimensions: ISelectedGraphNode[];
  selectedMetrics: ISelectedGraphNode[];
  compatibility: ICompatibilityState;
  limitRowsTo: number;
  startWithRow: number;
  request: IReportRequest;
  scopeNames: IAsyncState<string[]>;
  selectedScope: string;
  graphNames: IAsyncState<string[]>;
  selectedGraph: string;
  t: ITranslations;
  reportOptions: IReportOptionsState;
}

interface IDispatchProps {
  onOptionAdded: (payload: ReportColumnType) => void;
  onOptionSelected: (payload: ISelectGraphNodePayload) => void;
  onOptionUnselected: (payload: ISelectGraphNodePayload) => void;
  onSortOrder: (payload: ISortOrderGraphNodePayload) => void;
  onSortEnd: (payload: ISortGraphNodePayload) => void;
  onChangeLimitRowsTo: (payload: number) => void;
  onChangeStartWithRow: (payload: number) => void;
  onScopeChanged: (scope: string) => void;
  onGraphChanged: (payload: ILoadGraphNodesPayloadRequest) => void;
  onLoadReportRequest: (reportRequest: Partial<IReportRequest>) => void;
  onGenerateReportRequest: () => void;
  setTranslations: (translations: Partial<ITranslations>) => void;
  onReportOptionsChange: () => void;
}

interface IDefaultProps {
  loader: ReactNode;
  showScopesDropdown: boolean;
  showGraphsDropdown: boolean;
  showDimensionsList: boolean;
  showMetricsList: boolean;
  showFilters: boolean;
  showRowsOffset: boolean;
  showRowsLimit: boolean;
  defaultRowsOffset: number;
  defaultRowsLimit: number;
  maxRowsLimit: number;
  showRequestViewButton: boolean;
  showResponseViewButton: boolean;
  showDataTabs: boolean;
  showChart: boolean;
  showDataTable: boolean;
  defaultTab: number;
}

export interface IReportBuilderProps extends Partial<IDefaultProps> {
  peekdataApi: PeekdataApi;
  translations?: Partial<ITranslations>;
  reportRequest?: Partial<IReportRequest>;
}

interface IProps extends IStateProps, IDispatchProps, IReportBuilderProps { }

// #endregion

// #region -------------- Component -------------------------------------------------------------------

class ReportBuilder extends React.PureComponent<IProps> {

  public static defaultProps: IDefaultProps = {
    loader: <Spinner />,
    showScopesDropdown: true,
    showGraphsDropdown: true,
    showDimensionsList: true,
    showMetricsList: true,
    showFilters: true,
    showRowsOffset: true,
    showRowsLimit: true,
    defaultRowsOffset: defaultRows.offset,
    defaultRowsLimit: defaultRows.limit,
    maxRowsLimit: 10000,
    showRequestViewButton: true,
    showResponseViewButton: true,
    showDataTabs: true,
    showChart: true,
    showDataTable: true,
    defaultTab: 0,
  };

  public constructor(props: IProps) {
    super(props);

    const { peekdataApi, translations, defaultRowsOffset, defaultRowsLimit, setTranslations } = this.props;

    setPeekdataApi(peekdataApi);
    setTranslations(translations);
    setRowsDefaultOffset(defaultRowsOffset);
    setRowsDefaultLimit(defaultRowsLimit);
  }

  public componentDidMount() {
    const { reportRequest, onLoadReportRequest, onChangeStartWithRow, onChangeLimitRowsTo, defaultRowsOffset, defaultRowsLimit } = this.props;

    onChangeStartWithRow(defaultRowsOffset);
    onChangeLimitRowsTo(defaultRowsLimit);
    onLoadReportRequest(reportRequest);
  }

  public componentDidUpdate(prevProps: IProps) {
    const { translations, peekdataApi, onLoadReportRequest, reportRequest, onChangeStartWithRow, onChangeLimitRowsTo, defaultRowsOffset, defaultRowsLimit, setTranslations } = this.props;
    const prevTranslations = prevProps && prevProps.translations;
    const prevPeekdataApi = prevProps && prevProps.peekdataApi;
    const prevReportRequest = prevProps && prevProps.reportRequest;
    const prevRowsOffset = prevProps && prevProps.defaultRowsOffset;
    const prevRowsLimit = prevProps && prevProps.defaultRowsLimit;

    if (prevRowsOffset !== defaultRowsOffset) {
      onChangeStartWithRow(defaultRowsOffset);
    }

    if (prevRowsLimit !== defaultRowsLimit) {
      onChangeLimitRowsTo(defaultRowsLimit);
    }

    if (prevTranslations !== translations) {
      setTranslations(translations);
    }

    if (prevPeekdataApi !== peekdataApi) {
      setPeekdataApi(peekdataApi);
    }

    if (prevReportRequest !== reportRequest) {
      onLoadReportRequest(reportRequest);
    }
  }

  public render() {
    return (
      <div className='rb-report-builder-container'>
        {this.renderGraphDropDowns()}

        <div className='rb-report-container'>
          {this.renderLoader()}
          {this.renderError()}
          {this.renderReportBuilderContent()}
        </div>
      </div>
    );
  }

  // #region -------------- Graph dropdowns -------------------------------------------------------------------

  private renderGraphDropDowns = () => {
    const { scopeNames, graphNames, selectedScope, selectedGraph, onScopeChanged, onGraphChanged, showScopesDropdown, showGraphsDropdown, t } = this.props;

    return (
      <GraphDropDowns
        scopeNames={scopeNames}
        graphNames={graphNames}
        selectedScope={selectedScope}
        selectedGraph={selectedGraph}
        showScopesDropdown={showScopesDropdown}
        showGraphsDropdown={showGraphsDropdown}
        onScopeChanged={onScopeChanged}
        onGraphChanged={onGraphChanged}
        t={t}
      />
    );
  }

  // #endregion

  // #region -------------- Loader -------------------------------------------------------------------

  private renderLoader = () => {
    const { loader } = this.props;

    if (!this.isLoading()) {
      return null;
    }

    return loader;
  }

  private isLoading = () => {
    const { dimensions, metrics } = this.props;

    return (dimensions && dimensions.isFetching) ||
      (metrics && metrics.isFetching);
  }

  // #endregion

  // #region -------------- Errors -------------------------------------------------------------------

  private renderError = () => {
    const { dimensions, metrics } = this.props;
    const dimensionsError = dimensions && dimensions.error;
    const metricsError = metrics && metrics.error;

    if (!dimensionsError && !metricsError) {
      return null;
    }

    let error = '';

    if (dimensionsError) {
      error += `${dimensionsError}\n`;
    }

    if (metricsError) {
      error += `${metricsError}\n`;
    }

    return <div className='alert alert-danger'>{error}</div>;
  }

  // #endregion

  // #region -------------- Report builder content -------------------------------------------------------------------

  private renderReportBuilderContent = () => {
    const { selectedGraph, onReportOptionsChange, reportOptions, t } = this.props;

    if (!selectedGraph) {
      return null;
    }

    return (
      <Fragment>
        <div className='rb-report-content'>

          <div onClick={() => onReportOptionsChange()}>
            <span className="rotate90">
              <svg className={cx("icon", { "icon--expanded": reportOptions.isReportOptionsOpen })}
                viewBox="6 0 12 24">
                <polygon points="8 0 6 1.8 14.4 12 6 22.2 8 24 18 12" />
              </svg>
            </span>
            <span className='rb-title-dark rb-title-small'>{t.contentTitle}</span>

          </div>

          <Collapse className='rb-report-option-content' isOpen={reportOptions.isReportOptionsOpen}>
            {this.renderCompatibilityError()}
            {this.renderMetricsList()}
            {this.renderDimensionsList()}
            {this.renderFilters()}
            {this.renderRowsLimit()}
          </Collapse>

        </div>


        {this.renderViewDropDowns()}
        {this.renderTabs()}
      </Fragment>
    );
  }

  // #endregion

  // #endregion

  // #region -------------- Compatibility error -------------------------------------------------------------------

  private renderCompatibilityError = () => {
    const { compatibility } = this.props;

    if (!compatibility || !compatibility.error) {
      return null;
    }

    return <div className='alert alert-danger'>{compatibility.error}</div>;
  }

  // #endregion

  // #region -------------- Dimensions/Metrics lists -------------------------------------------------------------------

  private renderDimensionsList = () => {
    const { dimensions, selectedDimensions, onOptionAdded, onOptionSelected, onOptionUnselected, onSortEnd, showDimensionsList, t } = this.props;

    if (!showDimensionsList || !dimensions || !dimensions.data || dimensions.data.length === 0) {
      return null;
    }

    return (
      <ReportOptionsList
        options={dimensions.data}
        selectedOptions={selectedDimensions}
        optionType={ReportColumnType.dimension}
        listTitle={t.dimensionsListTitle}
        placeholder={t.dimensionPlaceholder}
        noResultsText={t.noDimensionsText}
        buttonTitle={t.addDimensionButtonText}
        onOptionAdded={onOptionAdded}
        onOptionSelected={onOptionSelected}
        onOptionUnselected={onOptionUnselected}
        onSortOrder={this.onSortOrder}
        onSortEnd={onSortEnd}
        isOptional={true}
        t={t}
      />
    );
  }

  private renderMetricsList = () => {
    const { metrics, selectedMetrics, onOptionAdded, onOptionSelected, onOptionUnselected, onSortEnd, showMetricsList, t } = this.props;

    if (!showMetricsList || !metrics || !metrics.data || metrics.data.length === 0) {
      return null;
    }

    return (
      <ReportOptionsList
        options={metrics.data}
        selectedOptions={selectedMetrics}
        optionType={ReportColumnType.metric}
        listTitle={t.metricsListTitle}
        placeholder={t.metricPlaceholder}
        noResultsText={t.noMetricsText}
        buttonTitle={t.addMetricButtonText}
        onOptionAdded={onOptionAdded}
        onOptionSelected={onOptionSelected}
        onOptionUnselected={onOptionUnselected}
        onSortOrder={this.onSortOrder}
        onSortEnd={onSortEnd}
        t={t}
      />
    );
  }

  private onSortOrder = (payload: ISortOrderGraphNodePayload) => {
    const { onSortOrder, onGenerateReportRequest } = this.props;

    onSortOrder(payload);
    onGenerateReportRequest();
  }

  // #endregion

  // #region -------------- Filters -------------------------------------------------------------------

  private renderFilters = () => {
    const { showFilters } = this.props;

    if (!showFilters) {
      return null;
    }

    return (
      <FilterControls />
    );
  }

  // #endregion

  // #region -------------- Rows limit -------------------------------------------------------------------

  private renderRowsLimit = () => {
    const { limitRowsTo, startWithRow, showRowsOffset, showRowsLimit, maxRowsLimit, t } = this.props;

    return (
      <RowsLimitInput
        startWithRow={startWithRow}
        limitRowsTo={limitRowsTo}
        showRowsOffset={showRowsOffset}
        showRowsLimit={showRowsLimit}
        onStartWithRowChanged={this.onChangeStartWithRow}
        onLimitRowsToChanged={this.onChangeLimitRowsTo}
        maxRowsLimit={maxRowsLimit}
        t={t}
      />
    );
  }

  private onChangeStartWithRow = (rowsOffset: number) => {
    const { onChangeStartWithRow, onGenerateReportRequest } = this.props;

    onChangeStartWithRow(rowsOffset);
    onGenerateReportRequest();
  }

  private onChangeLimitRowsTo = (rowsLimit: number) => {
    const { onChangeLimitRowsTo, onGenerateReportRequest } = this.props;

    onChangeLimitRowsTo(rowsLimit);
    onGenerateReportRequest();
  }

  // #endregion

  // #region -------------- View dropdowns -------------------------------------------------------------------

  private renderViewDropDowns = () => {
    const { showRequestViewButton, showResponseViewButton, loader } = this.props;

    if (!this.showRequestResults()) {
      return null;
    }

    return (
      <ViewDropDowns
        showRequestViewButton={showRequestViewButton}
        showResponseViewButton={showResponseViewButton}
        loader={loader}
      />
    );
  }

  private showRequestResults = () => {
    const { request } = this.props;

    return request && request.metrics && request.metrics.length > 0;
  }

  // #endregion

  // #region -------------- Tabs -------------------------------------------------------------------

  private renderTabs = () => {
    const { showDataTabs, showChart, showDataTable, defaultTab, loader } = this.props;

    if (!this.showRequestResults()) {
      return null;
    }

    return (
      <ReportTabs
        showDataTabs={showDataTabs}
        showChart={showChart}
        showDataTable={showDataTable}
        defaultTab={defaultTab}
        loader={loader}
      />
    );
  }

  // #endregion
}

// #endregion

// #region -------------- Connect -------------------------------------------------------------------

const connected = connect<IStateProps, IDispatchProps, IReportBuilderProps, IReportBuilderState>(
  (state) => {
    const { dimensions, metrics, selectedDimensions, selectedMetrics, compatibility, limitRowsTo, startWithRow, request, scopeNames, graphNames, translations, reportOptions } = state;

    return {
      dimensions,
      metrics,
      selectedDimensions,
      selectedMetrics,
      compatibility,
      limitRowsTo,
      startWithRow,
      request,
      scopeNames: scopeNames && scopeNames.scopeNames,
      selectedScope: scopeNames && scopeNames.selectedScope,
      graphNames: graphNames && graphNames.graphNames,
      selectedGraph: graphNames && graphNames.selectedGraph,
      t: translations,
      reportOptions,
    };
  },
  (dispatch) => {
    return {
      onOptionAdded: (payload: ReportColumnType) => dispatch(addGraphNode(payload)),
      onOptionSelected: (payload: ISelectGraphNodePayload) => dispatch(selectGraphNode(payload)),
      onOptionUnselected: (payload: ISelectGraphNodePayload) => dispatch(unselectGraphNode(payload)),
      onSortOrder: (payload: ISortOrderGraphNodePayload) => dispatch(sortOrder(payload)),
      onSortEnd: (payload: ISortGraphNodePayload) => dispatch(sortEnd(payload)),
      onChangeStartWithRow: (payload: number) => dispatch(changeStartWithRow(payload)),
      onChangeLimitRowsTo: (payload: number) => dispatch(changeLimitRowsTo(payload)),
      onScopeChanged: (scope: string) => dispatch(loadGraphNames(scope)),
      onGraphChanged: (payload: ILoadGraphNodesPayloadRequest) => dispatch(loadGraphNodes(payload)),
      onLoadReportRequest: (reportRequest: Partial<IReportRequest>) => dispatch(loadReportRequest(reportRequest)),
      onGenerateReportRequest: () => dispatch(generateReportRequest()),
      setTranslations: (translations: Partial<ITranslations>) => dispatch(setTranslations(translations)),
      onReportOptionsChange: () => dispatch(expandReportOptions())
    };
  },
)(ReportBuilder);

// #endregion

export { connected as ReportBuilder };

