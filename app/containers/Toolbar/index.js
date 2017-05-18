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

import Icon from 'components/Icon';
import Timer from 'components/Timer';
import AgentStatusMenu from 'containers/AgentStatusMenu';
import AgentStats from 'containers/AgentStats';
import AgentConfigMenu from 'containers/AgentConfigMenu';

import { selectSelectedPresenceReason } from 'containers/AgentStatusMenu/selectors';

import { toggleStat, toggleAgentMenu } from './actions';
import selectToolbar, { selectQueues, selectCurrentAgent } from './selectors';
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
    overflow: 'hidden',
  },
  statusButtonContainer: {
    order: '0',
    flex: '0 1 auto',
    width: '277px',
    height: '54px',
  },
  statusButtonNR: {
    cursor: 'pointer',
    marginLeft: '8px',
    marginTop: '3px',
    display: 'flex',
    paddingRight: '23px',
    paddingTop: '8px',
    paddingBottom: '8px',
    outline: 'none',
    height: '47px',
    minWidth: '160px',
    border: 'none',
  },
  statusButtonR: {
    cursor: 'pointer',
    marginLeft: '8px',
    marginTop: '3px',
    display: 'flex',
    paddingRight: '23px',
    paddingTop: '8px',
    paddingBottom: '8px',
    outline: 'none',
    height: '47px',
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

export class Toolbar extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      showConfigMenu: false,
      isStatusButtonHovered: false,
      isConfigButtonHovered: false,
    };
    this.showStatusMenu = this.showStatusMenu.bind(this);
    this.showConfigMenu = this.showConfigMenu.bind(this);
  }

  setStatusButtonHovered(isStatusButtonHovered) {
    this.setState({ isStatusButtonHovered });
  }

  setConfigButtonHovered(isConfigButtonHovered) {
    this.setState({ isConfigButtonHovered });
  }

  showStatusMenu(show = true) {
    this.props.toggleAgentMenu(show);
  }

  showConfigMenu(show = true) {
    this.setState({ showConfigMenu: show });
  }

  notReadyText() {
    if (this.props.selectedPresenceReason.reason && !this.props.selectedPresenceReason.isSystemReason) {
      return <span>{this.props.selectedPresenceReason.reason}</span>;
    }
    return <FormattedMessage {...messages.notReady} />;
  }

  getStatusMenuButtonStyle() {
    const statusButtonStyle = [];
    if (this.props.readyState === 'ready') {
      statusButtonStyle.push(styles.statusButtonR);
      if (this.props.showAgentStatusMenu) {
        statusButtonStyle.push(styles.openButtonR);
      } else if (this.state.isStatusButtonHovered) {
        statusButtonStyle.push(styles.hoverButtonR);
      }
    } else {
      statusButtonStyle.push(styles.statusButtonNR);
      if (this.props.showAgentStatusMenu) {
        statusButtonStyle.push(styles.openButtonNR);
      } else if (this.state.isStatusButtonHovered) {
        statusButtonStyle.push(styles.hoverButtonNR);
      }
    }
    return statusButtonStyle;
  }

  getConfigMenuButtonStyle() {
    const configButtonStyle = [];
    if (this.props.readyState === 'ready') {
      configButtonStyle.push(styles.configButtonR);
      if (this.state.showConfigMenu) {
        configButtonStyle.push(styles.openConfigButtonR);
      } else if (this.state.isConfigButtonHovered) {
        configButtonStyle.push(styles.hoverConfigButtonR);
      }
    } else {
      configButtonStyle.push(styles.configButtonNR);
      if (this.state.showConfigMenu) {
        configButtonStyle.push(styles.openConfigButtonNR);
      } else if (this.state.isConfigButtonHovered) {
        configButtonStyle.push(styles.hoverConfigButtonNR);
      }
    }
    return configButtonStyle;
  }

  getConnectionIconName() {
    const agentIsReady = this.props.readyState === 'ready';
    if (
      ((this.props.showAgentStatusMenu && agentIsReady) || (!this.state.isStatusButtonHovered && agentIsReady))
      || (!this.props.showAgentStatusMenu && this.state.isStatusButtonHovered && !agentIsReady)
    ) {
      return 'connected';
    } else {
      return 'not_connected';
    }
  }

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
        <div id="toolbar-container" style={[styles.container]}>
          <div id="agent-button-container" style={[styles.statusButtonContainer]}>
            <button
              id="agent-button"
              key="status-button"
              style={this.getStatusMenuButtonStyle()}
              onClick={() => this.showStatusMenu(!this.props.showAgentStatusMenu)}
              onMouseEnter={() => this.setStatusButtonHovered(true)}
              onMouseLeave={() => this.setStatusButtonHovered(false)}
            >
              <span id="agent-state" style={[styles.agentState]}>
                <div style={styles.presenceTextContainer}>
                  <Icon name={this.getConnectionIconName()} style={styles.connectionIcon} />
                </div>
                <div style={styles.presenceTextContainer}>
                  <span
                    style={styles.presenceText}
                  >
                    { agentIsReady
                      ? <FormattedMessage {...messages.ready} />
                      : this.notReadyText() }
                  </span>
                  <span id="agent-timer-container-span" style={[styles.agentTimer, agentIsReady && { color: '#14778D' }]}>
                    <Timer id="agent-timer-count" key={this.props.selectedPresenceReason.reason || this.props.readyState} />
                  </span>
                </div>
              </span>
            </button>
          </div>
          <AgentStatusMenu
            show={this.props.showAgentStatusMenu}
            key={'agentStatusMenu'}
            tenant={this.props.tenant}
            readyState={this.props.readyState}
            showAgentStatusMenu={this.showStatusMenu}
            agentDirection={this.props.agentDirection}
          />
          <AgentConfigMenu
            toggleStat={this.props.toggleStat}
            queues={this.props.queues}
            currentAgent={this.props.currentAgent}
            hideMenu={() => this.showConfigMenu(false)}
            show={this.state.showConfigMenu}
            key={'agentConfigMenu'}
          />
          <AgentStats queues={this.props.queues} toggleStat={this.props.toggleStat} readyState={this.props.readyState} />
          <div id="config-button-container" style={styles.configButtonContainer}>
            <button
              id="config-button"
              key="config-button"
              style={this.getConfigMenuButtonStyle()}
              onClick={() => this.showConfigMenu(!this.state.showConfigMenu)}
              onMouseEnter={() => this.setConfigButtonHovered(true)}
              onMouseLeave={() => this.setConfigButtonHovered(false)}
            >
              <Icon id="config-icon" name="config" style={{ width: '22px' }} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    queues: selectQueues(state, props),
    currentAgent: selectCurrentAgent(state, props),
    selectedPresenceReason: selectSelectedPresenceReason(state, props),
    ...selectToolbar()(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleStat: (stat, userId, queues) => dispatch(toggleStat(stat, userId, queues)),
    toggleAgentMenu: (show) => dispatch(toggleAgentMenu(show)),
    dispatch,
  };
}

Toolbar.propTypes = {
  style: PropTypes.array,
  readyState: PropTypes.string,
  tenant: PropTypes.object,
  agentDirection: PropTypes.string,
  toggleStat: PropTypes.func,
  queues: PropTypes.array,
  currentAgent: PropTypes.object,
  showAgentStatusMenu: PropTypes.bool,
  toggleAgentMenu: PropTypes.func,
  selectedPresenceReason: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Toolbar));
