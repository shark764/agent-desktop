/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import { toggleInteractionNotification } from 'containers/AgentDesktop/actions';
import {
  selectActiveVoiceInteractionId,
  selectActiveVoiceInteractionNotifications,
} from 'containers/VoiceInteractionNotifications/selectors';

import NotificationBanner from 'components/NotificationBanner';

import messages from './messages';

export class VoiceInteractionNotifications extends React.PureComponent {
  render() {
    if (
      this.props.interactionId &&
      this.props.notifications &&
      this.props.notifications.size
    ) {
      const notifications = this.props.notifications.toJS();
      return notifications.map(notification => {
        const message = this.props.intl.formatMessage(
          messages[notification.messageKey],
          notification.messageValues
        );
        const dismiss = notification.isDimissible
          ? this.props.toggleInteractionNotification
          : null;
        return (
          <NotificationBanner
            key={notification.messageKey}
            id={notification.messageKey}
            descriptionMessage={message}
            descriptionStyle={{
              textAlign: 'center',
            }}
            dismiss={dismiss}
            dismissArguments={
              dismiss ? [this.props.interactionId, notification] : []
            }
          />
        );
      });
    } else {
      return null;
    }
  }
}

VoiceInteractionNotifications.propTypes = {
  intl: intlShape.isRequired,
  interactionId: PropTypes.string,
  notifications: ImmutablePropTypes.listOf(
    ImmutablePropTypes.contains({
      messageKey: PropTypes.string.isRequired,
      messageValues: ImmutablePropTypes.map,
      isDimissable: PropTypes.bool.isRequired,
    })
  ),
  toggleInteractionNotification: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  interactionId: selectActiveVoiceInteractionId(state, props),
  notifications: selectActiveVoiceInteractionNotifications(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    toggleInteractionNotification: (interactionId, notification) =>
      dispatch(toggleInteractionNotification(interactionId, notification)),
    dispatch,
  };
}

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VoiceInteractionNotifications)
);
