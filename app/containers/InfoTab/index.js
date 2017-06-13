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

import ContactsControl from 'containers/ContactsControl';
import ContactHeader from 'components/ContactHeader';
import NotificationBanner from 'components/NotificationBanner';

import { setContactMode, resetForm } from 'containers/AgentDesktop/actions';
import { setShowCancelDialog, setShowConfirmDialog, editContact } from 'containers/ContactsControl/actions';

import selectInfoTab, { selectCurrentInteraction, selectNotifications,
  selectNextNotificationId, selectCRMUnavailable } from './selectors';
import { addNotification, dismissNotification, setLoading, setConfirmingDelete } from './actions';
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

  setSearching = () => {
    this.props.setContactMode(this.props.selectedInteraction.interactionId, 'search');
  }

  editAssignedContact = () => {
    this.props.editContact(this.props.selectedInteraction.interactionId, this.props.selectedInteraction.contact);
  }

  setNotEditing = (goTo) => {
    const newMode = goTo === 'view' ? 'view' : 'search';
    this.props.setContactMode(this.props.selectedInteraction.interactionId, newMode);
    this.props.resetForm(this.props.selectedInteraction.interactionId);
    this.props.setShowCancelDialog(false);
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
    const showCheckboxes = this.props.selectedInteraction.contactMode === 'search';
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
          editAssignedContact={this.editAssignedContact}
          contactMode={this.props.selectedInteraction.contactMode}
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
  selectedInteraction: React.PropTypes.object,
  setContactMode: React.PropTypes.func,
  query: React.PropTypes.array,
  setLoading: React.PropTypes.func,
  setConfirmingDelete: React.PropTypes.func,
  setShowCancelDialog: React.PropTypes.func,
  resetForm: React.PropTypes.func,
  nextNotificationId: React.PropTypes.number,
  dismissNotification: React.PropTypes.func,
  addNotification: React.PropTypes.func,
  notifications: React.PropTypes.array,
  editContact: React.PropTypes.func,
};

function mapStateToProps(state, props) {
  return {
    crmUnavailable: selectCRMUnavailable(state, props),
    selectedInteraction: selectCurrentInteraction(state, props),
    nextNotificationId: selectNextNotificationId(state, props),
    notifications: selectNotifications(state, props),
    ...selectInfoTab(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addNotification: (notification) => dispatch(addNotification(notification)),
    dismissNotification: (id) => dispatch(dismissNotification(id)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    setConfirmingDelete: (confirmingDelete) => dispatch(setConfirmingDelete(confirmingDelete)),
    setShowCancelDialog: (showCancelDialog) => dispatch(setShowCancelDialog(showCancelDialog)),
    setShowConfirmDialog: (showConfirmDialog) => dispatch(setShowConfirmDialog(showConfirmDialog)),
    setContactMode: (interactionId, newMode) => dispatch(setContactMode(interactionId, newMode)),
    resetForm: () => dispatch(resetForm()),
    editContact: (interactionId, contact) => dispatch(editContact(interactionId, contact)),
    setCriticalError: () => dispatch(setCriticalError()),
    dispatch,
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(InfoTab)));
