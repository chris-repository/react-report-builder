import { IOptimizedReportResponse, IReportRequest } from 'peekdata-datagateway-api-sdk';
import React, { Fragment, ReactNode } from 'react';
import { connect } from 'react-redux';
import { translate } from 'src/ReportBuilder//translations';
import { Dashboards } from 'src/ReportBuilder/components/Dashboards';
import { ReportTable } from 'src/ReportBuilder/components/ReportTable';
import { ITab, TabsControl as Tabs } from 'src/ReportBuilder/components/Tabs';
import { ISelectedGraphNode } from 'src/ReportBuilder/models/graph';
import { IAsyncState } from 'src/ReportBuilder/state/action';
import { loadDataOptimized } from 'src/ReportBuilder/state/actions';
import { IReportBuilderState } from 'src/ReportBuilder/state/reducers';
import { Spinner } from '../Spinner';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IStateProps {
  selectedDimensions: ISelectedGraphNode[];
  selectedMetrics: ISelectedGraphNode[];
  dataOptimized: IAsyncState<IOptimizedReportResponse>;
  request: IReportRequest;
}

interface IDispatchProps {
  onLoadOptimizedData: (request: IReportRequest) => void;
}

interface IDefaultProps {
  showDataTabs: boolean;
  showChart: boolean;
  showDataTable: boolean;
  defaultTab: number;
  loader: ReactNode;
}

interface IOwnProps extends Partial<IDefaultProps> { }

interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

// #endregion

// #region -------------- Component -------------------------------------------------------------------

class ReportTabs extends React.PureComponent<IProps> {

  public static defaultProps: IDefaultProps = {
    showDataTabs: true,
    showChart: true,
    showDataTable: true,
    defaultTab: 0,
    loader: <Spinner />,
  };

  public componentDidMount() {
    this.loadOptimizedData();
  }

  public componentDidUpdate() {
    this.loadOptimizedData();
  }

  public render() {
    const { showChart, showDataTable } = this.props;

    if (!showChart && !showDataTable) {
      return null;
    }

    return (
      <Fragment>
        {this.renderTabs()}
        {this.renderWithoutTabs()}
      </Fragment>
    );
  }

  private loadOptimizedData = () => {
    const { request, dataOptimized, onLoadOptimizedData } = this.props;

    if (request && (!dataOptimized || (!dataOptimized.data && !dataOptimized.error && !dataOptimized.isFetching))) {
      onLoadOptimizedData(request);
    }
  }

  // #region -------------- Tabs -------------------------------------------------------------------

  private renderTabs = () => {
    const { defaultTab, showDataTabs, loader } = this.props;

    if (!showDataTabs) {
      return null;
    }

    return (
      <div id='rbReportTabsContainer'>
        <Tabs
          id='rb-report-tabs'
          defaultTab={defaultTab}
          tabsItems={this.getTabsItems()}
          loader={loader}
        />
      </div>
    );
  }

  private getTabsItems = () => {
    const { dataOptimized, showChart, showDataTable } = this.props;
    const loading = dataOptimized && dataOptimized.isFetching;
    const error = dataOptimized && dataOptimized.error;

    const tabsItems: ITab[] = [];

    if (showChart) {
      tabsItems.push({
        title: translate(t => t.chartTab),
        loading,
        error,
        content: this.renderChartTab(),
        visible: true,
      });
    }

    if (showDataTable) {
      tabsItems.push({
        title: translate(t => t.tableTab),
        loading,
        error,
        content: this.renderTableTab(),
        visible: true,
      });
    }

    return tabsItems;
  }

  // #endregion

  // #region -------------- Without tabs -------------------------------------------------------------------

  private renderWithoutTabs = () => {
    const { showDataTabs } = this.props;

    if (showDataTabs) {
      return null;
    }

    return (
      <Fragment>
        {this.renderChart()}
        {this.renderDataTable()}
      </Fragment>
    );
  }

  // #endregion

  // #region -------------- Chart -------------------------------------------------------------------

  private renderChartTab = () => {
    return (
      <div className='rb-report-tab-content'>
        {this.renderChart()}
      </div>
    );
  }

  private renderChart = () => {
    const { dataOptimized, selectedDimensions, selectedMetrics, showChart } = this.props;
    const data = dataOptimized && dataOptimized.data;

    if (!showChart) {
      return null;
    }

    return (
      <Dashboards
        data={data}
        dimensions={selectedDimensions}
        metrics={selectedMetrics}
      />
    );
  }

  // #endregion

  // #region -------------- Table -------------------------------------------------------------------

  private renderTableTab = () => {
    return (
      <div className='rb-report-tab-content'>
        {this.renderDataTable()}
      </div>
    );
  }

  private renderDataTable = () => {
    const { dataOptimized, showDataTable } = this.props;
    const data = dataOptimized && dataOptimized.data;

    if (!showDataTable) {
      return null;
    }

    return (
      <ReportTable data={data} />
    );
  }

  // #endregion
}

// #endregion

// #region -------------- Connect -------------------------------------------------------------------

const connected = connect<IStateProps, IDispatchProps, IOwnProps, IReportBuilderState>(
  (state) => {
    const { dataOptimized, selectedDimensions, selectedMetrics, request } = state;

    return {
      selectedDimensions,
      selectedMetrics,
      dataOptimized,
      request,
    };
  },
  (dispatch) => {
    return {
      onLoadOptimizedData: (request: IReportRequest) => dispatch(loadDataOptimized(request)),
    };
  },
)(ReportTabs);

export { connected as ReportTabs };

// #endregion
