/*
 *
 * Toolbar
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import selectToolbar from './selectors';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Radium from 'radium';

import Icon from 'components/Icon';
import Timer from 'components/Timer';
import AgentMenu from 'containers/AgentStatusMenu';

import { showAgentStatusMenu } from './actions';

export class Toolbar extends React.Component { // eslint-disable-line react/prefer-stateless-function

  getStyle() {
    if (this.props.readyState === 'ready') {
      return [this.styles.base, this.props.style];
    } else {
      return [this.styles.base, this.styles.notReady, this.props.style];
    }
  }

  styles = {
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
      borderRadius: this.props.agentStatusMenu ? '3px' : '0px',
      backgroundColor: this.props.agentStatusMenu ? '#E43D5A' : 'transparent',
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
      borderRadius: this.props.agentStatusMenu ? '3px' : '0px',
      backgroundColor: this.props.agentStatusMenu ? '#E43D5A' : 'transparent',
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
    stats: {
      order: '0',
      flex: '1 1 auto',
      alignSelf: 'auto',
    },
    config: {
      order: '0',
      flex: '0 1 45px',
      alignSelf: 'auto',
      height: '54px',
      width: '50px',
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
  }

  render() {
    return (
      <div key={this.props.readyState} style={this.getStyle()}>
        <div id="toolbar-container" style={[this.styles.container]}>
          <div id="agent-button-container" style={[this.styles.agentButtonContainer]}>
            <button id="agent-button" style={this.props.readyState === 'ready' ? [this.styles.agentButtonR] : [this.styles.agentButtonNR]} onClick={() => this.props.showAgentStatusMenu()}>
              <span id="agent-state" style={[this.styles.agentState]}>
                <div style={{ display: 'inline', float: 'left' }}>
                  {
                    this.props.readyState === 'ready'
                    ? <Icon name="connected" style={{ height: '34px', float: 'left', marginLeft: '17px', marginRight: '23px' }} />
                    : <Icon name="not_connected" style={{ height: '34px', float: 'left', marginLeft: '17px', marginRight: '23px' }} />
                  }
                </div>
                <div style={{ display: 'inline', float: 'left' }}>
                  <span style={{ top: '-3px', position: 'relative', float: 'left', textTransform: 'uppercase' }}>
                    {
                      this.props.readyState === 'ready'
                      ? <FormattedMessage {...messages.ready} />
                      : <FormattedMessage {...messages.notReady} />
                    }
                  </span>
                  <span id="agent-timer-container-span" style={this.props.readyState === 'ready' ? [this.styles.agentTimer, { display: 'block', textAlign: 'left', color: '#14778D' }] : [this.styles.agentTimer, { display: 'block', textAlign: 'left' }]}>
                    <Timer id="agent-timer-count" />
                  </span>
                </div>
              </span>
            </button>
          </div>
          {
            this.props.agentStatusMenu
            ? <AgentMenu
              tenant={this.props.tenant}
              readyState={this.props.readyState}
              showAgentStatusMenu={this.props.showAgentStatusMenu}
              agentDirection={this.props.agentDirection}
              availablePresences={this.props.availablePresences}
            />
            : ''
          }
          <span id="agent-stats" style={[this.styles.stats]} />
          <div id="agent-config" style={[this.styles.config]}>
            <Icon id="agent-config-icon" name="config" style={{ width: '18px', marginLeft: '13px', marginTop: '17px' }} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = selectToolbar();

function mapDispatchToProps(dispatch) {
  return {
    showAgentStatusMenu: (show) => dispatch(showAgentStatusMenu(show)),
    dispatch,
  };
}

Toolbar.propTypes = {
  style: PropTypes.array,
  readyState: PropTypes.string,
  showAgentStatusMenu: PropTypes.func,
  agentStatusMenu: PropTypes.bool,
  tenant: PropTypes.object,
  agentDirection: PropTypes.string,
  availablePresences: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Toolbar));
