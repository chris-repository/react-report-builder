import { IAction } from 'src/ReportBuilder/state/action';
import { actionTypes } from 'src/ReportBuilder/state/actions';

// #region -------------- State -------------------------------------------------------------------

export interface IReportOptionsState {
  isReportOptionsOpen: boolean;
}

const initialState: IReportOptionsState = {
  isReportOptionsOpen: false,
};

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

export function reportOptions(state: IReportOptionsState = initialState, action: IAction): IReportOptionsState {

  switch (action.type) {
    case actionTypes.expandReportOptions:
      console.log(state);
      return {
        isReportOptionsOpen: !state.isReportOptionsOpen,
      };

    default:
      return state;
  }
}

// #endregion
