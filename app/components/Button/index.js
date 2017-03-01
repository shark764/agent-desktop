/**
*
* Button
*
*/

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

import Icon from 'components/Icon';

function Button(props) {
  let backgroundColor;
  let backgroundColorHover;
  let backgroundColorActive;
  let focusBorder;
  let boxSizing;
  let border;
  let borderRadius = '3px';
  let color = '#FFFFFF';
  let cursor = 'pointer';
  let fontSize = '13px';
  let fontWeight = 'bold';
  let padding = '9px 17px';
  const isIcon = !!props.iconName;
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
    focusBorder = {
      boxShadow: '0 0 6px 1px rgba(0, 0, 0, 0.12)',
      border: 'solid 1px #23CEF5',
    };
    border = '1px solid #979797';
    color = '#4B4B4B';
    fontWeight = '';
    borderRadius = '2px';
    if (props.disabled) {
      border = '1px solid #C5C5C5';
      cursor = 'default';
      color = '#C5C5C5';
    }
  }
  if (isIcon) {
    boxSizing = 'borderBox';
    padding = 'auto';
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
      boxSizing,
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
  function checkBorderOverride(style) {
    if (style.borderTop || style.borderRight || style.borderBottom || style.borderLeft) {
      border = undefined;
      focusBorder = undefined;
    }
  }

  if (Array.isArray(props.style)) {
    props.style.forEach((style) => {
      checkBorderOverride(style);
    });
  } else if (props.style) {
    checkBorderOverride(props.style);
  }

  if (border) {
    styles.base.border = border;
  }
  if (focusBorder) {
    styles.base[':focus'] = focusBorder;
  }

  let inner;

  if (isIcon) {
    inner = <Icon name={props.iconName} />;
  } else if (typeof props.text === 'object') {
    inner = <FormattedMessage {...props.text} />;
  } else {
    inner = props.text;
  }

  return (
    <button id={props.id} style={[styles.base, props.style]} tabIndex={props.tabIndex} onClick={props.onClick} disabled={props.disabled}>
      {inner}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.any,
  iconName: PropTypes.string,
  tabIndex: PropTypes.number,
  type: PropTypes.oneOf(['primaryBlue', 'primaryBlueBig', 'primaryRed', 'secondary']).isRequired,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  id: PropTypes.string.isRequired,
};

Button.defaultProps = {
  tabIndex: 0,
};

export default Radium(Button);
