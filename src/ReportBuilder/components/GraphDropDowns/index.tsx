import React, { Fragment } from 'react';
import { DropDownList } from 'src/ReportBuilder/components/DropDownList';
import { ITranslations } from 'src/ReportBuilder/models/translations';
import { IAsyncState } from 'src/ReportBuilder/state/action';
import { ILoadGraphNodesPayloadRequest } from 'src/ReportBuilder/state/actions';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IDefaultProps {
  showScopesDropdown: boolean;
  showGraphsDropdown: boolean;
}

interface IProps extends IDefaultProps {
  scopeNames: IAsyncState<string[]>;
  graphNames: IAsyncState<string[]>;
  selectedScope: string;
  selectedGraph: string;
  t: ITranslations;
  onScopeChanged: (scope: string) => void;
  onGraphChanged: (payload: ILoadGraphNodesPayloadRequest) => void;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class GraphDropDowns extends React.Component<IProps> {

  public static defaultProps: IDefaultProps = {
    showScopesDropdown: true,
    showGraphsDropdown: true,
  };

  public render() {
    return (
      <Fragment>
        {this.renderError()}

        <div>
          <div className='row hidden-xs'>
            {this.renderScopeDesktopTitle()}
            {this.renderGraphDesktopTitle()}
          </div>
          <div className='row'>
            {this.renderScopeDropDown()}
            {this.renderGraphDropDown()}
          </div>
        </div>
      </Fragment >
    );
  }

  // #region -------------- Error -------------------------------------------------------------------

  private renderError = () => {
    const { scopeNames, graphNames } = this.props;

    if ((scopeNames && scopeNames.error) || (graphNames && graphNames.error)) {
      return <div className='alert alert-danger'>{scopeNames.error || graphNames.error}</div>;
    }

    return null;
  }

  // #endregion

  // #region -------------- Scope dropdown -------------------------------------------------------------------

  private renderScopeDesktopTitle = () => {
    const { showScopesDropdown, t } = this.props;

    if (!showScopesDropdown) {
      return null;
    }

    return (
      <div className='col-md-4 col-sm-5'>
        <div className='rb-title-dark rb-title-small'>{t.scopesDropdownTitle}</div>
      </div>
    );
  }

  private renderScopeDropDown = () => {
    const { scopeNames, selectedScope, onScopeChanged, showScopesDropdown, t } = this.props;

    if (!showScopesDropdown) {
      return null;
    }

    const scopeNamesData = scopeNames && scopeNames.data;
    const list = scopeNamesData && new Map(scopeNamesData.map(d => [d, d]));

    return (
      <div className='col-md-4 col-sm-5'>
        <div className='rb-title-dark rb-title-small visible-xs'>{t.scopesDropdownTitle}</div>
        <DropDownList
          list={list}
          defaultLabel={t.scopesPlaceholder}
          selected={selectedScope}
          itemSelectedCallback={onScopeChanged}
        />
      </div>
    );
  }

  // #endregion

  // #region -------------- Graph dropdown -------------------------------------------------------------------

  private renderGraphDesktopTitle = () => {
    const { showGraphsDropdown, t } = this.props;

    if (!showGraphsDropdown) {
      return null;
    }

    return (
      <div className='col-md-4 col-sm-5'>
        <div className='rb-title-dark rb-title-small'>{t.graphsDropdownTitle}</div>
      </div>
    );
  }

  private renderGraphDropDown = () => {
    const { graphNames, selectedGraph, showGraphsDropdown, t } = this.props;

    if (!showGraphsDropdown) {
      return null;
    }

    const graphNamesData = graphNames && graphNames.data;
    const list = graphNamesData && new Map(graphNamesData.map(d => [d, d]));

    return (
      <div className='col-md-4 col-sm-5'>
        <div className='rb-title-dark rb-title-small visible-xs'>{t.graphsDropdownTitle}</div>
        <DropDownList
          list={list}
          defaultLabel={t.graphsPlaceholder}
          selected={selectedGraph}
          itemSelectedCallback={this.onGraphChanged}
        />
      </div>
    );
  }

  private onGraphChanged = (selectedGraph: string) => {
    const { onGraphChanged } = this.props;

    onGraphChanged({ selectedGraph });
  }

  // #endregion
}

// #endregion
