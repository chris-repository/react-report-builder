## React-Report-Builder

[![Build Status](https://travis-ci.org/peekdata/react-report-builder.svg?branch=master)](https://travis-ci.org/peekdata/react-report-builder)

Report builder is powerful reporting module consisting of easy to customize JavaScript components.

Key features:

- Introduce comprehensive reporting capabilities into your application in no time
- Your end users can build any report they want
- Create ready to use templates for the most common searches
- Define any filtering and sorting criteria
- Easy way to explore data and learn from it

See [reportbuilder.peekdata.io](http://reportbuilder.peekdata.io/) for live demo.



## Installation and usage

The easiest way to use react-report-builder is to install it from npm and build it into your app with Webpack.

`npm install --save react-report-builder`

or

`yarn add react-report-builder`

You will also need to require the CSS file from this package and its dependencies (or provide your own). The example below shows how to use it in your app and include CSS files if your build system supports requiring CSS files:

```javascript
import React from 'react';
import { ReportBuilder } from 'react-report-builder';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-table/react-table.css';
import 'react-report-builder/lib/main.css';

const apiRequestOptions = {
  baseUrl: 'https://demo.peekdata.io:8443/datagateway/rest/v1',
  timeout: 60000,
};

export class App extends React.Component {
  render() {
    return (
      <ReportBuilder apiRequestOptions={apiRequestOptions} />
    );
  }
}
```



## Props

Props description:

|             Name             | Type        | Default value | Description                                                  |
| :--------------------------: | :---------- | :------------ | ------------------------------------------------------------ |
| apiRequestOptions (required) | object      |               | API request options. To understand how to create or modify these options read [here](https://github.com/peekdata/datagateway-api-js-sdk#compact-initialization). |
|         translations         | object      |               | Translations object. All available translations can be seen [here](https://github.com/peekdata/react-report-builder/blob/master/src/ReportBuilder/translations.ts). |
|        reportRequest         | object      |               | This object can be used to prefill report builder form fields. All properties are optional. To understand how to create or modify this object read [here](https://github.com/peekdata/datagateway-api-js-sdk#report-request-options). |
|       showContentTitle       | boolean     | true          | Whether report builder title `Report content` is shown       |
|            loader            | elementType |               | Loader can be changed by passing custom loader component.    |
|      showScopesDropdown      | boolean     | true          | Whether the scopes dropdown is shown                         |
|      showGraphsDropdown      | boolean     | true          | Whether the graphs dropdown is shown                         |
|      showDimensionsList      | boolean     | true          | Whether the dimensions list is shown                         |
|       showMetricsList        | boolean     | true          | Whether the metrics list is shown                            |
|         showFilters          | boolean     | true          | Whether the filters component is shown                       |
|        showRowsOffset        | boolean     | true          | Whether the rows offset input is shown                       |
|        showRowsLimit         | boolean     | true          | Whether the rows limit input is shown                        |
|      defaultRowsOffset       | number      | 0             | Sets default rows offset                                     |
|       defaultRowsLimit       | number      | 100           | Sets default rows limit                                      |
|         maxRowsLimit         | number      | 1000          | Sets max value of rows limit input                           |
|    showRequestViewButton     | boolean     | true          | Whether the request view button is shown                     |
|    showResponseViewButton    | boolean     | true          | Whether the response view button is shown                    |
|         showDataTabs         | boolean     | true          | Whether the tabs section is shown                            |
|          showChart           | boolean     | true          | Whether the chart is shown                                   |
|        showDataTable         | boolean     | true          | Whether the data table is shown                              |
|          defaultTab          | number      | 0             | Sets index of active tab                                     |



### Translations

As mentioned above all available translations can be seen [here](https://github.com/peekdata/react-report-builder/blob/master/src/ReportBuilder/translations.ts). Moreover, there can be added one more translation object: `apiErrors`. This translation object is used to translate error returned from API by its code (see error codes [here](https://github.com/peekdata/datagateway-api-js-sdk/blob/master/src/models/error.ts)). Translation object example:

```javascript
const translations = {
    contentTitle: 'Report content',
    graphsDropdownTitle: 'Data Source',
  	dimensionsListTitle: 'Dimensions',
    apiErrors: {
        57010: 'Dimension/metric combination is not valid',
    },
};
```

