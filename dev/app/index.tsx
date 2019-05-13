// @ts-nocheck
import 'bootstrap/dist/css/bootstrap.min.css';
import 'isomorphic-fetch';
import { ApiErrorCode, IReportRequest, IRequestOptions, ReportSortDirectionType } from 'peekdata-datagateway-api-sdk';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDOM from 'react-dom';
import 'react-table/react-table.css';
import { ITranslations, ReportBuilder } from '../../src';

// #region -------------- Constants -------------------------------------------------------------------

const translationsBefore: Partial<ITranslations> = {};

const translationsAfter: Partial<ITranslations> = {
  scopesDropdownTitle: '#',
  scopesPlaceholder: '#',
  graphsDropdownTitle: '#',
  graphsPlaceholder: '#',
  contentTitle: '#',
  dimensionsListTitle: '#',
  dimensionPlaceholder: '#',
  noDimensionsText: '#',
  addDimensionButtonText: '#',
  metricsListTitle: '#',
  metricPlaceholder: '#',
  noMetricsText: '#',
  addMetricButtonText: '#',
  filtersText: '#',
  addFilterButton: '#',
  optionalLabel: '#',
  rowsOffset: '#',
  rowsLimit: '#',
  chartTab: '#',
  tableTab: '#',
  filterTypePlaceholder: '#',
  filterOperationPlaceholder: '#',
  filterFromLabel: '#',
  filterToLabel: '#',
  filterValuesDescription: '#',
  filterValuesExample: '#',
  filterTypeDateRange: '#',
  filterTypeSingleKey: '#',
  filterTypeSingleValue: '#',
  filterSingleKeyPlaceholder: '#',
  filterSingleValueKeysPlaceholder: '#',
  filterSingleValuePlaceholder: '#',
  filterOperationEquals: '#',
  filterOperationNotEquals: '#',
  filterOperationStartsWith: '#',
  filterOperationNotStartsWith: '#',
  filterOperationAllIsLess: '#',
  filterOperationAllIsMore: '#',
  filterOperationAtLeastOneIsLess: '#',
  filterOperationAtLeastOneIsMore: '#',
  viewRequestPayload: '#',
  viewRequestAsCURL: '#',
  viewResponseAsOptimizedDataJson: '#',
  viewResponseAsFullDataJson: '#',
  viewResponseAsSQL: '#',
  viewResponseAsCSV: '#',
  copyToClipboardButton: '#',
  copiedToClipboardMessage: '#',
  chartTypeBar: '#',
  chartTypeLine: '#',
  chartTypePie: '#',
  chartTypeDoughnut: '#',
  chartTypeRadar: '#',
  tablePreviousText: '#',
  tableNextText: '#',
  tableLoadingText: '#',
  tableNoDataText: '#',
  tablePageText: '#',
  tableOfText: '#',
  tableRowsText: '#',
  tablePageJumpText: '#',
  tableRowsSelectorText: '#',
  apiErrors: {
    [ApiErrorCode.BadGraphName]: '#',
  },
};

const apiRequestOptions: IRequestOptions = {
  baseUrl: 'https://demo.peekdata.io:8443/datagateway/rest/v1'
};

const reportRequest: Partial<IReportRequest> = {
  scopeName: 'Mortgage-Lending',
  graphName: 'Servicing-PostgreSQL',
  dimensions: [
    'cityname',
    'currency',
    'countryname',
  ],
  metrics: [
    'loanamount',
    'propertyprice',
  ],
  filters: {
    dateRanges: [{
      from: '2015-01-01',
      to: '2017-12-31',
      key: 'closingdate',
    }],
  },
  sortings: {
    dimensions: [
      {
        key: 'cityname',
        direction: ReportSortDirectionType.ASC,
      },
    ],
  },
};

// #endregion

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps { }

interface IState {
  translations: Partial<ITranslations>;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

class App extends React.PureComponent<IProps, IState> {

  constructor(props) {
    super(props);

    this.state = {
      translations: translationsBefore,
    };
  }

  public render() {
    return (
      <div>
        <input type='button' value='Change translations' onClick={this.onChangeTranslations} />
        <ReportBuilder
          apiRequestOptions={apiRequestOptions}
          translations={this.state.translations}
          defaultRowsOffset={10}
          defaultRowsLimit={190}
          maxRowsLimit={200}
          reportRequest={reportRequest} />
      </div>
    );
  }

  private onChangeTranslations = () => {
    this.setState({ translations: translationsAfter });
  }
}

// #endregion

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
