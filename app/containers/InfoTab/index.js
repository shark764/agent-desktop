/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * InfoTab
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Radium from 'radium';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import NotificationBanner from 'components/NotificationBanner';
import ContactsControl from 'containers/ContactsControl';
import ContactHeader from 'components/ContactHeader';
import ContactBulkActions from 'components/ContactBulkActions';
import IconSVG from 'components/IconSVG';

import { deleteContacts, setContactAction, addSearchFilter, removeSearchFilter } from 'containers/AgentDesktop/actions';
import { setShowCancelDialog, setShowConfirmDialog, setFormIsDirty, setFormValidity, resetForm } from 'containers/ContactsControl/actions';

import selectInfoTab, { selectCurrentInteraction, selectCheckedContacts,
  selectContactMode, selectEditingContact, selectExpandedQuery, selectNotifications,
  selectNextNotificationId, selectDeletionPending, selectConfirmingDelete, selectCRMUnavailable } from './selectors';
import { clearSearchResults, clearCheckedContacts, setContactMode,
  setEditingContact, addNotification, dismissNotification, setLoading, setDeletionPending, setConfirmingDelete } from './actions';
import messages from './messages';

export class InfoTab extends BaseComponent {

  styles = {
    base: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      position: 'relative',
    },
    results: {
      height: '100%',
      alignItems: 'stretch',
    },
    contacts: {
      overflowY: 'auto',
      boxSizing: 'content-box',
      flexGrow: '1',
      flexShrink: '1',
      position: 'relative',
      display: 'flex',
    },
    checkboxSpacing: {
      marginLeft: '-52px',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
    },
    loadingIcon: {
      height: '60px',
    },
    notificationBanner: {
      width: 'calc(100% + 76px)',
      position: 'relative',
      left: '-51px',
    },
  };

  componentWillReceiveProps(nextProps) {
    if (!this.state.error) {
      const queryChanged = JSON.stringify(nextProps.selectedInteraction.query) !== JSON.stringify(this.props.selectedInteraction.query);
      const interactionChanged = (nextProps.selectedInteraction.interactionId !== this.props.selectedInteraction.interactionId);
      if (queryChanged || interactionChanged) {
        this.props.clearSearchResults();
        this.props.clearCheckedContacts();
      }
      if (interactionChanged && this.props.contactMode !== 'viewing') {
        this.setNotEditing();
      }
      if (!this.props.deletionPending && nextProps.deletionPending) {
        this.deleteContacts();
      }
    }
  }

  componentWillUnmount() {
    if (!this.state.error) {
      this.props.clearSearchResults();
    }
  }

  componentDidMount() {
    CxEngage.contacts.listAttributes(() => {
      CxEngage.contacts.listLayouts(() => {
        this.props.setLoading(false);
      });
    });
  }

  setDeletionPending = () => {
    this.props.setLoading(true);
    this.props.setDeletionPending(true);
  }

  deleteContacts = () => {
    this.props.deleteContacts(this.props.checkedContacts.map((contact) => contact.id));
    this.props.clearCheckedContacts();
    this.props.setConfirmingDelete(false);
  }

  setSearching = () => {
    this.props.setContactAction(this.props.selectedInteraction.interactionId, 'search');
  }

  newContact = () => {
    this.props.setContactMode('editing');
    this.props.setEditingContact({});
  }

  editContact = () => {
    this.props.setContactMode('editing');
  }

  setViewing = () => {
    this.props.setContactAction(this.props.selectedInteraction.interactionId, 'view');
  }

  clearSearch = () => {
    this.props.removeSearchFilter();
    if (this.props.selectedInteraction.contact !== undefined) {
      this.setViewing();
    }
  }

  setNotEditing = () => {
    this.props.setContactMode('viewing');
    this.props.clearCheckedContacts();
    this.props.setShowCancelDialog(false);
    this.props.setShowConfirmDialog(false);
    this.props.setFormIsDirty(false);
    this.props.setFormValidity(false);
    this.props.resetForm();
  }

  setMerging = () => {
    this.props.setContactMode('merging');
  }

  addNotification = (messageType, isError, errorType) => {
    // TODO: move error logic to Errors reducer/saga and call handleError instead of addNotification if error
    const id = this.props.nextNotificationId;
    if (!isError) {
      setTimeout(() => this.props.dismissNotification(id), 3000);
    }
    this.props.addNotification({ id, errorType, messageType, isError });
  }

  crmUnavailableBanner = () =>
    <div style={[this.props.style, this.styles.base]}>
      <NotificationBanner
        id="crm-unavailable-banner"
        key="crm-unavailable-banner"
        style={this.styles.notificationBanner}
        titleMessage={messages.crmUnavailableTitle}
        descriptionMessage={messages[this.props.crmUnavailable] || messages.crmUnavailableGeneral}
        isError
      />
    </div>

  render() {
    if (this.props.crmUnavailable) {
      return this.crmUnavailableBanner();
    }
    const showBulkActions = this.props.results.length > 0 && this.props.contactMode === 'viewing' && this.props.selectedInteraction.contactAction === 'search';
    const showCheckboxes = this.props.selectedInteraction.contactAction !== 'view' && this.props.contactMode !== 'merging' && this.props.contactMode !== 'editing';
    return (
      <div style={[this.props.style, this.styles.base]}>
        {
          this.props.notifications.length ?
            this.props.notifications.map((notification, index) =>
              <NotificationBanner
                id={`contactNotification${index}`}
                key={notification.id}
                style={this.styles.notificationBanner}
                dismiss={() => this.props.dismissNotification(notification.id)}
                tryAgain={notification.tryAgain}
                titleMessage={messages[notification.errorType]}
                descriptionMessage={messages[notification.messageType]}
                isError={notification.isError}
              />
            )
          : null
        }
        <ContactHeader
          selectedInteraction={this.props.selectedInteraction}
          contactMode={this.props.contactMode}
          editingContactEditing={this.props.editingContact}
          resultsCount={this.props.resultsCount}
          addSearchFilter={this.props.addSearchFilter}
          clearSearch={this.clearSearch}
          query={this.props.expandedQuery}
          removeSearchFilter={this.props.removeSearchFilter}
          editAssignedContact={this.editContact}
          setSearching={this.setSearching}
        />
        {
          this.props.loading ?
            <div id="loadingContainer" style={this.styles.loading}>
              <IconSVG style={this.styles.loadingIcon} id="loadingIcon" name="loading" />
            </div>
          : <div style={[this.styles.contacts, showCheckboxes && this.styles.checkboxSpacing]}>
            <ContactsControl
              newContact={this.newContact}
              results={this.props.results}
              resultsCount={this.props.resultsCount !== undefined ? this.props.resultsCount : -1}
              isCollapsed={this.props.isCollapsed}
              setNotEditing={this.setNotEditing}
              addNotification={this.addNotification}
            />
          </div>
        }
        {
          showBulkActions && !this.props.loading &&
          <ContactBulkActions
            newContact={this.newContact}
            selectedContacts={this.props.checkedContacts}
            deleteContacts={this.setDeletionPending}
            confirmingDelete={this.props.confirmingDelete}
            setMerging={this.setMerging}
            setConfirmingDelete={this.props.setConfirmingDelete}
          />
        }
      </div>
    );
  }
}

