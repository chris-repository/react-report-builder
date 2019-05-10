// @ts-nocheck
import 'bootstrap/dist/css/bootstrap.min.css';
import 'isomorphic-fetch';
import { ReportSortDirectionType } from 'peekdata-datagateway-api-sdk';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDOM from 'react-dom';
import { ReportBuilder } from 'react-report-builder';
import 'react-report-builder/lib/main.css';
import 'react-table/react-table.css';

ReactDOM.render(
  <ReportBuilder
    apiRequestOptions={{
      baseUrl: 'https://demo.peekdata.io:8443/datagateway/rest/v1'
    }}
    defaultRowsOffset={10}
    defaultRowsLimit={190}
    maxRowsLimit={200}
    reportRequest={{
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
    }} />,
  document.getElementById('root')
);
