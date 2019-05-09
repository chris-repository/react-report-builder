import moment from 'moment';
import { IReportFilterDateRange, IReportFilters, IReportFilterSingleKey, IReportFilterSingleValue, ReportFilterOperationType } from 'peekdata-datagateway-api-sdk';
import { dateTime } from 'src/ReportBuilder/constants/dateTime';
import { FilterOptionTypes, FilterTypes, IFilter } from 'src/ReportBuilder/models/filter';
import { IAction } from 'src/ReportBuilder/state/action';
import { actionTypes, IChangeFilterInput, ISelectFilter } from 'src/ReportBuilder/state/actions';

// #region -------------- State -------------------------------------------------------------------

const initialState: IFilter[] = [];

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

export function filters(state: IFilter[] = initialState, action: IAction): IFilter[] {
  switch (action.type) {
    case actionTypes.loadScopeNames:
      if (action.payload) {
        return state;
      }

      return initialState;

    case actionTypes.dimensionsLoaded:
    case actionTypes.graphNamesLoaded:
      return initialState;

    case actionTypes.filtersLoaded:
      const requestFilters: IReportFilters = action.payload;
      let dateRanges: IFilter[] = [];
      let singleKeys: IFilter[] = [];
      let singleValues: IFilter[] = [];

      if (requestFilters) {
        if (requestFilters.dateRanges) {
          dateRanges = getDateRanges(requestFilters.dateRanges);
        }

        if (requestFilters.singleKeys) {
          singleKeys = getSingleKeys(requestFilters.singleKeys);
        }

        if (requestFilters.singleValues) {
          singleValues = getSingleValues(requestFilters.singleValues);
        }
      }

      return [
        ...dateRanges,
        ...singleKeys,
        ...singleValues,
      ];

    case actionTypes.addFilter:
      return [
        ...state,
        {},
      ];

    case actionTypes.removeFilter:
      return state.filter(f => f !== action.payload);

    case actionTypes.changeFilterInput:
      return state.map(f => {
        const { filter, name, value } = action.payload as IChangeFilterInput;

        if (filter !== f) {
          return f;
        }

        return {
          ...f,
          [name]: value,
        };
      });

    case actionTypes.selectFilterOption:
      return getProcessedFilters(state, action.payload);

    case actionTypes.setFilters:
      return action.payload;

    default:
      return state;
  }
}

// #endregion

// #region -------------- Helpers -------------------------------------------------------------------

const getProcessedFilters = (state: IFilter[], payload: ISelectFilter): IFilter[] => state.map(f => {
  const { filter, selectedItem, optionType } = payload;

  if (f !== filter) {
    return f;
  }

  switch (optionType) {
    case FilterOptionTypes.Key:
      if (typeof selectedItem === 'string') {
        return {
          ...f,
          key: selectedItem,
        };
      }

      return {
        ...f,
        keys: selectedItem,
      };

    case FilterOptionTypes.FilterType:
      const newFilter: IFilter = {
        filterType: selectedItem as FilterTypes,
      };

      if (selectedItem === FilterTypes.SingleValues) {
        newFilter.keys = f.keys || [];
      } else {
        newFilter.key = f.key || null;
      }

      if (selectedItem === FilterTypes.DateRanges) {
        newFilter.from = moment().subtract(3, 'months').format(dateTime.dateFormat);
        newFilter.to = moment().format(dateTime.dateFormat);
      }

      return newFilter;

    case FilterOptionTypes.Operation:
      return {
        ...f,
        operation: selectedItem as ReportFilterOperationType,
      };

    default:
      return f;
  }
});

const getDateRanges = (dateRanges: IReportFilterDateRange[]): IFilter[] =>
  dateRanges.map(dr => ({
    filterType: FilterTypes.DateRanges,
    key: dr.key,
    from: dr.from,
    to: dr.to,
  }));

const getSingleKeys = (singleKeys: IReportFilterSingleKey[]): IFilter[] =>
  singleKeys.map(sk => ({
    filterType: FilterTypes.SingleKeys,
    key: sk.key,
    operation: sk.operation || ReportFilterOperationType.EQUALS,
    values: sk.values.join(';'),
  }));

const getSingleValues = (singleValues: IReportFilterSingleValue[]): IFilter[] =>
  singleValues.map(sv => ({
    filterType: FilterTypes.SingleValues,
    keys: sv.keys,
    operation: sv.operation || ReportFilterOperationType.EQUALS,
    value: sv.value,
  }));

// #endregion
