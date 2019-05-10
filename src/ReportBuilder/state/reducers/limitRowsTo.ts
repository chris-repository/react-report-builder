import { defaultRows } from 'src/ReportBuilder/constants/rows';
import { IAction } from 'src/ReportBuilder/state/action';
import { actionTypes } from 'src/ReportBuilder/state/actions';

// #region -------------- Reducer -------------------------------------------------------------------

export function getLimitRowsTo(state: number = defaultRows.limit, action: IAction) {
  switch (action.type) {

    case actionTypes.loadScopeNames:
      if (action.payload) {
        return state;
      }

      return defaultRows.limit;

    case actionTypes.graphNamesLoaded:
      return defaultRows.limit;

    case actionTypes.changeLimitRowsTo:
      return action.payload;

    default:
      return state;
  }
}

// #endregion
