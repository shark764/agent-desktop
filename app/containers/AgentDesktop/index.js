/*
 *
 * AgentDesktop
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import selectAgentDesktop from './selectors';
import { injectIntl } from 'react-intl';

import InteractionsBar from 'containers/InteractionsBar';
import MainContentArea from 'containers/MainContentArea';
import SidePanel from 'containers/SidePanel';
import Toolbar from 'containers/Toolbar';

import Resizable from 'components/Resizable';

import Login from 'containers/Login';

import Radium from 'radium';

import { setTenantId, setPresence, setDirection, setAvailablePresences, addInteraction, addMessage, setMessageHistory,
  setInteractionStatus, removeInteraction, selectInteraction, setCustomFields, emailCreateReply, emailCancelReply } from './actions';

import { SQS_TYPES } from './constants';

export class AgentDesktop extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.beginSession = this.beginSession.bind(this);
    this.changePresence = this.changePresence.bind(this);
    this.showContactsPanel = this.showContactsPanel.bind(this);
    this.collapseContactsPanel = this.collapseContactsPanel.bind(this);
    this.setContactsPanelWidth = this.setContactsPanelWidth.bind(this);

    this.collapsedContactsPanelPx = 52;
    this.defaultContactsPanelPx = Math.min(window.innerWidth - 827, 553);

    this.state = {
      collapseContactsPanel: false,
      contactsPanelPx: this.defaultContactsPanelPx,
    };
  }

  setContactsPanelWidth(newWidth) {
    this.setState({
      contactsPanelPx: newWidth,
    });
  }

  collapseContactsPanel() {
    this.setState({
      collapseContactsPanel: true,
    });
  }

  showContactsPanel() {
    this.setState({
      collapseContactsPanel: false,
    });
  }

  beginSession(tenantId) {
    const sessionBeginCallback = () => {
      this.props.setTenantId(tenantId);
      const initState = 'notready'; // TODO constants file for these
      this.changePresence(initState);
    };
    const handleSqsMessage = (messageString) => {
      const message = JSON.parse(messageString);

      // We apparently need to acknowledge receipt of any flow-related message to
      // flow in order for things to not explode; all notification types except
      // resource-state-change need acknowledgement.
      if (message.type.toLowerCase() !== SQS_TYPES.resourceStateChange) {
        SDK.Agent.Session.Interactions.acknowledgeMessageReceived(message);
      }

      if (message.type.toLowerCase() === SQS_TYPES.resourceStateChange) {
        console.log('RESOURCE STATE CHANGE!', message.state, message); // eslint-disable-line
      } else if (message.type.toLowerCase() === SQS_TYPES.agentNotification) {
        console.log('AGENT NOTIFICATION!', message.notificationType, message); // eslint-disable-line
        if (message.notificationType === 'work-accepted') {
          this.props.setInteractionStatus(message.interactionId, message.notificationType);
        } else if (message.notificationType === 'work-rejected' || message.notificationType === 'work-ended') {
          this.props.removeInteraction(message.interactionId);
        } else if (message.notificationType === 'custom-fields') {
          this.props.setCustomFields(message.interactionId, message.customFields);
        }
      } else if (message.type.toLowerCase() === SQS_TYPES.workOffer) {
        console.log('WORK OFFER!', message); // eslint-disable-line
        const interaction = {
          channelType: message.channelType,
          customerAvatarIndex: Math.floor(Math.random() * 17),
          interactionId: message.interactionId,
          status: 'work-offer',
          timeout: message.timeout,
        };
        this.props.addInteraction(interaction);

        if (message.channelType === 'messaging' || message.channelType === 'sms') {
          SDK.Agent.Session.Messaging.getMessageHistory({
            interactionId: message.interactionId,
            callback: (messageHistory) => {
              const messageHistoryItems = messageHistory.map((messageHistoryItem) => ({
                text: messageHistoryItem.body.text,
                from: messageHistoryItem.metadata && messageHistoryItem.metadata.name ? messageHistoryItem.metadata.name : messageHistoryItem.from,
                type: messageHistoryItem.metadata.type,
                timestamp: messageHistoryItem.timestamp,
              }));
              this.props.setMessageHistory(message.interactionId, messageHistoryItems);
            },
          });
        }
      } else if (message.type.toLowerCase() === SQS_TYPES.sendScript) {
        console.log('SEND SCRIPT!', message); // eslint-disable-line
      } else {
        console.error(`Unknown message type: ${message.type}`); // eslint-disable-line
      }
    };
    const sessionParams = {
      'tenant-id': tenantId,
      'on-notification': handleSqsMessage,
      callback: sessionBeginCallback,
    };
    SDK.Agent.Session.beginSession(sessionParams);
  }

  changePresence(newPresence) {
    const changePresStateOnComplete = (data) => {
      const changePresenceResult = data.result;
      this.props.setDirection(changePresenceResult.direction);
      this.props.setPresence(changePresenceResult.state);
      this.props.setAvailablePresences(changePresenceResult.availableStates);
      if (newPresence === 'ready') {
        SDK.Agent.Session.Messaging.init({ onReceived: (message) => {
          console.log('GOT A MESSAGE!', message); // eslint-disable-line
          this.props.addMessage(message.to, {
            text: message.body.text,
            from: message.metadata && message.metadata.name ? message.metadata.name : message.from,
            type: message.metadata.type,
            timestamp: message.timestamp,
          });
        } });
      }
    };

    const changePresenceParams = {
      state: newPresence,
      'on-complete': changePresStateOnComplete,
    };

    SDK.Agent.Session.changePresenceState(changePresenceParams);
  }

  acceptInteraction(interactionId) {
    SDK.Agent.Session.Messaging.workNotificationHandler({ interactionId }, 'work-initiated');
  }

  styles = {
    base: {
      // styles
    },
    parent: {
      alignItems: 'stretch',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignContent: 'stretch',
    },
    columnParent: {
      flexDirection: 'column',
    },
    flexchild: {
      flex: '1',
      alignSelf: 'auto',
      overflow: 'auto',
    },
    toolbar: {
      flex: '0 0 auto',
      height: '54px',
    },
    sidebar: {
      flex: '0 0 auto',
      width: '100%',
    },
    interactions: {
      flex: '0 0 auto',
      width: '277px',
      borderBottom: '1px solid #141414',
    },
  };

  render() {
    return (
      <div>
        {
          this.props.login.showLogin
          ? <Login beginSession={this.beginSession} />
          : <div id="desktop-container" style={[this.styles.flexchild, this.styles.parent, this.styles.columnParent, { height: '100vh' }]}>
            <div id="top-area" style={[this.styles.flexchild, this.styles.parent, { height: 'calc(100vh - 54px)' }]}>
              <InteractionsBar acceptInteraction={this.acceptInteraction} setInteractionStatus={this.props.setInteractionStatus} selectInteraction={this.props.selectInteraction} style={[this.styles.flexchild, this.styles.interactions]} />
              <MainContentArea emailCreateReply={this.props.emailCreateReply} emailCancelReply={this.props.emailCancelReply} style={[this.styles.flexchild]} />
              <Resizable direction="left" setPx={this.setContactsPanelWidth} disabledPx={this.collapsedContactsPanelPx} px={this.state.contactsPanelPx} maxPx={window.innerWidth - 827} minPx={415} disabled={this.state.collapseContactsPanel}>
                <SidePanel style={[this.styles.sidebar]} isCollapsed={this.state.collapseContactsPanel} collapsePanel={this.collapseContactsPanel} showPanel={this.showContactsPanel} />
              </Resizable>
            </div>
            <Toolbar
              availablePresences={this.props.agentDesktop.availablePresences}
              tenant={this.props.login.tenant}
              changePresence={this.changePresence}
              readyState={this.props.agentDesktop.presence}
              agentDirection={this.props.agentDesktop.direction}
              style={[this.styles.flexchild, this.styles.toolbar]}
            />
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = selectAgentDesktop();

function mapDispatchToProps(dispatch) {
  return {
    setTenantId: (tenantId) => dispatch(setTenantId(tenantId)),
    setPresence: (presence) => dispatch(setPresence(presence)),
    setDirection: (direction) => dispatch(setDirection(direction)),
    setAvailablePresences: (availablePresences) => dispatch(setAvailablePresences(availablePresences)),
    setInteractionStatus: (interactionId, newStatus) => dispatch(setInteractionStatus(interactionId, newStatus)),
    addInteraction: (interaction) => dispatch(addInteraction(interaction)),
    removeInteraction: (interactionId) => dispatch(removeInteraction(interactionId)),
    setMessageHistory: (interactionId, messageHistoryItems) => dispatch(setMessageHistory(interactionId, messageHistoryItems)),
    addMessage: (interactionId, message) => dispatch(addMessage(interactionId, message)),
    selectInteraction: (interactionId) => dispatch(selectInteraction(interactionId)),
    setCustomFields: (interactionId, customFields) => dispatch(setCustomFields(interactionId, customFields)),
    emailCreateReply: (interactionId) => dispatch(emailCreateReply(interactionId)),
    emailCancelReply: (interactionId) => dispatch(emailCancelReply(interactionId)),
    dispatch,
  };
}

AgentDesktop.propTypes = {
  showLogin: PropTypes.bool,
  login: PropTypes.object,
  setTenantId: PropTypes.func,
  setDirection: PropTypes.func,
  setPresence: PropTypes.func,
  setAvailablePresences: PropTypes.func,
  setInteractionStatus: PropTypes.func,
  addInteraction: PropTypes.func,
  removeInteraction: PropTypes.func,
  setMessageHistory: PropTypes.func,
  addMessage: PropTypes.func,
  selectInteraction: PropTypes.func,
  setCustomFields: PropTypes.func,
  emailCreateReply: PropTypes.func,
  emailCancelReply: PropTypes.func,
  agentDesktop: PropTypes.object,
  tenant: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(AgentDesktop)));
