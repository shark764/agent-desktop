/*
 *
 * Toolbar
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectToolbar from './selectors';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export class Toolbar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

const mapStateToProps = selectToolbar();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
