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
import InfiniteScroll from 'react-infinite-scroller';

import selectContactsControl, { selectSelectedInteraction } from './selectors';
import { addSearchFilter, removeSearchFilter, setSearchResults } from './actions';

import Button from 'components/Button';
import Filter from 'components/Filter';
import Icon from 'components/Icon';
import ContactSearchResult from 'containers/ContactSearchResult';
import ContactSearchBar from 'containers/ContactSearchBar';
import Contact from 'containers/Contact';

const controlHeaderHeight = 70;
const resultsPlaceholderWidth = 330;

export class ContactsControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      action: 'view',
      tempContact: false,
    };

    this.setSearching = this.setSearching.bind(this);
    this.setViewing = this.setViewing.bind(this);
    this.setSearching = this.setSearching.bind(this);
    this.searchContacts = this.searchContacts.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.renderContactView = this.renderContactView.bind(this);
    this.setCreating = this.setCreating.bind(this);
    this.getBannerHeader = this.getBannerHeader.bind(this);
    this.getViewControlHeader = this.getViewControlHeader.bind(this);
    this.getSearchControlHeader = this.getSearchControlHeader.bind(this);
    this.getHeader = this.getHeader.bind(this);
    this.createContact = this.createContact.bind(this);
  }

  componentDidMount() {
    SDK.subscribe('cxengage/contacts/search-response', (error, topic, response) => {
      console.log('[ContactsControl] SDK.subscribe()', topic, response);
      this.props.setSearchResults(response);
    });
  }

  setSearching() {
    this.setState({
      action: 'search',
    });
  }

  setCreating() {
    this.setState({
      action: 'creating',
    });
  }

  setViewing() {
    this.setState({
      action: 'view',
    });
  }

  getSearchControlHeader() {
    return (
      <div style={this.styles.controlHeader}>
        <ContactSearchBar resultsCount={this.props.resultsCount !== undefined ? this.props.resultsCount : -1} addFilter={this.props.addSearchFilter} setNotSearching={this.setViewing} style={this.styles.contactSearchBar} />
        <div style={this.styles.filtersWrapper}>
          { this.props.query.map((filter) => <Filter key={filter.id} filter={filter} remove={this.props.removeSearchFilter} style={this.styles.filter} />) }
        </div>
      </div>
    );
  }

  getViewControlHeader() {
    return (
      <div style={this.styles.controlHeader}>
        <div style={this.styles.buttonSet}>
          {/* <Button id="contact-edit-btn" style={this.styles.leftButton} onClick={this.setCreating} text={messages.edit} type="secondary" /> */}
          <Button id="contact-search-btn" style={this.styles.rightButton} onClick={this.setSearching} iconName="search" type="secondary" />
        </div>
      </div>
    );
  }

  getBannerHeader(text) {
    return (
      <div style={this.styles.bannerHeader}>
        <div style={this.styles.leftGutter}></div>
        <div style={this.styles.bannerHeaderText}>
          {text}
        </div>
      </div>
    );
  }

  getHeader() {
    switch (this.state.action) {
      case 'view':
        return this.getViewControlHeader();
      case 'creating':
        return this.getBannerHeader('New Customer Record');
      case 'search':
      default:
        return this.getSearchControlHeader();
    }
  }

  getMainContent() {
    switch (this.state.action) {
      case 'view':
        return this.renderContactView();
      case 'creating':
        return <Contact save={this.createContact} cancel={this.setSearching} style={this.styles.mainContact} contactAttributes={this.state.tempContact ? this.state.tempContact.attributes : {}} isEditing />;
      case 'search':
      default:
        return this.renderResults();
    }
  }

  searchContacts() {
    const sdkQuery = {};
    this.props.query.forEach((queryItem) => {
      sdkQuery[queryItem.objectName] = queryItem.value;
    });
    sdkQuery.page = this.props.nextPage;
    SDK.contacts.search({ query: sdkQuery });
  }

  styles = {
    base: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    controlHeader: {
      minHeight: `${controlHeaderHeight}px`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      flexShrink: '0',
    },
    contactSearchBar: {
      paddingTop: '19px',
    },
    filtersWrapper: {
      minHeight: '65px',
      display: 'flex',
      padding: '11.5px 0',
      overflowX: 'auto',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    filter: {
      margin: '5px 5px 5px 0',
    },
    leftButton: {
      margin: '0 11px',
    },
    rightButton: {
      float: 'right',
      margin: '0',
    },
    resultsPlaceholder: {
      color: '#979797',
      display: 'flex',
      marginTop: '100px',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mainContact: {
      marginTop: '8px',
      alignSelf: 'stretch',
      flexGrow: '1',
      flexShrink: '0',
    },
    results: {
      height: '100%',
      alignItems: 'stretch',
    },
    resultsPlaceholderBold: {
      paddingLeft: '15px',
      fontWeight: 'bold',
      alignItems: 'center',
    },
    filtersListText: {
      textAlign: 'center',
    },
    contacts: {
      overflowY: 'auto',
      boxSizing: 'content-box',
      flexGrow: '1',
      flexShrink: '1',
    },
    buttonSet: {
      alignSelf: 'flex-end',
      flexGrow: '0',
      flexShrink: '1',
    },
    contactResult: {
      marginBottom: '14px',
      alignSelf: 'stretch',
      flexGrow: '1',
      flexShrink: '1',
    },
    resultsPlaceholderTitle: {
      paddingBottom: '8px',
      display: 'flex',
      alignItems: 'center',
    },
    filtersList: {
      textAlign: 'center',
      maxWidth: `${resultsPlaceholderWidth}px`,
    },
    bannerHeader: {
      backgroundColor: '#DEF8FE',
      width: 'calc(100% + 76px)',
      height: '70px',
      position: 'relative',
      left: '-51px',
      display: 'flex',
      alignItems: 'stretch',
    },
    bannerHeaderText: {
      fontWeight: 'bold',
      alignSelf: 'center',
    },
    leftGutter: {
      width: '52px',
    },
  };

  createContact(contact) {
    SDK.contacts.create(contact);
    this.setViewing();
  }

  renderResults() {
    let results;
    if (this.props.query.length) {
      const resultsMapped = this.props.results.map((contact) => <ContactSearchResult style={this.styles.contactResult} key={contact.id} contact={contact} />);
      results = (
        <InfiniteScroll
          loadMore={this.searchContacts}
          hasMore={this.props.resultsCount === undefined || this.props.results.length < this.props.resultsCount}
          loader={<div className="loader"><FormattedMessage {...messages.loading} /></div>}
          useWindow={false}
        >
          { resultsMapped }
        </InfiniteScroll>
      );
    } else {
      results = (
        <div id="results-placeholder" style={this.styles.resultsPlaceholder}>
          <div style={this.styles.resultsPlaceholderTitle}>
            <Icon name="search" />
            <div style={this.styles.resultsPlaceholderBold}>
              <FormattedMessage {...messages.searchText} />
            </div>
          </div>
          <div style={this.styles.filtersList}>
            <FormattedMessage {...messages.filtersList} />
          </div>
          <div style={{ margin: '5px 0' }}>
            <FormattedMessage {...messages.or} />
          </div>
          <Button id="createNewRecord" type="secondary" text="Create New Record" onClick={this.setCreating}></Button>
        </div>
      );
    }
    return results;
  }

  renderContactView() {
    return this.props.selectedInteraction.contact ?
      <Contact style={this.styles.mainContact} contactAttributes={this.props.selectedInteraction.contact.attributes} />
      :
      ''; // TODO: loading animation
  }

  render() {
    return (
      <div key={this.props.key} style={[this.props.style, this.styles.base]}>
        { this.getHeader() }
        <div style={[this.styles.contacts]}>
          { this.getMainContent() }
        </div>
      </div>
    );
  }
}

ContactsControl.propTypes = {
  style: React.PropTypes.object,
  key: React.PropTypes.any,
  query: React.PropTypes.array,
  nextPage: React.PropTypes.number,
  resultsCount: React.PropTypes.number,
  results: React.PropTypes.any,
  addSearchFilter: React.PropTypes.func,
  removeSearchFilter: React.PropTypes.func,
  setSearchResults: React.PropTypes.func,
  selectedInteraction: React.PropTypes.object,
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
    setSearchResults: (response) => dispatch(setSearchResults(response)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(ContactsControl));
