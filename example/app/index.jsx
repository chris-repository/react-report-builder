// @ts-nocheck
import 'bootstrap/dist/css/bootstrap.min.css';
import 'isomorphic-fetch';
import { PeekdataApi } from 'peekdata-datagateway-api-sdk';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDOM from 'react-dom';
import { ReportBuilder } from 'react-report-builder';
import 'react-report-builder/lib/main.css';
import 'react-table/react-table.css';

const peekdataApi = new PeekdataApi({
  baseUrl: 'https://demo.peekdata.io:8443/datagateway/rest/v1'
});

ReactDOM.render(
  <ReportBuilder peekdataApi={peekdataApi} />,
  document.getElementById('root')
);
