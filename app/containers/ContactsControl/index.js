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
import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { VelocityTransitionGroup } from 'velocity-react';

import NotificationBanner from 'components/NotificationBanner';
import IconSVG from 'components/IconSVG';
import Button from 'components/Button';
import Filter from 'components/Filter';
import Icon from 'components/Icon';
import ContactSearchResult from 'containers/ContactSearchResult';
import ContactSearchBar from 'containers/ContactSearchBar';
import ConfirmDialog from 'components/ConfirmDialog';
import Contact from 'containers/Contact';

import messages from './messages';
import selectContactsControl, { selectCurrentInteraction, selectAttributes } from './selectors';
import { setSearchResults, clearSearchResults } from './actions';
import { assignContact, selectContact, loadContactInteractionHistory, deleteContacts } from '../AgentDesktop/actions';

const controlHeaderHeight = 70;
const resultsPlaceholderWidth = 330;

export class ContactsControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nextNotificationId: 0,
      query: this.expandQuery(this.props.selectedInteraction.query, this.props.attributes),
      loading: true,
      isEditing: false,
      confirmingDelete: false,
      deletionPending: false,
      unassignedContactEditing: {},
      notifications: [],
      selectedContacts: [],
    };

    this.mounted = false;

    this.setSearching = this.setSearching.bind(this);
    this.setViewing = this.setViewing.bind(this);
    this.setSearching = this.setSearching.bind(this);
    this.searchContacts = this.searchContacts.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.renderContactView = this.renderContactView.bind(this);
    this.editUnassignedContact = this.editUnassignedContact.bind(this);
    this.editAssignedContact = this.editAssignedContact.bind(this);
    this.newContact = this.newContact.bind(this);
    this.deleteContacts = this.deleteContacts.bind(this);
    this.getBannerHeader = this.getBannerHeader.bind(this);
    this.getViewControlHeader = this.getViewControlHeader.bind(this);
    this.getSearchControlHeader = this.getSearchControlHeader.bind(this);
    this.getHeader = this.getHeader.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.setNotEditing = this.setNotEditing.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.createCallback = this.createCallback.bind(this);
    this.updateCallback = this.updateCallback.bind(this);
    this.handleContactAssign = this.handleContactAssign.bind(this);
    this.dismissNotification = this.dismissNotification.bind(this);
    this.renderBulkActionControls = this.renderBulkActionControls.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const queryChanged = JSON.stringify(nextProps.selectedInteraction.query) !== JSON.stringify(this.props.selectedInteraction.query);
    const interactionChanged = (nextProps.selectedInteraction.interactionId !== this.props.selectedInteraction.interactionId);
    if (queryChanged || interactionChanged) {
      this.props.clearSearchResults();
      this.setState({
        query: this.expandQuery(nextProps.selectedInteraction.query, nextProps.attributes),
        selectedContacts: [],
      });
    }
    if (interactionChanged && this.state.isEditing) {
      this.setNotEditing();
    }
  }

  componentWillUnmount() {
    this.props.clearSearchResults();
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    SDK.contacts.listAttributes({ callback: () => {
      SDK.contacts.listLayouts({ callback: () => {
        this.setState({ loading: false }); // TODO: error handling
      } });
    } });
  }

  deleteContacts() {
    this.setState({ loading: true, deletionPending: true }, () => {
      this.props.deleteContacts(this.state.selectedContacts);
      this.setState({ confirmingDelete: false, selectedContacts: [] });
    });
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

  setSearching() {
    this.props.setContactAction(this.props.selectedInteraction.interactionId, 'search');
  }

  editUnassignedContact(contact) {
    this.setState({ isEditing: true, unassignedContactEditing: contact, selectedContacts: [] });
  }

  newContact() {
    this.setState({ isEditing: true, unassignedContactEditing: {}, selectedContacts: [] });
  }

  editAssignedContact() {
    this.setState({ isEditing: true, unassignedContactEditing: {}, selectedContacts: [] });
  }

  setViewing() {
    this.props.setContactAction(this.props.selectedInteraction.interactionId, 'view');
  }

  clearSearch() {
    this.props.removeSearchFilter();
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
          addFilter={this.props.addSearchFilter}
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
              remove={() => this.props.removeSearchFilter(filter.attribute.objectName)}
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
            key={this.state.unassignedContactEditing.id}
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
    if (!this.state.loading || this.state.deletionPending) {
      this.setState({ loading: true, deletionPending: false });
      const encodedQuery = {};
      Object.keys(this.props.selectedInteraction.query).forEach((queryName) => {
        const queryToEncode = this.props.selectedInteraction.query[queryName];
        const queryNoQuotes = queryToEncode.replace(/"/g, '');
        let finalQuery = queryNoQuotes;

        // here we are looking for queries that either start and end with double-quotes,
        // or are telephone queries. If they are either, then put double quotes around
        // them so that the sdk does an exact string match instead of the default partial match
        if (/^".*"$/.test(queryToEncode) || queryName === 'phone') {
          finalQuery = `"${queryNoQuotes}"`;
        }

        encodedQuery[queryName] = encodeURIComponent(finalQuery);
      });
      SDK.contacts.search({ query: Object.assign(encodedQuery, { page: this.props.nextPage }) }, (error, topic, response) => {
        console.log('[ContactsControl] SDK.subscribe()', topic, response);
        this.props.setSearchResults(response);
        if (this.mounted) this.setState({ loading: false });
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
      height: '36px',
      width: '60px',
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
      position: 'relative',
      display: 'flex',
      flexFlow: 'column',
    },
    buttonSet: {
      alignSelf: 'flex-end',
      flexGrow: '0',
      flexShrink: '1',
    },
    contactResult: {
      marginBottom: '14px',
      alignSelf: 'stretch',
      flex: '1',
      flexGrow: '1',
      flexShrink: '1',
      marginLeft: '52px',
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
    bulkActionControlBar: {
      display: 'flex',
      flexShrink: '0',
      margin: '12px 0',
      transform: 'none',
    },
    bulkConfirmDialog: {
      position: 'absolute',
      left: '-23px',
      bottom: '40px',
    },
    checkboxSpacing: {
      marginLeft: '-52px',
    },
  };

  addNotification(messageType, isError, errorType) {
    const id = this.state.nextNotificationId;
    if (!isError) {
      setTimeout(() => this.dismissNotification(id), 3000);
    }
    this.setState({
      notifications: [...this.state.notifications, { id, errorType, messageType, isError }],
      nextNotificationId: id + 1,
    });
  }

  updateCallback(error, topic, response) {
    console.log('[ContactsControl] SDK.subscribe()', topic, response);
    this.setState({ loading: false });
    if (error) {
      this.addNotification('notSaved', true, 'serverError'); // TODO: when notifications are ready, get error from response?
      console.error(error);
    } else {
      this.props.clearSearchResults();
      this.setNotEditing();
      this.addNotification('saved', false);
    }
  }

  createCallback(error, topic, response) {
    console.log('[ContactsControl] SDK.subscribe()', topic, response);
    if (error) {
      this.addNotification('notCreated', true, 'serverError'); // TODO: when notifications are ready, get error from response?
      console.error(error);
      this.setState({ loading: false });
    } else {
      this.handleContactAssign(response, () => {
        this.props.clearSearchResults();
        this.setState({ loading: false });
        this.setNotEditing();
        this.addNotification('created', false);
      });
    }
  }

  dismissNotification(id) {
    const notificationIndex = this.state.notifications.findIndex((notification) => notification.id === id);
    if (notificationIndex > -1 && this.mounted) {
      this.setState({ notifications: [...this.state.notifications.splice(1, notificationIndex)] });
    }
  }

  handleSave(attributes, contactId) {
    this.setState({ loading: true });
    if (contactId) {
      SDK.contacts.update({ contactId, attributes }, this.updateCallback);
    } else {
      SDK.contacts.create({ attributes }, this.createCallback);
    }
  }

  unassignCurrentContact(callback) {
    SDK.interactions.unassignContact({
      interactionId: this.props.selectedInteraction.interactionId,
      contactId: this.props.selectedInteraction.contact.id,
    }, (error, response, topic) => {
      this.setState({ loading: false });
      console.log('[ContactsControl] SDK.subscribe()', topic, response);
      callback(error);
    });
  }

  handleContactAssign(contact, callback) {
    if (!this.props.selectedInteraction.interactionId) {
      this.props.selectContact(contact);
      if (typeof callback === 'function') callback();
      this.props.loadContactInteractionHistory(contact.id);
    } else {
      this.setState({ loading: true });
      const handleError = (error) => {
        this.addNotification('notAssigned', true, 'serverError'); // TODO: when errors are ready, get error from response?
        console.error(error);
      };
      if (this.props.selectedInteraction.contact !== undefined) {
        this.unassignCurrentContact((unassignError) => {
          if (unassignError) {
            this.setState({ loading: false });
            handleError(unassignError);
            if (typeof callback === 'function') callback();
          } else {
            this.props.assignContact(this.props.selectedInteraction.interactionId);
            this.assignContactToSelected(contact, (assignError) => {
              if (assignError) {
                handleError(assignError);
              }
              this.setState({ loading: false });
              if (typeof callback === 'function') callback();
            });
          }
        });
      } else {
        this.assignContactToSelected(contact, (assignError) => {
          if (assignError) {
            handleError(assignError);
          }
          this.setState({ loading: false });
          if (typeof callback === 'function') callback();
        });
      }
    }
  }

  assignContactToSelected(contact, callback) {
    SDK.interactions.assignContact({
      interactionId: this.props.selectedInteraction.interactionId,
      contactId: contact.id,
    }, (error, topic, response) => {
      this.setState({ loading: false });
      console.log('[ContactsControl] SDK.subscribe()', topic, response);
      if (error) {
        callback(error);
      } else {
        this.props.loadContactInteractionHistory(contact.id);
        this.props.clearSearchResults();
        this.props.assignContact(this.props.selectedInteraction.interactionId, contact);
        callback();
      }
    });
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
      const resultsMapped = !this.state.deletionPending && this.props.results.map(
        (contact, index) => {
          const isSelected = this.state.selectedContacts.includes(contact.id);
          return (<ContactSearchResult
            isCollapsed={this.props.isCollapsed}
            checked={isSelected}
            style={this.styles.contactResult}
            selectContact={(isChecked) => {
              if (isChecked) {
                this.setState({ selectedContacts: this.state.selectedContacts.concat(contact.id) });
              } else {
                this.setState({ selectedContacts: this.state.selectedContacts.filter((id) => id !== contact.id) });
              }
            }}
            key={contact.id}
            id={`contactSearchResult-${index}`}
            isAssigned={this.props.selectedInteraction.contact && this.props.selectedInteraction.contact.id === contact.id}
            contact={contact}
            assignContact={this.handleContactAssign}
            editContact={this.editUnassignedContact}
            loading={this.state.loading}
          />);
        });
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
      <Contact
        key={this.props.selectedInteraction.contact.id}
        style={this.styles.mainContact}
        isAssigned
        contact={this.props.selectedInteraction.contact}
        loading={this.state.loading}
        save={this.handleSave}
        cancel={this.setNotEditing}
        isEditing={this.state.isEditing}
      />
      :
      ''; // TODO: loading animation
  }

  renderBulkActionControls() {
    return (
      <div id="bulk-action-controls" style={this.styles.bulkActionControlBar}>
        <div key="delete-btn-container" style={{ position: 'relative' }}>
          <ConfirmDialog
            questionMessage={
              this.state.selectedContacts.length === 1
                ? messages.deleteContact
                : { ...messages.deleteContacts, values: { count: this.state.selectedContacts.length } }
            }
            leftAction={() => this.setState({ confirmingDelete: false })}
            rightAction={this.deleteContacts}
            isVisible={this.state.confirmingDelete}
            hide={() => this.setState({ confirmingDelete: false })}
            style={this.styles.bulkConfirmDialog}
          />
          <Button onClick={() => this.setState({ confirmingDelete: true })} id="delete-btn" text={messages.delete} type="secondary"></Button>
        </div>
      </div>
    );
  }

  velocityCleanup = (animatedElements) => {
    const bulkActionBar = animatedElements[0];
    bulkActionBar.style.transform = 'none';
  }

  render() {
    const showCheckboxes = (
      this.props.selectedInteraction.contactAction !== 'view'
      && this.state.isEditing === false
    );
    return (
      <div style={[this.props.style, this.styles.base]}>
        {
          this.state.notifications.length ?
            this.state.notifications.map((notification, index) =>
              <NotificationBanner
                id={`contactNotification${index}`}
                key={notification.id}
                dismiss={() => this.dismissNotification(notification.id)}
                tryAgain={notification.tryAgain}
                errorType={notification.errorType}
                messageType={notification.messageType}
                isError={notification.isError}
              />
            )
          : null
        }
        { this.getHeader() }
        <div style={[this.styles.contacts, showCheckboxes && this.styles.checkboxSpacing]}>
          <div style={{ width: '52px' }}></div>
          { this.getMainContent() }
        </div>
        <VelocityTransitionGroup enter={{ animation: 'transition.slideUpIn', duration: '100', complete: this.velocityCleanup }} leave={{ animation: 'transition.slideDownOut', duration: '100' }}>
          {
            (this.props.selectedInteraction.contactAction === 'search' && !this.state.isEditing && this.state.selectedContacts.length > 0)
            && this.renderBulkActionControls()
          }
        </VelocityTransitionGroup>
      </div>
    );
  }
}

ContactsControl.propTypes = {
  isCollapsed: React.PropTypes.bool.isRequired,
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
  selectContact: React.PropTypes.func,
  deleteContacts: React.PropTypes.func,
  loadContactInteractionHistory: React.PropTypes.func,
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
    selectContact: (contact) => dispatch(selectContact(contact)),
    deleteContacts: (contactIds) => dispatch(deleteContacts(contactIds)),
    loadContactInteractionHistory: (contactId, page) => dispatch(loadContactInteractionHistory(contactId, page)),
    dispatch,
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(ContactsControl)));
