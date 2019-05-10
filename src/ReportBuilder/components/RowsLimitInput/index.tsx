import React from 'react';
import { InputNumber } from 'src/ReportBuilder/components/inputs/InputNumber';
import { translate } from 'src/ReportBuilder/translations';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  startWithRow: number;
  limitRowsTo: number;
  showRowsOffset: boolean;
  showRowsLimit: boolean;
  maxRowsLimit: number;
  onStartWithRowChanged(value: number);
  onLimitRowsToChanged(value: number);
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class RowsLimitInput extends React.PureComponent<IProps> {

  public render() {
    return (
      <div className='rb-limit-rows-to-container'>
        {this.renderOffsetField()}
        {this.renderRowsLimitField()}
      </div>
    );
  }

  private renderOffsetField = () => {
    const { startWithRow, onStartWithRowChanged, showRowsOffset } = this.props;

    if (!showRowsOffset) {
      return null;
    }

    return (
      <div className='rb-limit-rows-input-container'>
        <div className='rb-title-dark rb-title-extra-small'>{translate(t => t.rowsOffset)}</div>

        <InputNumber
          value={startWithRow}
          minValue={0}
          onChange={onStartWithRowChanged}
        />
      </div>
    );
  }

  private renderRowsLimitField = () => {
    const { limitRowsTo, onLimitRowsToChanged, showRowsLimit, maxRowsLimit } = this.props;

    if (!showRowsLimit) {
      return null;
    }

    return (
      <div className='rb-limit-rows-input-container'>
        <div className='rb-title-dark rb-title-extra-small'>{translate(t => t.rowsLimit)}</div>

        <InputNumber
          value={limitRowsTo}
          minValue={0}
          maxValue={maxRowsLimit}
          onChange={onLimitRowsToChanged}
        />
      </div>
    );
  }
}

// #endregion
