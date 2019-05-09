import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { IGraphNode, ReportColumnType } from 'peekdata-datagateway-api-sdk';
import React from 'react';
import { DropDownListWithSearch } from 'src/ReportBuilder/components/DropDownListWithSearch';
import { ISelectedGraphNode } from 'src/ReportBuilder/models/graph';
import { ISelectGraphNodePayload, ISortOrderGraphNodePayload } from 'src/ReportBuilder/state/actions';

// #region -------------- Interfaces -------------------------------------------------------------------

export interface ISortableItemProps {
  options: IGraphNode[];
  optionType: ReportColumnType;
  placeholder: string;
  noResultsText: string;
  selectedOption?: ISelectedGraphNode;
  selectDisabled?: boolean;
  sortButton?: React.ReactNode;
  onOptionSelected: (payload: ISelectGraphNodePayload) => void;
  onOptionUnselected: (payload: ISelectGraphNodePayload) => void;
  onSortOrder: (payload: ISortOrderGraphNodePayload) => void;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class DragHandle extends React.PureComponent<ISortableItemProps> {
  public render() {
    const { options, optionType, placeholder, selectedOption, selectDisabled, noResultsText, onOptionSelected, onOptionUnselected } = this.props;

    return (
      <div className={classnames({
        'rb-report-option': true,
        'rb-report-option-draggable': selectDisabled,
      })}>

        <DropDownListWithSearch
          list={options}
          hideOptions={true}
          placeholder={placeholder}
          selected={selectedOption && selectedOption.value}
          disabled={selectDisabled}
          noResultsText={noResultsText}
          optionSelectedCallback={(selectedOptionValue) => onOptionSelected({ value: selectedOptionValue, optionType })}
        />

        {this.renderSortButton()}

        <div className='rb-btn-close' onClick={() => onOptionUnselected({ value: selectedOption.value, optionType })} >
          <i><FontAwesomeIcon icon={faTimesCircle} /></i>
        </div>
      </div>
    );
  }

  // #region -------------- Sort button -------------------------------------------------------------------

  private renderSortButton() {
    const { selectedOption, sortButton } = this.props;

    if (!selectedOption || !selectedOption.value) {
      return null;
    }

    return (
      <div className='rb-btn-sort' onClick={this.onSortClick} >
        {sortButton}
      </div>
    );
  }

  private onSortClick = () => {
    const { optionType, selectedOption, onSortOrder } = this.props;

    onSortOrder({ selectedOption, optionType });
  }

  // #endregion
}

// #endregion
