import React from 'react';
import { MenuItem, SplitButton } from 'react-bootstrap';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  id: string;
  value: string;
  options: Map<string, string>;
  classNames?: string;
  onSelect: (option: string) => void;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class SplitButtonDropDown extends React.PureComponent<IProps> {
  public render() {
    const { id, value, classNames, options } = this.props;
    const title = options && options.get(value);

    return (
      <div className='rb-split-btn'>
        <SplitButton
          id={id}
          title={title}
          className={classNames}
          onClick={() => this.onSelect(value)}
        >
          {this.renderOptions()}
        </SplitButton>
      </div>
    );
  }

  // #region -------------- Options -------------------------------------------------------------------

  private renderOptions = () => {
    const { options } = this.props;

    if (!options || options.size < 1) {
      return null;
    }

    const items = [];

    options.forEach((label, value) => {
      items.push((
        <MenuItem
          key={value}
          eventKey={value}
          onSelect={() => this.onSelect(value)}
        >
          {label}
        </MenuItem>
      ));
    });

    return items;
  }

  private onSelect = (option: string) => {
    const { onSelect } = this.props;

    onSelect(option);
  }

  // #endregion
}

// #endregion
