import { rows } from 'src/ReportBuilder/constants/rows';
import { IAction } from 'src/ReportBuilder/state/action';
import { actionTypes } from 'src/ReportBuilder/state/actions';

// #region -------------- State -------------------------------------------------------------------

const initialState: number = rows.startWithRow;

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

export function getStartWithRow(state: number = initialState, action: IAction) {
  switch (action.type) {

    case actionTypes.loadScopeNames:
      if (action.payload) {
        return state;
      }

      return initialState;

    case actionTypes.graphNamesLoaded:
      return initialState;

    case actionTypes.changeStartWithRow:
      return action.payload;

    default:
      return state;
  }
}

// #endregion
