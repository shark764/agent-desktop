/*
 *
 * ContactsControl
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Radium from 'radium';

import selectContactsControl, { selectSelectedInteraction } from './selectors';
import { addSearchFilter, removeSearchFilter, setSearchResults, setLoading } from './actions';

import Button from 'components/Button';
import Icon from 'components/Icon';
import ContactSearchBar from 'containers/ContactSearchBar';
import Contact from 'containers/Contact';

const controlHeaderHeight = 70;

export class ContactsControl extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      isSearching: false,
    };

    this.setSearching = this.setSearching.bind(this);
    this.setNotSearching = this.setNotSearching.bind(this);
    this.beginSearch = this.beginSearch.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.renderContact = this.renderContact.bind(this);
  }

  componentDidUpdate() {
    if (this.props.query.length && !this.props.results && !this.props.loading) {
      this.beginSearch();
    }
  }

  setSearching() {
    this.setState({
      isSearching: true,
    });
  }

  setNotSearching() {
    this.setState({
      isSearching: false,
    });
  }

  beginSearch() {
    // SDK trigger search
    // this.props.setLoading();
  }

  styles = {
    flexParent: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'no-wrap',
      justifyContent: 'flex-end',
      alignContent: 'center',
      alignItems: 'stretch',
    },
    flexChildGrow: {
      order: '0',
      flex: '1 0 auto',
      alignSelf: 'auto',
    },
    flexChildShrink: {
      order: '0',
      flex: '0 1 auto',
      alignSelf: 'auto',
    },
    flexChildStatic: {
      order: '0',
      flex: '0 0 auto',
      alignSelf: 'auto',
    },
    leftButton: {
      margin: '0 11px',
    },
    rightButton: {
      float: 'right',
      margin: '0',
    },
    controlHeader: {
      height: `${controlHeaderHeight}px`,
      justifyContent: 'center',
    },
    resultsPlaceholder: {
      width: '375px',
      color: '#979797',
      alignItems: 'center',
      justifyContent: 'center',
    },
    resultsPlaceholderBold: {
      paddingLeft: '15px',
      fontWeight: 'bold',
      alignItems: 'center',
    },
    contacts: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonSet: {
      alignSelf: 'flex-end',
    },
  };

  renderResults() {
    return this.props.results ?
        '' /** TODO: search results **/
      :
        (
          <div id="results-placeholder" style={[this.styles.flexParent, this.styles.flexChildGrow, this.styles.resultsPlaceholder]}>
            <div style={[this.styles.flexChildShrink, { paddingBottom: '8px' }]}>
              <Icon name="search" />
              <span style={this.styles.resultsPlaceholderBold}>
                <FormattedMessage {...messages.searchText} />
              </span>
            </div>
            <div style={[this.styles.flexChildShrink, { textAlign: 'center' }]}>
              <FormattedMessage {...messages.filtersList} />
            </div>
            <div style={{ height: '100px' }}></div> {/* TODO: OR create contact button */}
          </div>
        );
  }

  renderContact() {
    return this.props.selectedInteraction.contact ?
      <Contact style={[this.styles.flexChildGrow, { alignSelf: 'stretch' }]} contact={this.props.selectedInteraction.contact} />
      :
      ''; // TODO: loading animation
  }

  render() {
    return (
      <div style={[this.props.style, this.styles.flexParent, { height: '100%' }]}>
        <div style={[this.styles.flexParent, this.styles.controlHeader, this.styles.flexChildStatic]}>
          {
            this.state.isSearching ?
              <ContactSearchBar addFilter={this.props.addSearchFilter} removeFilter={this.props.removeSearchFilter} style={this.styles.flexChildStatic} setNotSearching={this.setNotSearching}> </ContactSearchBar>
              :
                <span style={[this.styles.flexChildShrink, this.styles.buttonSet]}>
                  {/* <Button id="contact-edit-btn" style={this.styles.leftButton} text={messages.edit} type="secondary" /> */}
                  <Button id="contact-search-btn" style={this.styles.rightButton} onClick={this.setSearching} iconName="search" type="secondary" />
                </span>
          }
        </div>
        <div style={[this.styles.flexParent, this.styles.flexChildGrow, this.styles.contacts]}>
          {
            this.state.isSearching ?
                this.renderResults()
              :
                this.renderContact()
          }
        </div>
      </div>
    );
  }
}

ContactsControl.propTypes = {
  style: React.PropTypes.object,
  query: React.PropTypes.array,
  loading: React.PropTypes.bool,
  results: React.PropTypes.any,
  addSearchFilter: React.PropTypes.func,
  selectedInteraction: React.PropTypes.object,
  removeSearchFilter: React.PropTypes.func,
};

function mapStateToProps(state, props) {
  return {
    selectedInteraction: selectSelectedInteraction(state, props),
    ...selectContactsControl(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addSearchFilter: (filter) => dispatch(addSearchFilter(filter)),
    removeSearchFilter: (filter) => dispatch(removeSearchFilter(filter)),
    setSearchResults: (filter) => dispatch(setSearchResults(filter)),
    setLoading: () => dispatch(setLoading()),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(ContactsControl));
