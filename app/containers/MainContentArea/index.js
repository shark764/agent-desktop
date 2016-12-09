/*
 *
 * MainContentArea
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectMainContentArea from './selectors';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export class MainContentArea extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

const mapStateToProps = selectMainContentArea();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContentArea);
