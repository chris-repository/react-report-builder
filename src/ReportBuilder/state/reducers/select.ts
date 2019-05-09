import { AsyncState, IAction, IAsyncState } from 'src/ReportBuilder/state/action';
import { actionTypes } from 'src/ReportBuilder/state/actions';

// #region -------------- State -------------------------------------------------------------------

const initialState: IAsyncState<string> = new AsyncState();

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

export function select(state: IAsyncState<string> = initialState, action: IAction): IAsyncState<string> {
  switch (action.type) {
    case actionTypes.loadScopeNames:
      if (action.payload) {
        return state;
      }

      return initialState;

    case actionTypes.dimensionsLoaded:
    case actionTypes.graphNamesLoaded:
    case actionTypes.reportRequestGenerated:
      return initialState;

    case actionTypes.loadSelect:
      return {
        ...state,
        isFetching: true,
        timestamp: new Date(),
      };

    case actionTypes.selectLoaded:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

// #endregion
