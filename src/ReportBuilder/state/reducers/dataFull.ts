import { INotOptimizedReportResponse } from 'peekdata-datagateway-api-sdk';
import { AsyncState, IAction, IAsyncState } from 'src/ReportBuilder/state/action';
import { actionTypes } from 'src/ReportBuilder/state/actions';

// #region -------------- State -------------------------------------------------------------------

const initialState: IAsyncState<INotOptimizedReportResponse> = new AsyncState();

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

export function dataFull(state: IAsyncState<INotOptimizedReportResponse> = initialState, action: IAction): IAsyncState<INotOptimizedReportResponse> {
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

    case actionTypes.loadDataFull:
      return {
        ...state,
        isFetching: true,
        timestamp: new Date(),
      };

    case actionTypes.dataFullLoaded:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

// #endregion
