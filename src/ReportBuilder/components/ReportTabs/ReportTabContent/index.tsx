import { INotOptimizedReportResponse, IOptimizedReportResponse, IReportRequest } from 'peekdata-datagateway-api-sdk';
import React from 'react';
import { connect } from 'react-redux';
import { IAsyncState } from 'src/ReportBuilder/state/action';
import { loadDataFull, loadDataOptimized } from 'src/ReportBuilder/state/actions';
import { IReportBuilderState } from 'src/ReportBuilder/state/reducers';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IStateProps {
  request: IReportRequest;
  dataFull: IAsyncState<INotOptimizedReportResponse>;
  dataOptimized: IAsyncState<IOptimizedReportResponse>;
}

interface IDispatchProps {
  onLoadDataFull: (request: IReportRequest) => void;
  onLoadDataOptimized: (request: IReportRequest) => void;
}

interface IOwnProps {
  contentType: TabContentType;
}

interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

export enum TabContentType {
  dataFull = 'dataFull',
  dataOptimized = 'dataOptimized',
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

class ReportTabContent extends React.PureComponent<IProps> {

  public componentDidMount() {
    this.loadData();
  }

  public componentDidUpdate() {
    this.loadData();
  }

  public render() {
    const { children } = this.props;

    return (
      <div className='rb-report-tab-content'>
        {children}
      </div>
    );
  }

  private loadData = () => {
    const { contentType } = this.props;

    if (contentType === TabContentType.dataFull) {
      this.loadDataFull();
    } else {
      this.loadDataOptimized();
    }
  }

  private loadDataFull = () => {
    const { request, dataFull, onLoadDataFull } = this.props;

    if (request && (!dataFull || (!dataFull.data && !dataFull.error))) {
      onLoadDataFull(request);
    }
  }

  private loadDataOptimized = () => {
    const { request, dataOptimized, onLoadDataOptimized } = this.props;

    if (request && (!dataOptimized || (!dataOptimized.data && !dataOptimized.error))) {
      onLoadDataOptimized(request);
    }
  }
}

// #endregion

// #region -------------- Connect -------------------------------------------------------------------

const connected = connect<IStateProps, IDispatchProps, IOwnProps, IReportBuilderState>(
  (state) => {
    const { request, dataFull, dataOptimized } = state;

    return {
      request,
      dataFull,
      dataOptimized,
    };
  },
  (dispatch) => {
    return {
      onLoadDataFull: (request: IReportRequest) => dispatch(loadDataFull(request)),
      onLoadDataOptimized: (request: IReportRequest) => dispatch(loadDataOptimized(request)),
    };
  },
)(ReportTabContent);

export { connected as ReportTabContent };

// #endregion
