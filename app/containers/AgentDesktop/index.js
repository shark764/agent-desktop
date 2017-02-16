/*
 *
 * AgentDesktop
 *
 */

import '../../../node_modules/cxengage-javascript-sdk/release/cxengage-javascript-sdk.min';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import selectAgentDesktop, { selectLogin } from './selectors';

import InteractionsBar from 'containers/InteractionsBar';
import MainContentArea from 'containers/MainContentArea';
import PhoneControls from 'containers/PhoneControls';
import SidePanel from 'containers/SidePanel';
import Toolbar from 'containers/Toolbar';

import Resizable from 'components/Resizable';

import Login from 'containers/Login';

import Radium from 'radium';

import { setPresence, addInteraction, workInitiated, addMessage, setMessageHistory, assignContact, setInteractionQuery, setInteractionStatus, removeInteraction, selectInteraction,
  setCustomFields, muteCall, unmuteCall, holdCall, resumeCall, recordCall, stopRecordCall, emailCreateReply, emailCancelReply, addSearchFilter, removeSearchFilter, setContactAction } from './actions';


export class AgentDesktop extends React.Component {

  constructor(props) {
    super(props);
    this.showContactsPanel = this.showContactsPanel.bind(this);
    this.collapseContactsPanel = this.collapseContactsPanel.bind(this);
    this.acceptInteraction = this.acceptInteraction.bind(this);
    this.setContactsPanelWidth = this.setContactsPanelWidth.bind(this);
    this.selectInteraction = this.selectInteraction.bind(this);

    this.collapsedContactsPanelPx = 52;
    this.defaultContactsPanelPx = Math.min(window.innerWidth - 827, 553);

    this.state = {
      isContactsPanelCollapsed: false,
      contactsPanelPx: this.defaultContactsPanelPx,
    };
  }

