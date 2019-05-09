import { IReportRequest } from 'peekdata-datagateway-api-sdk';
import { IAction } from 'src/ReportBuilder/state/action';
import { actionTypes } from 'src/ReportBuilder/state/actions';

// #region -------------- State -------------------------------------------------------------------

const initialState: IReportRequest = null;

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

export function request(state: IReportRequest = initialState, action: IAction): IReportRequest {
  switch (action.type) {
    case actionTypes.loadScopeNames:
      if (action.payload) {
        return state;
      }

      return initialState;

    case actionTypes.graphNamesLoaded:
    case actionTypes.dimensionsLoaded:
      return initialState;

    case actionTypes.reportRequestGenerated:
      return action.payload;

    default:
      return state;
  }
}

// #endregion
