/*
 *
 * AgentDesktop
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import selectAgentDesktop from './selectors';
import { injectIntl } from 'react-intl';

import InteractionsBar from 'containers/InteractionsBar';
import MainContentArea from 'containers/MainContentArea';
// import SidePanel from 'containers/SidePanel';
import Toolbar from 'containers/Toolbar';

import Login from 'containers/Login';

import Radium from 'radium';

import { setTenantId, setPresence, setDirection, setAvailablePresences } from './actions';

export class AgentDesktop extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.beginSession = this.beginSession.bind(this);
    this.changePresence = this.changePresence.bind(this);
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
    toolbar: {
      flex: '0 0 auto',
      height: '54px',
    },
    sidebar: {
      flex: '0 0 auto',
      width: '400px',
    },
    interactions: {
      flex: '0 0 auto',
      width: '277px',
    },
  };

  changePresence(newPresence) {
    const changePresStateOnComplete = (data) => {
      const changePresenceResult = data.result;
      this.props.setDirection(changePresenceResult.direction);
      this.props.setPresence(changePresenceResult.state);
      this.props.setAvailablePresences(changePresenceResult.availableStates);
    };

    const changePresenceParams = {
      state: newPresence,
      'on-complete': changePresStateOnComplete,
      // TODO ? callback is unneeded?
      callback: (...allArguments) => {
        console.log('CHANGE PRESENCE CALL BACH', allArguments); // eslint-disable-line
      },
    };
    SDK.Agent.Session.changePresenceState(changePresenceParams);
  }

  beginSession(tenantId) {
    const sessionBeginCallback = () => {
      this.props.setTenantId(tenantId);
      const initState = 'notready'; // TODO constants file for these
      this.changePresence(initState);
    };
    const sessionParams = {
      'tenant-id': tenantId,
      'on-notification': function handleSqsMessage(...allArguments) {
        console.log('NOTIFICATION!', allArguments); // eslint-disable-line
      },
      callback: sessionBeginCallback,
    };
    SDK.Agent.Session.beginSession(sessionParams);
  }

  render() {
    return (
      <div>
        {
          this.props.login.showLogin
          ? <Login beginSession={this.beginSession} />
          : <div id="desktop-container" style={[this.styles.flexchild, this.styles.parent, this.styles.columnParent]}>
            <div id="top-area" style={[this.styles.flexchild, this.styles.parent, { height: 'calc(100vh - 54px)' }]}>
              <InteractionsBar style={[this.styles.flexchild, this.styles.interactions]} />
              <MainContentArea style={[this.styles.flexchild]} />
              { /* <SidePanel style={[this.styles.flexchild, this.styles.sidebar]} />   */ }
            </div>
            <Toolbar readyState={false} style={[this.styles.flexchild, this.styles.toolbar]} />
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = selectAgentDesktop();

function mapDispatchToProps(dispatch) {
  return {
    setTenantId: (tenantId) => dispatch(setTenantId(tenantId)),
    setPresence: (presence) => dispatch(setPresence(presence)),
    setDirection: (direction) => dispatch(setDirection(direction)),
    setAvailablePresences: (availablePresences) => dispatch(setAvailablePresences(availablePresences)),
    dispatch,
  };
}

AgentDesktop.propTypes = {
  showLogin: PropTypes.bool,
  login: PropTypes.object,
  setTenantId: PropTypes.func,
  setDirection: PropTypes.func,
  setPresence: PropTypes.func,
  setAvailablePresences: PropTypes.func,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(AgentDesktop)));
