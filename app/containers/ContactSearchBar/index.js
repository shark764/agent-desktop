/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * ContactSearchBar
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { injectIntl, FormattedMessage } from 'react-intl';
import Autocomplete from 'react-autocomplete';

import { getLocaleLabel } from 'utils/contact';

import search from 'assets/icons/search.png';

import ErrorBoundary from 'components/ErrorBoundary';

import Button from 'components/Button';
import TextInput from 'components/TextInput';

import {
  addSearchFilter,
  removeSearchFilter,
  setContactMode,
} from 'containers/AgentDesktop/actions';
import { setSearchPending } from 'containers/InfoTab/actions';
import { selectSearchPending } from 'containers/InfoTab/selectors';
import { selectSearchableAttributes } from './selectors';
import messages from './messages';

export class ContactSearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pendingFilter: false,
      pendingFilterValue: '',
      autocompleteValue: '',
      filterMenuWidth: 0,
    };
  }

  componentDidMount() {
    this.resizeFilterDropdownMenu();
  }

  componentDidUpdate() {
    this.resizeFilterDropdownMenu();
  }

  getLabel = (attribute) => getLocaleLabel(attribute, this.props.intl.locale);

  getSearchableAttributes = () =>
    [
      {
        id: 'all',
        label: {
          all: this.props.intl.formatMessage(messages.all),
        },
        // Fuzzy search query parameter
        objectName: 'q',
      },
    ].concat(this.props.searchableAttributes);

  getAvailableFilters = () => {
    if (this.props.query.length && this.props.query[0].attribute.id === 'all') {
      // Don't show other filters when 'all' is selected
      return [];
    }
    const filteredFilters = this.getSearchableAttributes().filter(
      (possibleFilter) =>
        this.props.query.findIndex(
          (searchFilter) =>
            searchFilter.attribute.objectName === possibleFilter.objectName
        ) === -1
    );
    return filteredFilters;
  };

  resizeFilterDropdownMenu = () => {
    const newInputDivWidth =
      (this.inputDivElement && this.inputDivElement.offsetWidth) ||
      this.state.filterMenuWidth;
    if (newInputDivWidth !== this.state.filterMenuWidth) {
      this.setState({
        // eslint-disable-line react/no-did-mount-set-state
        filterMenuWidth: newInputDivWidth,
      });
    }
  };

  handleFilterValueInputKey = (event) => {
    switch (event.key) {
      case 'Backspace':
        if (!this.state.pendingFilterValue.length) {
          this.setState(
            {
              pendingFilter: false,
            },
            this.props.focusSearchInputElement
          );
        }
        break;
      default:
        break;
    }
  };

  createDropdownItem = (item, isHighlighted) => (
    <div
      key={item.id}
      style={{
        ...this.styles.filterDropdownRow,
        ...(isHighlighted ? this.styles.highlightedFilter : {}),
      }}
    >
      {this.getLabel(item)}
    </div>
  );

  styles = {
    base: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    inputBox: {
      backgroundColor: '#fff',
      backgroundImage: `url(${search})`,
      backgroundPosition: '10px 10px',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '16px',
      padding: '3px 3px 3px 40px',
      height: '36px',
      ':focus': {
        boxShadow: '0 0 6px 1px rgba(0, 0, 0, 0.12)',
        borderColor: '#23CEF5',
      },
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: '#979797',
      maxWidth: '100%',
      display: 'flex',
      alignItems: 'center',
      flexGrow: '1',
      flexShrink: '1',
    },
    input: {
      height: '100%',
      width: '100%',
      outline: 'none',
      borderTop: 'none',
      borderRight: 'none',
      borderBottom: 'none',
      borderLeft: 'none',
      ':focus': {
        outline: 'none',
      },
    },
    pendingFilterInput: {
      padding: '0 11px 0 0',
    },
    noBg: {
      backgroundColor: '#fff',
      borderWidth: 0,
    },
    closeButton: {
      margin: '0',
      order: '1',
      flexGrow: '0',
      flexShrink: '0',
      borderTop: 'none',
      borderRight: 'none',
      borderLeft: 'none',
      borderBottom: 'none',
      backgroundColor: 'none',
      ':hover': this.noBg,
      ':active': this.noBg,
    },
    highlightedFilter: {
      background: '#E4E4E4',
    },
    inputWrapper: {
      height: '100%',
      paddingLeft: '0',
      display: 'flex',
      alignItems: 'center',
      flexGrow: '1',
      flexShrink: '1',
      position: 'relative',
    },
    filterDropdown: {
      left: '-41px',
      top: '32px',
      position: 'absolute',
      background: '#fff',
      borderRadius: '0 0 0 2px',
      border: '1px solid #E4E4E4',
      borderTop: 'none',
      zIndex: '10',
    },
    filterDropdownRow: {
      background: '#fff',
      borderRadius: '0 0 0 2px',
      padding: '5px 12px',
    },
    resultsCount: {
      fontWeight: 'bold',
      color: '#979797',
      fontSize: '14px',
      margin: '0 12px',
      flexShrink: 0,
    },
    filterName: {
      flexShrink: '0',
    },
  };

  handleFilterSelect = (itemName) => {
    this.setState(
      {
        pendingFilter: this.getSearchableAttributes().find(
          (filter) => this.getLabel(filter) === itemName
        ),
        autocompleteValue: '',
      },
      this.props.focusSearchInputElement
    );
  };

  matchFilterToTerm = (state, value) =>
    this.getLabel(state)
      .toLowerCase()
      .indexOf(value.toLowerCase()) !== -1;

  clearContactSearchForm = () => {
    this.setState({
      pendingFilter: false,
      pendingFilterValue: '',
      autocompleteValue: '',
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.pendingFilter) {
      if (this.state.pendingFilterValue.length) {
        this.props.addFilter(
          this.state.pendingFilter.objectName,
          this.state.pendingFilterValue
        );
        this.clearContactSearchForm();
        this.props.setSearchPending(false); // Set to false to reset a possible failed state
      }
    } else if (this.state.autocompleteValue.length > 0) {
      this.props.addFilter('q', this.state.autocompleteValue);
      this.clearContactSearchForm();
      this.props.setSearchPending(false); // Set to false to reset a possible failed state
    }
    return false;
  };

  cancel = () => {
    if (this.props.searchPending !== true) {
      this.props.removeSearchFilter();
      this.props.setSearchPending(false); // Set to false to reset a possible failed state
      if (
        this.props.selectedInteraction.contact !== undefined &&
        this.props.selectedInteraction.contact.id !== undefined
      ) {
        this.props.setContactMode(
          this.props.selectedInteraction.interactionId,
          'view'
        );
      } else {
        this.clearContactSearchForm();
      }
    }
  };

  getResultsCountText = () => {
    let resultsCountText;
    if (this.props.resultsCount === 1) {
      resultsCountText = <FormattedMessage {...messages.result} />;
    } else if (this.props.resultsCount !== -1) {
      resultsCountText = (
        <FormattedMessage
          {...messages.results}
          values={{ count: String(this.props.resultsCount) }}
        />
      );
    }
    return resultsCountText;
  };

  setinputDivElement = (element) => {
    this.inputDivElement = element;
  };

  render() {
    const hideDisplayClearBtn =
      this.state.autocompleteValue.length > 0 || this.state.pendingFilter;

    return (
      <form id="search-form" onSubmit={this.handleSubmit}>
        <div id="contactSearchBar" style={[this.styles.base, this.props.style]}>
          <div ref={this.setinputDivElement} style={this.styles.inputBox}>
            {this.state.pendingFilter ? (
              <span style={this.styles.inputWrapper}>
                <span style={this.styles.filterName}>
                  {`${this.getLabel(this.state.pendingFilter)}:`}
                  &nbsp;
                </span>
                <TextInput
                  id="search-filter-input"
                  noBorder
                  onKeyDown={this.handleFilterValueInputKey}
                  style={[this.styles.input, this.styles.pendingFilterInput]}
                  cb={(pendingFilterValue) =>
                    this.setState({ pendingFilterValue })}
                  value={this.state.pendingFilterValue}
                  handleInputRef={this.props.setSearchInputElement}
                />
              </span>
            ) : (
              <Autocomplete
                value={this.state.autocompleteValue}
                items={this.getAvailableFilters()}
                renderItem={this.createDropdownItem}
                getItemValue={this.getLabel}
                shouldItemRender={this.matchFilterToTerm}
                onChange={(event, value) =>
                  this.setState({ autocompleteValue: value })}
                onSelect={this.handleFilterSelect}
                inputProps={{
                  style: this.styles.input,
                }}
                wrapperStyle={this.styles.inputWrapper}
                menuStyle={{
                  ...this.styles.filterDropdown,
                  width: `${this.state.filterMenuWidth}px`,
                }}
                ref={this.props.setSearchInputElement}
              />
            )}
            <div style={this.styles.resultsCount}>
              {this.getResultsCountText()}
            </div>

            {hideDisplayClearBtn && (
              <Button
                id="exit-search-btn"
                style={this.styles.closeButton}
                iconName="close"
                type="secondary"
                onClick={this.cancel}
              />
            )}
          </div>
        </div>
      </form>
    );
  }
}

ContactSearchBar.propTypes = {
  intl: PropTypes.object.isRequired,
  query: PropTypes.array,
  style: PropTypes.object,
  resultsCount: PropTypes.number,
  addFilter: PropTypes.func.isRequired,
  selectedInteraction: PropTypes.object.isRequired,
  setSearchInputElement: PropTypes.func.isRequired,
  focusSearchInputElement: PropTypes.func.isRequired,
  searchableAttributes: PropTypes.array,
  removeSearchFilter: PropTypes.func.isRequired,
  setContactMode: PropTypes.func.isRequired,
  setSearchPending: PropTypes.func.isRequired,
  searchPending: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

function mapStateToProps(state, props) {
  return {
    searchableAttributes: selectSearchableAttributes(state, props),
    searchPending: selectSearchPending(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addFilter: (filterName, value) =>
      dispatch(addSearchFilter(filterName, value)),
    removeSearchFilter: (filter) => dispatch(removeSearchFilter(filter)),
    setContactMode: (interactionId, newMode) =>
      dispatch(setContactMode(interactionId, newMode)),
    setSearchPending: (pending) => dispatch(setSearchPending(pending)),
    dispatch,
  };
}

export default ErrorBoundary(
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(Radium(ContactSearchBar))
  )
);
