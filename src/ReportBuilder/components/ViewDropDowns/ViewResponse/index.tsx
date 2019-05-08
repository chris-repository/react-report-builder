import { INotOptimizedReportResponse, IOptimizedReportResponse, IReportRequest } from 'peekdata-datagateway-api-sdk';
import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';
import { ContentWithCopy } from 'src/ReportBuilder/components/ContentWithCopy';
import { SplitButtonDropDown } from 'src/ReportBuilder/components/SplitButtonDropDown';
import { Languages } from 'src/ReportBuilder/constants/languages';
import { IAsyncState } from 'src/ReportBuilder/state/action';
import { loadCsvFile, loadDataFull, loadDataOptimized, loadSelect } from 'src/ReportBuilder/state/actions';
import { IReportBuilderState } from 'src/ReportBuilder/state/reducers';

// #region -------------- Constants -------------------------------------------------------------------

const viewResponseModalCssClasses = {
  overlay: 'rb-modal-overlay',
  modal: 'rb-modal',
  closeButton: 'rb-close-button',
};

const viewResponseOptions = {
  viewResponseAsOptimizedDataJson: 'View response as optimized JSON',
  viewResponseAsFullDataJson: 'View response as full JSON',
  viewResponseAsSQL: 'View response as SQL',
  viewResponseAsCSV: 'View response as CSV',
};

// #endregion

// #region -------------- Interfaces -------------------------------------------------------------------

interface IStateProps {
  dataFull: IAsyncState<INotOptimizedReportResponse>;
  dataOptimized: IAsyncState<IOptimizedReportResponse>;
  file: IAsyncState<string>;
  select: IAsyncState<string>;
  request: IReportRequest;
}

interface IDispatchProps {
  onLoadDataFull: (request: IReportRequest) => void;
  onLoadDataOptimized: (request: IReportRequest) => void;
  onLoadCsvFile: (request: IReportRequest) => void;
  onLoadSelect: (request: IReportRequest) => void;
}

interface IOwnProps { }

interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

interface IState {
  isOpen: boolean;
  selected: string;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

class ViewResponse extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      isOpen: false,
      selected: viewResponseOptions.viewResponseAsOptimizedDataJson,
    };
  }

  public componentDidMount() {
    const { dataOptimized, request, onLoadDataOptimized } = this.props;

    if (request && (!dataOptimized || (!dataOptimized.data && !dataOptimized.error))) {
      onLoadDataOptimized(request);
    }
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    const { selected } = this.state;
    const { selected: prevSelected } = prevState;
    const { dataFull, dataOptimized, file, select, request, onLoadDataOptimized, onLoadDataFull, onLoadCsvFile, onLoadSelect } = this.props;
    const { request: prevRequest } = prevProps;

    if (selected !== prevSelected || (request && prevRequest && request !== prevRequest)) {
      switch (selected) {
        case viewResponseOptions.viewResponseAsFullDataJson:
          if (!dataFull || (!dataFull.data && !dataFull.error)) {
            onLoadDataFull(request);
          }
          break;
        case viewResponseOptions.viewResponseAsOptimizedDataJson:
          if (!dataOptimized || (!dataOptimized.data && !dataOptimized.error)) {
            onLoadDataOptimized(request);
          }
          break;
        case viewResponseOptions.viewResponseAsCSV:
          if (!file || (!file.data && !file.error)) {
            onLoadCsvFile(request);
          }
          break;
        case viewResponseOptions.viewResponseAsSQL:
          if (!select || (!select.data && !select.error)) {
            onLoadSelect(request);
          }
          break;
        default:
      }
    }
  }

  public render() {
    return (
      <div className='rb-view-response-dropdown-container'>
        <SplitButtonDropDown
          id='rb-view-response-dropdown'
          title={viewResponseOptions.viewResponseAsOptimizedDataJson}
          options={Object.values(viewResponseOptions)}
          onSelect={this.onSelect}
        />

        {this.renderViewResponseModal()}
      </div>
    );
  }

  private onSelect = (newSelected: string) => {
    this.setState({
      selected: newSelected,
    });

    this.onOpenModal();
  }

  // #region -------------- Modal -------------------------------------------------------------------

  private renderViewResponseModal() {
    const { isOpen, selected } = this.state;
    const { dataFull, dataOptimized, file, select } = this.props;

    let body = null;
    let title = null;
    let language = null;

    switch (selected) {
      case viewResponseOptions.viewResponseAsFullDataJson:
        body = dataFull && dataFull.data;
        title = viewResponseOptions.viewResponseAsFullDataJson;
        language = Languages.json;
        break;
      case viewResponseOptions.viewResponseAsOptimizedDataJson:
        body = dataOptimized && dataOptimized.data;
        title = viewResponseOptions.viewResponseAsOptimizedDataJson;
        language = Languages.json;
        break;
      case viewResponseOptions.viewResponseAsCSV:
        body = file && file.data;
        title = viewResponseOptions.viewResponseAsCSV;
        break;
      case viewResponseOptions.viewResponseAsSQL:
        body = select && select.data;
        title = viewResponseOptions.viewResponseAsSQL;
        language = Languages.sql;
        break;
      default:
    }

    if (typeof body !== 'string') {
      body = JSON.stringify(body, null, 2);
    }

    return (
      <Modal
        classNames={viewResponseModalCssClasses}
        open={isOpen}
        onClose={this.onCloseModal}
        closeIconSize={25}
        animationDuration={300}
      >
        <div className='rb-title-dark rb-title-medium'>{title}</div>
        <ContentWithCopy body={body} language={language} />
      </Modal>
    );
  }

  private onOpenModal = () => {
    this.setState({
      isOpen: true,
    });
  }

  private onCloseModal = () => {
    this.setState({
      isOpen: false,
    });
  }

  // #endregion
}

// #endregion

// #region -------------- Connect -------------------------------------------------------------------

const connected = connect<IStateProps, IDispatchProps, IOwnProps, IReportBuilderState>(
  (state) => {
    const { dataFull, dataOptimized, file, select, request } = state;

    return {
      dataFull,
      dataOptimized,
      file,
      select,
      request,
    };
  },
  (dispatch) => {
    return {
      onLoadDataFull: (request: IReportRequest) => dispatch(loadDataFull(request)),
      onLoadDataOptimized: (request: IReportRequest) => dispatch(loadDataOptimized(request)),
      onLoadCsvFile: (request: IReportRequest) => dispatch(loadCsvFile(request)),
      onLoadSelect: (request: IReportRequest) => dispatch(loadSelect(request)),
    };
  },
)(ViewResponse);

export { connected as ViewResponse };

// #endregion
