/*
 *
 * AgentDesktop
 *
 */

import '../../../node_modules/cxengage-js-sdk/release/cxengage-js-sdk.min';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import selectAgentDesktop, { selectLogin } from './selectors';

// import { mockContact } from 'utils/mocking';

import InteractionsBar from 'containers/InteractionsBar';
import MainContentArea from 'containers/MainContentArea';
import PhoneControls from 'containers/PhoneControls';
import SidePanel from 'containers/SidePanel';
import Toolbar from 'containers/Toolbar';

import Resizable from 'components/Resizable';

import Login from 'containers/Login';

import Radium from 'radium';

import { setPresence, addInteraction, addMessage, setMessageHistory, assignContact,
  setInteractionStatus, removeInteraction, selectInteraction, setCustomFields, emailCreateReply, emailCancelReply } from './actions';

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
      isContactsPanelCollapsed: true,
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
      switch (topic) {
        case 'cxengage/session/state-changed': {
          this.props.setPresence(response);
          break;
        }
        case 'cxengage/interactions/work-offer': {
          this.props.addInteraction(response);
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
        // Igonore these pubsubs
        case 'cxengage/authentication/login': // Handled in Login component
        case 'cxengage/session/active-tenant-set': // Handled in Login component
        case 'cxengage/session/started': // Not needed
        case 'cxengage/interactions/accept-response': // Using cxengage/interactions/work-accepted instead
        case 'cxengage/interactions/end-response': // Using cxengage/interactions/work-ended instead
        case 'cxengage/messaging/send-message-response': // Using cxengage/messaging/new-message-received instead
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

  acceptInteraction(interactionId, autoSelect) {
    this.props.setInteractionStatus(interactionId, 'work-accepting');
    if (autoSelect) {
      this.selectInteraction(interactionId);
    }
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
    flexchild: {
      flex: '1',
      alignSelf: 'auto',
      overflow: 'auto',
    },
    leftArea: {
      flex: '0 0 auto',
      width: '283px',
      borderBottom: '1px solid #141414',
    },
    phoneControls: {
      height: '64px',
    },
    interactionsBar: {
      height: 'calc(100% - 64px)',
    },
    mainContentArea: {
      borderBottom: '1px solid #141414',
    },
    toolbar: {
      flex: '0 0 auto',
      height: '54px',
    },
    sidebar: {
      flex: '0 0 auto',
      width: '100%',
    },
  };

  render() {
    return (
      <div>
        {
          this.props.login.showLogin
          ? <Login />
          : <div id="desktop-container" style={[this.styles.flexchild, this.styles.parent, this.styles.columnParent, { height: '100vh' }]}>
            <div id="top-area" style={[this.styles.flexchild, this.styles.parent, { height: 'calc(100vh - 54px)' }]}>
              <div style={[this.styles.flexchild, this.styles.leftArea]}>
                <PhoneControls style={[this.styles.phoneControls]} />
                <InteractionsBar acceptInteraction={this.acceptInteraction} setInteractionStatus={this.props.setInteractionStatus} selectInteraction={this.selectInteraction} style={[this.styles.interactionsBar]} />
              </div>
              <MainContentArea emailCreateReply={this.props.emailCreateReply} emailCancelReply={this.props.emailCancelReply} style={[this.styles.flexchild, this.styles.mainContentArea]} />
              {
                (this.props.agentDesktop.selectedInteractionId !== undefined) ?
                  <Resizable direction="left" setPx={this.setContactsPanelWidth} disabledPx={this.collapsedContactsPanelPx} px={this.state.contactsPanelPx} maxPx={window.innerWidth - 827} minPx={415} disabled={this.state.isContactsPanelCollapsed}>
                    <SidePanel style={[this.styles.sidebar]} isCollapsed={this.state.isContactsPanelCollapsed} collapsePanel={this.collapseContactsPanel} showPanel={this.showContactsPanel} />
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
              style={[this.styles.flexchild, this.styles.toolbar]}
            />
          </div>
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
    assignContact: (interactionId, messageHistoryItems) => dispatch(assignContact(interactionId, messageHistoryItems)),
    addMessage: (response) => dispatch(addMessage(response)),
    selectInteraction: (interactionId) => dispatch(selectInteraction(interactionId)),
    setCustomFields: (interactionId, customFields) => dispatch(setCustomFields(interactionId, customFields)),
    emailCreateReply: (interactionId) => dispatch(emailCreateReply(interactionId)),
    emailCancelReply: (interactionId) => dispatch(emailCancelReply(interactionId)),
    dispatch,
  };
}

AgentDesktop.propTypes = {
  setPresence: PropTypes.func,
  setInteractionStatus: PropTypes.func,
  addInteraction: PropTypes.func,
  removeInteraction: PropTypes.func,
  setMessageHistory: PropTypes.func,
  // assignContact: PropTypes.func,
  addMessage: PropTypes.func,
  selectInteraction: PropTypes.func,
  // TODO when in SDK
  // setCustomFields: PropTypes.func,
  emailCreateReply: PropTypes.func,
  emailCancelReply: PropTypes.func,
  login: PropTypes.object,
  agentDesktop: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(AgentDesktop)));
