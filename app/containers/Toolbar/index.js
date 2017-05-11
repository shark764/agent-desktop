/*
 *
 * Toolbar
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
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
  base: {
    backgroundColor: '#072931',
  },
  notReady: {
    backgroundColor: '#FE4565',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignContent: 'stretch',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  agentButtonContainer: {
    order: '0',
    flex: '0 1 auto',
    alignSelf: 'auto',
    width: '277px',
    height: '54px',
  },
  agentButtonNR: {
    cursor: 'pointer',
    marginLeft: '8px',
    marginTop: '3px',
    display: 'inline-grid',
    paddingRight: '23px',
    paddingTop: '8px',
    paddingBottom: '8px',
    outline: 'none',
    height: '47px',
    minWidth: '160px',
    border: 'none',
    ':hover': {
      borderRadius: '2px',
      border: 'none',
      boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
      backgroundColor: '#E43D5A',
    },
    ':focus': {
      borderRadius: '2px',
      border: 'none',
      boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
      backgroundColor: '#CB3750',
    },
  },
  agentButtonR: {
    cursor: 'pointer',
    marginLeft: '8px',
    marginTop: '3px',
    display: 'inline-grid',
    paddingRight: '23px',
    paddingTop: '8px',
    paddingBottom: '8px',
    outline: 'none',
    height: '47px',
    minWidth: '160px',
    border: 'none',
    ':hover': {
      borderRadius: '2px',
      border: 'none',
      boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
      backgroundColor: '#093742',
    },
    ':focus': {
      borderRadius: '2px',
      boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
      backgroundColor: '#0B424E',
    },
  },
  configButtonContainer: {
    order: '0',
    flex: '0 1 52px',
    alignSelf: 'auto',
  },
  configR: {
    height: '54px',
    width: '50px',
    outline: 'none',
    ':hover': {
      borderRadius: '2px',
      boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
      backgroundColor: '#093742',
    },
    ':focus': {
      borderRadius: '2px',
      boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
      backgroundColor: '#0B424E',
    },
  },
  configNR: {
    height: '54px',
    width: '50px',
    outline: 'none',
    ':hover': {
      borderRadius: '2px',
      boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
      backgroundColor: '#E43D5A',
    },
    ':focus': {
      borderRadius: '2px',
      boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
      backgroundColor: '#CB3750',
    },
  },
  agentState: {
    fontSize: '14px',
    lineHeight: '17px',
    color: '#FFFFFF',
    display: 'block',
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
    float: 'left',
    maxWidth: '5.7em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  presenceTextContainer: {
    display: 'inline',
    float: 'left',
  },
};

export class Toolbar extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      agentConfigMenu: false,
    };
    this.showAgentStatusMenu = this.showAgentStatusMenu.bind(this);
    this.showAgentConfigMenu = this.showAgentConfigMenu.bind(this);
  }

  getStyle() {
    if (this.props.readyState === 'ready') {
      return [styles.base, this.props.style];
    } else {
      return [styles.base, styles.notReady, this.props.style];
    }
  }


  showAgentStatusMenu(show = true) {
    this.props.toggleAgentMenu(show);
  }

  showAgentConfigMenu(show = true) {
    this.setState({ agentConfigMenu: show });
  }

  notReadyText() {
    if (this.props.selectedPresenceReason.reason && !this.props.selectedPresenceReason.isSystemReason) {
      return this.props.selectedPresenceReason.reason;
    }
    return <FormattedMessage {...messages.notReady} />;
  }

  render() {
    return (
      <div key={this.props.readyState} style={this.getStyle()}>
        <div id="toolbar-container" style={[styles.container]}>
          <div id="agent-button-container" style={[styles.agentButtonContainer]}>
            <button
              id="agent-button"
              key="status-button"
              style={[this.props.readyState === 'ready' ? styles.agentButtonR : styles.agentButtonNR]}
              onClick={() => this.showAgentStatusMenu(!this.props.showAgentStatusMenu)}
            >
              <span id="agent-state" style={[styles.agentState]}>
                <div style={styles.presenceTextContainer}>
                  {
                    this.props.readyState === 'ready'
                    ? <Icon name="connected" style={{ height: '34px', float: 'left', marginLeft: '17px', marginRight: '23px' }} />
                    : <Icon name="not_connected" style={{ height: '34px', float: 'left', marginLeft: '17px', marginRight: '23px' }} />
                  }
                </div>
                <div style={styles.presenceTextContainer}>
                  <span
                    style={styles.presenceText}
                  >
                    {
                      this.props.readyState === 'ready'
                      ? <FormattedMessage {...messages.ready} />
                      : this.notReadyText()
                    }
                  </span>
                  <span id="agent-timer-container-span" style={this.props.readyState === 'ready' ? [styles.agentTimer, { display: 'block', textAlign: 'left', color: '#14778D' }] : [styles.agentTimer, { display: 'block', textAlign: 'left' }]}>
                    <Timer id="agent-timer-count" />
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
            showAgentStatusMenu={this.showAgentStatusMenu}
            agentDirection={this.props.agentDirection}
          />
          <AgentConfigMenu
            toggleStat={this.props.toggleStat}
            queues={this.props.queues}
            currentAgent={this.props.currentAgent}
            hideMenu={() => this.showAgentConfigMenu(false)}
            show={this.state.agentConfigMenu}
            key={'agentConfigMenu'}
          />
          <AgentStats queues={this.props.queues} toggleStat={this.props.toggleStat} readyState={this.props.readyState} />
          <div id="config-button-container" style={styles.configButtonContainer}>
            <button
              id="config-button"
              key="config-button"
              style={[this.props.readyState === 'ready' ? styles.configR : styles.configNR]}
              onClick={() => this.showAgentConfigMenu(!this.state.agentConfigMenu)}
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
