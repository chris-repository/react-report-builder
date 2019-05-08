import { IDimension } from 'src/ReportBuilder/models/graph';
import { AsyncState, IAction, IAsyncState } from 'src/ReportBuilder/state/action';
import { actionTypes } from 'src/ReportBuilder/state/actions';

// #region -------------- State -------------------------------------------------------------------

const initialState: IAsyncState<IDimension[]> = new AsyncState();

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

export function dimensions(state: IAsyncState<IDimension[]> = initialState, action: IAction): IAsyncState<IDimension[]> {
  switch (action.type) {
    case actionTypes.loadScopeNames:
      if (action.payload) {
        return state;
      }

      return initialState;

    case actionTypes.graphNamesLoaded:
      return initialState;

    case actionTypes.loadGraphNodes:
      return {
        ...state,
        data: null,
        isFetching: true,
        timestamp: new Date(),
      };

    case actionTypes.dimensionsLoaded:
      return {
        ...state,
        ...action.payload,
      };

    case actionTypes.compatibilityChecked:
      if (action.payload && action.payload.data) {
        return {
          ...state,
          data: action.payload.data.dimensions,
        };
      }

      return state;

    default:
      return state;
  }
}

// #endregion
