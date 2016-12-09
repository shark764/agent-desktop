/*
 *
 * AgentDesktop
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectAgentDesktop from './selectors';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export class AgentDesktop extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <FormattedMessage {...messages.header} />
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
