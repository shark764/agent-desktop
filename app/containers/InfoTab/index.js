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

import { setContactAction } from 'containers/AgentDesktop/actions';
import { setShowCancelDialog, setShowConfirmDialog, setFormIsDirty, setFormValidity, resetForm } from 'containers/ContactsControl/actions';

import selectInfoTab, { selectCurrentInteraction, selectCheckedContacts,
  selectContactMode, selectEditingContact, selectNotifications,
  selectNextNotificationId, selectCRMUnavailable } from './selectors';
import { clearSearchResults, clearCheckedContacts, setContactMode,
  setEditingContact, addNotification, dismissNotification, setLoading, setConfirmingDelete } from './actions';
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

  componentDidMount() {
    CxEngage.contacts.listAttributes(() => {
      CxEngage.contacts.listLayouts(() => {
        this.props.setLoading(false);
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const interactionChanged = (nextProps.selectedInteraction.interactionId !== this.props.selectedInteraction.interactionId);
    if (interactionChanged) {
      this.setNotEditing();
    }
  }

  setSearching = () => {
    this.props.setContactAction(this.props.selectedInteraction.interactionId, 'search');
  }

  editAssignedContact = () => {
    this.props.setEditingContact({});
    this.props.setContactMode('edit');
  }

  setNotEditing = () => {
    this.props.setContactMode();
    this.props.setEditingContact({});
    this.props.clearCheckedContacts();
    this.props.resetForm();
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
    const showCheckboxes = (
      this.props.selectedInteraction.contactAction === 'search'
      && !this.props.contactMode
    );
    return (
      <div style={[this.props.style, this.styles.base]}>
        {
          this.props.notifications.map((notification, index) =>
            <NotificationBanner
              id={`contactNotification${index}`}
              key={notification.id}
              style={this.styles.notificationBanner}
              dismiss={() => this.props.dismissNotification(notification.id)}
              tryAgain={notification.tryAgain}
              titleMessage={notification.errorType && messages[notification.errorType]}
              descriptionMessage={messages[notification.messageType] || messages.notSaved}
              isError={notification.isError}
            />
          )
        }
        <ContactHeader
          contactAction={this.props.selectedInteraction.contactAction}
          contactMode={this.props.contactMode}
          editAssignedContact={this.editAssignedContact}
          setSearching={this.setSearching}
          showControls={this.props.selectedInteraction.interactionId !== 'creating-new-interaction'}
        />
        <div style={[this.styles.contacts, showCheckboxes && this.styles.checkboxSpacing]}>
          <ContactsControl
            setNotEditing={this.setNotEditing}
            addNotification={this.addNotification}
          />
        </div>
      </div>
    );
  }
}

InfoTab.propTypes = {
  crmUnavailable: React.PropTypes.string,
  style: React.PropTypes.object,
  clearSearchResults: React.PropTypes.func,
  clearCheckedContacts: React.PropTypes.func,
  selectedInteraction: React.PropTypes.object,
  setContactAction: React.PropTypes.func,
  contactMode: React.PropTypes.string,
  query: React.PropTypes.array,
  deletionPending: React.PropTypes.bool,
  setLoading: React.PropTypes.func,
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
};

function mapStateToProps(state, props) {
  return {
    crmUnavailable: selectCRMUnavailable(state, props),
    selectedInteraction: selectCurrentInteraction(state, props),
    checkedContacts: selectCheckedContacts(state, props),
    contactMode: selectContactMode(state, props),
    editingContact: selectEditingContact(state, props),
    nextNotificationId: selectNextNotificationId(state, props),
    notifications: selectNotifications(state, props),
    ...selectInfoTab(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    clearSearchResults: () => dispatch(clearSearchResults()),
    clearCheckedContacts: () => dispatch(clearCheckedContacts()),
    setContactMode: (contactMode) => dispatch(setContactMode(contactMode)),
    setEditingContact: (editingContact) => dispatch(setEditingContact(editingContact)),
    addNotification: (notification) => dispatch(addNotification(notification)),
    dismissNotification: (id) => dispatch(dismissNotification(id)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    setConfirmingDelete: (confirmingDelete) => dispatch(setConfirmingDelete(confirmingDelete)),
    setShowCancelDialog: (showCancelDialog) => dispatch(setShowCancelDialog(showCancelDialog)),
    setShowConfirmDialog: (showConfirmDialog) => dispatch(setShowConfirmDialog(showConfirmDialog)),
    setContactAction: (interactionId, newAction) => dispatch(setContactAction(interactionId, newAction)),
    setFormIsDirty: (formIsDirty) => dispatch(setFormIsDirty(formIsDirty)),
    setFormValidity: (formIsValid) => dispatch(setFormValidity(formIsValid)),
    resetForm: () => dispatch(resetForm()),
    dispatch,
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(InfoTab)));
