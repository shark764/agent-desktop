/**
*
* ContactInput
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import TextInput from 'components/TextInput';
import ConfirmDialogLink from 'components/ConfirmDialogLink';

import Radium from 'radium';

import messages from './messages';

function ContactInput(props) {
  const styles = {
    inputCheckbox: {
      marginLeft: '4px',
    },
    inputBox: {
      backgroundColor: '#ffffff',
      padding: '2px',
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
      borderTop: '0',
      borderRight: '0',
      borderBottom: '0',
      borderLeft: '0',
      order: '1',
      flexGrow: '0',
      flexShrink: '0',
      ':hover': {
        backgroundColor: '',
      },
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

  let value;
  const inputError = props.showErrors[props.attribute.objectName] ? props.errors[props.attribute.objectName] : false;
  if (props.isEditing) {
    value = props.formInput;
    switch (props.attribute.type) {
      case 'boolean':
        if (value === undefined) {
          value = false;
        }
        return (
          <div style={styles.attributeRow} key={props.attribute.id}>
            <div style={styles.attributeName}>
              {props.attributeLabel}
            </div>
            <Checkbox
              id={`${props.attribute.objectName}Checkbox`}
              name={props.attribute.objectName}
              cb={props.handleInputChange}
              onBlur={props.handleOnBlur}
              checked={JSON.parse(value)}
              style={styles.inputCheckbox}
            />
          </div>
        );
      default:
        return (
          <div style={styles.attributeRow} key={props.attribute.id}>
            <div style={styles.attributeName}>
              {props.attributeLabel}
            </div>
            <div key={props.attribute.objectName} style={[styles.inputBox, styles.inputBorder, inputError && styles.inputErrorBorder, { marginLeft: props.hasRadio ? '-17px' : '' }]}>
              <TextInput
                noBorder
                cb={props.handleInputChange}
                style={styles.textInput}
                id={`${props.attribute.objectName}Input`}
                name={props.attribute.objectName}
                value={value}
                placeholder={props.attribute.label[props.intl.locale]}
                autocomplete="off"
                onBlur={props.handleOnBlur}
              />
              {value && value.length
                ? <Button
                  id={`${props.attribute.objectName}-clear-btn`}
                  tabIndex={-1}
                  name={props.attribute.objectName}
                  style={styles.closeButton}
                  iconName="close"
                  type="secondary"
                  onClick={props.handleInputClear}
                />
                : undefined
              }
            </div>
          </div>
        );
    }
  }
  value = (props.contact.attributes && props.contact.attributes[props.attribute.objectName]) ? props.contact.attributes[props.attribute.objectName] : '';
  let content;
  switch (props.attribute.type) { // TODO: AttributeValue components w/edit flags & callbacks
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
        <Checkbox id={`${props.attribute.objectName}Checkbox`} checked={props.formatValue(props.attribute.objectName, value)} />
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
      <div style={styles.attributeValue}>
        {content}
      </div>
    </div>
  );
}

ContactInput.propTypes = {
  showErrors: PropTypes.object,
  attribute: PropTypes.object,
  attributeLabel: PropTypes.string,
  errors: PropTypes.object,
  isEditing: PropTypes.bool,
  formInput: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  handleInputClear: PropTypes.func,
  handleOnBlur: PropTypes.func,
  handleInputChange: PropTypes.func,
  intl: PropTypes.object,
  contact: PropTypes.object,
  isReady: PropTypes.bool,
  hasRadio: PropTypes.bool,
  hasVoiceInteraction: PropTypes.bool,
  formatValue: PropTypes.func,
  smsInteractionNumbers: PropTypes.array.isRequired,
  startCall: PropTypes.func,
  startSms: PropTypes.func,
};

export default Radium(ContactInput);