  componentDidMount() {
    let env;
    switch (window.location.hostname) {
      case 'qe-desktop.cxengagelabs.net':
        env = 'qe';
        break;
      case 'dev-desktop.cxengagelabs.net':
        env = 'dev';
        break;
      default:
        env = 'dev';
        break;
    }

    window.SDK = cxengage.sdk.init({ env });

    SDK.subscribe('cxengage', (error, topic, response) => {
      if (error) {
        console.error('Pub sub error', topic, error); // eslint-disable-line no-console
        return;
      }
      switch (topic) {
        case 'cxengage/session/started': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          SDK.contacts.listAttributes();
          SDK.contacts.listLayouts();
          break;
        }
        case 'cxengage/session/state-changed': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.setPresence(response);
          break;
        }
        case 'cxengage/interactions/work-offer': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.addInteraction(response);
          break;
        }
        case 'cxengage/interactions/work-initiated': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.workInitiated(response);
          // attempt to auto-assign contact
          const interaction = this.props.agentDesktop.interactions.find((availableInteraction) => availableInteraction.interactionId === response.interactionId);
          if (interaction && (interaction.channelType === 'voice' || interaction.channelType === 'sms')) {
            this.attemptContactSearch(response.customer, response.interactionId);
          }
          break;
        }
        case 'cxengage/messaging/history': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.setMessageHistory(response);
          // attempt to auto-assign contact
          const interaction = this.props.agentDesktop.interactions.find((availableInteraction) => availableInteraction.interactionId === response[0].channelId);
          if (interaction && (interaction.channelType === 'messaging')) {
            const customerMessage = response.find((message) => message.payload.metadata.type === 'customer'); // History has been coming in with initial customer issue message missing
            if (customerMessage && customerMessage.payload && customerMessage.payload.from) {
              this.attemptContactSearch(customerMessage.payload.from, customerMessage.channelId);
            }
          }
          break;
        }
        case 'cxengage/interactions/work-accepted': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.setInteractionStatus(response.interactionId, 'work-accepted');
          break;
        }
        case 'cxengage/interactions/work-rejected':
        case 'cxengage/interactions/work-ended': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.removeInteraction(response.interactionId);
          break;
        }
        case 'cxengage/messaging/new-message-received': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.addMessage(response);
          break;
        }
        case 'cxengage/voice/mute-started': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.muteCall(response.interactionId);
          break;
        }
        case 'cxengage/voice/mute-ended': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.unmuteCall(response.interactionId);
          break;
        }
        case 'cxengage/voice/hold-started': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.holdCall(response.interactionId);
          break;
        }
        case 'cxengage/voice/hold-ended': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.resumeCall(response.interactionId);
          break;
        }
        case 'cxengage/voice/recording-started': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.recordCall(response.interactionId);
          break;
        }
        case 'cxengage/voice/recording-ended': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.stopRecordCall(response.interactionId);
          break;
        }
        case 'cxengage/contacts/create-response': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.assignContact(this.props.agentDesktop.selectedInteractionId, response);
          break;
        }
        // Igonore these pubsubs. They are unneeded or handled elsewhere.
        case 'cxengage/authentication/login': // Handled in Login component
        case 'cxengage/session/active-tenant-set': // Handled in Login component
        case 'cxengage/interactions/accept-response': // Using cxengage/interactions/work-accepted instead
        case 'cxengage/interactions/end-response': // Using cxengage/interactions/work-ended instead
        case 'cxengage/messaging/send-message-response': // Using cxengage/messaging/new-message-received instead
        case 'cxengage/voice/phone-controls-response': // Using mute-started, mute-ended, etc. instead
        case 'cxengage/contacts/list-attributes-response': // Handled in SidePanel
        case 'cxengage/contacts/list-layouts-response': // Handled in SidePanel
        case 'cxengage/contacts/search-response': // Handled in ContactsControl & AgentDesktop callback
        case 'cxengage/crud/get-queues-response': // Handled in TransferMenu
        case 'cxengage/crud/get-users-response': // Handled in TransferMenu

          break;
        default: {
          console.warn('AGENT DESKTOP: No pub sub for', error, topic, response); // eslint-disable-line no-console
        }
      }
    });
  }

  attemptContactSearch(from, interactionId) {
    const query = { q: from };
    SDK.contacts.search({ query }, (error, topic, response) => {
      console.log('[AgentDesktop] SDK.subscribe()', topic, response);
      if (response.count === 1) {
        this.props.assignContact(interactionId, response.results[0]);
      } else {
        this.props.setInteractionQuery(interactionId, query);
      }
    });
  }

  setContactsPanelWidth(newWidth) {
    this.setState({
      contactsPanelPx: newWidth,
    });
  }

  collapseContactsPanel() {
    this.setState({
      isContactsPanelCollapsed: true,
    });
  }

  showContactsPanel() {
    this.setState({
      isContactsPanelCollapsed: false,
    });
  }

  selectInteraction(interactionId) {
    this.props.selectInteraction(interactionId);
    this.showContactsPanel();
  }

  acceptInteraction(interactionId) {
    this.props.setInteractionStatus(interactionId, 'work-accepting');
    SDK.interactions.accept({ interactionId });
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
    flexChildGrow: {
      flex: '1 0 auto',
    },
    leftArea: {
      flex: '0 0 auto',
      width: '283px',
      display: 'flex',
      flexFlow: 'column',
    },
    phoneControls: {
      flex: '0 0 auto',
    },
    interactionsBar: {
      flex: '1 0 auto',
    },
    toolbar: {
      flex: '0 0 auto',
      height: '54px',
    },
    topArea: {
      height: 'calc(100vh - 54px)',
      borderBottom: '1px solid #141414',
    },
  };

  render() {
    return (
      <div>
        {
          this.props.login.showLogin
            ? <Login />
            : <span>
              <div id="desktop-container" style={[this.styles.flexChildGrow, this.styles.parent, this.styles.columnParent, { height: '100vh' }]}>
                <div id="top-area" style={[this.styles.flexChildGrow, this.styles.parent, this.styles.topArea]}>
                  <div style={[this.styles.leftArea]}>
                    <PhoneControls style={[this.styles.phoneControls]} />
                    <InteractionsBar acceptInteraction={this.acceptInteraction} setInteractionStatus={this.props.setInteractionStatus} selectInteraction={this.selectInteraction} style={[this.styles.interactionsBar]} />
                  </div>
                  <MainContentArea emailCreateReply={this.props.emailCreateReply} emailCancelReply={this.props.emailCancelReply} style={[this.styles.flexChildGrow]} />
                  {
                    (this.props.agentDesktop.selectedInteractionId !== undefined) ?
                      <Resizable id="crm-resizable" direction="left" setPx={this.setContactsPanelWidth} disabledPx={this.collapsedContactsPanelPx} px={this.state.contactsPanelPx} maxPx={window.innerWidth - 827} minPx={430} isDisabled={this.state.isContactsPanelCollapsed} style={this.styles.topArea} >
                      </Resizable>
                      :
                      ''
                  }
                </div>
                <Toolbar
                  availablePresences={this.props.agentDesktop.availablePresences}
                  tenant={this.props.login.tenant}
                  readyState={this.props.agentDesktop.presence}
                  agentDirection={this.props.agentDesktop.direction}
                  style={[this.styles.flexChildGrow, this.styles.toolbar]}
                />
              </div>
              <SidePanel
                style={this.styles.topArea}
                collapsedPx={this.collapsedContactsPanelPx}
                openPx={this.state.contactsPanelPx}
                isCollapsed={this.state.isContactsPanelCollapsed}
                collapsePanel={this.collapseContactsPanel}
                showPanel={this.showContactsPanel}
                assignContact={this.props.assignContact}
                addSearchFilter={this.props.addSearchFilter}
                removeSearchFilter={this.props.removeSearchFilter}
                setContactAction={this.props.setContactAction}
              />
            </span>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  login: selectLogin(state, props),
  agentDesktop: selectAgentDesktop(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    setPresence: (response) => dispatch(setPresence(response)),
    setInteractionStatus: (interactionId, newStatus) => dispatch(setInteractionStatus(interactionId, newStatus)),
    addInteraction: (interaction) => dispatch(addInteraction(interaction)),
    workInitiated: (response) => dispatch(workInitiated(response)),
    removeInteraction: (interactionId) => dispatch(removeInteraction(interactionId)),
    setMessageHistory: (response) => dispatch(setMessageHistory(response)),
    assignContact: (interactionId, contact) => dispatch(assignContact(interactionId, contact)),
    addMessage: (response) => dispatch(addMessage(response)),
    selectInteraction: (interactionId) => dispatch(selectInteraction(interactionId)),
    setInteractionQuery: (interactionId, query) => dispatch(setInteractionQuery(interactionId, query)),
    addSearchFilter: (filterName, value) => dispatch(addSearchFilter(filterName, value)),
    removeSearchFilter: (filter) => dispatch(removeSearchFilter(filter)),
    setContactAction: (interactionId, newAction) => dispatch(setContactAction(interactionId, newAction)),
    setCustomFields: (interactionId, customFields) => dispatch(setCustomFields(interactionId, customFields)),
    muteCall: (interactionId) => dispatch(muteCall(interactionId)),
    unmuteCall: (interactionId) => dispatch(unmuteCall(interactionId)),
    holdCall: (interactionId) => dispatch(holdCall(interactionId)),
    resumeCall: (interactionId) => dispatch(resumeCall(interactionId)),
    recordCall: (interactionId) => dispatch(recordCall(interactionId)),
    stopRecordCall: (interactionId) => dispatch(stopRecordCall(interactionId)),
    emailCreateReply: (interactionId) => dispatch(emailCreateReply(interactionId)),
    emailCancelReply: (interactionId) => dispatch(emailCancelReply(interactionId)),
    dispatch,
  };
}

AgentDesktop.propTypes = {
  setPresence: PropTypes.func.isRequired,
  setInteractionStatus: PropTypes.func.isRequired,
  addInteraction: PropTypes.func.isRequired,
  workInitiated: PropTypes.func.isRequired,
  removeInteraction: PropTypes.func.isRequired,
  setMessageHistory: PropTypes.func.isRequired,
  assignContact: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  selectInteraction: PropTypes.func.isRequired,
  addSearchFilter: PropTypes.func.isRequired,
  removeSearchFilter: PropTypes.func.isRequired,
  setContactAction: PropTypes.func.isRequired,
  setInteractionQuery: PropTypes.func.isRequired,
  // TODO when in SDK
  // setCustomFields: PropTypes.func,
  muteCall: PropTypes.func.isRequired,
  unmuteCall: PropTypes.func.isRequired,
  holdCall: PropTypes.func.isRequired,
  resumeCall: PropTypes.func.isRequired,
  recordCall: PropTypes.func.isRequired,
  stopRecordCall: PropTypes.func.isRequired,
  emailCreateReply: PropTypes.func.isRequired,
  emailCancelReply: PropTypes.func.isRequired,
  login: PropTypes.object,
  agentDesktop: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(AgentDesktop)));
