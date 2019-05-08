import { INotOptimizedReportResponse, IOptimizedReportResponse } from 'peekdata-datagateway-api-sdk';
import React, { Fragment, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'src/ReportBuilder/components/Spinner';
import { IAsyncState } from 'src/ReportBuilder/state/action';
import { IReportBuilderState } from 'src/ReportBuilder/state/reducers';
import { ViewRequest } from './ViewRequest';
import { ViewResponse } from './ViewResponse';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IStateProps {
  dataFull: IAsyncState<INotOptimizedReportResponse>;
  dataOptimized: IAsyncState<IOptimizedReportResponse>;
  file: IAsyncState<string>;
  select: IAsyncState<string>;
}

interface IDispatchProps { }

interface IDefaultProps {
  showRequestViewButton: boolean;
  showResponseViewButton: boolean;
  loader: ReactNode;
}

interface IOwnProps extends Partial<IDefaultProps> { }

interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

// #endregion

// #region -------------- Component -------------------------------------------------------------------

class ViewDropDowns extends React.PureComponent<IProps> {

  public static defaultProps: IDefaultProps = {
    showRequestViewButton: true,
    showResponseViewButton: true,
    loader: <Spinner />,
  };

  public render() {
    return (
      <Fragment>
        {this.renderError()}

        <div className='rb-view-dropdowns-container'>
          {this.renderLoader()}
          {this.renderViewRequest()}
          {this.renderViewResponse()}
        </div>
      </Fragment>
    );
  }

  // #region -------------- Error -------------------------------------------------------------------

  private renderError() {
    const { dataFull, dataOptimized, file, select } = this.props;

    if ((dataFull && dataFull.error) || (dataOptimized && dataOptimized.error) ||
      (file && file.error) || (select && select.error)) {
      return (
        <div className='alert alert-danger'>
          {dataFull.error || dataOptimized.error || file.error || select.error}
        </div>
      );
    }

    return null;
  }

  // #endregion

  // #region -------------- Loader -------------------------------------------------------------------

  private renderLoader() {
    const { loader } = this.props;

    if (!this.isLoading()) {
      return null;
    }

    return loader;
  }

  private isLoading = () => {
    const { dataFull, dataOptimized, file, select } = this.props;

    return (dataFull && dataFull.isFetching) || (dataOptimized && dataOptimized.isFetching) ||
      (file && file.isFetching) || (select && select.isFetching);
  }

  // #endregion

  // #region -------------- View request -------------------------------------------------------------------

  private renderViewRequest = () => {
    const { showRequestViewButton } = this.props;

    if (!showRequestViewButton) {
      return null;
    }

    return (
      <ViewRequest />
    );
  }

  // #endregion

  // #region -------------- View response -------------------------------------------------------------------

  private renderViewResponse = () => {
    const { showResponseViewButton } = this.props;

    if (!showResponseViewButton) {
      return null;
    }

    return (
      <ViewResponse />
    );
  }

  // #endregion
}

// #endregion

// #region -------------- Connect -------------------------------------------------------------------

const connected = connect<IStateProps, IDispatchProps, IOwnProps, IReportBuilderState>(
  (state) => {
    const { dataFull, dataOptimized, file, select } = state;

    return {
      dataFull,
      dataOptimized,
      file,
      select,
    };
  },
)(ViewDropDowns);

export { connected as ViewDropDowns };

// #endregion
