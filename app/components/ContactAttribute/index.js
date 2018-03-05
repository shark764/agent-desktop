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
import { formatValue } from 'utils/contact';

import Checkbox from 'components/Checkbox';
import MenuDialogLink from 'components/MenuDialogLink';

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
};

function ContactAttribute(props) {
  const value = props.attributeValue;
  let content;
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
              action: () => props.startCall(value),
              disabled: props.hasVoiceInteraction,
            },
            {
              message: messages.sms,
              action: () => props.startSms(value),
              disabled: props.smsInteractionNumbers.includes(value),
            },
          ]}
        />
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
              action: () => props.startEmail(value),
            },
          ]}
        />
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
      <div style={styles.attributeName}>{langAtt}</div>
      <div style={[styles.attributeValue]}>{content}</div>
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
  startCall: PropTypes.func.isRequired, // eslint-disable-line
  startSms: PropTypes.func.isRequired, // eslint-disable-line
  startEmail: PropTypes.func.isRequired, // eslint-disable-line
};

// For eslint disables above see https://github.com/yannickcr/eslint-plugin-react/issues/885

export default Radium(ContactAttribute);
