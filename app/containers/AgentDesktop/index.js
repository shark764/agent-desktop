/*
 *
 * AgentDesktop
 *
 */
import 'cxengage-javascript-sdk/release/cxengage-javascript-sdk.min';

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

import { showLogin, tenantError, logout } from 'containers/Login/actions';
import { setContactLayout, setContactAttributes } from 'containers/SidePanel/actions';
import { setExtensions, updateWrapupDetails, setPresence, addInteraction, workInitiated, addMessage, setMessageHistory, assignContact, updateContact, setInteractionQuery, setInteractionStatus, removeInteraction, selectInteraction,
  setCustomFields, muteCall, unmuteCall, holdCall, resumeCall, recordCall, stopRecordCall, transferCancelled, transferConnected, emailCreateReply, emailCancelReply, addSearchFilter,
  removeSearchFilter, setContactAction } from './actions';

import selectAgentDesktop, { selectLogin } from './selectors';

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
      isContactsPanelCollapsed: true,
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

    let where;
    let environment;
    let logLevel;
    let blastSqsOutput;
    if (typeof window.ADconf !== 'undefined') {
      where = window.ADconf.api;
      environment = window.ADconf.env;
      logLevel = 'info';
      blastSqsOutput = false;
    } else if (location.hostname === 'localhost') {
      where = 'dev-api.cxengagelabs.net/v1/';
      environment = 'dev';
      logLevel = 'debug';
      blastSqsOutput = true;
    } else {
      console.error('Server conf file not found, Unable to load desktop');
    }

    const sdkConf = { baseUrl: `https://${where}`, logLevel, blastSqsOutput, environment };
    window.SDK = serenova.cxengage.initialize(sdkConf);

    SDK.subscribe('cxengage', (error, topic, response) => {
      if (error) {
        console.error('Pub sub error', topic, error); // eslint-disable-line no-console
        if (error.code === 1400) { // Missing CRM Perms
          this.props.tenantError(messages.noPermsError);
        }
        return;
      }
      switch (topic) {
        case 'cxengage/session/extension-list': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.setExtensions(response);
          break;
        }
        case 'cxengage/session/started': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.showLogin(false);
          SDK.contacts.listAttributes();
          SDK.contacts.listLayouts();
          break;
        }
        case 'cxengage/capabilities/voice-available':
        case 'cxengage/capabilities/messaging-available': {
          // TODO set these in state?
          window.SDK = serenova.cxengage.api;
          break;
        }
        case 'cxengage/session/state-change-response': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.setPresence(response);
          if (response.state === 'offline') {
            // FIXME do this instead when it's working on the SDK
            // this.props.logout();
            window.location.reload();
          }
          break;
        }
        case 'cxengage/session/ended': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          // FIXME do this instead when it's working on the SDK
          // this.props.logout();
          window.location.reload();
          break;
        }
        case 'cxengage/interactions/voice/dial-response': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          if (error) console.error(error); // TODO: toast error
          break;
        }
        case 'cxengage/interactions/work-offer-received': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.addInteraction(response);
          break;
        }
        case 'cxengage/interactions/work-initiated-received': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.workInitiated(response);
          // attempt to auto-assign contact
          const interaction = this.props.agentDesktop.interactions.find((availableInteraction) => availableInteraction.interactionId === response.interactionId);
          if (interaction && (interaction.channelType === 'voice' || interaction.channelType === 'sms')) {
            let fromNumber = response.customer;
            if (fromNumber[0] !== '+') fromNumber = `+${fromNumber}`; // server currently stripping +'s on SMS
            this.attemptContactSearch(fromNumber, response.interactionId, true);
          }
          if (interaction.autoAnswer === true) {
            this.acceptInteraction(response.interactionId);
          }
          break;
        }
        case 'cxengage/interactions/messaging/history-received': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.setMessageHistory(response);
          // attempt to auto-assign contact
          const interaction = this.props.agentDesktop.interactions.find((availableInteraction) => availableInteraction.interactionId === response[0].to);
          if (interaction !== undefined && interaction.channelType === 'messaging') {
            const customerMessage = response.find((message) => message.metadata.type === 'customer'); // History has been coming in with initial customer issue message missing
            if (customerMessage && customerMessage.metadata && customerMessage.metadata.name) {
              this.attemptContactSearch(customerMessage.metadata.name, customerMessage.to, false);
            } else {
              console.error('customer name not found in:', interaction);
            }
          } else {
            console.warn('no customer message found for interaction:', interaction);
          }
          break;
        }
        case 'cxengage/interactions/work-accepted-received': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.setInteractionStatus(response.interactionId, 'work-accepted');
          break;
        }
        case 'cxengage/interactions/custom-fields-received': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.setCustomFields(response.interactionId, response.customFields);
          break;
        }
        case 'cxengage/interactions/wrapup-ended':
        case 'cxengage/interactions/work-rejected':
        case 'cxengage/interactions/work-ended-received': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.removeInteraction(response.interactionId);
          break;
        }
        case 'cxengage/interactions/messaging/new-message-received': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.addMessage(response);
          break;
        }
        case 'cxengage/interactions/voice/resource-mute-received': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          if (response.resourceId === this.props.login.agent.userId) {
            this.props.muteCall(response.interactionId);
          }
          break;
        }
        case 'cxengage/interactions/voice/resource-unmute-received': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          if (response.resourceId === this.props.login.agent.userId) {
            this.props.unmuteCall(response.interactionId);
          }
          break;
        }
        case 'cxengage/interactions/voice/customer-hold-received': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.holdCall(response.interactionId);
          break;
        }
        case 'cxengage/interactions/voice/customer-resume-received': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.resumeCall(response.interactionId);
          break;
        }
        case 'cxengage/interactions/voice/recording-start-received': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.recordCall(response.interactionId);
          break;
        }
        case 'cxengage/interactions/voice/recording-end-received': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.stopRecordCall(response.interactionId);
          break;
        }
        case 'cxengage/interactions/voice/cancel-transfer-acknowledged': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.transferCancelled(response.interactionId);
          break;
        }
        case 'cxengage/interactions/voice/transfer-connected': {
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
        case 'cxengage/contacts/create-contact-response': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.assignContact(this.props.agentDesktop.selectedInteractionId, response);
          break;
        }
        case 'cxengage/contacts/update-contact-response': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.updateContact(response);
          break;
        }
        case 'cxengage/interactions/wrapup-started': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.setInteractionStatus(response.interactionId, 'wrapup');
          break;
        }
        case 'cxengage/interactions/wrapup-details-received': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.updateWrapupDetails(response.interactionId, response);
          break;
        }
        case 'cxengage/interactions/enable-wrapup-acknowledged': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.updateWrapupDetails(response.interactionId, { wrapupEnabled: true });
          break;
        }
        case 'cxengage/interactions/disable-wrapup-acknowledged': {
          console.log('[AgentDesktop] SDK.subscribe()', topic, response);
          this.props.updateWrapupDetails(response.interactionId, { wrapupEnabled: false });
          break;
        }
        // Igonore these pubsubs. They are unneeded or handled elsewhere.
        case 'cxengage/authentication/login-response': // Handled in Login component
        case 'cxengage/session/tenant-list': // Using tenants from login-response
        case 'cxengage/session/set-active-tenant-response': // Handled in Login component
        case 'cxengage/session/state-change-request-acknowledged': // Ignore
        case 'cxengage/session/session-heartbeat-response': // Ignore
        case 'cxengage/interactions/accept-acknowledged': // Using cxengage/interactions/work-accepted instead
        case 'cxengage/interactions/end-acknowledged': // Using cxengage/interactions/work-ended instead
        case 'cxengage/interactions/messaging/send-message-acknowledged': // Using cxengage/messaging/new-message-received instead
        case 'cxengage/interactions/voice/phone-controls-response': // Using mute-started, mute-ended, etc. instead
        case 'cxengage/contacts/search-contacts-response': // Handled in ContactsControl & AgentDesktop callback
        case 'cxengage/entities/get-queues-response': // Handled in TransferMenu
        case 'cxengage/entities/get-users-response': // Handled in TransferMenu
        case 'cxengage/entities/get-transfer-lists-response': // Handled in TransferMenu
        case 'cxengage/interactions/voice/transfer-response': // Handled in TransferMenu
        case 'cxengage/interactions/contact-unassigned-acknowledged': // Handled in ContactsControl
        case 'cxengage/interactions/contact-assigned-acknowledged': // Handled in ContactsControl
          break;
        default: {
          console.warn('[AgentDesktop] SDK.subscribe(): No pub sub for', topic, response, error); // eslint-disable-line no-console
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
                  <Resizable id="crm-resizable" direction="left" setPx={this.setContactsPanelWidth} disabledPx={this.collapsedContactsPanelPx} px={this.state.contactsPanelPx} maxPx={this.state.contactsPanelMaxPx} minPx={400} isDisabled={this.state.isContactsPanelCollapsed} style={this.styles.topArea} />
                </div>
                <Toolbar
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
    setExtensions: (response) => dispatch(setExtensions(response)),
    updateWrapupDetails: (interactionId, wrapupDetails) => dispatch(updateWrapupDetails(interactionId, wrapupDetails)),
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
    logout: () => dispatch(logout()),
    dispatch,
  };
}

AgentDesktop.propTypes = {
  showLogin: PropTypes.func.isRequired,
  tenantError: PropTypes.func.isRequired,
  setExtensions: PropTypes.func.isRequired,
  updateWrapupDetails: PropTypes.func.isRequired,
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
  setCustomFields: PropTypes.func.isRequired,
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
  // TODO when fixed in SDK
  // logout: PropTypes.func.isRequired,
  login: PropTypes.object,
  agentDesktop: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(AgentDesktop)));
