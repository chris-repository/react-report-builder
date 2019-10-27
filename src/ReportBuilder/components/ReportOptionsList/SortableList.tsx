import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { ReportColumnType } from 'peekdata-datagateway-api-sdk';
import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { ButtonWithIcon } from 'src/ReportBuilder/components/ButtonWithIcon';
import { ISelectedGraphNode } from 'src/ReportBuilder/models/graph';
import { ITranslations } from 'src/ReportBuilder/models/translations';
import { ISortableItemProps } from './DragHandle';
import { SortableItem } from './SortableItem';
import { SortButton } from './SortButton';

// #region -------------- Interfaces -------------------------------------------------------------------

export interface ISortableListProps extends ISortableItemProps {
  selectedOptions: ISelectedGraphNode[];
  buttonTitle: string;
  listTitle: string;
  showButton?: boolean;
  isOptional?: boolean;
  t: ITranslations;
  onOptionAdded: (payload: ReportColumnType) => void;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

class SortableList extends React.PureComponent<ISortableListProps> {

  public render() {
    const { options, selectedOptions, optionType, buttonTitle, showButton, listTitle, isOptional, onOptionAdded, t, ...otherProps } = this.props;

    return (
      <div>
        <div className='rb-title-dark rb-title-extra-small'>{listTitle} {isOptional && <span>- {t.optionalLabel}</span>}</div>
        <div className='rb-report-options'>

          {selectedOptions.map((selectedOption, index) => {
            const disabled = !!(selectedOption && selectedOption.value);
            let filteredOptions = options;

            if (!disabled) {
              const selectedValues = selectedOptions.map(selected => selected.value);

              filteredOptions = options.filter(option => selectedValues.indexOf(option.name) === -1);
            }

            return (
              <SortableItem
                key={index}
                index={index}
                disabled={!disabled}
                options={[...filteredOptions]}
                optionType={optionType}
                selectedOption={selectedOption}
                selectDisabled={disabled}
                sortButton={<SortButton sorting={selectedOption.sorting} />}
                {...otherProps}
              />
            );
          })}

          {showButton && <div className='rb-btn-container'>
            <ButtonWithIcon
              title={buttonTitle}
              styleClasses='rb-btn-small rb-btn-caramel-dashed'
              icon={faPlusCircle}
              onClick={() => onOptionAdded(optionType)}
            />
          </div>}
        </div>
      </div>
    );
  }
}

// #endregion

const withSortableContainer = SortableContainer(SortableList);

export { withSortableContainer as SortableList };

