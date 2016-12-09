/*
 *
 * InteractionsBar
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectInteractionsBar from './selectors';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export class InteractionsBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

const mapStateToProps = selectInteractionsBar();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InteractionsBar);
