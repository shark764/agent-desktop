/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

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

import Radium from 'radium';

function ContactInput(props) {
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

  let value = props.formInput;
  const inputError = props.showErrors[props.attribute.objectName] ? props.errors[props.attribute.objectName] : false;
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
          <div style={[styles.attributeName, props.inputLabelStyle]}>
            {props.attributeLabel}
          </div>
          <div key={props.attribute.objectName} style={[styles.inputBox, styles.inputBorder, inputError && styles.inputErrorBorder, { marginLeft: props.hasRadio ? '-17px' : '' }, props.notSelected && styles.notSelected]}>
            {
              (value !== undefined)
              && <TextInput
                noBorder
                disabled={props.notSelected}
                cb={props.handleInputChange}
                style={[styles.textInput, props.notSelected && styles.notSelected]}
                id={`${props.attribute.objectName}Input`}
                name={props.attribute.objectName}
                value={value}
                placeholder={props.attribute.label[props.intl.locale]}
                autocomplete="off"
                onBlur={props.handleOnBlur}
              />
            }
            {value && value.length && !props.notSelected
              ? <Button
                id={`${props.attribute.objectName}-clear-btn`}
                tabIndex={-1}
                name={props.attribute.objectName}
                style={styles.closeButton}
                iconName="close"
                clear
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

ContactInput.propTypes = {
  attribute: PropTypes.object,
  attributeLabel: PropTypes.string,
  formInput: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  handleInputChange: PropTypes.func,
  handleOnBlur: PropTypes.func,
  handleInputClear: PropTypes.func,
  notSelected: PropTypes.bool,
  hasRadio: PropTypes.bool,
  showErrors: PropTypes.object,
  errors: PropTypes.object,
  intl: PropTypes.object,
  inputLabelStyle: PropTypes.object,
};

export default Radium(ContactInput);
