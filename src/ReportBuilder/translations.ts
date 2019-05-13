import { PeekdataError } from 'peekdata-datagateway-api-sdk';
import { isPeekdataError } from './utils/ErrorUtils';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IApiErrorTranslations {
  [errorCode: number]: string;
}

type MainTranslations = typeof mainTranslations;

export interface ITranslations extends MainTranslations {
  apiErrors?: IApiErrorTranslations;
}

type TranslationSelector = (translations: ITranslations) => string;

// #endregion

// #region -------------- Helpers -------------------------------------------------------------------

export function translate(selector: TranslationSelector): string {
  return selector(mainTranslations);
}

export function setTranslations(newTranslations: Partial<ITranslations>) {
  if (!newTranslations) {
    return;
  }

  mainTranslations = {
    ...mainTranslations,
    ...newTranslations,
  };
}

export function getTranslations(): Partial<ITranslations> {
  return mainTranslations;
}

export function getApiErrorTranslation(error: PeekdataError): string {
  if (isPeekdataError(error)) {
    const translations = getTranslations();
    const apiErrors = translations && translations.apiErrors;

    if (apiErrors && apiErrors[error.code]) {
      return translate(t => t.apiErrors[error.code]);
    }
  }

  return null;
}

// #endregion

// #region -------------- Translations -------------------------------------------------------------------

let mainTranslations = {
  contentTitle: 'Report content',
  scopesDropdownTitle: 'Choose your Business Scope/Domain',
  graphsDropdownTitle: 'Data Source',
  dimensionsListTitle: 'Dimensions',
  dimensionPlaceholder: 'Select dimension',
  noDimensionsText: 'No dimensions found',
  addDimensionButtonText: 'Add dimension',
  metricsListTitle: 'Metrics',
  metricPlaceholder: 'Select metric',
  noMetricsText: 'No metrics found',
  addMetricButtonText: 'Add metric',
  filtersText: 'Filters',
  optionalLabel: 'optional',
  rowsOffset: 'Start with row',
  rowsLimit: 'Limit number of rows to',
  chartTab: 'Chart',
  tableTab: 'Table',
  filterFromLabel: 'from',
  filterToLabel: 'to',
  filterValuesDescription: 'The possible values have to be separated by a semicolon.',
  filterValuesExample: 'Example',
  filterTypeDateRange: 'Date Range',
  filterTypeSingleKey: 'Single Key',
  filterTypeSingleValue: 'Single Value',
  filterOperationEquals: 'EQUALS',
  filterOperationNotEquals: 'NOT_EQUALS',
  filterOperationStartsWith: 'STARTS_WITH',
  filterOperationNotStartsWith: 'NOT_STARTS_WITH',
  filterOperationAllIsLess: 'ALL_IS_LESS',
  filterOperationAllIsMore: 'ALL_IS_MORE',
  filterOperationAtLeastOneIsLess: 'AT_LEAST_ONE_IS_LESS',
  filterOperationAtLeastOneIsMore: 'AT_LEAST_ONE_IS_MORE',
  chartTypeBar: 'Bar',
  chartTypeLine: 'Line',
  chartTypePie: 'Pie',
  chartTypeDoughnut: 'Doughnut',
  chartTypeRadar: 'Radar',
};

// #endregion
