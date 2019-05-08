import { IReportRequest } from 'peekdata-datagateway-api-sdk';
import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';
import { ContentWithCopy } from 'src/ReportBuilder/components/ContentWithCopy';
import { SplitButtonDropDown } from 'src/ReportBuilder/components/SplitButtonDropDown';
import { Languages } from 'src/ReportBuilder/constants/languages';
import { IReportBuilderState } from 'src/ReportBuilder/state/reducers';
import { generateCUrl } from 'src/ReportBuilder/utils/UrlUtils';

// #region -------------- Constants -------------------------------------------------------------------

const viewRequestModalCssClasses = {
  overlay: 'rb-modal-overlay',
  modal: 'rb-modal',
  closeButton: 'rb-close-button',
};

const viewRequestOptions = {
  viewRequestPayload: 'View request payload',
  viewRequestAsCURL: 'View request as cURL',
};

// #endregion

// #region -------------- Interfaces -------------------------------------------------------------------

interface IStateProps {
  request: IReportRequest;
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
      selected: viewRequestOptions.viewRequestPayload,
    };
  }

  public render() {
    return (
      <div className='rb-view-request-dropdown-container'>
        <SplitButtonDropDown
          id='rb-view-request-dropdown'
          title={viewRequestOptions.viewRequestPayload}
          options={Object.values(viewRequestOptions)}
          onSelect={this.onSelect}
        />

        {this.renderViewRequestModal()}
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

  private renderViewRequestModal() {
    const { isOpen, selected } = this.state;
    const { request } = this.props;

    if (!request) {
      return null;
    }

    let body = null;
    let title = null;
    let language = null;

    switch (selected) {
      case viewRequestOptions.viewRequestPayload:
        body = request;
        title = viewRequestOptions.viewRequestPayload;
        language = Languages.json;
        break;
      case viewRequestOptions.viewRequestAsCURL:
        body = generateCUrl(JSON.stringify(request), '/select/dataoptimized');
        title = viewRequestOptions.viewRequestAsCURL;
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
    const { request } = state;

    return {
      request,
    };
  },
)(ViewRequest);

export { connected as ViewRequest };

// #endregion