InfoTab.propTypes = {
  crmUnavailable: React.PropTypes.string,
  isCollapsed: React.PropTypes.bool.isRequired,
  style: React.PropTypes.object,
  resultsCount: React.PropTypes.number,
  results: React.PropTypes.any,
  addSearchFilter: React.PropTypes.func,
  removeSearchFilter: React.PropTypes.func,
  clearSearchResults: React.PropTypes.func,
  clearCheckedContacts: React.PropTypes.func,
  selectedInteraction: React.PropTypes.object,
  setContactAction: React.PropTypes.func,
  deleteContacts: React.PropTypes.func,
  contactMode: React.PropTypes.string,
  query: React.PropTypes.array,
  deletionPending: React.PropTypes.bool,
  setLoading: React.PropTypes.func,
  setDeletionPending: React.PropTypes.func,
  setConfirmingDelete: React.PropTypes.func,
  setContactMode: React.PropTypes.func,
  setEditingContact: React.PropTypes.func,
  setShowCancelDialog: React.PropTypes.func,
  setFormIsDirty: React.PropTypes.func,
  setFormValidity: React.PropTypes.func,
  resetForm: React.PropTypes.func,
  nextNotificationId: React.PropTypes.number,
  checkedContacts: React.PropTypes.array,
  dismissNotification: React.PropTypes.func,
  addNotification: React.PropTypes.func,
  notifications: React.PropTypes.array,
  editingContact: React.PropTypes.object,
  expandedQuery: React.PropTypes.array,
  loading: React.PropTypes.bool,
  confirmingDelete: React.PropTypes.bool,
};

function mapStateToProps(state, props) {
  return {
    crmUnavailable: selectCRMUnavailable(state, props),
    selectedInteraction: selectCurrentInteraction(state, props),
    checkedContacts: selectCheckedContacts(state, props),
    contactMode: selectContactMode(state, props),
    editingContact: selectEditingContact(state, props),
    expandedQuery: selectExpandedQuery(state, props),
    nextNotificationId: selectNextNotificationId(state, props),
    notifications: selectNotifications(state, props),
    deletionPending: selectDeletionPending(state, props),
    confirmingDelete: selectConfirmingDelete(state, props),
    ...selectInfoTab(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    clearSearchResults: () => dispatch(clearSearchResults()),
    clearCheckedContacts: () => dispatch(clearCheckedContacts()),
    deleteContacts: (contactIds) => dispatch(deleteContacts(contactIds)),
    setContactMode: (contactMode) => dispatch(setContactMode(contactMode)),
    setEditingContact: (editingContact) => dispatch(setEditingContact(editingContact)),
    addNotification: (notification) => dispatch(addNotification(notification)),
    dismissNotification: (id) => dispatch(dismissNotification(id)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    setDeletionPending: (deletionPending) => dispatch(setDeletionPending(deletionPending)),
    setConfirmingDelete: (confirmingDelete) => dispatch(setConfirmingDelete(confirmingDelete)),
    setShowCancelDialog: (showCancelDialog) => dispatch(setShowCancelDialog(showCancelDialog)),
    setShowConfirmDialog: (showConfirmDialog) => dispatch(setShowConfirmDialog(showConfirmDialog)),
    setContactAction: (interactionId, newAction) => dispatch(setContactAction(interactionId, newAction)),
    setFormIsDirty: (formIsDirty) => dispatch(setFormIsDirty(formIsDirty)),
    setFormValidity: (formIsValid) => dispatch(setFormValidity(formIsValid)),
    addSearchFilter: (filterName, value) => dispatch(addSearchFilter(filterName, value)),
    removeSearchFilter: (filter) => dispatch(removeSearchFilter(filter)),
    resetForm: () => dispatch(resetForm()),
    dispatch,
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(InfoTab)));
