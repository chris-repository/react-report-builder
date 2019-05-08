import { ReportColumnType, ReportSortDirectionType } from 'peekdata-datagateway-api-sdk';
import { arrayMove } from 'react-sortable-hoc';
import { ISelectedGraphNode } from 'src/ReportBuilder/models/graph';
import { IAction } from 'src/ReportBuilder/state/action';
import { actionTypes, ISelectGraphNodePayload, ISortGraphNodePayload, ISortOrderGraphNodePayload } from 'src/ReportBuilder/state/actions';
import { getSortedItems } from 'src/ReportBuilder/utils/SortingUtils';

// #region -------------- State -------------------------------------------------------------------

const initialState: ISelectedGraphNode[] = [];

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

export function selectedDimensions(state: ISelectedGraphNode[] = initialState, action: IAction): ISelectedGraphNode[] {
  switch (action.type) {
    case actionTypes.loadScopeNames:
      if (action.payload) {
        return state;
      }

      return initialState;

    case actionTypes.dimensionsLoaded:
    case actionTypes.graphNamesLoaded:
      return initialState;

    case actionTypes.addOption:
      if (action.payload !== ReportColumnType.dimension) {
        return state;
      }

      return [
        ...state,
        {},
      ];

    case actionTypes.sortOrder:
      return getSortedItems(state, action.payload as ISortOrderGraphNodePayload, ReportColumnType.dimension);

    case actionTypes.sortEnd:
      const { oldIndex, newIndex, optionType } = action.payload as ISortGraphNodePayload;

      if (optionType !== ReportColumnType.dimension) {
        return state;
      }

      return arrayMove(state, oldIndex, newIndex);

    case actionTypes.setSelectedDimensions:
      return action.payload;

    case actionTypes.selectOption:
      const payload = action.payload as ISelectGraphNodePayload;

      if (!payload || payload.optionType !== ReportColumnType.dimension) {
        return state;
      }

      return state.map((item, index) => {
        if (item.value) {
          return item;
        }

        let sorting = null;

        // First item has to have ASC sorting
        if (index === 0) {
          sorting = ReportSortDirectionType.ASC;
        }

        return {
          value: payload.value,
          sorting,
        };
      });

    case actionTypes.unselectOption:
      const { value: unselectedOptionValue, optionType: unselectOptionType } = action.payload as ISelectGraphNodePayload;

      if (unselectOptionType !== ReportColumnType.dimension) {
        return state;
      }

      return state.filter(item => item.value !== unselectedOptionValue);

    default:
      return state;
  }
}

// #endregion
