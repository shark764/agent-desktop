/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* TextInput
*
*/

import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

function TextInput(props) {
  const { formatMessage } = props.intl;

  let styles;
  if (props.styleType === 'inlineInherit') {
    styles = {
      base: {
        display: 'inline-block',
        fontFamily: 'inherit',
        ':focus': {
          outline: 'none',
        },
        ':hover': {
          borderBottom: 'solid 1px #D0D0D0',
        },
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        borderLeft: 'none',
      },
    };
  } else {
    styles = {
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
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        borderLeft: 'none',
      },
    };

    if (!props.noBorder) {
      styles.base.borderTop = 'solid 1px #979797';
      styles.base.borderRight = 'solid 1px #979797';
      styles.base.borderBottom = 'solid 1px #979797';
      styles.base.borderLeft = 'solid 1px #979797';
      styles.base[':focus'] = {
        boxShadow: '0 0 6px 1px rgba(0, 0, 0, 0.12)',
        borderTop: 'solid 1px #23CEF5',
        borderRight: 'solid 1px #23CEF5',
        borderBottom: 'solid 1px #23CEF5',
        borderLeft: 'solid 1px #23CEF5',
      };
    }
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
      disabled={props.disabled}
    />
  );
}

TextInput.propTypes = {
  intl: intlShape.isRequired,
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  cb: PropTypes.func.isRequired,
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
  styleType: PropTypes.oneOf(['inlineInherit']),
  disabled: PropTypes.bool,
};

TextInput.defaultProps = {
  tabIndex: 0,
};

export default injectIntl(Radium(TextInput));
