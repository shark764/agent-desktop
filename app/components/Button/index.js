/**
*
* Button
*
*/

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

function Button(props) {
  let backgroundColor;
  let backgroundColorHover;
  let backgroundColorActive;
  let border = '';
  let borderRadius = '3px';
  let color = '#FFFFFF';
  let cursor = 'pointer';
  let fontSize = '13px';
  let fontWeight = 'bold';
  let padding = '9px 17px';
  if (props.type === 'primaryBlueBig' || props.type === 'primaryBlue') {
    if (props.type === 'primaryBlueBig') {
      borderRadius = '8px';
      fontSize = '16px';
      padding = '14px 28px';
    }
    if (props.disabled) {
      backgroundColor = '#8BE1F4';
      cursor = 'default';
    } else {
      backgroundColor = '#23cdf4';
      backgroundColorHover = '#1FB8DC';
      backgroundColorActive = '#14778D';
    }
  } else if (props.type === 'primaryRed') {
    backgroundColor = '#FE4565';
    backgroundColorHover = '#E43D5A';
    backgroundColorActive = '#CB3750';
  } else if (props.type === 'secondary') {
    backgroundColor = '#FFFFFF';
    backgroundColorHover = '#F3F3F3';
    backgroundColorActive = '#E4E4E4';
    border = '1px solid #979797';
    color = '#4B4B4B';
    fontWeight = '';
  }

  const styles = {
    base: {
      borderRadius,
      backgroundColor,
      fontSize,
      fontWeight,
      fontStyle: 'normal',
      fontStretch: 'normal',
      color,
      padding,
      cursor,
      outline: 'none',
      ':hover': {
        backgroundColor: backgroundColorHover,
      },
      ':active': {
        backgroundColor: backgroundColorActive,
      },
    },
  };

  // To prevent warning from: https://github.com/FormidableLabs/radium/issues/95
  if (props.style && (props.style.borderTop || props.style.borderRight || props.style.borderBottom || props.style.borderLeft)) {
    border = undefined;
  }
  if (border) {
    styles.base.border = border;
  }

  return (
    <button style={[styles.base, props.style]} onClick={props.onClick} disabled={props.disabled}>
      {typeof props.text === 'object'
        ? <FormattedMessage {...props.text} />
        : props.text
      }
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.any.isRequired,
  type: PropTypes.oneOf(['primaryBlue', 'primaryBlueBig', 'primaryRed', 'secondary']).isRequired,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Radium(Button);
