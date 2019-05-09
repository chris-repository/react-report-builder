import classnames from 'classnames';
import React from 'react';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  buttons: IButtonGroupButton[];
  selected?: string;
  onClick: (value: string) => void;
}

export interface IButtonGroupButton {
  value: string;
  label: string;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class ButtonGroup extends React.PureComponent<IProps> {
  public render() {
    const { buttons } = this.props;

    if (!buttons || buttons.length < 1) {
      return null;
    }

    return (
      <div className='rb-btn-group'>
        {this.renderButtons()}
      </div>
    );
  }

  private renderButtons() {
    const { buttons, selected } = this.props;

    if (!buttons || buttons.length < 1) {
      return null;
    }

    return buttons.map((button, index) => {
      if (!button || !button.value) {
        return null;
      }

      return (
        <button
          key={index}
          className={classnames({
            btn: true,
            'btn-active': selected === button.value,
          })}
          onClick={() => this.onClick(button.value)}
        >
          {button.label || button.value}
        </button>
      );
    });
  }

  private onClick = (value: string) => {
    const { onClick } = this.props;

    onClick(value);
  }
}

// #endregion
