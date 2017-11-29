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

import {
  dismissContactWasAssignedNotification,
  dismissContactWasUnassignedNotification,
} from 'containers/AgentDesktop/actions';

import messages from './messages';

const styles = {
  base: {
    backgroundColor: '#FE4565',
    color: '#FFFFFF',
    textAlign: 'center',
    margin: '-5px -5px 0 -5px',
    padding: '4px 0',
    fontSize: '15px',
    fontWeight: 'bold',
    borderBottom: '1px solid #D0D0D0',
    zIndex: 1,
  },
  contactWasAssigned: {
    backgroundColor: '#23cdf4',
  },
  noRecord: {
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

  dismissContactWasUnassignedNotification = () => {
    this.props.dismissContactWasUnassignedNotification(
      this.props.interactionId
    );
  };

  render() {
    if (this.props.contactAssignedNotification === false) {
      // Notification was dismissed
      return null;
    } else if (typeof this.props.contactAssignedNotification === 'string') {
      let message;
      let onClick;
      let contactWasAssignedNotificationStyle;
      if (this.props.contactAssignedNotification === 'contactWasAssigned') {
        message = <FormattedMessage {...messages.recordLinked} />;
        onClick = this.dismissContactWasAssignedNotification;
        contactWasAssignedNotificationStyle = styles.contactWasAssigned;
      } else if (
        this.props.contactAssignedNotification === 'contactWasUnassigned'
      ) {
        message = <FormattedMessage {...messages.recordUnlinked} />;
        onClick = this.dismissContactWasUnassignedNotification;
      } else {
        console.error(
          `Invalid contactWasAssignedNotification: ${
            this.props.contactAssignedNotification
          }`
        );
      }
      return (
        <div style={[styles.base, contactWasAssignedNotificationStyle]}>
          {message}
          <Button
            id="dismissRecordLinked"
            style={styles.dismissRecordLinked}
            iconName="close"
            onClick={onClick}
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
  contactAssignedNotification: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  interactionId: PropTypes.string.isRequired,
  dismissContactWasAssignedNotification: PropTypes.func.isRequired,
  dismissContactWasUnassignedNotification: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dismissContactWasAssignedNotification: (interactionId) =>
      dispatch(dismissContactWasAssignedNotification(interactionId)),
    dismissContactWasUnassignedNotification: (interactionId) =>
      dispatch(dismissContactWasUnassignedNotification(interactionId)),
    dispatch,
  };
}

export default ErrorBoundary(
  connect(null, mapDispatchToProps)(Radium(CrmRecordNotification))
);
