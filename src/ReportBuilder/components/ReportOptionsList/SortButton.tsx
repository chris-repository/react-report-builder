import { ReportSortDirectionType } from 'peekdata-datagateway-api-sdk';
import React from 'react';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  sorting: ReportSortDirectionType;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export const SortButton: React.SFC<IProps> = ({ sorting }) => (
  <i className={getClassName(sorting)} />
);

// #endregion

// #region -------------- Selectors -------------------------------------------------------------------

const getClassName = (sorting: ReportSortDirectionType): string => {
  switch (sorting) {
    case ReportSortDirectionType.ASC:
      return 'fas fa-sort-alpha-down';

    case ReportSortDirectionType.DESC:
      return 'fas fa-sort-alpha-up';

    default:
      return 'fas fa-minus';
  }
};

// #endregion
