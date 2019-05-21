import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { ISortGraphNodePayload } from 'src/ReportBuilder/state/actions';
import 'src/style/components/reportOptionsList.scss';
import { ISortableListProps, SortableList } from './SortableList';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps extends ISortableListProps {
  onSortEnd: (payload: ISortGraphNodePayload) => void;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class ReportOptionsList extends React.PureComponent<IProps> {
  public render() {
    const { optionType, onSortEnd, options, selectedOptions } = this.props;

    if (!options || options.length === 0) {
      return null;
    }

    const notSelectedOptions = getNotSelectedOptions(options, selectedOptions);

    return (
      <SortableList
        {...this.props}
        axis='xy'
        helperClass='rb-report-option-grabbed'
        useDragHandle={true}
        onSortEnd={({ oldIndex, newIndex }) => onSortEnd({ oldIndex, newIndex, optionType })}
        showButton={getShowButton(selectedOptions, notSelectedOptions)}
      />
    );
  }
}

// #endregion

// #region -------------- Selectors -------------------------------------------------------------------

const getNotSelectedOptions = (options, selectedOptions) =>
  options.filter(option => !selectedOptions.map(o => o.value).includes(option.name));

const getShowButton = (selectedOptions, notSelectedOptions) =>
  notSelectedOptions &&
  notSelectedOptions.length > 0 &&
  (selectedOptions && selectedOptions.length > 0 ? !isEmpty(selectedOptions[selectedOptions.length - 1]) : true);

// #endregion
