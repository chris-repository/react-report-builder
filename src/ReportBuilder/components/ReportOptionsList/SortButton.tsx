import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faMinus, faSortAlphaDown, faSortAlphaUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReportSortDirectionType } from 'peekdata-datagateway-api-sdk';
import React from 'react';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  sorting: ReportSortDirectionType;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export const SortButton: React.SFC<IProps> = ({ sorting }) => (
  <i><FontAwesomeIcon icon={getIcon(sorting)} /></i>
);

// #endregion

// #region -------------- Selectors -------------------------------------------------------------------

const getIcon = (sorting: ReportSortDirectionType): IconProp => {
  switch (sorting) {
    case ReportSortDirectionType.ASC:
      return faSortAlphaDown;

    case ReportSortDirectionType.DESC:
      return faSortAlphaUp;

    default:
      return faMinus;
  }
};

// #endregion
