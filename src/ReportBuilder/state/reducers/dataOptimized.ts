import { IOptimizedReportResponse } from 'peekdata-datagateway-api-sdk';
import { AsyncState, IAction, IAsyncState } from 'src/ReportBuilder/state/action';
import { actionTypes } from 'src/ReportBuilder/state/actions';

// #region -------------- State -------------------------------------------------------------------

const initialState: IAsyncState<IOptimizedReportResponse> = new AsyncState();

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

export function dataOptimized(state: IAsyncState<IOptimizedReportResponse> = initialState, action: IAction): IAsyncState<IOptimizedReportResponse> {
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

    case actionTypes.loadDataOptimized:
      return {
        ...state,
        isFetching: true,
        timestamp: new Date(),
      };

    case actionTypes.dataOptimizedLoaded:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

// #endregion
