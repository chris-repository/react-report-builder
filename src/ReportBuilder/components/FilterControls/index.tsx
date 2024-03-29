import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { connect } from 'react-redux';
import { ButtonWithIcon } from 'src/ReportBuilder/components/ButtonWithIcon';
import { IFilter } from 'src/ReportBuilder/models/filter';
import { IDimension } from 'src/ReportBuilder/models/graph';
import { ITranslations } from 'src/ReportBuilder/models/translations';
import { addFilter, changeFilterInput, generateReportRequest, IChangeFilterInput, ISelectFilter, removeFilter, selectFilterOption } from 'src/ReportBuilder/state/actions';
import { IReportBuilderState } from 'src/ReportBuilder/state/reducers';
import { FilterControl } from './FilterControl';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IStateProps {
  filters: IFilter[];
  dimensions: IDimension[];
  t: ITranslations;
}

interface IDispatchProps {
  onFilterAddClicked: () => void;
  onFilterOptionSelected: (payload: ISelectFilter) => void;
  onFilterInputChanged: (payload: IChangeFilterInput) => void;
  onFilterRemoveClicked: (payload: IFilter) => void;
  onGenerateReportRequest: () => void;
}

interface IOwnProps { }

interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

// #endregion

// #region -------------- Component -------------------------------------------------------------------

class FilterControls extends React.PureComponent<IProps> {

  public render() {
    const { filters, dimensions, onFilterOptionSelected, onFilterInputChanged, onFilterAddClicked, onFilterRemoveClicked, onGenerateReportRequest, t } = this.props;

    return (
      <div className='rb-report-filters'>
        <div className='rb-title-dark rb-title-extra-small'>{t.filtersText} <span>- {t.optionalLabel}</span></div>

        {filters && filters.length !== 0 && <div className='rb-filter-container'>
          {filters.map((filter, index) =>
            <FilterControl
              key={index}
              filter={filter}
              dimensions={dimensions}
              onFilterRemoveClicked={onFilterRemoveClicked}
              onFilterOptionSelected={onFilterOptionSelected}
              onFilterInputChanged={onFilterInputChanged}
              onGenerateReportRequest={onGenerateReportRequest}
              t={t}
            />,
          )}
        </div>}

        <div className='rb-btn-container'>
          <ButtonWithIcon
            title={t.addFilterButton}
            styleClasses='rb-btn-small rb-btn-crimson'
            icon={faPlusCircle}
            onClick={onFilterAddClicked}
          />
        </div>
      </div>
    );
  }
}

// #endregion

// #region -------------- Connect -------------------------------------------------------------------

const connected = connect<IStateProps, IDispatchProps, IOwnProps, IReportBuilderState>(
  (state) => {
    const { filters, dimensions, translations } = state;

    return {
      filters,
      dimensions: dimensions && dimensions.data,
      t: translations,
    };
  },
  (dispatch) => {
    return {
      onFilterAddClicked: () => dispatch(addFilter()),
      onFilterOptionSelected: (payload: ISelectFilter) => dispatch(selectFilterOption(payload)),
      onFilterInputChanged: (payload: IChangeFilterInput) => dispatch(changeFilterInput(payload)),
      onFilterRemoveClicked: (payload: IFilter) => dispatch(removeFilter(payload)),
      onGenerateReportRequest: () => dispatch(generateReportRequest()),
    };
  },
)(FilterControls);

export { connected as FilterControls };

// #endregion
