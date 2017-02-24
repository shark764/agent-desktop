/*
 *
 * AgentDesktop
 *
 */

import '../../../node_modules/cxengage-javascript-sdk/release/cxengage-javascript-sdk.min';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Radium from 'radium';
import axios from 'axios';

import Resizable from 'components/Resizable';

import InteractionsBar from 'containers/InteractionsBar';
import Login from 'containers/Login';
import MainContentArea from 'containers/MainContentArea';
import PhoneControls from 'containers/PhoneControls';
import SidePanel from 'containers/SidePanel';
import Toolbar from 'containers/Toolbar';

import selectAgentDesktop, { selectLogin } from './selectors';
import { setPresence, addInteraction, workInitiated, addMessage, setMessageHistory, assignContact, updateContact, setInteractionQuery, setInteractionStatus, removeInteraction, selectInteraction,
  setCustomFields, muteCall, unmuteCall, holdCall, resumeCall, recordCall, stopRecordCall, transferCancelled, transferConnected, emailCreateReply, emailCancelReply, addSearchFilter,
  removeSearchFilter, setContactAction } from './actions';
import { showLogin, tenantError } from 'containers/Login/actions';
import { setContactLayout, setContactAttributes } from 'containers/SidePanel/actions';
import messages from './messages';

export class AgentDesktop extends React.Component {

  constructor(props) {
    super(props);
    this.showContactsPanel = this.showContactsPanel.bind(this);
    this.collapseContactsPanel = this.collapseContactsPanel.bind(this);
    this.acceptInteraction = this.acceptInteraction.bind(this);
    this.setContactsPanelWidth = this.setContactsPanelWidth.bind(this);
    this.selectInteraction = this.selectInteraction.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);

    this.collapsedContactsPanelPx = 52;
    this.defaultContactsPanelPx = 600;

