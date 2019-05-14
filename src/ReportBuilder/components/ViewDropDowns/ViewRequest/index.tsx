import { IReportRequest } from 'peekdata-datagateway-api-sdk';
import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';
import { ContentWithCopy } from 'src/ReportBuilder/components/ContentWithCopy';
import { SplitButtonDropDown } from 'src/ReportBuilder/components/SplitButtonDropDown';
import { Languages } from 'src/ReportBuilder/constants/languages';
import { ITranslations } from 'src/ReportBuilder/models/translations';
import { IReportBuilderState } from 'src/ReportBuilder/state/reducers';
import { generateCUrl } from 'src/ReportBuilder/utils/UrlUtils';

// #region -------------- Constants -------------------------------------------------------------------

const viewRequestModalCssClasses = {
  overlay: 'rb-modal-overlay',
  modal: 'rb-modal',
  closeButton: 'rb-close-button',
};

enum ViewRequestOptions {
  payload = 'payload',
  curl = 'curl',
}

// #endregion

// #region -------------- Interfaces -------------------------------------------------------------------

interface IStateProps {
  request: IReportRequest;
  t: ITranslations;
}

interface IDispatchProps { }

interface IOwnProps { }

interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

interface IState {
  isOpen: boolean;
  selected: string;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

class ViewRequest extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      isOpen: false,
      selected: ViewRequestOptions.payload,
    };
  }

  public render() {
    return (
      <div className='rb-view-request-dropdown-container'>
        <SplitButtonDropDown
          id='rb-view-request-dropdown'
          value={ViewRequestOptions.payload}
          options={this.getOptions()}
          onSelect={this.onSelect}
        />

        {this.renderViewRequestModal()}
      </div>
    );
  }

  private getOptions = () => {
    const { t } = this.props;

    return new Map<string, string>([
      [ViewRequestOptions.payload, t.viewRequestPayload],
      [ViewRequestOptions.curl, t.viewRequestAsCURL],
    ]);
  }

  private onSelect = (newSelected: string) => {
    this.setState({
      selected: newSelected,
    });

    this.onOpenModal();
  }

  // #region -------------- Modal -------------------------------------------------------------------

  private renderViewRequestModal() {
    const { isOpen, selected } = this.state;
    const { request, t } = this.props;
    const options = this.getOptions();

    if (!request) {
      return null;
    }

    let body = null;
    let title = null;
    let language = null;

    switch (selected) {
      case ViewRequestOptions.payload:
        body = request;
        title = options.get(ViewRequestOptions.payload);
        language = Languages.json;
        break;
      case ViewRequestOptions.curl:
        body = generateCUrl(JSON.stringify(request), '/select/dataoptimized');
        title = options.get(ViewRequestOptions.curl);
        language = Languages.powershell;
        break;
      default:
    }

    if (typeof body !== 'string') {
      body = JSON.stringify(body, null, 2);
    }

    return (
      <Modal
        classNames={viewRequestModalCssClasses}
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
    const { request, translations } = state;

    return {
      request,
      t: translations,
    };
  },
)(ViewRequest);

export { connected as ViewRequest };

// #endregion
