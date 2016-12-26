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
      <span>
        <span style={[this.styles.agentStatusMenuTriangle]} />
        <div id="agent-status-menu" style={this.styles.agentStatusMenu}>
          <div style={[this.styles.readyLink]} onClick={() => { this.props.changePresence('ready'); this.props.showAgentStatusMenu(false); }}><FormattedMessage {...messages.ready} /></div>
        </div>
      </span>
    );
  }
}

AgentStatusMenu.propTypes = {
  changePresence: PropTypes.func,
  showAgentStatusMenu: PropTypes.func,
};

const mapStateToProps = selectAgentStatusMenu();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(AgentStatusMenu));
