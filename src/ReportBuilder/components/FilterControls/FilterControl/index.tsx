import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { ReportFilterOperationType } from 'peekdata-datagateway-api-sdk';
import React, { ChangeEvent } from 'react';
import { CustomDatePicker } from 'src/ReportBuilder/components/CustomDatePicker';
import { DropDownList } from 'src/ReportBuilder/components/DropDownList';
import { DropDownListWithSearch } from 'src/ReportBuilder/components/DropDownListWithSearch';
import { FilterOptionTypes, FilterTypes, IFilter } from 'src/ReportBuilder/models/filter';
import { IDimension } from 'src/ReportBuilder/models/graph';
import { ITranslations } from 'src/ReportBuilder/models/translations';
import { IChangeFilterInput, ISelectFilter } from 'src/ReportBuilder/state/actions';
import 'src/style/components/filterControl.scss';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  filter: IFilter;
  dimensions: IDimension[];
  t: ITranslations;
  onFilterOptionSelected: (payload: ISelectFilter) => void;
  onFilterInputChanged: (payload: IChangeFilterInput) => void;
  onFilterRemoveClicked: (filter: IFilter) => void;
  onGenerateReportRequest: () => void;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class FilterControl extends React.PureComponent<IProps> {

  public componentDidUpdate(prevProps: IProps) {
    this.generateReportRequestIfNeeded(prevProps, this.props);
  }

  public render() {
    const { filter, t } = this.props;

    return (
      <div className='rb-filter-control'>

        {this.renderRemoveFilterButton()}

        <div className='rb-filter-dropdown'>
          <DropDownList
            list={this.getFilterTypeOptions()}
            defaultLabel={t.filterTypePlaceholder}
            selected={filter.filterType}
            itemSelectedCallback={this.onTypeSelected}
          />
        </div>

        {this.renderOperationsFilter()}
        {this.renderSingleValuesInput()}
        {this.renderKeyFilter()}
        {this.renderDateRangesFilter()}
        {this.renderSingleKeysInput()}

      </div>
    );
  }

  private getFilterTypeOptions = () => {
    const { t } = this.props;

    return new Map<string, string>([
      [FilterTypes.DateRanges, t.filterTypeDateRange],
      [FilterTypes.SingleKeys, t.filterTypeSingleKey],
      [FilterTypes.SingleValues, t.filterTypeSingleValue],
    ]);
  }

  private onTypeSelected = (selectedItem: string) => {
    const { filter, onFilterOptionSelected } = this.props;

    onFilterOptionSelected({
      filter,
      selectedItem,
      optionType: FilterOptionTypes.FilterType,
    });
  }

  // #region -------------- Remove filter button -------------------------------------------------------------------

  private renderRemoveFilterButton() {
    return (
      <span className='rb-btn-filter-remove' onClick={this.onFilterRemoveClicked}>
        <i><FontAwesomeIcon icon={faTrashAlt} /></i>
      </span>
    );
  }

  private onFilterRemoveClicked = () => {
    const { filter, onFilterRemoveClicked, onGenerateReportRequest } = this.props;

    onFilterRemoveClicked(filter);

    if (filter && filter.filterType) {
      onGenerateReportRequest();
    }
  }

  // #endregion

  // #region -------------- Operations filter -------------------------------------------------------------------

  private renderOperationsFilter() {
    const { filter, t } = this.props;

    if (!filter || (filter.filterType !== FilterTypes.SingleKeys && filter.filterType !== FilterTypes.SingleValues)) {
      return null;
    }

    return (
      <div className='rb-filter-dropdown'>
        <DropDownList
          list={this.getOperationOptions()}
          defaultLabel={t.filterOperationPlaceholder}
          selected={filter.operation}
          itemSelectedCallback={this.onOperationSelected}
        />
      </div>
    );
  }

  private getOperationOptions = () => {
    const { t } = this.props;

    return new Map<string, string>([
      [ReportFilterOperationType.EQUALS, t.filterOperationEquals],
      [ReportFilterOperationType.NOT_EQUALS, t.filterOperationNotEquals],
      [ReportFilterOperationType.STARTS_WITH, t.filterOperationStartsWith],
      [ReportFilterOperationType.NOT_STARTS_WITH, t.filterOperationNotStartsWith],
      [ReportFilterOperationType.ALL_IS_LESS, t.filterOperationAllIsLess],
      [ReportFilterOperationType.ALL_IS_MORE, t.filterOperationAllIsMore],
      [ReportFilterOperationType.AT_LEAST_ONE_IS_LESS, t.filterOperationAtLeastOneIsLess],
      [ReportFilterOperationType.AT_LEAST_ONE_IS_MORE, t.filterOperationAtLeastOneIsMore],
    ]);
  }

  private onOperationSelected = (selectedItem: string) => {
    const { filter, onFilterOptionSelected } = this.props;

    onFilterOptionSelected({
      filter,
      selectedItem,
      optionType: FilterOptionTypes.Operation,
    });
  }

  // #endregion

  // #region -------------- Key/Keys filter -------------------------------------------------------------------

  private renderKeyFilter() {
    const { filter, dimensions, t } = this.props;

    let isMulti: boolean = false;
    let selected: string | string[] = filter.key;
    let placeholder: string = t.filterSingleKeyPlaceholder;

    if (filter.filterType === FilterTypes.SingleValues) {
      isMulti = true;
      selected = filter.keys;
      placeholder = t.filterSingleValueKeysPlaceholder;
    }

    return (
      <div className={classnames({
        'rb-filter-dropdown': true,
        'rb-filter-multi': isMulti,
      })}>
        <DropDownListWithSearch
          list={dimensions}
          hideOptions={true}
          placeholder={placeholder}
          selected={selected}
          disabled={!filter.filterType}
          isClearable={false}
          isMulti={isMulti}
          optionSelectedCallback={this.onKeySelected}
        />
      </div>
    );
  }

  private onKeySelected = (selectedItem: string) => {
    const { filter, onFilterOptionSelected } = this.props;

    onFilterOptionSelected({
      filter,
      selectedItem,
      optionType: FilterOptionTypes.Key,
    });
  }

  // #endregion

  // #region -------------- Single keys input -------------------------------------------------------------------

  private renderSingleKeysInput() {
    const { filter, t } = this.props;

    if (filter.filterType !== FilterTypes.SingleKeys) {
      return null;
    }

    return (
      <div className='rb-filter-values'>
        <p>{t.filterValuesDescription}</p>
        <p>{t.filterValuesExample}: <b>1;2;3</b></p>
        <input
          id='values'
          className='rb-input'
          name='values'
          type='text'
          value={filter.values ? filter.values : ''}
          disabled={!filter.operation}
          onChange={this.onFilterInputChanged}
        />
      </div>
    );
  }

  // #endregion

  // #region -------------- Single values input -------------------------------------------------------------------

  private renderSingleValuesInput() {
    const { filter, t } = this.props;

    if (filter.filterType !== FilterTypes.SingleValues) {
      return null;
    }

    return (
      <div className='rb-filter-value'>
        <input
          id='values'
          className='rb-input'
          name='value'
          type='text'
          placeholder={t.filterSingleValuePlaceholder}
          value={filter.value ? filter.value : ''}
          disabled={!filter.operation}
          onChange={this.onFilterInputChanged}
        />
      </div>
    );
  }

  // #endregion

  // #region -------------- Date ranges filter -------------------------------------------------------------------

  private renderDateRangesFilter() {
    const { filter, t } = this.props;

    if (!filter || filter.filterType !== FilterTypes.DateRanges) {
      return null;
    }

    return (
      <div className='rb-date-ranges-filter'>
        <div>
          <label>{t.filterFromLabel}:</label>

          <CustomDatePicker
            name='from'
            startDate={filter.from}
            maxDate={filter.to}
            onDateInputChangedCallback={this.onFilterInputChanged}
            onDateSelectedCallback={this.onDateSelected}
          />
        </div>
        <div>
          <label>{t.filterToLabel}:</label>

          <CustomDatePicker
            name='to'
            startDate={filter.to}
            minDate={filter.from}
            onDateInputChangedCallback={this.onFilterInputChanged}
            onDateSelectedCallback={this.onDateSelected}
          />
        </div>
      </div>
    );
  }

  private onDateSelected = (name: string, value: string) => {
    const { filter, onFilterInputChanged } = this.props;

    onFilterInputChanged({ filter, name, value });
  }

  // #endregion

  // #region -------------- Common events -------------------------------------------------------------------

  private onFilterInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const { filter, onFilterInputChanged } = this.props;

    const target = event.target;
    const name = target.name;
    const value = target.value;

    onFilterInputChanged({ filter, name, value });
  }

  private generateReportRequestIfNeeded = (prevProps: IProps, nextProps: IProps) => {
    const prevFilter = prevProps && prevProps.filter;
    const nextFilter = nextProps && nextProps.filter;

    if (!nextFilter || !prevFilter || !nextFilter.filterType) {
      return;
    }

    if (nextFilter.filterType === FilterTypes.DateRanges) {
      if ((nextFilter.filterType === prevFilter.filterType &&
        nextFilter.key === prevFilter.key &&
        nextFilter.to === prevFilter.to &&
        nextFilter.from === prevFilter.from) ||
        !nextFilter.key || !nextFilter.from || !nextFilter.to) {
        return;
      }
    } else if (nextFilter.filterType === FilterTypes.SingleKeys) {
      if ((nextFilter.filterType === prevFilter.filterType &&
        nextFilter.operation === prevFilter.operation &&
        nextFilter.key === prevFilter.key &&
        nextFilter.values === prevFilter.values) ||
        !nextFilter.operation || !nextFilter.key || !nextFilter.values) {
        return;
      }
    } else {
      if ((nextFilter.filterType === prevFilter.filterType &&
        nextFilter.operation === prevFilter.operation &&
        nextFilter.value === prevFilter.value &&
        ((nextFilter.keys && nextFilter.keys.length) === (prevFilter.keys && prevFilter.keys.length))) ||
        !nextFilter.operation || !nextFilter.value || !nextFilter.keys || nextFilter.keys.length < 1) {
        return;
      }
    }

    const { onGenerateReportRequest } = this.props;

    onGenerateReportRequest();
  }

  // #endregion
}

// #endregion
