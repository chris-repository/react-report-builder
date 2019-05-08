// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom';
import { ReportBuilder } from 'react-report-builder';
import 'react-report-builder/lib/react-report-builder.min.css';

const apiRequestOptions = {
  baseUrl: 'https://demo.peekdata.io:8443/datagateway/rest/v1'
};

ReactDOM.render(
  <ReportBuilder apiRequestOptions={apiRequestOptions} />,
  document.getElementById('root')
);
