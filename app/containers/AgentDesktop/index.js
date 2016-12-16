/*
 *
 * AgentDesktop
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import selectAgentDesktop from './selectors';

import InteractionsBar from 'containers/InteractionsBar';
import MainContentArea from 'containers/MainContentArea';
import SidePanel from 'containers/SidePanel';
import Toolbar from 'containers/Toolbar';

import Login from 'containers/Login';
import Radium from 'radium';

export class AgentDesktop extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
  }

  render() {
    return (
      <div>
        {
          this.props.login.showLogin
          ? <Login />
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
    dispatch,
  };
}

AgentDesktop.propTypes = {
  showLogin: PropTypes.bool,
  login: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(AgentDesktop));
