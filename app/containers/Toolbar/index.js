/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * Toolbar
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';
import ErrorBoundary from 'components/ErrorBoundary';
import Icon from 'components/Icon';
import Timer from 'components/Timer';
import AgentStatusMenu from 'containers/AgentStatusMenu';
import AgentStats from 'containers/AgentStats';
import AgentPreferencesMenu from 'containers/AgentPreferencesMenu';
import { updateUserAssignedTransferLists } from 'containers/TransferMenu/actions';
import { selectUserAssignedTransferLists } from 'containers/TransferMenu/selectors';
import {
  selectQueues,
  selectQueuesSet,
} from 'containers/AgentDesktop/selectors';
import { selectSelectedPresenceReason } from 'containers/AgentStatusMenu/selectors';
import { selectHasInteractions } from 'containers/InteractionsBar/selectors';
import { toggleAgentMenu } from './actions';
import selectToolbar, { selectReadyState } from './selectors';
import messages from './messages';

const styles = {
  readyBase: {
    backgroundColor: '#072931',
  },
  notReadyBase: {
    backgroundColor: '#FE4565',
  },
  container: {
    display: 'flex',
  },
  statusButtonContainer: {
    position: 'relative',
    order: '0',
    flex: '0 1 auto',
    width: '192px',
    height: '54px',
  },
  statusButton: {
    cursor: 'pointer',
    margin: '4px 3px 0',
    display: 'flex',
    paddingRight: '23px',
    paddingTop: '8px',
    paddingBottom: '8px',
    outline: 'none',
    height: '46px',
    minWidth: '160px',
    border: 'none',
  },
  openButtonNR: {
    borderRadius: '2px',
    boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
    backgroundColor: '#CB3750',
  },
  openButtonR: {
    borderRadius: '2px',
    boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
    backgroundColor: '#0B424E',
  },
  hoverButtonNR: {
    borderRadius: '2px',
    boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
    backgroundColor: '#E43D5A',
  },
  hoverButtonR: {
    borderRadius: '2px',
    boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
    backgroundColor: '#093742',
  },
  configButtonContainer: {
    position: 'relative',
    order: '0',
    flex: '0 1 52px',
    alignSelf: 'auto',
  },
  configButtonR: {
    height: '54px',
    width: '50px',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  configButtonNR: {
    height: '54px',
    width: '50px',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  openConfigButtonNR: {
    borderRadius: '2px',
    boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
    backgroundColor: '#CB3750',
  },
  openConfigButtonR: {
    borderRadius: '2px',
    boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
    backgroundColor: '#0B424E',
  },
  hoverConfigButtonNR: {
    borderRadius: '2px',
    boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
    backgroundColor: '#E43D5A',
  },
  hoverConfigButtonR: {
    borderRadius: '2px',
    boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
    backgroundColor: '#093742',
  },
  agentState: {
    fontSize: '14px',
    lineHeight: '17px',
    color: '#FFFFFF',
    display: 'flex',
    fontWeight: 'lighter',
  },
  agentTimer: {
    fontSize: '16px',
    fontWeight: 'bold',
    lineHeight: '19px',
    height: '14px',
    color: '#FFFFFF',
    position: 'relative',
  },
  presenceText: {
    top: '-3px',
    position: 'relative',
    maxWidth: '6em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    lineHeight: 'normal',
  },
  presenceTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  connectionIcon: {
    height: '34px',
    marginLeft: '17px',
    marginRight: '23px',
  },
};

export class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfigMenu: false,
      isStatusButtonHovered: false,
      isConfigButtonHovered: false,
    };
    if (this.props.transferLists === 'loading') {
      this.initializeTransferLists();
    }
  }

  initializeTransferLists = () => {
    this.props.updateUserAssignedTransferLists();
  };

  setStatusButtonHovered = (isStatusButtonHovered) => {
    this.setState({ isStatusButtonHovered });
  };

  setConfigButtonHovered = (isConfigButtonHovered) => {
    this.setState({ isConfigButtonHovered });
  };

  showStatusMenu = (show = true) => {
    this.props.toggleAgentMenu(show);
  };

  showConfigMenu = (show = true) => {
    if (!this.props.queuesSet) {
      CxEngage.entities.getQueues();
    }
    this.setState({ showConfigMenu: show });
  };

  resetAgentTimer = () => {
    if (this.props.selectedPresenceReason.reason) {
      return `Presence Timer - ${this.props.selectedPresenceReason.reason}`;
    } else if (this.props.hasInteractions) {
      return 'Work Allocated Timer';
    } else {
      return 'Idle Timer';
    }
  };

  notReadyText = () => {
    if (
      this.props.selectedPresenceReason.reason &&
      !this.props.selectedPresenceReason.isSystemReason
    ) {
      return (
        <span>
          {this.props.selectedPresenceReason.reason}
        </span>
      );
    }
    return <FormattedMessage {...messages.notReady} />;
  };

  getStatusMenuButtonStyle = () => {
    const statusButtonStyle = [styles.statusButton];
    if (this.props.readyState === 'ready') {
      if (this.props.showAgentStatusMenu) {
        statusButtonStyle.push(styles.openButtonR);
      } else if (this.state.isStatusButtonHovered) {
        statusButtonStyle.push(styles.hoverButtonR);
      } else {
        statusButtonStyle.push(styles.readyBase);
      }
    } else if (this.props.showAgentStatusMenu) {
      statusButtonStyle.push(styles.openButtonNR);
    } else if (this.state.isStatusButtonHovered) {
      statusButtonStyle.push(styles.hoverButtonNR);
    } else {
      statusButtonStyle.push(styles.notReadyBase);
    }
    return statusButtonStyle;
  };

  getConfigMenuButtonStyle = () => {
    const configButtonStyle = [];
    if (this.props.readyState === 'ready') {
      configButtonStyle.push(styles.configButtonR);
      if (this.state.showConfigMenu) {
        configButtonStyle.push(styles.openConfigButtonR);
      } else if (this.state.isConfigButtonHovered) {
        configButtonStyle.push(styles.hoverConfigButtonR);
      } else {
        configButtonStyle.push(styles.readyBase);
      }
    } else {
      configButtonStyle.push(styles.configButtonNR);
      if (this.state.showConfigMenu) {
        configButtonStyle.push(styles.openConfigButtonNR);
      } else if (this.state.isConfigButtonHovered) {
        configButtonStyle.push(styles.hoverConfigButtonNR);
      } else {
        configButtonStyle.push(styles.notReadyBase);
      }
    }
    return configButtonStyle;
  };

  getConnectionIconName = () => {
    const agentIsReady = this.props.readyState === 'ready';
    if (
      (this.props.showAgentStatusMenu && agentIsReady) ||
      (!this.state.isStatusButtonHovered && agentIsReady) ||
      (!this.props.showAgentStatusMenu &&
        this.state.isStatusButtonHovered &&
        !agentIsReady)
    ) {
      return 'connected';
    } else {
      return 'not_connected';
    }
  };

  render() {
    const agentIsReady = this.props.readyState === 'ready';

    return (
      <div
        key={this.props.readyState}
        style={[
          agentIsReady ? styles.readyBase : styles.notReadyBase,
          this.props.style,
        ]}
      >
        <div id="toolbar-container" style={styles.container}>
          <div id="agent-button-container" style={styles.statusButtonContainer}>
            <button
              id="agent-button"
              key="status-button"
              style={this.getStatusMenuButtonStyle()}
              onClick={() =>
                this.showStatusMenu(!this.props.showAgentStatusMenu)
              }
              onMouseEnter={() => this.setStatusButtonHovered(true)}
              onMouseLeave={() => this.setStatusButtonHovered(false)}
              type="button"
            >
              <span id="agent-state" style={[styles.agentState]}>
                <div style={styles.presenceTextContainer}>
                  <Icon
                    name={this.getConnectionIconName()}
                    style={styles.connectionIcon}
                  />
                </div>
                <div style={styles.presenceTextContainer}>
                  <span style={styles.presenceText} id="agent_presence_reason">
                    {agentIsReady ? (
                      <FormattedMessage {...messages.ready} />
                    ) : (
                      this.notReadyText()
                    )}
                  </span>
                  <span
                    id="agent-timer-container-span"
                    style={[
                      styles.agentTimer,
                      agentIsReady && { color: '#14778D' },
                    ]}
                  >
                    <Timer
                      id="agent-timer-count"
                      key={this.resetAgentTimer()}
                    />
                  </span>
                </div>
              </span>
            </button>
            <AgentStatusMenu
              show={this.props.showAgentStatusMenu}
              key="agentStatusMenu"
              tenant={this.props.tenant}
              readyState={this.props.readyState}
              showAgentStatusMenu={this.showStatusMenu}
            />
          </div>
          <AgentStats
            queues={this.props.queues}
            readyState={this.props.readyState}
          />
          <div
            id="config-button-container"
            style={styles.configButtonContainer}
          >
            <button
              id="config-button"
              style={this.getConfigMenuButtonStyle()}
              onClick={() => this.showConfigMenu(!this.state.showConfigMenu)}
              onMouseEnter={() => this.setConfigButtonHovered(true)}
              onMouseLeave={() => this.setConfigButtonHovered(false)}
              type="button"
            >
              <Icon id="config-icon" name="config" style={{ width: '22px' }} />
            </button>
            <AgentPreferencesMenu
              hideMenu={() => this.showConfigMenu(false)}
              isVisible={this.state.showConfigMenu}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    queues: selectQueues(state, props),
    selectedPresenceReason: selectSelectedPresenceReason(state, props),
    hasInteractions: selectHasInteractions(state, props),
    readyState: selectReadyState(state, props),
    queuesSet: selectQueuesSet(state, props),
    ...selectToolbar()(state, props),
    transferLists: selectUserAssignedTransferLists(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleAgentMenu: (show) => dispatch(toggleAgentMenu(show)),
    updateUserAssignedTransferLists: () =>
      dispatch(updateUserAssignedTransferLists()),
    dispatch,
  };
}

Toolbar.propTypes = {
  style: PropTypes.array,
  readyState: PropTypes.string,
  tenant: PropTypes.object,
  queues: PropTypes.array,
  showAgentStatusMenu: PropTypes.bool,
  toggleAgentMenu: PropTypes.func,
  selectedPresenceReason: PropTypes.object,
  hasInteractions: PropTypes.bool,
  queuesSet: PropTypes.bool,
  transferLists: PropTypes.PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  updateUserAssignedTransferLists: PropTypes.func.isRequired,
};

export default ErrorBoundary(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Radium(Toolbar))
);
