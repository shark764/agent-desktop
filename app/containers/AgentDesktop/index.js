/*
 *
 * AgentDesktop
 *
 */

// TODO get that working
// import '../../../node_modules/cxengage-js-sdk/release/cxengage-js-sdk.min';
import '../../assets/js/cxengagesdk';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import selectAgentDesktop, { selectLogin } from './selectors';

import mockContact from 'utils/mocking';

import InteractionsBar from 'containers/InteractionsBar';
import MainContentArea from 'containers/MainContentArea';
import PhoneControls from 'containers/PhoneControls';
import SidePanel from 'containers/SidePanel';
import Toolbar from 'containers/Toolbar';

import Resizable from 'components/Resizable';

import Login from 'containers/Login';

import Radium from 'radium';

import { setPresence, addInteraction, addMessage, setMessageHistory, assignContact, setInteractionStatus, removeInteraction, selectInteraction,
  setCustomFields, muteCall, unmuteCall, holdCall, resumeCall, recordCall, stopRecordCall, emailCreateReply, emailCancelReply } from './actions';

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
      }
      console.log('[AgentDesktop] SDK.subscribe()', topic, response);
      switch (topic) {
        case 'cxengage/session/state-changed': {
          this.props.setPresence(response);
          break;
        }
        case 'cxengage/interactions/work-offer': {
          this.props.addInteraction(response);
          // WARNING - MUCH MOCKERY
          if (response.channelType === 'voice') {
            this.props.assignContact(response.interactionId, mockContact(response.channelType, response.number || response.from));
          }
          // WARNING - MUCH MOCKERY
          break;
        }
        case 'cxengage/messaging/history': {
          this.props.setMessageHistory(response);
          break;
        }
        case 'cxengage/interactions/work-accepted': {
          this.props.setInteractionStatus(response.interactionId, 'work-accepted');
          break;
        }
        case 'cxengage/interactions/work-rejected':
        case 'cxengage/interactions/work-ended': {
          this.props.removeInteraction(response.interactionId);
          break;
        }
        case 'cxengage/messaging/new-message-received': {
          this.props.addMessage(response);
          break;
        }
        case 'cxengage/voice/mute-started': {
          this.props.muteCall(response.interactionId);
          break;
        }
        case 'cxengage/voice/mute-ended': {
          this.props.unmuteCall(response.interactionId);
          break;
        }
        case 'cxengage/voice/hold-started': {
          this.props.holdCall(response.interactionId);
          break;
        }
        case 'cxengage/voice/hold-ended': {
          this.props.resumeCall(response.interactionId);
          break;
        }
        case 'cxengage/voice/recording-started': {
          this.props.recordCall(response.interactionId);
          break;
        }
        case 'cxengage/voice/recording-ended': {
          this.props.stopRecordCall(response.interactionId);
          break;
        }
        // Igonore these pubsubs
        case 'cxengage/authentication/login': // Handled in Login component
        case 'cxengage/session/active-tenant-set': // Handled in Login component
        case 'cxengage/session/started': // Not needed
        case 'cxengage/interactions/accept-response': // Using cxengage/interactions/work-accepted instead
        case 'cxengage/interactions/end-response': // Using cxengage/interactions/work-ended instead
        case 'cxengage/messaging/send-message-response': // Using cxengage/messaging/new-message-received instead
        case 'cxengage/voice/phone-controls-response': // Using mute-started, mute-ended, etc. instead
          break;
        default: {
          console.warn('AGENT DESKTOP: No pub sub for', error, topic, response); // eslint-disable-line no-console
        }
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
      borderBottom: '1px solid #141414',
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
                  <MainContentArea emailCreateReply={this.props.emailCreateReply} emailCancelReply={this.props.emailCancelReply} style={[this.styles.flexChildGrow, this.styles.bottomBorder]} />
                  {
                    (this.props.agentDesktop.selectedInteractionId !== undefined) ?
                      <Resizable id="crm-resizable" direction="left" setPx={this.setContactsPanelWidth} disabledPx={this.collapsedContactsPanelPx} px={this.state.contactsPanelPx} maxPx={window.innerWidth - 827} minPx={415} isDisabled={this.state.isContactsPanelCollapsed} style={this.styles.topArea} >
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
              {this.props.agentDesktop.selectedInteractionId !== undefined ?
                <SidePanel style={this.styles.topArea} collapsedPx={this.collapsedContactsPanelPx} openPx={this.state.contactsPanelPx} isCollapsed={this.state.isContactsPanelCollapsed} collapsePanel={this.collapseContactsPanel} showPanel={this.showContactsPanel} />
                :
                ''
              }
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
    removeInteraction: (interactionId) => dispatch(removeInteraction(interactionId)),
    setMessageHistory: (response) => dispatch(setMessageHistory(response)),
    assignContact: (interactionId, contact) => dispatch(assignContact(interactionId, contact)),
    addMessage: (response) => dispatch(addMessage(response)),
    selectInteraction: (interactionId) => dispatch(selectInteraction(interactionId)),
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
  removeInteraction: PropTypes.func.isRequired,
  setMessageHistory: PropTypes.func.isRequired,
  assignContact: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  selectInteraction: PropTypes.func.isRequired,
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
