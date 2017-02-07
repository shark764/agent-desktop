/*
 *
 * ContactSearchBar
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { injectIntl } from 'react-intl';
import Autocomplete from 'react-autocomplete';

import { selectQuery, selectSearchableAttributes } from './selectors';

import search from 'assets/icons/search.png';

import Button from 'components/Button';
import TextInput from 'components/TextInput';

export class ContactSearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      pendingFilter: false,
      pendingFilterValue: '',
      autocompleteValue: '',
      filterMenuWidth: 0,
      filterMenuRightOffset: 0,
    };

    this.setSearchTerm = this.setSearchTerm.bind(this);
    this.handleFilterValueInputKey = this.handleFilterValueInputKey.bind(this);
    this.handleFilterSelect = this.handleFilterSelect.bind(this);
    this.createDropdownItem = this.createDropdownItem.bind(this);
    this.resizeFilterDropdownMenu = this.resizeFilterDropdownMenu.bind(this);
    this.matchFilterToTerm = this.matchFilterToTerm.bind(this);
    this.getItemValue = this.getItemValue.bind(this);
  }

  componentDidMount() {
    this.resizeFilterDropdownMenu();
  }

  componentDidUpdate() {
    this.resizeFilterDropdownMenu();
  }

  getAvailableFilters() {
    if (this.props.query.length && this.props.query[0].id === 'all') {
      // Don't show other filters when 'all' is selected
      return [];
    } else {
      return this.props.searchableAttributes.filter(
        (possibleFilter) => this.props.query.findIndex(
          (searchFilter) => searchFilter.label[this.props.intl.locale] === possibleFilter.label[this.props.intl.locale]
        ) === -1
      );
    }
  }

  setSearchTerm(searchTerm) {
    this.setState({ searchTerm });
  }

  getItemValue(item) {
    return item.label[this.props.intl.locale];
  }

  resizeFilterDropdownMenu() {
    const newInputDivWidth = this.inputDiv.offsetWidth;
    if (newInputDivWidth !== this.state.filterMenuWidth) {
      this.setState({ // eslint-disable-line react/no-did-mount-set-state
        filterMenuWidth: newInputDivWidth,
      });
    }
  }

  handleFilterValueInputKey(event) {
    switch (event.key) {
      case 'Backspace':
        if (!this.state.pendingFilterValue.length) {
          this.setState({
            pendingFilter: false,
          });
        }
        break;
      case 'Enter':
        if (this.state.pendingFilterValue.length) {
          this.props.addFilter({ ...this.state.pendingFilter, value: this.state.pendingFilterValue });
          this.setState({
            pendingFilter: false,
            pendingFilterValue: '',
            autocompleteValue: '',
          });
        }
        break;
      default:
        break;
    }
  }

  createDropdownItem(item, isHighlighted) {
    return (
      <div
        key={item.id}
        style={Object.assign({}, this.styles.filterDropdownRow, isHighlighted ? this.styles.highlightedFilter : {})}
      >{item.label[this.props.intl.locale]}</div>
    );
  }

  styles = {
    base: {
      display: 'flex',
      alignItems: 'center',
    },
    inputBox: {
      backgroundColor: '#ffffff',
      backgroundImage: `url(${search})`,
      backgroundPosition: '10px 10px',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '16px',
      padding: '3px 0 3px 40px',
      height: '36px',
      borderRadius: '2px 0 0 3px',
      border: 'solid 1px #979797',
      ':focus': {
        boxShadow: '0 0 6px 1px rgba(0, 0, 0, 0.12)',
        border: 'solid 1px #23CEF5',
      },
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
      ':focus': {
        outline: 'none',
      },
    },
    pendingFilterInput: {
      padding: '11px 11px 11px 0',
    },
    closeButton: {
      margin: '0',
      alignSelf: 'auto',
      borderTop: '1px solid #979797',
      borderRight: '1px solid #979797',
      borderBottom: '1px solid #979797',
      borderLeft: '0',
      borderRadius: '0 2px 2px 0',
      order: '1',
      flex: '0 0 auto',
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
    },
    filterDropdown: {
      left: '',
      right: '92px',
      position: 'fixed',
      background: '#FFFFFF',
      borderRadius: '0 0 0 2px',
      border: '1px solid #E4E4E4',
      borderTop: 'none',
      padding: '10px 0 10px 0',
      margin: '4px 0 0 0',
      zIndex: '10',
    },
    filterDropdownRow: {
      background: '#FFFFFF',
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
  };

  handleFilterSelect(itemFull) {
    this.setState({
      pendingFilter: this.props.searchableAttributes.find((filter) => filter.label[this.props.intl.locale] === itemFull),
      autoCompleteValue: '',
    });
  }

  matchFilterToTerm(state, value) {
    return (
      state.label[this.props.intl.locale].toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  render() {
    return (
      <div style={[this.styles.base, this.props.style]}>
        <div ref={(element) => { this.inputDiv = element; }} style={this.styles.inputBox}>
          {
            this.state.pendingFilter ?
              <span style={this.styles.inputWrapper}>
                <span style={this.styles.filterName}>{`${this.state.pendingFilter.label[this.props.intl.locale]}:`}&nbsp;</span>
                <TextInput id="search-filter-input" noBorder autoFocus onKeyDown={this.handleFilterValueInputKey} style={[this.styles.input, this.styles.pendingFilterInput]} cb={(pendingFilterValue) => this.setState({ pendingFilterValue })} value={this.state.pendingFilterValue} />
              </span>
            :
              <Autocomplete
                id="search-filter-autocomplete"
                value={this.state.autocompleteValue}
                items={this.getAvailableFilters()}
                renderItem={this.createDropdownItem}
                getItemValue={this.getItemValue}
                shouldItemRender={this.matchFilterToTerm}
                onChange={(event, value) => this.setState({ autocompleteValue: value })}
                onSelect={this.handleFilterSelect}
                inputProps={{ style: this.styles.input }}
                wrapperStyle={this.styles.inputWrapper}
                menuStyle={{ ...this.styles.filterDropdown, width: `${this.state.filterMenuWidth}px` }}
              />
          }
          { this.props.resultsCount > -1 ? <div style={this.styles.resultsCount}>{`${this.props.resultsCount} Result(s)`}</div> : '' }
        </div>
        <Button id="exit-search-btn" style={this.styles.closeButton} iconName="close" type="secondary" onClick={this.props.setNotSearching} />
      </div>
    );
  }
}

ContactSearchBar.propTypes = {
  intl: React.PropTypes.object.isRequired,
  addFilter: React.PropTypes.func.isRequired,
  setNotSearching: React.PropTypes.func.isRequired,
  query: React.PropTypes.array,
  searchableAttributes: React.PropTypes.array,
  style: React.PropTypes.object,
  resultsCount: React.PropTypes.number,
};

const mapStateToProps = (state, props) => ({
  query: selectQuery(state, props),
  searchableAttributes: selectSearchableAttributes(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(ContactSearchBar)));
