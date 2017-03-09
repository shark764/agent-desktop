/*
 *
 * ContactsControl
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Radium from 'radium';
import InfiniteScroll from 'react-infinite-scroller';

import ErrorBanner from 'components/ErrorBanner';
import IconSVG from 'components/IconSVG';
import Button from 'components/Button';
import Filter from 'components/Filter';
import Icon from 'components/Icon';
import ContactSearchResult from 'containers/ContactSearchResult';
import ContactSearchBar from 'containers/ContactSearchBar';
import Contact from 'containers/Contact';

import messages from './messages';
import selectContactsControl, { selectCurrentInteraction, selectAttributes } from './selectors';
import { setSearchResults, clearSearchResults } from './actions';
import { assignContact } from '../AgentDesktop/actions';

const controlHeaderHeight = 70;
const resultsPlaceholderWidth = 330;

export class ContactsControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nextErrorId: 0,
      query: this.expandQuery(this.props.selectedInteraction.query, this.props.attributes),
      loading: false,
      isEditing: false,
      unassignedContactEditing: {},
      errors: [],
    };

    this.setSearching = this.setSearching.bind(this);
    this.setViewing = this.setViewing.bind(this);
    this.setSearching = this.setSearching.bind(this);
    this.searchContacts = this.searchContacts.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.renderContactView = this.renderContactView.bind(this);
    this.editUnassignedContact = this.editUnassignedContact.bind(this);
    this.editAssignedContact = this.editAssignedContact.bind(this);
    this.newContact = this.newContact.bind(this);
    this.getBannerHeader = this.getBannerHeader.bind(this);
    this.getViewControlHeader = this.getViewControlHeader.bind(this);
    this.getSearchControlHeader = this.getSearchControlHeader.bind(this);
    this.getHeader = this.getHeader.bind(this);
    this.addFilter = this.addFilter.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.setNotEditing = this.setNotEditing.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.saveCallback = this.saveCallback.bind(this);
    this.assignContactToSelected = this.assignContactToSelected.bind(this);
    this.dismissError = this.dismissError.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const querySizeChanged = Object.keys(nextProps.selectedInteraction.query).length !== Object.keys(this.props.selectedInteraction.query).length;
    const interactionChanged = (nextProps.selectedInteraction.interactionId !== this.props.selectedInteraction.interactionId);
    if (querySizeChanged || interactionChanged) {
      this.props.clearSearchResults();
      this.setState({ query: this.expandQuery(nextProps.selectedInteraction.query, nextProps.attributes) });
    }
    if (interactionChanged && this.state.isEditing) {
      this.setNotEditing();
    }
  }

  componentWillUnmount() {
    this.props.clearSearchResults();
  }

  expandQuery(query, attributes) {
    return Object.keys(query).map((filterName) => {
      let attribute;
      if (filterName === 'q') {
        attribute = {
          id: 'all',
          label: {
            'en-US': 'All',
          },
          objectName: 'q', // Fuzzy search query parameter
        };
      } else {
        attribute = attributes.find((fullAttribute) => fullAttribute.objectName === filterName);
      }
      const label = attribute.label[this.props.intl.locale] || filterName;
      return (attribute)
        ? { attribute, value: query[filterName], label }
        : false;
    }).filter(Boolean);
  }

  removeFilter(filterName) {
    this.props.clearSearchResults();
    this.props.removeSearchFilter(filterName);
  }

  addFilter(filterName, value) {
    this.props.clearSearchResults();
    this.props.addSearchFilter(filterName, value);
  }

  setSearching() {
    this.props.setContactAction(this.props.selectedInteraction.interactionId, 'search');
  }

  editUnassignedContact(contact) {
    this.setState({ isEditing: true, unassignedContactEditing: contact });
  }

  newContact() {
    this.setState({ isEditing: true, unassignedContactEditing: {} });
  }

  editAssignedContact() {
    this.setState({ isEditing: true, unassignedContactEditing: {} });
  }

  setViewing() {
    this.props.setContactAction(this.props.selectedInteraction.interactionId, 'view');
  }

  clearSearch() {
    this.removeFilter();
    if (this.props.selectedInteraction.contact !== undefined) {
      this.setViewing();
    }
  }

  setNotEditing() {
    this.setState({ isEditing: false, unassignedContactEditing: {} });
  }

  getSearchControlHeader() {
    return (
      <div style={this.styles.controlHeader}>
        <ContactSearchBar
          resultsCount={this.props.resultsCount !== undefined ? this.props.resultsCount : -1}
          addFilter={this.addFilter}
          cancel={this.clearSearch}
          query={this.state.query}
          style={this.styles.contactSearchBar}
        />
        <div style={this.styles.filtersWrapper}>
          {this.state.query.map((filter) =>
            <Filter
              key={filter.attribute.objectName}
              name={filter.label}
              value={filter.value}
              remove={() => this.removeFilter(filter.attribute.objectName)}
              style={this.styles.filter}
            />
          )}
        </div>
      </div>
    );
  }

  getViewControlHeader() {
    return (
      <div style={this.styles.controlHeader}>
        <div style={this.styles.buttonSet}>
          <Button id="contact-edit-btn" style={this.styles.leftButton} onClick={this.editAssignedContact} text={messages.edit} type="secondary" />
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
    switch (this.props.selectedInteraction.contactAction) {
      case 'view':
        if (this.state.isEditing) {
          return this.getBannerHeader(<FormattedMessage {...messages.contactEditingBanner} />);
        }
        return this.getViewControlHeader();
      case 'search':
      default:
        if (this.state.isEditing) {
          if (Object.keys(this.state.unassignedContactEditing).length === 0) {
            return this.getBannerHeader(<FormattedMessage {...messages.newContactBanner} />);
          } else {
            return this.getBannerHeader(<FormattedMessage {...messages.contactEditingBanner} />);
          }
        }
        return this.getSearchControlHeader();
    }
  }

  getMainContent() {
    switch (this.props.selectedInteraction.contactAction) {
      case 'view':
        return this.renderContactView();
      case 'search':
      default:
        if (this.state.isEditing) {
          return (<Contact
            save={this.handleSave}
            cancel={this.setNotEditing}
            style={this.styles.mainContact}
            isEditing={this.state.isEditing}
            contact={this.state.unassignedContactEditing}
          />);
        }
        return this.renderResults();
    }
  }

  searchContacts() {
    if (!this.state.loading) {
      this.setState({ loading: true });
      const encodedQuery = {};
      Object.keys(this.props.selectedInteraction.query).forEach((queryName) => {
        encodedQuery[queryName] = encodeURIComponent(this.props.selectedInteraction.query[queryName]);
      });
      SDK.contacts.search({ query: Object.assign(encodedQuery, { page: this.props.nextPage }) }, (error, topic, response) => {
        console.log('[ContactsControl] SDK.subscribe()', topic, response);
        this.props.setSearchResults(response);
        this.setState({ loading: false });
      });
    }
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
      paddingRight: '5px',
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
      flexShrink: 0,
    },
    bannerHeaderText: {
      fontWeight: 'bold',
      alignSelf: 'center',
    },
    leftGutter: {
      width: '52px',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
    },
    loadingIcon: {
      height: '60px',
    },
  };

  saveCallback(error, topic, response) {
    console.log('[ContactsControl] SDK.subscribe()', topic, response);
    this.setState({ loading: false });
    if (error) {
      const type = 'server'; // TODO: when errors are ready, get error from response?
      this.setState({
        errors: [...this.state.errors, { type, messageType: 'notSaved', id: this.state.nextErrorId }],
        nextErrorId: this.state.nextErrorId + 1,
      });
      console.error(error);
    } else {
      this.props.clearSearchResults();
      this.setNotEditing();
    }
  }

  dismissError(index) {
    this.setState({ errors: [...this.state.errors.splice(1, index)] });
  }

  handleSave(attributes, contactId) {
    this.setState({ loading: true });
    if (contactId) {
      SDK.contacts.update({ contactId, attributes }, this.saveCallback);
    } else {
      SDK.contacts.create({ attributes }, this.saveCallback);
    }
  }

  assignContactToSelected(contact) {
    this.props.assignContact(this.props.selectedInteraction.interactionId, contact);
  }

  getLoader() {
    return (
      <div id="loadingContainer" style={this.styles.loading}>
        <IconSVG style={this.loadingIcon} id="loadingIcon" name="loading" />
      </div>
    );
  }

  renderResults() {
    const results = [];
    if (this.props.selectedInteraction.query && Object.keys(this.props.selectedInteraction.query).length) {
      const resultsMapped = this.props.results.map(
        (contact, index) =>
          <ContactSearchResult
            style={this.styles.contactResult}
            key={contact.id}
            id={`contactSearchResult-${index}`}
            isAssigned={this.props.selectedInteraction && this.props.selectedInteraction.contact && this.props.selectedInteraction.contact.id === contact.id}
            contact={contact}
            assignContact={this.assignContactToSelected}
            editContact={this.editUnassignedContact}
            loading={this.state.loading}
          />);
      results.push(
        <InfiniteScroll
          key="infinite-scroll"
          loadMore={this.searchContacts}
          hasMore={this.props.resultsCount === -1 || this.props.results.length < this.props.resultsCount}
          loader={this.getLoader()}
          useWindow={false}
        >
          { resultsMapped }
        </InfiniteScroll>
      );
    }
    if (this.props.resultsCount < 1 && !this.state.loading) {
      results.push(
        <div key="results-placeholder" id="results-placeholder" style={this.styles.resultsPlaceholder}>
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
          <Button id="createNewRecord" type="secondary" text="Create New Record" onClick={this.newContact}></Button>
        </div>
      );
    }
    return results;
  }

  renderContactView() {
    return Object.keys(this.props.selectedInteraction.contact).length ?
      <Contact style={this.styles.mainContact} isAssigned contact={this.props.selectedInteraction.contact} loading={this.state.loading} save={this.handleSave} cancel={this.setNotEditing} isEditing={this.state.isEditing} />
      :
      ''; // TODO: loading animation
  }

  render() {
    return (
      <div style={[this.props.style, this.styles.base]}>
        {
          this.state.errors.length ?
            this.state.errors.map((error, index) =>
              <ErrorBanner
                id={`error${index}`}
                key={error.id}
                dismiss={() => this.dismissError(index)}
                tryAgain={error.tryAgain}
                errorType={error.type}
                messageType={error.messageType}
              />
            )
          : null
        }
        { this.getHeader() }
        <div style={[this.styles.contacts]}>
          { this.getMainContent() }
        </div>
      </div>
    );
  }
}

ContactsControl.propTypes = {
  intl: React.PropTypes.object.isRequired,
  style: React.PropTypes.object,
  attributes: React.PropTypes.array,
  resultsCount: React.PropTypes.number,
  results: React.PropTypes.any,
  nextPage: React.PropTypes.number,
  addSearchFilter: React.PropTypes.func,
  removeSearchFilter: React.PropTypes.func,
  setSearchResults: React.PropTypes.func,
  clearSearchResults: React.PropTypes.func,
  selectedInteraction: React.PropTypes.object,
  setContactAction: React.PropTypes.func,
  assignContact: React.PropTypes.func,
};

function mapStateToProps(state, props) {
  return {
    attributes: selectAttributes(state, props),
    selectedInteraction: selectCurrentInteraction(state, props),
    ...selectContactsControl(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSearchResults: (filter) => dispatch(setSearchResults(filter)),
    clearSearchResults: () => dispatch(clearSearchResults()),
    assignContact: (interactionId, contact) => dispatch(assignContact(interactionId, contact)),
    dispatch,
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(ContactsControl)));
