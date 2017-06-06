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
import ConfirmDialogLink from 'components/ConfirmDialogLink';

import messages from './messages';

function ContactAttribute(props) {
  const styles = {
    inputCheckbox: {
      marginLeft: '4px',
    },
    inputBox: {
      backgroundColor: '#ffffff',
      paddingTop: '2px',
      paddingRight: '2px',
      paddingBottom: '2px',
      paddingLeft: '5px',
      height: '21px',
      borderRadius: '2px 0 0 3px',
      maxWidth: '100%',
      display: 'flex',
      alignItems: 'center',
      flexGrow: '1',
      flexShrink: '1',
    },
    inputBorder: {
      ':focus': {
        boxShadow: '0 0 6px 1px rgba(0, 0, 0, 0.12)',
        borderColor: '#23CEF5',
      },
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: '#979797',
    },
    inputErrorBorder: {
      ':focus': {
        borderColor: '#FE4565',
      },
      borderColor: '#F99CAC',
    },
    closeButton: {
      margin: '0',
      order: '1',
      flexGrow: '0',
      flexShrink: '0',
    },
    textInput: {
      width: '',
      height: '',
      fontSize: '14px',
      outline: 'none',
      ':focus': {
        outline: 'none',
      },
      padding: '',
      flexGrow: '1',
      flexShrink: '1',
      alignSelf: 'stretch',
    },
    notSelected: {
      backgroundColor: '#f0f0f0',
    },
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

  const value = props.attributeValue;
  let content;
  switch (props.attribute.type) {
    case 'phone':
      content = (
        <ConfirmDialogLink
          id={`${props.attribute.objectName}Anchor`}
          linkText={value}
          disabled={!props.isReady}
          leftMessage={messages.call}
          leftAction={() => props.startCall(value)}
          leftDisabled={props.hasVoiceInteraction}
          rightMessage={messages.sms}
          rightAction={() => props.startSms(value)}
          rightDisabled={props.smsInteractionNumbers.includes(value)}
        />
      );
      break;
    case 'link':
      content = (
        <a href={value} target="_blank">{value}</a>
      );
      break;
    case 'boolean':
      content = (
        <Checkbox id={`${props.attribute.objectName}Checkbox`} checked={formatValue(props.attribute, value)} />
      );
      break;
    default:
      content = value;
  }
  return (
    <div style={styles.attributeRow} key={props.attribute.id}>
      <div style={styles.attributeName}>
        {props.attributeLabel}
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
  startCall: PropTypes.func.isRequired,
  startSms: PropTypes.func.isRequired,
};

export default Radium(ContactAttribute);
