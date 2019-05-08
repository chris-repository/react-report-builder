## React-Report-Builder

[![Build Status](https://travis-ci.org/peekdata/react-report-builder.svg?branch=master)](https://travis-ci.org/peekdata/react-report-builder)

Report builder is powerful reporting module consisting of easy to customize JavaScript components.

Key features:

- Introduce comprehensive reporting capabilities into your application in no time
- Your end users can build any report they want
- Create ready to use templates for the most common searches
- Define any filtering and sorting criteria
- Easy way to explore data and learn from it

See [reportbuilder.peekdata.io](http://reportbuilder.peekdata.io/) for live demos.



## Installation and usage

The easiest way to use react-report-builder is to install it from npm and build it into your app with Webpack.

`npm install --save react-report-builder`

or

`yarn add react-report-builder`

You will also need to require the CSS file from this package (or provide your own). The example below shows how to use it in your app and include the CSS from this package if your build system supports requiring CSS files:

```react
import React from 'react';
import { ReportBuilder } from 'react-report-builder';

import 'react-report-builder/lib/react-report-builder.min.css';

const apiRequestOptions = {
  baseUrl: 'https://demo.peekdata.io:8443/datagateway/rest/v1',
  timeout: 60000,
};

export class App extends React.Component {
    render() {
        return (
        	<ReportBuilder
            	apiRequestOptions={apiRequestOptions}
            />
        );
    }
}
```



## Props

Props description:

|             Name             | Type        | Default value | Description                                                  |
| :--------------------------: | :---------- | :------------ | ------------------------------------------------------------ |
| apiRequestOptions (required) |             |               |                                                              |
|         translations         |             |               |                                                              |
|        reportRequest         |             |               |                                                              |
|       showContentTitle       | boolean     | true          | Whether report builder title `Report content` is shown       |
|            loader            | elementType | <Spinner />   | If you need, it can be used your custom loader component.    |
|      showScopesDropdown      | boolean     | true          | Whether the scopes dropdown is shown                         |
|      showGraphsDropdown      | boolean     | true          | Whether the graphs dropdown is shown                         |
|      showDimensionsList      | boolean     | true          | Whether the dimensions list is shown                         |
|         showFilters          | boolean     | true          | Whether the filters component is shown                       |
|        showRowsOffset        | boolean     | true          | Whether the `Start with row` component is shown              |
|        showRowsLimit         | boolean     | true          | Whether the `Limit number of rows to` component is shown     |
|         maxRowsLimit         | number      | 1000          | Sets max value of limit row                                  |
|    showRequestViewButton     | boolean     | true          | Whether the dropdown (options: `View request payload`, `View request as cURL`) is shown |
|    showResponseViewButton    | boolean     | true          | Whether the dropdown (options: `View response as optimized JSON`, `View response as full JSON`, `View reponse as SQL`, `View response as CSV`) is shown |
|         showDataTabs         | boolean     | true          | Whether the tabs section is shown                            |
|          showChart           | boolean     | true          | Whether the tab of charts is shown                           |
|        showDataTable         | boolean     | true          | Whether the tab of data table is shown                       |
|          defaultTab          | number      | 0             | Index of first tab                                           |

