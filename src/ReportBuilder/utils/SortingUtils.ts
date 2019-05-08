import { ReportColumnType, ReportSortDirectionType } from 'peekdata-datagateway-api-sdk';
import { ISelectedGraphNode } from 'src/ReportBuilder/models/graph';
import { ISortOrderGraphNodePayload } from 'src/ReportBuilder/state/actions';

export const getSortedItems = (state: ISelectedGraphNode[], payload: ISortOrderGraphNodePayload, type: ReportColumnType): ISelectedGraphNode[] => {
  const { selectedOption, optionType } = payload;
  const { value, sorting } = selectedOption;

  if (optionType !== type) {
    return state;
  }

  return state.map(item => {
    if (value !== item.value) {
      return item;
    }

    return {
      ...item,
      sorting: getSorting(sorting),
    };
  });
};

export const getSorting = (sorting: ReportSortDirectionType) => {
  switch (sorting) {
    case ReportSortDirectionType.ASC:
      return ReportSortDirectionType.DESC;

    case ReportSortDirectionType.DESC:
      return null;

    default:
      return ReportSortDirectionType.ASC;
  }
};
