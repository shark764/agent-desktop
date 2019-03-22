/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * ContactAttribute
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { connect } from 'react-redux';
import { formatValue } from 'utils/contact';

import ErrorBoundary from 'components/ErrorBoundary';

import Checkbox from 'components/Checkbox';
import MenuDialogLink from 'components/MenuDialogLink';
import OutboundAniSelect from 'containers/OutboundAniSelect/index';

import {
  getSelectedOutboundEmailIdentifier,
  getSelectedOutboundPhoneIdentifier,
} from 'containers/OutboundAniSelect/selectors';

import {
  selectOutboundPhoneIdentification,
  selectOutboundEmailIdentification,
} from 'containers/OutboundAniSelect/actions';

import messages from './messages';

const styles = {
  attributeValue: {
    flexShrink: '1',
  },
  attributeRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '4px',
    width: '100%',
  },
  attributeName: {
    color: '#979797',
    width: '161px',
    flexShrink: '0',
    alignSelf: 'center',
  },
  outboundAniDiv: {
    width: '100%',
    borderStyle: 'none',
  },
};

function ContactAttribute(props) {
  const value = props.attributeValue;
  let content;
  let channelType;
  if (props.getSelectedOutboundPhoneIdentifier) {
    ({ channelType } = props.getSelectedOutboundPhoneIdentifier);
  }
  switch (props.attribute.type) {
    case 'phone':
      content = (
        <MenuDialogLink
          id={`${props.attribute.objectName}Anchor`}
          linkText={value}
          disabled={!props.isReady}
          options={[
            {
              message: messages.call,
              action: () => props.startInteraction('voice', value),
              disabled:
                props.hasVoiceInteraction ||
                (props.getSelectedOutboundPhoneIdentifier &&
                  channelType !== 'voice'),
            },
            {
              message: messages.sms,
              action: () => props.startInteraction('sms', value),
              disabled:
                props.smsInteractionNumbers.includes(value) ||
                (props.getSelectedOutboundPhoneIdentifier &&
                  channelType !== 'sms'),
            },
          ]}
        >
          <div style={styles.outboundAniDiv}>
            <OutboundAniSelect
              channelTypes={['voice', 'sms']}
              changeSelected={props.selectOutboundPhoneIdentification}
              valueSelected={props.getSelectedOutboundPhoneIdentifier}
            />
          </div>
        </MenuDialogLink>
      );
      break;
    case 'email':
      content = (
        <MenuDialogLink
          id={`${props.attribute.objectName}Anchor`}
          linkText={value}
          disabled={!props.isReady}
          options={[
            {
              message: messages.email,
              action: () => props.startInteraction('email', value),
            },
          ]}
        >
          <div style={styles.outboundAniDiv}>
            <OutboundAniSelect
              channelTypes={['email']}
              changeSelected={props.selectOutboundEmailIdentification}
              valueSelected={props.getSelectedOutboundEmailIdentifier}
            />
          </div>
        </MenuDialogLink>
      );
      break;
    case 'link':
      content = (
        <a href={value} target="_blank">
          {value}
        </a>
      );
      break;
    case 'boolean':
      content = (
        <Checkbox
          id={`${props.attribute.objectName}Checkbox`}
          checked={formatValue(props.attribute, value)}
        />
      );
      break;
    default:
      content = value;
  }

  let langAtt;
  if (props.attributeLabel === 'undefined') {
    if (props.attribute.label['en-US'] !== undefined) {
      langAtt = props.attribute.label['en-US'];
    } else if (props.attribute.label['en-GB'] !== undefined) {
      langAtt = props.attribute.label['en-GB'];
    } else {
      langAtt = props.attribute.label[Object.keys(props.attribute.label)[0]];
    }
  } else {
    langAtt = props.attributeLabel;
  }

  return (
    <div style={styles.attributeRow} key={props.attribute.id}>
      <div style={styles.attributeName}>
        {langAtt}
      </div>
      <div style={[styles.attributeValue]}>
        {content}
      </div>
    </div>
  );
}

ContactAttribute.propTypes = {
  attribute: PropTypes.object.isRequired,
  attributeLabel: PropTypes.string.isRequired,
  attributeValue: PropTypes.string,
  isReady: PropTypes.bool.isRequired,
  hasVoiceInteraction: PropTypes.bool.isRequired,
  smsInteractionNumbers: PropTypes.array.isRequired,
  startInteraction: PropTypes.func.isRequired, // eslint-disable-line
  selectOutboundPhoneIdentification: PropTypes.func.isRequired,
  selectOutboundEmailIdentification: PropTypes.func.isRequired,
  getSelectedOutboundEmailIdentifier: PropTypes.object,
  getSelectedOutboundPhoneIdentifier: PropTypes.object,
};

export const actions = {
  selectOutboundPhoneIdentification,
  selectOutboundEmailIdentification,
};

const mapStateToProps = (state, props) => ({
  getSelectedOutboundEmailIdentifier: getSelectedOutboundEmailIdentifier(
    state,
    props
  ),
  getSelectedOutboundPhoneIdentifier: getSelectedOutboundPhoneIdentifier(
    state,
    props
  ),
});

// For eslint disables above see https://github.com/yannickcr/eslint-plugin-react/issues/885

export default ErrorBoundary(
  connect(
    mapStateToProps,
    actions
  )(Radium(ContactAttribute))
);
