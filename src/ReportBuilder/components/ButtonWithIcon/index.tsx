import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React from 'react';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  title: string;
  styleClasses: string;
  icon: IconProp;
  disabled?: boolean;
  onClick?: () => void;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class ButtonWithIcon extends React.PureComponent<IProps> {
  public render() {
    const { styleClasses, disabled, icon, title } = this.props;

    return (
      <a className={
        classnames({
          btn: true,
          disabled,
        }, styleClasses)}
        onClick={this.onClick}
      >
        <i><FontAwesomeIcon icon={icon} /></i>
        {title}
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
