import React from 'react';
import { Provider } from 'react-redux';
import 'src/style/containers/reportBuilder.scss';
import 'src/style/index.scss';
import { IReportBuilderProps, ReportBuilder as ReportBuilderInner } from './components/ReportBuilder';
import { configureStore } from './state/configureStore';

// #region -------------- Store -------------------------------------------------------------------

const store = configureStore();

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class ReportBuilder extends React.PureComponent<IReportBuilderProps> {
  public render() {
    return (
      <Provider store={store as any}>
        <ReportBuilderInner {...this.props} />
      </Provider>
    );
  }
}

// #endregion
