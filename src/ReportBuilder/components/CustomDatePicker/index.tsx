import moment from 'moment';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { dateTime } from 'src/ReportBuilder/constants/dateTime';
import 'src/style/components/customDatePicker.scss';
import { DatePickerIcon } from './DatePickerIcon';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  name: string;
  startDate: string;
  minDate?: string;
  maxDate?: string;
  onDateInputChangedCallback(e: React.ChangeEvent);
  onDateSelectedCallback(name: string, value: string);
}

interface IState {
  previousDate: string;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class CustomDatePicker extends React.Component<IProps, IState> {

  public constructor(props) {
    super(props);

    const { startDate } = this.props;

    this.state = {
      previousDate: startDate,
    };
  }

  public render() {
    const { name, startDate, minDate, maxDate } = this.props;
    const selectedDate = moment(startDate, dateTime.dateFormat);
    const minSelectedDate = moment(minDate, dateTime.dateFormat);
    const maxSelectedDate = moment(maxDate, dateTime.dateFormat);

    return (
      <div className='rb-datepicker'>
        <input className='rb-input'
          name={name}
          type='text'
          value={startDate}
          placeholder={dateTime.dateFormat}
          maxLength={10}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />

        <DatePicker
          customInput={<DatePickerIcon />}
          selected={selectedDate.isValid() ? selectedDate : null}
          minDate={minSelectedDate.isValid() ? minSelectedDate : null}
          maxDate={maxSelectedDate.isValid() ? maxSelectedDate : null}
          onChange={this.handleSelect}
        />
      </div>
    );
  }

  private handleChange = (e: React.ChangeEvent) => {
    this.props.onDateInputChangedCallback(e);
  }

  private handleBlur = (e) => {
    const startDate = this.props.startDate;
    const minDate = this.props.minDate;
    const maxDate = this.props.maxDate;

    if (moment(startDate, dateTime.dateFormat).isValid() && /(\d{4})-(\d{2})-(\d{2})/.test(startDate) &&
      ((minDate && moment(minDate, dateTime.dateFormat) <= moment(startDate, dateTime.dateFormat)) ||
        (maxDate && moment(maxDate, dateTime.dateFormat) >= moment(startDate, dateTime.dateFormat)))
    ) {
      this.props.onDateInputChangedCallback(e);

      this.setState({
        previousDate: startDate,
      });
    } else {
      this.props.onDateSelectedCallback(this.props.name, this.state.previousDate);
    }
  }

  private handleSelect = (date) => {
    this.setState({
      previousDate: date.format(dateTime.dateFormat),
    });

    this.props.onDateSelectedCallback(this.props.name, date.format(dateTime.dateFormat));
  }
}

// #endregion
