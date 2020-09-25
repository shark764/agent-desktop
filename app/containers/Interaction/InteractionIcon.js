import React from 'react';
import PropTypes from 'prop-types';

import { lastMessageFromInteraction } from 'utils/interaction';

import VoiceIconSVG from 'components/VoiceIconSVG';
import Icon from 'components/Icon';

export default function InteractionIcon(props, context) {
  let icon;
  const { channelType, status, notifications } = props.interaction;
  if (status === 'script-only' || status === 'work-ended-pending-script') {
    icon = 'script';
  } else if (channelType === 'voice') {
    let type = 'default';
    let color = 'blue';
    if (notifications.findIndex((notification) => notification.messageKey === 'callbackRequest') > -1) {
      type = 'callback';
    }
    if (status === 'work-initiated' && context.toolbarMode) {
      icon = color = 'white';
    }
    icon = <VoiceIconSVG type={type} color={color} />;
  } else if (channelType === 'messaging' || channelType === 'sms') {
    const lastMessageFromThisInteraction = lastMessageFromInteraction(
      props.interaction
    );
    if (
      (status === 'work-initiated' && !context.toolbarMode) ||
      // if the last message was from the customer, show the 'new' icon
      (status !== 'work-initiated' &&
        lastMessageFromThisInteraction &&
        (lastMessageFromThisInteraction.type === 'customer' ||
          lastMessageFromThisInteraction.type === 'message'))
    ) {
      icon = 'message_new';
    } else {
      icon = 'message';
    }
  } else if (channelType === 'email') {
    if (status === 'work-initiated' && !context.toolbarMode) {
      icon = 'email_new';
    } else {
      icon = 'email';
    }
  } else if (channelType === 'work-item') {
    if (status === 'work-initiated' && !context.toolbarMode) {
      icon = 'work_item_new';
    } else {
      icon = 'work_item';
    }
  }

  if (typeof icon === 'string') {
    icon = <Icon name={icon} />;
  }
  return icon;
}

InteractionIcon.propTypes = {
  interaction: PropTypes.shape({
    channelType: PropTypes.string,
    status: PropTypes.string,
    notifications: PropTypes.array,
  }).isRequired,
};

InteractionIcon.contextTypes = {
  toolbarMode: PropTypes.bool,
};
