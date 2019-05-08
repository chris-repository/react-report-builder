import { IReportRequest, IRequestOptions, ReportColumnType } from 'peekdata-datagateway-api-sdk';
import React, { Fragment, ReactNode } from 'react';
import { connect } from 'react-redux';
import { FilterControls } from 'src/ReportBuilder/components/FilterControls';
import { GraphDropDowns } from 'src/ReportBuilder/components/GraphDropDowns';
import { ReportOptionsList } from 'src/ReportBuilder/components/ReportOptionsList';
import { ReportTabs } from 'src/ReportBuilder/components/ReportTabs';
import { RowsLimitInput } from 'src/ReportBuilder/components/RowsLimitInput';
import { Spinner } from 'src/ReportBuilder/components/Spinner';
import { ViewDropDowns } from 'src/ReportBuilder/components/ViewDropDowns';
import { IDimension, IMetric, ISelectedGraphNode } from 'src/ReportBuilder/models/graph';
import { initPeekdataApi } from 'src/ReportBuilder/services/api';
import { IAsyncState } from 'src/ReportBuilder/state/action';
import { addGraphNode, changeLimitRowsTo, changeStartWithRow, generateReportRequest, ILoadGraphNodesPayloadRequest, ISelectGraphNodePayload, ISortGraphNodePayload, ISortOrderGraphNodePayload, loadGraphNames, loadGraphNodes, loadReportRequest, loadScopeNames, selectGraphNode, sortEnd, sortOrder, unselectGraphNode } from 'src/ReportBuilder/state/actions';
import { IReportBuilderState } from 'src/ReportBuilder/state/reducers';
import { ICompatibilityState } from 'src/ReportBuilder/state/reducers/compatibility';
import { ITranslations, setTranslations, translate } from 'src/ReportBuilder/translations';

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
}

interface IDispatchProps {
  onOptionAdded: (payload: ReportColumnType) => void;
  onOptionSelected: (payload: ISelectGraphNodePayload) => void;
  onOptionUnselected: (payload: ISelectGraphNodePayload) => void;
  onSortOrder: (payload: ISortOrderGraphNodePayload) => void;
  onSortEnd: (payload: ISortGraphNodePayload) => void;
  onChangeLimitRowsTo: (payload: number) => void;
  onChangeStartWithRow: (payload: number) => void;
  onLoadScopeNames: () => void;
  onScopeChanged: (scope: string) => void;
  onGraphChanged: (payload: ILoadGraphNodesPayloadRequest) => void;
  onLoadReportRequest: (reportRequest: Partial<IReportRequest>) => void;
  onGenerateReportRequest: () => void;
}

interface IDefaultProps {
  showTitle: boolean;
  showContentTitle: boolean;
  loader: ReactNode;
  showScopesDropdown: boolean;
  showGraphsDropdown: boolean;
  showDimensionsList: boolean;
  showFilters: boolean;
  showRowsOffset: boolean;
  showRowsLimit: boolean;
  maxRowsLimit: number;
  showRequestViewButton: boolean;
  showResponseViewButton: boolean;
  showDataTabs: boolean;
  showChart: boolean;
  showDataTable: boolean;
  defaultTab: number;
}

export interface IReportBuilderProps extends Partial<IDefaultProps> {
  apiRequestOptions: IRequestOptions;
  translations?: Partial<ITranslations>;
  reportRequest?: Partial<IReportRequest>;
}

interface IProps extends IStateProps, IDispatchProps, IReportBuilderProps { }

// #endregion

// #region -------------- Component -------------------------------------------------------------------

class ReportBuilder extends React.PureComponent<IProps> {

  public static defaultProps: IDefaultProps = {
    showTitle: true,
    showContentTitle: true,
    loader: <Spinner />,
    showScopesDropdown: true,
    showGraphsDropdown: true,
    showDimensionsList: true,
    showFilters: true,
    showRowsOffset: true,
    showRowsLimit: true,
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

    const { apiRequestOptions, translations } = this.props;

    initPeekdataApi(apiRequestOptions);
    setTranslations(translations);
  }

