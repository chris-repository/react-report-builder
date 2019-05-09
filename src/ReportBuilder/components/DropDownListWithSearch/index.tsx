import classnames from 'classnames';
import { IGraphNode } from 'peekdata-datagateway-api-sdk';
import React from 'react';
import Select from 'react-select';
import { isGraphNode } from 'src/ReportBuilder/models/graph';
import 'src/style/components/dropDownListWithSearch.scss';

// #region -------------- Interfaces -------------------------------------------------------------------

type ListItem = string | IGraphNode;

interface IProps {
  list: ListItem[];
  selected: string | string[];
  placeholder?: string;
  disabled?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
  noResultsText?: string;
  hideOptions?: boolean;
  optionSelectedCallback: (selectedValue) => void;
}

interface IState {
  expandedGroups: string[];
  showOptions: boolean;
}

interface IOption {
  value: string;
  label: string;
  description?: string;
  groups?: string[];
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class DropDownListWithSearch extends React.PureComponent<IProps, IState> {

  private selectRef;

  constructor(props: IProps) {
    super(props);

    this.state = {
      expandedGroups: [],
      showOptions: !props.hideOptions,
    };
  }

  public render() {
    const { list, placeholder, selected, disabled, noResultsText, isClearable, isMulti } = this.props;

    let groups = null;
    let options: IOption[] = [];

    if (list && list.length > 0) {
      options = list.map((listItem) => {
        if (isGraphNode(listItem)) {
          groups = this.getGroups(listItem.groups);

          return {
            value: listItem.name,
            label: listItem.title,
            description: listItem.description,
            groups: listItem.groups,
          };
        }

        return {
          value: listItem,
          label: listItem,
        };
      });
    }

    let value: IOption | IOption[] = null;
    if (selected) {
      if (typeof selected === 'string') {
        for (const option of options) {
          if (option.value === selected) {
            value = option;
            break;
          }
        }
      } else {
        value = [];

        for (const selectedValue of selected) {
          for (const option of options) {
            if (option.value === selectedValue) {
              value.push(option);
              break;
            }
          }
        }
      }
    }

    let groupedOptions = [];
    if (groups && groups.length > 0) {
      groups.sort();

      for (const group of groups) {
        groupedOptions.push({
          label: group,
          options: this.getGroupOptions(options, group),
        });
      }
    } else {
      groupedOptions = options;
    }

    const isDisabled = options.length === 0 || disabled;

    return (
      <Select
        className='rb-dropdown-with-search-container'
        classNamePrefix='rb-dropdown-with-search'
        ref={ref => this.selectRef = ref}
        options={groupedOptions}
        value={value}
        placeholder={placeholder}
        onChange={this.onChange}
        onInputChange={(inputValue) => this.onInputChange(inputValue, groups)}
        onMenuClose={this.onMenuClose}
        noOptionsMessage={() => (noResultsText)}
        isDisabled={isDisabled}
        isClearable={isClearable}
        formatGroupLabel={this.formatGroupLabel}
        formatOptionLabel={this.formatOptionLabel}
        menuShouldScrollIntoView={false}
        openMenuOnFocus={true}
        isMulti={isMulti}
      />
    );
  }

  private getGroups(optionGroups) {
    const groups = [];

    if (optionGroups && optionGroups.length > 0) {
      for (const optionGroup of optionGroups) {
        if (groups.indexOf(optionGroup) === -1) {
          groups.push(optionGroup);
        }
      }
    }

    return groups;
  }

  private getGroupOptions(options, group) {
    const groupOptions = [];

    for (const option of options) {
      const newOption = { ...option };

      if (newOption.groups) {
        for (const newOptionGroup of newOption.groups) {
          if (newOptionGroup === group) {
            newOption.group = group;
            groupOptions.push(newOption);
          }
        }
      }
    }

    return groupOptions;
  }

  private onChange = (selectedOption) => {
    const { optionSelectedCallback } = this.props;

    if (optionSelectedCallback && selectedOption) {
      if (typeof selectedOption === 'object' && selectedOption.value) {
        optionSelectedCallback(selectedOption.value);
      } else {
        const values = selectedOption.map(option => option.value);

        optionSelectedCallback(values);
      }
    }
  }

  private onInputChange = (value, groups) => {
    const { hideOptions } = this.props;

    if (hideOptions) {
      if (value.length === 0) {
        this.setState({
          expandedGroups: [],
          showOptions: false,
        });
      }

      if (value.length >= 1) {
        this.setState({
          expandedGroups: groups,
          showOptions: true,
        });
      }
    }
  }

  private onMenuClose = () => {
    this.selectRef.blur();
  }

  private formatGroupLabel = (option) => {
    const { expandedGroups, showOptions } = this.state;
    const label = option.label;
    let isExpanded = false;

    if (expandedGroups.indexOf(label) !== -1 || showOptions) {
      isExpanded = true;
    }

    return (
      <div
        style={{ borderBottom: isExpanded ? 'none' : null }}
        className='rb-dropdown-with-search-group-heading'
        onClick={() => this.toggleOptions(label)}
      >
        <div className='rb-group-heading-label'>{label}</div>
        <div className={classnames({
          'rb-group-heading-indicator': true,
          'is-expanded': isExpanded,
        })}>
          <div />
        </div>
      </div>
    );
  }

  private formatOptionLabel = (option, labelMeta) => {
    const { expandedGroups, showOptions } = this.state;

    if (labelMeta.context === 'value') {
      return (
        <div className='rb-dropdown-with-search-label'>
          <div className='rb-option-label'>{option.label}</div>
        </div>
      );
    }

    if (expandedGroups.indexOf(option.group) === -1 && !showOptions) {
      return null;
    }

    return (
      <div className='rb-dropdown-with-search-label'>
        <div className='rb-option-label'>{option.label}</div>

        {option.description &&
          <div className='rb-tooltip'>
            <div>{option.description}</div>
          </div>
        }

      </div>
    );
  }

  private toggleOptions = (label) => {
    const { expandedGroups } = this.state;
    const index = expandedGroups.indexOf(label);

    if (index === -1) {
      this.setState({
        expandedGroups: [...expandedGroups, label],
        showOptions: false,
      });
    } else {
      const updatedExpandedGroups = [...expandedGroups];
      updatedExpandedGroups.splice(index, 1);

      this.setState({
        expandedGroups: updatedExpandedGroups,
        showOptions: false,
      });
    }
  }
}

// #endregion
