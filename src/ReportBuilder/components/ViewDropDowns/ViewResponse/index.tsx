import { INotOptimizedReportResponse, IOptimizedReportResponse, IReportRequest } from 'peekdata-datagateway-api-sdk';
import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';
import { ContentWithCopy } from 'src/ReportBuilder/components/ContentWithCopy';
import { SplitButtonDropDown } from 'src/ReportBuilder/components/SplitButtonDropDown';
import { Languages } from 'src/ReportBuilder/constants/languages';
import { ITranslations } from 'src/ReportBuilder/models/translations';
import { IAsyncState } from 'src/ReportBuilder/state/action';
import { loadCsvFile, loadDataFull, loadDataOptimized, loadSelect } from 'src/ReportBuilder/state/actions';
import { IReportBuilderState } from 'src/ReportBuilder/state/reducers';

// #region -------------- Constants -------------------------------------------------------------------

const viewResponseModalCssClasses = {
  overlay: 'rb-modal-overlay',
  modal: 'rb-modal',
  closeButton: 'rb-close-button',
};

enum ViewResponseOption {
  optimizedJson = 'optimizedJson',
  fullJson = 'fullJson',
  sql = 'sql',
  csv = 'csv',
}

// #endregion

// #region -------------- Interfaces -------------------------------------------------------------------

interface IStateProps {
  dataFull: IAsyncState<INotOptimizedReportResponse>;
  dataOptimized: IAsyncState<IOptimizedReportResponse>;
  file: IAsyncState<string>;
  select: IAsyncState<string>;
  request: IReportRequest;
  t: ITranslations;
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
      selected: ViewResponseOption.optimizedJson,
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
        case ViewResponseOption.fullJson:
          if (!dataFull || (!dataFull.data && !dataFull.error)) {
            onLoadDataFull(request);
          }
          break;
        case ViewResponseOption.optimizedJson:
          if (!dataOptimized || (!dataOptimized.data && !dataOptimized.error)) {
            onLoadDataOptimized(request);
          }
          break;
        case ViewResponseOption.csv:
          if (!file || (!file.data && !file.error)) {
            onLoadCsvFile(request);
          }
          break;
        case ViewResponseOption.sql:
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
          value={ViewResponseOption.optimizedJson}
          options={this.getOptions()}
          onSelect={this.onSelect}
        />

        {this.renderViewResponseModal()}
      </div>
    );
  }

  private getOptions = () => {
    const { t } = this.props;

    return new Map<string, string>([
      [ViewResponseOption.optimizedJson, t.viewResponseAsOptimizedDataJson],
      [ViewResponseOption.fullJson, t.viewResponseAsFullDataJson],
      [ViewResponseOption.sql, t.viewResponseAsSQL],
      [ViewResponseOption.csv, t.viewResponseAsCSV],
    ]);
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
    const { dataFull, dataOptimized, file, select, t } = this.props;
    const options = this.getOptions();

    let body = null;
    let title = null;
    let language = null;

    switch (selected) {
      case ViewResponseOption.fullJson:
        body = dataFull && dataFull.data;
        title = options.get(ViewResponseOption.fullJson);
        language = Languages.json;
        break;
      case ViewResponseOption.optimizedJson:
        body = dataOptimized && dataOptimized.data;
        title = options.get(ViewResponseOption.optimizedJson);
        language = Languages.json;
        break;
      case ViewResponseOption.csv:
        body = file && file.data;
        title = options.get(ViewResponseOption.csv);
        break;
      case ViewResponseOption.sql:
        body = select && select.data;
        title = options.get(ViewResponseOption.sql);
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
        <ContentWithCopy body={body} language={language} t={t} />
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
    const { dataFull, dataOptimized, file, select, request, translations } = state;

    return {
      dataFull,
      dataOptimized,
      file,
      select,
      request,
      t: translations,
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
