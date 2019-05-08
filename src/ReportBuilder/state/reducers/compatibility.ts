import { IGraphReportCompatibility } from 'peekdata-datagateway-api-sdk';
import { AsyncState, IAction, IAsyncState } from 'src/ReportBuilder/state/action';
import { actionTypes } from 'src/ReportBuilder/state/actions';

// #region -------------- Interfaces -------------------------------------------------------------------

export type ICompatibilityState = IAsyncState<IGraphReportCompatibility>;

// #endregion

// #region -------------- State -------------------------------------------------------------------

const initialState: ICompatibilityState = new AsyncState();

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

export function compatibility(state: ICompatibilityState = initialState, action: IAction): ICompatibilityState {
  switch (action.type) {
    case actionTypes.loadGraphNames:
    case actionTypes.loadGraphNodes:
      return initialState;

    case actionTypes.selectOption:
    case actionTypes.unselectOption:
      return {
        ...state,
        isFetching: true,
        timestamp: new Date(),
      };

    case actionTypes.compatibilityChecked:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

// #endregion
