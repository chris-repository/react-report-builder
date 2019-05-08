import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Languages } from 'src/ReportBuilder/constants/languages';
import 'src/style/components/contentWithCopy.scss';
import { chalk } from 'src/style/highlighterThemes/chalk';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  body: string;
  language?: Languages;
}

interface IState {
  justCopiedToClipboard: boolean;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class ContentWithCopy extends React.PureComponent<IProps, IState> {

  private successMessageTimeout;

  constructor(props: IProps) {
    super(props);

    this.state = {
      justCopiedToClipboard: false,
    };
  }

  public componentWillUnmount() {
    clearTimeout(this.successMessageTimeout);
  }

  public render() {
    const { body } = this.props;

    if (!body) {
      return null;
    }

    return (
      <div className='rb-content-with-copy-container'>
        <div className='rb-content-with-copy'>
          {this.renderContentToCopy()}
        </div>
        <div className='rb-btn-container'>

          {this.renderCopyButton()}

        </div>
      </div>
    );
  }

  private renderContentToCopy = () => {
    const { body, language } = this.props;

    if (!body) {
      return null;
    }

    return (
      <SyntaxHighlighter language={language} style={chalk}>
        {body}
      </SyntaxHighlighter>
    );
  }

  private renderCopyButton = () => {
    const { justCopiedToClipboard } = this.state;
    const { body } = this.props;

    if (!body) {
      return null;
    }

    if (justCopiedToClipboard) {
      return <div className='alert alert-success'>Copied to clipboard</div>;
    }

    return (
      <CopyToClipboard text={body}>
        <a className='btn rb-btn-small rb-btn-crimson' onClick={this.onCopyClick}>Copy to clipboard</a>
      </CopyToClipboard>
    );
  }

  private onCopyClick = () => {
    this.setState({
      ...this.state,
      justCopiedToClipboard: true,
    });

    clearTimeout(this.successMessageTimeout);

    this.successMessageTimeout = setTimeout(() => {
      this.setState({
        ...this.state,
        justCopiedToClipboard: false,
      });
    }, 3000);
  }
}

// #endregion
