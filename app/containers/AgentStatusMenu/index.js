/*
 *
 * AgentStatusMenu
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectHasActiveInteractions, selectExtensions, selectActiveExtension } from './selectors';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Radium from 'radium';
import { setActiveExtension } from 'containers/AgentDesktop/actions';
import checkIcon from 'assets/icons/CheckStatus.png';

export class AgentStatusMenu extends React.Component {
  styles = {
    agentStatusMenu: {
      position: 'fixed',
      width: '303px',
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 6px 1px rgba(0,0,0,0.29)',
      left: '12px',
      bottom: '66px',
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
      boxSizing: 'border-box',
      bottom: '-15px',
      position: 'relative',
      width: 'calc(100% - 48px)',
      marginBottom: '16px',
      marginLeft: '24px',
      marginRight: '24px',
      cursor: 'pointer',
    },
    agentReadyState: {
      borderTop: '1px solid #E1E1E1',
      marginTop: '10px',
      paddingBottom: '16px',
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
    logoutLinkInactive: {
      cursor: 'default',
      color: '#979797',
      textDecoration: 'none',
    },
    dropdownContainer: {
      position: 'relative',
    },
    dropdown: {
      backgroundColor: '#F3F3F3',
      paddingLeft: '24px',
      paddingRight: '16px',
      paddingTop: '17px',
      paddingBottom: '17px',
      display: 'block',
      height: '74px',
      borderTop: 'solid 1px #e4e4e4',
    },
    activeDropdown: {
      backgroundColor: '#FFFFFF',
      cursor: 'pointer',
    },
    dropdownSelectedItemContainer: {
      display: 'inline-block',
      width: 'calc(100% - 20px)',
    },
    dropdownIcon: {
      display: 'inline-block',
      verticalAlign: 'top',
      marginTop: '10px',
    },
    notReadyReasons: {
      paddingLeft: '24px',
      paddingRight: '24px',
      display: 'block',
      paddingTop: '14px',
      borderTop: 'solid 1px #e4e4e4',
      lineHeight: '1.25',
    },
    notReadyReasonsActive: {
      cursor: 'default',
    },
    dropdownTitle: {
      fontSize: '14px',
      color: '#979797',
      fontWeight: '300',
    },
    dropdownSelectedText: {
      fontSize: '18px',
      color: '#4B4B4B',
      fontWeight: 'bold',
      display: 'inline',
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    dropdownList: {
      position: 'absolute',
      top: '18px',
      left: '303px',
      width: '303px',
      backgroundColor: '#FFFFFF',
      borderRadius: '3px',
      padding: '5px 0',
    },
    dropdownListItem: {
      padding: '3px 24px',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: '#DEF8FE',
      },
    },
    notReadyPresence: {
      cursor: 'pointer',
      textTransform: 'capitalize',
      height: '24px',
      width: '303px',
      marginLeft: '-24px',
      paddingLeft: '24px',
      paddingRight: '13px',
    },
    inactivePresence: {
      textDecoration: 'underline',
    },
    arrow: {
      float: 'right',
    },
  }

  changePresence(newPresence) {
    if (newPresence === 'ready') {
      SDK.session.goReady({ extensionId: this.props.activeExtension.value });
    } else if (newPresence === 'notready') {
      SDK.session.goNotReady();
    } else {
      throw new Error('newPresence is neither ready nor notready:', newPresence);
    }
  }

  render() {
    return (
      <span>
        <span style={[this.styles.agentStatusMenuTriangle]} />
        <div id="agentStatusMenu" style={this.styles.agentStatusMenu}>
          { this.props.hasActiveInteractions
            ? <div id="agentLogoutLink" style={[this.styles.logoutLink, this.styles.logoutLinkInactive]}><FormattedMessage {...messages.logout} /></div>
            : <div id="agentLogoutLink" style={[this.styles.logoutLink]} onClick={() => { SDK.session.goOffline(); this.props.showAgentStatusMenu(false); }}><FormattedMessage {...messages.logout} /></div>
          }
          <div id="agentMenuTenant" style={[this.styles.dropdown]}>
            <div style={[this.styles.dropdownTitle]}><FormattedMessage {...messages.tenant} /></div>
            <div style={[this.styles.dropdownSelectedText]}>{this.props.tenant.name}</div>
          </div>
          <div id="agentMenuMode" style={[this.styles.dropdown]}>
            <div style={[this.styles.dropdownTitle]}><FormattedMessage {...messages.mode} /></div>
            <div style={[this.styles.dropdownSelectedText]}>
              { /* TODO when we have this:
                 this.props.agentDirection */}
              <FormattedMessage {...messages.inbound} />
            </div>
          </div>
          <div style={this.styles.dropdownContainer}>
            <div
              id="agentMenuPathway"
              style={[this.styles.dropdown, this.props.readyState !== 'ready' ? this.styles.activeDropdown : {}]}
              onClick={() => {
                if (this.props.readyState !== 'ready') {
                  this.setState({ showAgentMenuPathwayDropdown: !this.state.showAgentMenuPathwayDropdown });
                }
              }}
            >
              <div style={this.styles.dropdownSelectedItemContainer}>
                <div style={[this.styles.dropdownTitle]}><FormattedMessage {...messages.activeVoicePath} /></div>
                <div style={[this.styles.dropdownSelectedText]}>{this.props.activeExtension.description}</div>
              </div>
              {
                this.props.readyState !== 'ready'
                ? <div style={this.styles.dropdownIcon}>
                  &#9658;
                </div>
                : undefined
              }
            </div>
            { this.state.showAgentMenuPathwayDropdown
              ? <div style={this.styles.dropdownList}>
                {
                  this.props.extensions.map((extension) =>
                    <div
                      key={extension.value}
                      id={extension.value}
                      style={this.styles.dropdownListItem}
                      onClick={() => {
                        this.props.setActiveExtension(extension);
                        this.setState({ showAgentMenuPathwayDropdown: false });
                      }}
                    >
                      {extension.description}
                    </div>
                  )
                }
              </div>
              : undefined
            }
          </div>
          <div id="agentNotReadyState" style={[this.styles.notReadyReasons]}>
            {
              this.props.readyState === 'ready'
              ? <div
                id="notReadyStateLink"
                style={[this.styles.notReadyPresence, this.styles.inactivePresence]}
                onClick={() => { this.changePresence('notready'); this.props.showAgentStatusMenu(false); }}
              >
                <FormattedMessage {...messages.notReady} />
              </div>
              : <div
                id="notReadyStateLink"
                style={[this.styles.notReadyPresence, this.styles.notReadyReasonsActive]}
              >
                <FormattedMessage {...messages.notReady} />
                <img src={checkIcon} style={{ height: '17px', float: 'right' }} alt="checkIcon" />
              </div>
            }
          </div>
          <div id="agentReadyState" style={this.styles.agentReadyState}>
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
                style={[this.styles.readyLink, this.styles.inactivePresence]}
                onClick={() => { this.changePresence('ready'); this.props.showAgentStatusMenu(false); }}
              >
                <FormattedMessage {...messages.ready} />
              </div>
            }
          </div>
        </div>
      </span>
    );
  }
}

AgentStatusMenu.propTypes = {
  hasActiveInteractions: PropTypes.bool.isRequired,
  extensions: PropTypes.array.isRequired,
  activeExtension: PropTypes.object.isRequired,
  showAgentStatusMenu: PropTypes.func,
  tenant: PropTypes.object,
  // agentDirection: PropTypes.string,
  readyState: PropTypes.string,
  setActiveExtension: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  hasActiveInteractions: selectHasActiveInteractions(state, props),
  extensions: selectExtensions(state, props),
  activeExtension: selectActiveExtension(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    setActiveExtension: (extension) => dispatch(setActiveExtension(extension)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(AgentStatusMenu));
