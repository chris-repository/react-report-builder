import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  onClick?(e: React.MouseEvent);
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class DatePickerIcon extends React.PureComponent<IProps> {
  public render() {
    return (
      <div className='rb-datepicker-icon' onClick={this.props.onClick} >
        <i><FontAwesomeIcon icon={faCalendarAlt} /></i>
      </div>
    );
  }
}

// #endregion
