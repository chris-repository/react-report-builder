import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent } from 'react';
import 'src/style/components/inputNumber.scss';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  value: number;
  minValue?: number;
  maxValue?: number;
  onChange: (value: number) => void;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class InputNumber extends React.PureComponent<IProps> {
  public render() {
    const { value, minValue, maxValue } = this.props;

    return (
      <div className='rb-number-input'>
        <div className='rb-btn-crimson rb-btn-number rb-btn-decrease' onClick={this.decreaseValue}>
          <i><FontAwesomeIcon icon={faMinusCircle} /></i>
        </div>

        <input
          className='rb-input'
          type='number'
          value={value}
          min={minValue}
          max={maxValue}
          onChange={this.onChange}
        />

        <div className='rb-btn-crimson rb-btn-number rb-btn-increase' onClick={this.increaseValue}>
          <i><FontAwesomeIcon icon={faPlusCircle} /></i>
        </div>
      </div>
    );
  }

  private onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    this.setValue(value);
  }

  private setValue(value) {
    const { minValue, maxValue, onChange } = this.props;
    const valueToNumber = Number(value);

    let validatedValue;
    if (valueToNumber < minValue) {
      validatedValue = minValue;
    } else if (valueToNumber > maxValue) {
      validatedValue = maxValue;
    } else {
      validatedValue = valueToNumber;
    }

    onChange(validatedValue);
  }

  private decreaseValue = () => {
    const { minValue, onChange } = this.props;

    const value = Number(this.props.value) - 1;
    if (value < minValue) {
      return;
    }

    onChange(value);
  }

  private increaseValue = () => {
    const { maxValue, onChange } = this.props;

    const value = Number(this.props.value) + 1;
    if (value > maxValue) {
      return;
    }

    onChange(value);
  }
}

// #endregion
