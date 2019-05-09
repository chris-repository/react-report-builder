import { AsyncState, IAction, IAsyncState } from 'src/ReportBuilder/state/action';
import { actionTypes } from 'src/ReportBuilder/state/actions';

// #region -------------- State -------------------------------------------------------------------

export interface IScopeNamesState {
  scopeNames: IAsyncState<string[]>;
  selectedScope: string;
}

const initialState: IScopeNamesState = {
  scopeNames: new AsyncState(),
  selectedScope: '',
};

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

export function scopeNames(state: IScopeNamesState = initialState, action: IAction): IScopeNamesState {
  switch (action.type) {
    case actionTypes.loadScopeNames:
      if (action.payload) {
        return state;
      }

      return {
        ...initialState,
        scopeNames: {
          ...state.scopeNames,
          isFetching: true,
          timestamp: new Date(),
        },
      };

    case actionTypes.scopeNamesLoaded:
      return {
        ...initialState,
        scopeNames: {
          ...state.scopeNames,
          ...action.payload,
        },
      };

    case actionTypes.loadGraphNames:
      return {
        ...state,
        selectedScope: action.payload,
      };

    default:
      return state;
  }
}

// #endregion
