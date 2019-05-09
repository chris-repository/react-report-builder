import { AsyncState, IAction, IAsyncState } from 'src/ReportBuilder/state/action';
import { actionTypes } from 'src/ReportBuilder/state/actions';

// #region -------------- State -------------------------------------------------------------------

export interface IGraphNamesState {
  graphNames: IAsyncState<string[]>;
  selectedGraph: string;
}

const initialState: IGraphNamesState = {
  graphNames: new AsyncState(),
  selectedGraph: '',
};

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

export function graphNames(state: IGraphNamesState = initialState, action: IAction): IGraphNamesState {
  switch (action.type) {
    case actionTypes.loadScopeNames:
      if (action.payload) {
        return state;
      }

      return initialState;

    case actionTypes.loadGraphNames:
      return {
        ...initialState,
        graphNames: {
          ...state.graphNames,
          isFetching: true,
          timestamp: new Date(),
        },
      };

    case actionTypes.graphNamesLoaded:
      return {
        ...state,
        graphNames: {
          ...state.graphNames,
          ...action.payload,
        },
      };

    case actionTypes.loadGraphNodes:
      return {
        ...state,
        selectedGraph: action.payload.selectedGraph,
      };

    default:
      return state;
  }
}

// #endregion
