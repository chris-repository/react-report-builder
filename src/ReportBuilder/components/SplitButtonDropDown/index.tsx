import React from 'react';
import { MenuItem, SplitButton } from 'react-bootstrap';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  id: string;
  title: string;
  options: string[];
  classNames?: string;
  onSelect: (option: string) => void;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class SplitButtonDropDown extends React.PureComponent<IProps> {
  public render() {
    const { id, title, classNames } = this.props;

    return (
      <div className='rb-split-btn'>
        <SplitButton
          id={id}
          title={title}
          className={classNames}
          onClick={() => this.onSelect(title)}
        >
          {this.renderOptions()}
        </SplitButton>
      </div>
    );
  }

  // #region -------------- Options -------------------------------------------------------------------

  private renderOptions = () => {
    const { options } = this.props;

    if (!options || options.length < 1) {
      return null;
    }

    return options.map((option, index) => (
      <MenuItem
        key={index}
        eventKey={index}
        onSelect={() => this.onSelect(option)}
      >
        {option}
      </MenuItem>
    ));
  }

  private onSelect = (option: string) => {
    const { onSelect } = this.props;

    onSelect(option);
  }

  // #endregion
}

// #endregion
