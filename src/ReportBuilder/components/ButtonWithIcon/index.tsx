import classnames from 'classnames';
import React from 'react';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  title: string;
  styleClasses: string;
  iconClasses: string;
  disabled?: boolean;
  onClick?: () => void;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class ButtonWithIcon extends React.PureComponent<IProps> {
  public render() {
    const { styleClasses, disabled } = this.props;

    return (
      <a className={
        classnames({
          btn: true,
          disabled,
        }, styleClasses)}
        onClick={this.onClick}
      >
        <i className={this.props.iconClasses} />
        {this.props.title}
      </a>
    );
  }

  private onClick = () => {
    const { disabled, onClick } = this.props;

    if (onClick && !disabled) {
      onClick();
    }
  }
}

// #endregion
