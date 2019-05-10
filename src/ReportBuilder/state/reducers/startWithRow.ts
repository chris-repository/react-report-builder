import { defaultRows } from 'src/ReportBuilder/constants/rows';
import { IAction } from 'src/ReportBuilder/state/action';
import { actionTypes } from 'src/ReportBuilder/state/actions';

// #region -------------- Reducer -------------------------------------------------------------------

export function getStartWithRow(state: number = defaultRows.offset, action: IAction) {
  switch (action.type) {

    case actionTypes.loadScopeNames:
      if (action.payload) {
        return state;
      }

      return defaultRows.offset;

    case actionTypes.graphNamesLoaded:
      return defaultRows.offset;

    case actionTypes.changeStartWithRow:
      return action.payload;

    default:
      return state;
  }
}

// #endregion
