import { ReportColumnType } from 'peekdata-datagateway-api-sdk';
import { arrayMove } from 'react-sortable-hoc';
import { ISelectedGraphNode } from 'src/ReportBuilder/models/graph';
import { IAction } from 'src/ReportBuilder/state/action';
import { actionTypes, ISelectGraphNodePayload, ISortGraphNodePayload, ISortOrderGraphNodePayload } from 'src/ReportBuilder/state/actions';
import { getSortedItems } from 'src/ReportBuilder/utils/SortingUtils';

// #region -------------- State -------------------------------------------------------------------

const initialState: ISelectedGraphNode[] = [];

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

export function selectedMetrics(state: ISelectedGraphNode[] = initialState, action: IAction): ISelectedGraphNode[] {
  switch (action.type) {
    case actionTypes.loadScopeNames:
      if (action.payload) {
        return state;
      }

      return initialState;

    case actionTypes.metricsLoaded:
    case actionTypes.graphNamesLoaded:
      return initialState;

    case actionTypes.addOption:
      if (action.payload !== ReportColumnType.metric) {
        return state;
      }

      return [
        ...state,
        {},
      ];

    case actionTypes.sortOrder:
      return getSortedItems(state, action.payload as ISortOrderGraphNodePayload, ReportColumnType.metric);

    case actionTypes.sortEnd:
      const { oldIndex, newIndex, optionType } = action.payload as ISortGraphNodePayload;

      if (optionType !== ReportColumnType.metric) {
        return state;
      }

      return arrayMove(state, oldIndex, newIndex);

    case actionTypes.setSelectedMetrics:
      return action.payload;

    case actionTypes.selectOption:
      const payload = action.payload as ISelectGraphNodePayload;

      if (!payload || payload.optionType !== ReportColumnType.metric) {
        return state;
      }

      return state.map(item => {
        if (item.value) {
          return item;
        }

        return {
          value: payload.value,
          sorting: null,
        };
      });

    case actionTypes.unselectOption:
      const { value: unselectedOptionValue, optionType: unselectOptionType } = action.payload as ISelectGraphNodePayload;

      if (unselectOptionType !== ReportColumnType.metric) {
        return state;
      }

      return state.filter(item => item.value !== unselectedOptionValue);

    default:
      return state;
  }
}

// #endregion