    this.state = {
      isContactsPanelCollapsed: false,
      contactsPanelPx: this.defaultContactsPanelPx,
      contactsPanelMaxPx: Math.max(window.innerWidth - 600, 600),
    };
  }

  updateDimensions() {
    const documentElement = document.documentElement;
    const body = document.getElementsByTagName('body')[0];
    const width = window.innerWidth || documentElement.clientWidth || body.clientWidth;
    this.setState({
      contactsPanelMaxPx: Math.max(width - 600, 600),
      contactsPanelPx: this.state.contactsPanelPx > Math.max(width - 600, 600) ? Math.max(width - 600, 600) : this.state.contactsPanelPx,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentWillMount() {
    axios({
      method: 'get',
      url: window.location.href + 'config.json', // eslint-disable-line
    }).then((res) => {
      if (typeof res.data !== 'undefined') {
        window.ADconf = res.data.config;
      }
      this.init();
    });
  }

  init() {
    window.addEventListener('resize', this.updateDimensions);

    let env;
    if (typeof window.ADconf !== 'undefined') {
      env = window.ADconf.api;
    } else if (location.hostname === 'localhost') {
      env = 'dev-api.cxengagelabs.net/v1';
    } else {
      console.error('Server conf file not found, Unable to load desktop');
    }

    const sdkConf = { baseUrl: `https://${env}`, logLevel: 'info', blastSqsOutput: false };
    window.SDK = cxengage.sdk.init(sdkConf);


    SDK.subscribe('cxengage', (error, topic, response) => {
      if (error) {
        console.error('Pub sub error', topic, error); // eslint-disable-line no-console
        if (error.code === 1400) { // Missing CRM Perms
          this.props.tenantError(messages.noPermsError);
        }
        return;
      }
      switch (topic) {
        case 'cxengage/session/started': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.showLogin(false);
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
            let fromNumber = response.customer;
            if (fromNumber[0] !== '+') fromNumber = `+${fromNumber}`; // server currently stripping +'s on SMS
            this.attemptContactSearch(fromNumber, response.interactionId, true);
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
            if (customerMessage && customerMessage.payload && customerMessage.payload.metadata && customerMessage.payload.metadata.name) {
              this.attemptContactSearch(customerMessage.payload.metadata.name, customerMessage.channelId, false);
            } else {
              console.error('customer name not found in:', customerMessage);
            }
          } else {
            console.warn('no customer message found for interaction:', response[0].channelId);
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
        case 'cxengage/voice/cancel-transfer-response': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.transferCancelled(response.interactionId);
          break;
        }
        case 'cxengage/voice/transfer-connected': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.transferConnected(response.interactionId);
          break;
        }
        case 'cxengage/contacts/list-attributes-response': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.setContactAttributes(response);
          break;
        }
        case 'cxengage/contacts/list-layouts-response': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.setContactLayout(response);
          break;
        }
        case 'cxengage/contacts/create-response': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.assignContact(this.props.agentDesktop.selectedInteractionId, response);
          break;
        }
        case 'cxengage/contacts/update-response': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.updateContact(response);
          break;
        }
        // Igonore these pubsubs. They are unneeded or handled elsewhere.
        case 'cxengage/authentication/login': // Handled in Login component
        case 'cxengage/session/active-tenant-set': // Handled in Login component
        case 'cxengage/interactions/accept-response': // Using cxengage/interactions/work-accepted instead
        case 'cxengage/interactions/end-response': // Using cxengage/interactions/work-ended instead
        case 'cxengage/messaging/send-message-response': // Using cxengage/messaging/new-message-received instead
        case 'cxengage/voice/phone-controls-response': // Using mute-started, mute-ended, etc. instead
        case 'cxengage/contacts/search-response': // Handled in ContactsControl & AgentDesktop callback
        case 'cxengage/crud/get-queues-response': // Handled in TransferMenu
        case 'cxengage/crud/get-users-response': // Handled in TransferMenu
        case 'cxengage/crud/get-transfer-lists-response': // Handled in TransferMenu
        case 'cxengage/voice/transfer-response': // Handled in TransferMenu
          break;
        default: {
          console.warn('AGENT DESKTOP: No pub sub for', error, topic, response); // eslint-disable-line no-console
        }
      }
    });
  }

  attemptContactSearch(from, interactionId, exact) {
    console.log('[AgentDesktop] attemptContactSearch()', { query: { q: exact ? encodeURIComponent(`"${from}"`) : encodeURIComponent(from) } });
    SDK.contacts.search({ query: { q: encodeURIComponent(`"${from}"`) } }, (error, topic, response) => {
      console.log('[AgentDesktop] SDK.subscribe()', topic, response);
      if (response.count === 1) {
        this.props.assignContact(interactionId, response.results[0]);
      } else {
        this.props.setInteractionQuery(interactionId, { q: `"${from}"` });
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
          this.props.login.showLogin || this.props.agentDesktop.presence === undefined
            ? <Login />
            : <span>
              <div id="desktop-container" style={[this.styles.flexChildGrow, this.styles.parent, this.styles.columnParent, { height: '100vh' }]}>
                <div id="top-area" style={[this.styles.flexChildGrow, this.styles.parent, this.styles.topArea]}>
                  <div style={[this.styles.leftArea]}>
                    <PhoneControls style={[this.styles.phoneControls]} />
                    <InteractionsBar acceptInteraction={this.acceptInteraction} setInteractionStatus={this.props.setInteractionStatus} selectInteraction={this.selectInteraction} style={[this.styles.interactionsBar]} />
                  </div>
                  <MainContentArea emailCreateReply={this.props.emailCreateReply} emailCancelReply={this.props.emailCancelReply} agent={this.props.login.agent} tenant={this.props.login.tenant} style={{ flex: '1 1 auto' }} />
                  {
                    (this.props.agentDesktop.selectedInteractionId !== undefined) ?
                      <Resizable id="crm-resizable" direction="left" setPx={this.setContactsPanelWidth} disabledPx={this.collapsedContactsPanelPx} px={this.state.contactsPanelPx} maxPx={this.state.contactsPanelMaxPx} minPx={400} isDisabled={this.state.isContactsPanelCollapsed} style={this.styles.topArea} >
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
    showLogin: (show) => dispatch(showLogin(show)),
    tenantError: (error) => dispatch(tenantError(error)),
    setPresence: (response) => dispatch(setPresence(response)),
    setInteractionStatus: (interactionId, newStatus) => dispatch(setInteractionStatus(interactionId, newStatus)),
    addInteraction: (interaction) => dispatch(addInteraction(interaction)),
    workInitiated: (response) => dispatch(workInitiated(response)),
    removeInteraction: (interactionId) => dispatch(removeInteraction(interactionId)),
    setMessageHistory: (response) => dispatch(setMessageHistory(response)),
    assignContact: (interactionId, contact) => dispatch(assignContact(interactionId, contact)),
    updateContact: (updatedContact) => dispatch(updateContact(updatedContact)),
    addMessage: (response) => dispatch(addMessage(response)),
    selectInteraction: (interactionId) => dispatch(selectInteraction(interactionId)),
    setContactLayout: (layout) => dispatch(setContactLayout(layout)),
    setContactAttributes: (attributes) => dispatch(setContactAttributes(attributes)),
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
    transferCancelled: (interactionId) => dispatch(transferCancelled(interactionId)),
    transferConnected: (interactionId) => dispatch(transferConnected(interactionId)),
    emailCreateReply: (interactionId) => dispatch(emailCreateReply(interactionId)),
    emailCancelReply: (interactionId) => dispatch(emailCancelReply(interactionId)),
    dispatch,
  };
}

AgentDesktop.propTypes = {
  showLogin: PropTypes.func.isRequired,
  tenantError: PropTypes.func.isRequired,
  setPresence: PropTypes.func.isRequired,
  setInteractionStatus: PropTypes.func.isRequired,
  addInteraction: PropTypes.func.isRequired,
  workInitiated: PropTypes.func.isRequired,
  removeInteraction: PropTypes.func.isRequired,
  setMessageHistory: PropTypes.func.isRequired,
  assignContact: PropTypes.func.isRequired,
  updateContact: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  selectInteraction: PropTypes.func.isRequired,
  setContactLayout: PropTypes.func.isRequired,
  setContactAttributes: PropTypes.func.isRequired,
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
  transferCancelled: PropTypes.func.isRequired,
  transferConnected: PropTypes.func.isRequired,
  emailCreateReply: PropTypes.func.isRequired,
  emailCancelReply: PropTypes.func.isRequired,
  login: PropTypes.object,
  agentDesktop: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(AgentDesktop)));
