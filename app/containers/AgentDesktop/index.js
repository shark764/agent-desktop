/*
 *
 * AgentDesktop
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectAgentDesktop from './selectors';

import Login from 'containers/Login';

export class AgentDesktop extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Login />
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

export default connect(mapStateToProps, mapDispatchToProps)(AgentDesktop);
