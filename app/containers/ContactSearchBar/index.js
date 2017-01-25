/*
 *
 * ContactSearchBar
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import Autocomplete from 'react-autocomplete';

import { selectQuery } from './selectors';

import search from 'assets/icons/search.png';

import Button from 'components/Button';
import TextInput from 'components/TextInput';
import Icon from 'components/Icon';

export class ContactSearchBar extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
    this.createFilter = this.createFilter.bind(this);
    this.handleFilterValueInputKey = this.handleFilterValueInputKey.bind(this);
    this.handleFilterSelect = this.handleFilterSelect.bind(this);
    this.createDropdownItem = this.createDropdownItem.bind(this);
    this.resizeFilterDropdownMenu = this.resizeFilterDropdownMenu.bind(this);
  }

  componentDidMount() {
    this.resizeFilterDropdownMenu();
  }

  componentDidUpdate() {
    this.resizeFilterDropdownMenu();
  }

  getAvailableFilters() {
    return this.allFilters.filter(
      (possibleFilter) => this.props.query.findIndex(
        (searchFilter) => searchFilter.full === possibleFilter.full
      ) === -1
    );
  }

  setSearchTerm(searchTerm) {
    this.setState({ searchTerm });
  }

  getItemValue(item) {
    return item.full;
  }

  getFilterDropdownStyle() {
    return { ...this.styles.filterDropdown, width: `${this.state.filterMenuWidth}px` };
  }

  createFilter(filter) {
    const handleRemoveClick = () => this.props.removeFilter(filter);

    return (
      <div key={filter.full} style={[this.styles.searchFilter, this.styles.flexChildFixed, this.styles.flexContainer]}>
        <span style={[this.styles.filterName, this.styles.flexChildFixed]}>{`${filter.short}:`}&nbsp;</span>
        <span style={this.styles.flexChildFixed}>{filter.value}</span>
        <Icon name="close" onclick={handleRemoveClick} style={[this.styles.deleteFilterIcon, this.styles.flexChildFixed]}></Icon>
      </div>
    );
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
        key={item.short}
        style={Object.assign({}, this.styles.filterDropdownRow, isHighlighted ? this.styles.highlightedFilter : {})}
      >{item.full}</div>
    );
  }

  allFilters = [
    {
      short: 'Name',
      full: 'Name',
      sdkName: 'name',
    },
    {
      short: 'Email',
      full: 'Email Address',
      sdkName: 'email',
    },
    {
      short: 'Address',
      full: 'Mailing Address',
      sdkName: 'address',
    },
    {
      short: 'Phone',
      full: 'Phone Number',
      sdkName: 'phone',
    },
    {
      short: 'Org',
      full: 'Organization',
      sdkName: 'organization',
    },
    {
      short: 'Cust #',
      full: 'Customer Number',
      sdkName: 'customer',
    },
  ];

  styles = {
    flexContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    flexChildFixed: {
      flex: '0 0 auto',
    },
    flexChildGrow: {
      flex: '1 0 auto',
    },
    inputBox: {
      backgroundColor: '#ffffff',
      backgroundImage: `url(${search})`,
      backgroundPosition: '10px 10px',
      backgroundRepeat: 'no-repeat',
      padding: '3px 0 3px 40px',
      height: '36px',
      borderRadius: '2px 0 0 3px',
      border: 'solid 1px #979797',
      ':focus': {
        boxShadow: '0 0 6px 1px rgba(0, 0, 0, 0.12)',
        border: 'solid 1px #23CEF5',
      },
      maxWidth: '100%',
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
      order: '1',
      flex: '0 0 auto',
      alignSelf: 'auto',
      borderTop: '1px solid #979797',
      borderRight: '1px solid #979797',
      borderBottom: '1px solid #979797',
      borderLeft: '0',
      borderRadius: '0 2px 2px 0',
    },
    searchFilter: {
      background: '#DEF8FE',
      paddingLeft: '10px',
      marginRight: '10px',
      height: '100%',
    },
    filterName: {
      fontWeight: 'bold',
    },
    deleteFilterIcon: {
      margin: '0 10px',
      cursor: 'pointer',
    },
    highlightedFilter: {
      background: '#E4E4E4',
    },
    inputWrapper: {
      height: '100%',
      paddingLeft: '0',
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
    },
    filterDropdownRow: {
      background: '#FFFFFF',
      borderRadius: '0 0 0 2px',
      padding: '5px 12px',
    },
  };

  handleFilterSelect(itemFull) {
    this.setState({
      pendingFilter: this.allFilters.find((filter) => filter.full === itemFull),
      autoCompleteValue: '',
    });
  }

  matchFilterToTerm(state, value) {
    return (
      state.short.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
      state.full.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  render() {
    return (
      <div style={[this.styles.flexContainer, this.props.style]}>
        <div ref={(element) => { this.inputDiv = element; }} style={[this.styles.inputBox, this.styles.flexContainer, this.styles.flexChildGrow]}>
          {this.props.query.map(this.createFilter, this)}
          {
            this.state.pendingFilter ?
              <span style={[this.styles.flexChildGrow, this.styles.flexContainer, this.styles.inputWrapper]}>
                <span style={[this.styles.filterName, this.styles.flexChildFixed]}>{`${this.state.pendingFilter.short}:`}&nbsp;</span>
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
                wrapperStyle={{ ...this.styles.flexChildGrow, ...this.styles.inputWrapper }}
                menuStyle={this.getFilterDropdownStyle()}
              />
          }
        </div>
        <Button id="exit-search-btn" style={[this.styles.closeButton, this.styles.flexChildFixed]} iconName="close" type="secondary" onClick={this.props.setNotSearching} />
      </div>
    );
  }
}

ContactSearchBar.propTypes = {
  addFilter: React.PropTypes.func.isRequired,
  removeFilter: React.PropTypes.func.isRequired,
  setNotSearching: React.PropTypes.func.isRequired,
  query: React.PropTypes.array,
  style: React.PropTypes.object,
};

const mapStateToProps = (state, props) => ({
  query: selectQuery(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(ContactSearchBar));