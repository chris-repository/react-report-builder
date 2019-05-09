import { IOptimizedReportResponse } from 'peekdata-datagateway-api-sdk';
import React from 'react';
import ReactTable, { Column } from 'react-table';
import 'react-table/react-table.css';
import 'src/style/components/table.scss';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  data: IOptimizedReportResponse;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class ReportTable extends React.Component<IProps> {
  public render() {
    const { data } = this.props;

    if (!data) {
      return null;
    }

    const columnHeaders = data && data.columnHeaders;
    const rows = data && data.rows;
    const tableData = [];

    if (rows && rows.length > 0) {
      for (const row of rows) {
        const dataRow = {};

        for (let i = 0; i < row.length; i += 1) {
          dataRow[columnHeaders[i].name] = row[i];
        }

        tableData.push(dataRow);
      }
    }

    const columns: Column[] = columnHeaders.map(header => ({
      Header: header.title,
      accessor: header.name,
    }));

    return (
      <div className='rb-table'>
        <ReactTable
          className='-striped'
          data={tableData}
          columns={columns}
        />
      </div>
    );
  }
}

// #endregion
