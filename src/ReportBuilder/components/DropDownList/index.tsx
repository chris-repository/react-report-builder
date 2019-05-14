import classnames from 'classnames';
import React, { Component } from 'react';
import 'src/style/components/dropDownList.scss';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  list: Map<string, string>;
  selected: string;
  disabled?: boolean;
  defaultLabel?: string;
  itemSelectedCallback: (listItem: string) => void;
}

interface IState {
  listVisible: boolean;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class DropDownList extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      listVisible: false,
    };
  }

  public render() {
    const { listVisible } = this.state;
    const { list, disabled, selected, defaultLabel } = this.props;
    const title = selected && list ? list.get(selected) : defaultLabel;

    return (
      <div className={classnames({
        'rb-dropdown-container': true,
        'rb-show-list': listVisible,
      })}>
        <div className={
          classnames({
            'rb-dropdown-display': true,
            clicked: listVisible,
            disabled: disabled || !list || list.size === 0,
          })}
          onClick={this.show}
        >
          <div className='rb-selection-title'>
            {title}
          </div>
          <div className='rb-selection-icon'>
            <div className='rb-dropdown-icon' />
          </div>
        </div>
        <div className='rb-dropdown-list'>
          <div>

            {this.renderListItems()}

          </div>
        </div>
      </div>
    );
  }

  private renderListItems() {
    const { list, disabled } = this.props;
    const items = [];

    if (!disabled && list && list.size > 0) {
      list.forEach((itemLabel, itemValue) => {
        items.push((
          <div className='rb-dropdown-item' key={itemValue} onClick={() => this.select(itemValue)}>
            {itemLabel}
          </div>
        ));
      });
    }

    return items;
  }

  private select = (listItem: string) => {
    const { itemSelectedCallback } = this.props;

    if (itemSelectedCallback) {
      itemSelectedCallback(listItem);
    }
  }

  private show = () => {
    const { list } = this.props;

    if (list && list.size > 0) {
      this.setState({
        listVisible: true,
      });

      document.addEventListener('click', this.hide);
    }
  }

  private hide = () => {
    this.setState({
      listVisible: false,
    });

    document.removeEventListener('click', this.hide);
  }
}

// #endregion
