/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';
import { FormattedMessage } from 'react-intl';

import ErrorBoundary from 'components/ErrorBoundary';

import Button from 'components/Button';

import { dismissContactWasAssignedNotification } from 'containers/AgentDesktop/actions';

import messages from './messages';

const styles = {
  base: {
    color: '#FFFFFF',
    textAlign: 'center',
    margin: '-5px -5px 0 -5px',
    padding: '4px 0',
    fontSize: '15px',
    fontWeight: 'bold',
    borderBottom: '1px solid #D0D0D0',
    zIndex: 1,
  },
  contactWasAssignedNotification: {
    backgroundColor: '#23cdf4',
  },
  noRecord: {
    backgroundColor: '#FE4565',
    borderTop: '1px #000000 solid',
  },
  dismissRecordLinked: {
    float: 'right',
  },
};

export class CrmRecordNotification extends React.Component {
  dismissContactWasAssignedNotification = () => {
    this.props.dismissContactWasAssignedNotification(this.props.interactionId);
  };

  render() {
    if (this.props.contactWasAssignedNotification === false) {
      // Notification was dismissed
      return null;
    } else if (this.props.contactWasAssignedNotification === true) {
      return (
        <div style={[styles.base, styles.contactWasAssignedNotification]}>
          <FormattedMessage {...messages.recordLinked} />
          <Button
            id="dismissRecordLinked"
            style={styles.dismissRecordLinked}
            iconName="close"
            onClick={this.dismissContactWasAssignedNotification}
            clear
          />
        </div>
      );
    } else {
      return (
        <div style={[styles.base, styles.noRecord]}>
          <FormattedMessage {...messages.noRecordLinked} />
        </div>
      );
    }
  }
}

CrmRecordNotification.propTypes = {
  contactWasAssignedNotification: PropTypes.bool,
  interactionId: PropTypes.string,
  dismissContactWasAssignedNotification: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dismissContactWasAssignedNotification: (interactionId) =>
      dispatch(dismissContactWasAssignedNotification(interactionId)),
    dispatch,
  };
}

export default ErrorBoundary(
  connect(null, mapDispatchToProps)(Radium(CrmRecordNotification))
);
