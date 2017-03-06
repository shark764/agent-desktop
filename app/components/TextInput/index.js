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
      fontSize: '16px',
      fontWeight: 'light',
      fontStyle: 'normal',
      fontStretch: 'normal',
      color: '#494949',
      outline: 'none',
      padding: '11px',
      borderRadius: '2px',
    },
  };

  if (!props.noBorder) {
    styles.base.border = 'solid 1px #979797';
    styles.base[':focus'] = {
      boxShadow: '0 0 6px 1px rgba(0, 0, 0, 0.12)',
      border: 'solid 1px #23CEF5',
    };
  }

  function getPlaceholder() {
    if (typeof props.placeholder === 'string') {
      return props.placeholder;
    }
    if (typeof props.placeholder === 'object') {
      return formatMessage(props.placeholder);
    }
    return '';
  }

  return (
    <input
      id={props.id}
      tabIndex={props.tabIndex}
      name={props.name}
      style={[styles.base, props.style]}
      type={props.type || 'text'}
      value={props.value}
      placeholder={getPlaceholder()}
      onChange={(e) => props.cb(e.target.value, e)}
      autoComplete={props.autocomplete || 'on'}
      onKeyUp={
        (e) => {
          if (props.onKeyUp !== undefined) {
            props.onKeyUp(e);
          }
          if (props.onEnter !== undefined && e.key === 'Enter') {
            props.onEnter();
          }
        }
      }
      onKeyDown={props.onKeyDown || ''}
      autoFocus={props.autoFocus}
      onBlur={props.onBlur}
    />
  );
}

TextInput.propTypes = {
  intl: intlShape.isRequired,
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // eslint-disable-line react/no-unused-prop-types
  cb: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  onEnter: PropTypes.func,
  autocomplete: PropTypes.string,
  tabIndex: PropTypes.number,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  style: PropTypes.object,
  type: PropTypes.string,
  onKeyUp: PropTypes.func,
  onKeyDown: PropTypes.func,
  onBlur: PropTypes.func,
  autoFocus: PropTypes.bool,
  id: PropTypes.string.isRequired,
  noBorder: PropTypes.bool,
};

TextInput.defaultProps = {
  tabIndex: 0,
};

export default injectIntl(Radium(TextInput));