  public componentDidMount() {
    const { onLoadScopeNames, reportRequest, onLoadReportRequest } = this.props;

    if (reportRequest) {
      onLoadReportRequest(reportRequest);
    } else {
      onLoadScopeNames();
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    const { translations, apiRequestOptions, onLoadReportRequest, reportRequest } = this.props;
    const prevTranslations = prevProps && prevProps.translations;
    const prevApiRequestOptions = prevProps && prevProps.apiRequestOptions;
    const prevReportRequest = prevProps && prevProps.reportRequest;

    if (prevTranslations !== translations) {
      setTranslations(translations);
    }

    if (prevApiRequestOptions !== apiRequestOptions) {
      initPeekdataApi(apiRequestOptions);
    }

    if (prevReportRequest !== reportRequest) {
      onLoadReportRequest(reportRequest);
    }
  }

  public render() {
    return (
      <Fragment>
        {this.renderGraphDropDowns()}

        <div className='rb-report-container'>
          {this.renderLoader()}
          {this.renderError()}
          {this.renderReportBuilderContent()}
        </div>

      </Fragment>
    );
  }

  // #region -------------- Graph dropdowns -------------------------------------------------------------------

  private renderGraphDropDowns = () => {
    const { scopeNames, graphNames, selectedScope, selectedGraph, onScopeChanged, onGraphChanged, showScopesDropdown, showGraphsDropdown } = this.props;

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
    if (!this.showReportBuilderContent()) {
      return null;
    }

    return (
      <Fragment>
        <div className='rb-report-content'>
          {this.renderContentTitle()}
          {this.renderCompatibilityError()}
          {this.renderDimensionsList()}
          {this.renderMetricsList()}
        </div>

        {this.renderFilters()}
        {this.renderRowsLimit()}
        {this.renderViewDropDowns()}
        {this.renderTabs()}
      </Fragment>
    );
  }

  private showReportBuilderContent = () => {
    const { dimensions, metrics } = this.props;

    return dimensions && dimensions.data && dimensions.data.length > 0
      && metrics && metrics.data && metrics.data.length > 0;
  }

  // #endregion

  // #region -------------- Content title -------------------------------------------------------------------

  private renderContentTitle = () => {
    const { showContentTitle } = this.props;

    if (!showContentTitle) {
      return null;
    }

    return (
      <div className='rb-title-dark rb-title-small'>{translate(t => t.contentTitle)}</div>
    );
  }

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
    const { dimensions, selectedDimensions, onOptionAdded, onOptionSelected, onOptionUnselected, onSortEnd, showDimensionsList } = this.props;

    if (!showDimensionsList || !dimensions || !dimensions.data || dimensions.data.length === 0) {
      return null;
    }

    return (
      <ReportOptionsList
        options={dimensions.data}
        selectedOptions={selectedDimensions}
        optionType={ReportColumnType.dimension}
        listTitle={translate(t => t.dimensionsListTitle)}
        placeholder={translate(t => t.dimensionPlaceholder)}
        noResultsText={translate(t => t.noDimensionsText)}
        buttonTitle={translate(t => t.addDimensionButtonText)}
        onOptionAdded={onOptionAdded}
        onOptionSelected={onOptionSelected}
        onOptionUnselected={onOptionUnselected}
        onSortOrder={this.onSortOrder}
        onSortEnd={onSortEnd}
        isOptional={true}
      />
    );
  }

  private renderMetricsList = () => {
    const { metrics, selectedMetrics, onOptionAdded, onOptionSelected, onOptionUnselected, onSortEnd } = this.props;

    if (!metrics || !metrics.data || metrics.data.length === 0) {
      return null;
    }

    return (
      <ReportOptionsList
        options={metrics.data}
        selectedOptions={selectedMetrics}
        optionType={ReportColumnType.metric}
        listTitle={translate(t => t.metricsListTitle)}
        placeholder={translate(t => t.metricPlaceholder)}
        noResultsText={translate(t => t.noMetricsText)}
        buttonTitle={translate(t => t.addMetricButtonText)}
        onOptionAdded={onOptionAdded}
        onOptionSelected={onOptionSelected}
        onOptionUnselected={onOptionUnselected}
        onSortOrder={this.onSortOrder}
        onSortEnd={onSortEnd}
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
    const { limitRowsTo, startWithRow, onChangeStartWithRow, onChangeLimitRowsTo, showRowsOffset, showRowsLimit, maxRowsLimit } = this.props;

    return (
      <RowsLimitInput
        startWithRow={startWithRow}
        limitRowsTo={limitRowsTo}
        showRowsOffset={showRowsOffset}
        showRowsLimit={showRowsLimit}
        onStartWithRowChanged={onChangeStartWithRow}
        onLimitRowsToChanged={onChangeLimitRowsTo}
        maxRowsLimit={maxRowsLimit}
      />
    );
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
    const { dimensions, metrics, selectedDimensions, selectedMetrics, compatibility, limitRowsTo, startWithRow, request, scopeNames, graphNames } = state;

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
    };
  },
  (dispatch) => {
    return {
      onOptionAdded: (payload: ReportColumnType) => dispatch(addGraphNode(payload)),
      onOptionSelected: (payload: ISelectGraphNodePayload) => dispatch(selectGraphNode(payload)),
      onOptionUnselected: (payload: ISelectGraphNodePayload) => dispatch(unselectGraphNode(payload)),
      onSortOrder: (payload: ISortOrderGraphNodePayload) => dispatch(sortOrder(payload)),
      onSortEnd: (payload: ISortGraphNodePayload) => dispatch(sortEnd(payload)),
      onChangeLimitRowsTo: (payload: number) => {
        dispatch(changeLimitRowsTo(payload));
        dispatch(generateReportRequest());
      },
      onChangeStartWithRow: (payload: number) => {
        dispatch(changeStartWithRow(payload));
        dispatch(generateReportRequest());
      },
      onLoadScopeNames: () => dispatch(loadScopeNames()),
      onScopeChanged: (scope: string) => dispatch(loadGraphNames(scope)),
      onGraphChanged: (payload: ILoadGraphNodesPayloadRequest) => dispatch(loadGraphNodes(payload)),
      onLoadReportRequest: (reportRequest: Partial<IReportRequest>) => dispatch(loadReportRequest(reportRequest)),
      onGenerateReportRequest: () => dispatch(generateReportRequest()),
    };
  },
)(ReportBuilder);

// #endregion

export { connected as ReportBuilder };

