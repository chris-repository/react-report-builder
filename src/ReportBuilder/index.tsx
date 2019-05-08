import 'isomorphic-fetch';
import React from 'react';
import { Provider } from 'react-redux';
import { IReportBuilderProps, ReportBuilder as ReportBuilderInner } from './components/ReportBuilder';
import { configureStore } from './state/configureStore';

// #region -------------- Store -------------------------------------------------------------------

const store = configureStore();

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class ReportBuilder extends React.PureComponent<IReportBuilderProps> {
  public render() {
    return (
      <Provider store={store}>
        <ReportBuilderInner {...this.props} />
      </Provider>
    );
  }
}

// #endregion
