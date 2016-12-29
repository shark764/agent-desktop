/*
 *
 * AgentStatusMenu
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import selectAgentStatusMenu from './selectors';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Radium from 'radium';
import { logout } from 'containers/Login/actions';
import checkIcon from 'assets/icons/CheckStatus.png';

export class AgentStatusMenu extends React.Component { // eslint-disable-line react/prefer-stateless-function
  styles = {
    agentStatusMenu: {
      position: 'fixed',
      width: '303px',
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 6px 1px rgba(0,0,0,0.29)',
      left: '12px',
      bottom: '66px',
      paddingBottom: '16px',
      paddingTop: '16px',
      color: '#4b4b4b',
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
      bottom: '-15px',
      position: 'relative',
      width: 'calc(100% - 48px)',
      paddingTop: '10px',
      paddingBottom: '16px',
      marginLeft: '24px',
      marginRight: '24px',
      cursor: 'pointer',
    },
    logoutLink: {
      fontSize: '16px',
      lineHeight: '19px',
      color: '#363636',
      textDecoration: 'underline',
      boxSizing: 'border-box',
      top: '-12px',
      position: 'relative',
      width: 'calc(100% - 48px)',
      paddingTop: '10px',
      marginLeft: '24px',
      marginRight: '24px',
      cursor: 'pointer',
    },
    tenant: {
      backgroundColor: '#F3F3F3',
      paddingLeft: '24px',
      paddingRight: '24px',
      display: 'block',
      height: '74px',
      paddingTop: '17px',
      paddingBottom: '17px',
      borderTop: 'solid 1px #e4e4e4',
    },
    notReadyReasons: {
      paddingLeft: '24px',
      paddingRight: '24px',
      display: 'block',
      paddingTop: '14px',
      borderTop: 'solid 1px #e4e4e4',
      lineHeight: '1.25',
    },
    notReadyReasonsTitle: {
      fontSize: '16px',
      color: '#979797',
      height: '27px',
    },
    notReadyReasonsActive: {
      fontWeight: 'bold',
      cursor: 'default',
    },
    tenantTitle: {
      fontSize: '14px',
      color: '#979797',
      fontWeight: '300',
    },
    tenantText: {
      fontSize: '18px',
      color: '#4B4B4B',
      fontWeight: 'bold',
      display: 'inline',
      textTransform: 'capitalize',
    },
    notReadyPresence: {
      cursor: 'pointer',
      textTransform: 'capitalize',
      height: '24px',
      width: '303px',
      marginLeft: '-24px',
      paddingLeft: '24px',
      paddingRight: '13px',
      ':hover': {
        backgroundColor: '#f3f3f3',
      },
    },
    arrow: {
      float: 'right',
    },
  }

  render() {
    return (
      <span>
        <span style={[this.styles.agentStatusMenuTriangle]} />
        <div id="agentStatusMenu" style={this.styles.agentStatusMenu}>
          <div id="agentLogoutLink" style={[this.styles.logoutLink]} onClick={() => { this.props.logout(); this.props.showAgentStatusMenu(false); }}><FormattedMessage {...messages.logout} /></div>
          <div id="agentMenuTenant" style={[this.styles.tenant]}>
            <div style={[this.styles.tenantTitle]}><FormattedMessage {...messages.tenant} /></div>
            <div style={[this.styles.tenantText]}>{this.props.tenant.name}</div>
          </div>
          <div id="agentMenuMode" style={[this.styles.tenant]}>
            <div style={[this.styles.tenantTitle]}><FormattedMessage {...messages.mode} /></div>
            <div style={[this.styles.tenantText]}>{this.props.agentDirection}</div>
          </div>
          <div id="agentMenuPathway" style={[this.styles.tenant]}>
            <div style={[this.styles.tenantTitle]}><FormattedMessage {...messages.activeVoicePath} /></div>
            <div style={[this.styles.tenantText]}><FormattedMessage {...messages.softphone} /></div>
          </div>
          <div id="agentNotReadyStates" style={[this.styles.notReadyReasons]}>
            <div id="agentNotReadyStatesTitle" style={[this.styles.notReadyReasonsTitle]}><FormattedMessage {...messages.notReady} /></div>
            {
              this.props.availablePresences.map(
                (presence) => { // eslint-disable-line
                  return presence !== 'ready' && presence !== 'offline'
                  ? <div
                    id={`${presence}_reason`}
                    key={`${presence}_reason`}
                    style={presence !== this.props.readyState
                    ? [this.styles.notReadyPresence]
                    : [this.styles.notReadyPresence, this.styles.notReadyReasonsActive]}
                    onClick={() => { this.props.changePresence(presence); this.props.showAgentStatusMenu(false); }}
                  >
                    {presence}
                    {presence === this.props.readyState ? <img src={checkIcon} style={{ height: '17px', float: 'right' }} alt="checkIcon" /> : ''}
                  </div>
                  : '';
                }
              )
            }
            {
              this.props.readyState !== 'ready'
              ? <div
                id={`${this.props.readyState}_current_reason`}
                key={`${this.props.readyState}_current_reason`}
                style={[this.styles.notReadyPresence, this.styles.notReadyReasonsActive, { cursor: 'default' }]}
              >
                {this.props.readyState}
                <img src={checkIcon} style={{ height: '17px', float: 'right' }} alt="checkIcon" />
              </div>
              : ''
            }
          </div>
          {
            this.props.readyState === 'ready'
            ? <div
              id="readyStateLink"
              style={[this.styles.readyLink, this.styles.notReadyReasonsActive]}
            >
              <FormattedMessage {...messages.ready} />
              <img src={checkIcon} style={{ height: '17px', float: 'right' }} alt="checkIcon" />
            </div>
            : <div
              id="readyStateLink"
              style={[this.styles.readyLink]}
              onClick={() => { this.props.changePresence('ready'); this.props.showAgentStatusMenu(false); }}
            >
              <FormattedMessage {...messages.ready} />
            </div>
          }
        </div>
      </span>
    );
  }
}

AgentStatusMenu.propTypes = {
  changePresence: PropTypes.func,
  showAgentStatusMenu: PropTypes.func,
  tenant: PropTypes.object,
  agentDirection: PropTypes.string,
  readyState: PropTypes.string,
  logout: PropTypes.func,
  availablePresences: PropTypes.array,
};

const mapStateToProps = selectAgentStatusMenu();

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout()),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(AgentStatusMenu));
