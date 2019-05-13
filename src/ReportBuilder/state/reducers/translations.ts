import { translations } from 'src/assets/translations';
import { ITranslations } from 'src/ReportBuilder/models/translations';
import { IAction } from 'src/ReportBuilder/state/action';
import { actionTypes } from 'src/ReportBuilder/state/actions';

// #region -------------- Initial state -------------------------------------------------------------------

const initialState: ITranslations = translations;

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

export function translationsReducer(state: ITranslations = initialState, action: IAction): ITranslations {
  switch (action.type) {
    case actionTypes.setTranslations:
      if (!action.payload) {
        return;
      }

      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

// #endregion
