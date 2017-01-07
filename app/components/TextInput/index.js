/**
*
* TextInput
*
*/

import React, { PropTypes } from 'react';

import { injectIntl, intlShape } from 'react-intl';

import Radium from 'radium';


function TextInput(props) {
  const { formatMessage } = props.intl;
  const styles = {
    base: {
      width: '282px',
      height: '44px',
      backgroundColor: '#ffffff',
      border: 'solid 1px #979797',
      fontSize: '16px',
      fontWeight: 'light',
      fontStyle: 'normal',
      fontStretch: 'normal',
      color: '#494949',
      outline: 'none',
      padding: '11px',
      borderRadius: '2px',

      ':focus': {
        boxShadow: '0 0 6px 1px rgba(0, 0, 0, 0.12)',
        border: 'solid 1px #23CEF5',
      },
    },
  };

  return (
    <input
      style={[styles.base, styles.center, props.style]}
      type={props.type || 'text'}
      key={formatMessage(props.placeholder)}
      value={props.value}
      placeholder={formatMessage(props.placeholder)}
      onChange={(e) => props.cb(e.target.value)}
      autoComplete={props.autocomplete || 'on'}
      onKeyUp={props.onKeyUp || ''}
      autoFocus={props.autoFocus}
    />
  );
}

TextInput.propTypes = {
  intl: intlShape.isRequired,
  placeholder: PropTypes.object.isRequired,
  cb: PropTypes.func.isRequired,
  autocomplete: PropTypes.string,
  value: PropTypes.string.isRequired,
  style: PropTypes.object,
  type: PropTypes.string,
  onKeyUp: PropTypes.func,
  autoFocus: PropTypes.bool,
};

export default injectIntl(Radium(TextInput));
