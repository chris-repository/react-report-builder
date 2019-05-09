import { IMetric } from 'src/ReportBuilder/models/graph';
import { AsyncState, IAction, IAsyncState } from 'src/ReportBuilder/state/action';
import { actionTypes } from 'src/ReportBuilder/state/actions';

// #region -------------- State -------------------------------------------------------------------

const initialState: IAsyncState<IMetric[]> = new AsyncState();

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

export function metrics(state: IAsyncState<IMetric[]> = initialState, action: IAction): IAsyncState<IMetric[]> {
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

    case actionTypes.metricsLoaded:
      return {
        ...state,
        ...action.payload,
      };

    case actionTypes.compatibilityChecked:
      if (action.payload && action.payload.data) {
        return {
          ...state,
          data: action.payload.data.metrics,
        };
      }

      return state;

    default:
      return state;
  }
}

// #endregion
