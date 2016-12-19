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

import { showAgentStatusMenu } from './actions';

export class Toolbar extends React.Component { // eslint-disable-line react/prefer-stateless-function

  getStyle() {
    if (this.props.readyState === 'ready') {
      return [this.styles.base, this.props.style];
    } else {
      return [this.styles.base, this.styles.ready, this.props.style];
    }
  }

  styles = {
    base: {
      backgroundColor: '#072931',
    },
    ready: {
      backgroundColor: '#FE4565',
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignContent: 'stretch',
      alignItems: 'flex-start',
    },
    agentButtonContainer: {
      order: '0',
      flex: '0 1 auto',
      alignSelf: 'auto',
      borderRight: '1px solid rgba(6, 30, 36, 1.0)',
      width: '277px',
      height: '54px',
    },
    agentButton: {
      cursor: 'pointer',
      marginLeft: '11px',
      marginTop: '5px',
      display: 'inline-grid',
      paddingLeft: '8px',
      paddingRight: '8px',
      paddingTop: '3px',
      paddingBottom: '4px',
      outline: 'none',
      borderRadius: this.props.agentStatusMenu ? '2px' : '0px',
      boxShadow: this.props.agentStatusMenu ? '0 0 2px 1px rgba(0,0,0,0.29)' : 'none',
      backgroundColor: this.props.agentStatusMenu ? '#C93952' : 'transparent',
      ':hover': {
        borderRadius: '2px',
        boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
        backgroundColor: '#C93952',
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
      backgroundColor: 'rgba(59, 59, 59, 1.0)',
      height: '54px',
      width: '50px',
    },
    agentState: {
      fontSize: '16px',
      lineHeight: '19px',
      color: '#FFFFFF',
      display: 'block',
      fontWeight: 'lighter',
    },
    agentTimer: {
      fontSize: '16px',
      fontWeight: 'bold',
      lineHeight: '19px',
      color: '#FFFFFF',
    },
    agentStatusMenu: {
      position: 'fixed',
      width: '303px',
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 6px 1px rgba(0,0,0,0.29)',
      left: '12px',
      bottom: '66px',
      height: '200px',
      paddingBottom: '16px',
      paddingTop: '16px',
      paddingLeft: '24px',
      paddingRight: '24px',
    },
    agentStatusMenuTriangle: {
      position: 'absolute',
      width: '0px',
      height: '0px',
      left: '51px',
      bottom: '60px',
      zIndex: '1',
      borderWidth: '8px',
      borderStyle: 'solid',
      borderColor: '#FFF transparent transparent #FFF',
      borderImage: 'initial',
      transform: 'rotate(-134deg)',
      borderRadius: '3px',
    },
    readyLink: {
      fontSize: '16px',
      lineHeight: '19px',
      color: '#363636',
      textDecoration: 'underline',
      borderTop: '1px solid #E1E1E1',
      boxSizing: 'border-box',
      bottom: '0px',
      position: 'absolute',
      width: 'calc(100% - 48px)',
      paddingTop: '10px',
      paddingBottom: '16px',
      cursor: 'pointer',
    },
  }

  render() {
    return (
      <div key={this.props.readyState} style={this.getStyle()}>
        <div id="toolbar-container" style={[this.styles.container]}>
          <div id="agent-button-container" style={[this.styles.agentButtonContainer]}>
            <button id="agent-button" style={[this.styles.agentButton]} onClick={() => this.props.showAgentStatusMenu(true)}>
              <span id="agent-state" style={[this.styles.agentState]}>
                {
                  this.props.readyState === 'ready'
                  ? <FormattedMessage {...messages.ready} />
                  : <FormattedMessage {...messages.notReady} />
                }
              </span>
              <span id="agent-timer" style={[this.styles.agentTimer]}>
                00:00:00
              </span>
            </button>
          </div>
          {
            this.props.agentStatusMenu
            ? <span>
              <span style={[this.styles.agentStatusMenuTriangle]} />
              <div id="agent-status-menu" style={this.styles.agentStatusMenu}>
                <div style={[this.styles.readyLink]} onClick={() => { this.props.changePresence('ready'); this.props.showAgentStatusMenu(false); }}><FormattedMessage {...messages.ready} /></div>
              </div>
            </span>
            : ''
          }
          <span id="agent-stats" style={[this.styles.stats]} />
          <div id="agent-config" style={[this.styles.config]}>
            <Icon name="config" style={{ width: '18px', marginLeft: '13px', marginTop: '17px' }} />
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
  readyState: PropTypes.bool.isRequired,
  showAgentStatusMenu: PropTypes.func,
  agentStatusMenu: PropTypes.bool,
  changePresence: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Toolbar));
