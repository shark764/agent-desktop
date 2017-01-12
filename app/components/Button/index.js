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
  let fontSize = '13px';
  let fontWeight = 'bold';
  let padding = '9px 17px';
  if (props.type === 'primaryBlueBig' || props.type === 'primaryBlue') {
    if (props.type === 'primaryBlueBig') {
      borderRadius = '8px';
      fontSize = '16px';
      padding = '14px 28px';
    }
    backgroundColor = '#23cdf4';
    backgroundColorHover = '#1FB8DC';
    backgroundColorActive = '#14778D';
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
      border,
      borderRadius,
      backgroundColor,
      fontSize,
      fontWeight,
      fontStyle: 'normal',
      fontStretch: 'normal',
      color,
      padding,
      cursor: 'pointer',
      outline: 'none',
      ':hover': {
        backgroundColor: backgroundColorHover,
      },
      ':active': {
        backgroundColor: backgroundColorActive,
      },
    },
  };

  return (
    <button style={[styles.base, props.style]} onClick={props.onClick}>
      <FormattedMessage {...props.text} />
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['primaryBlue', 'primaryBlueBig', 'primaryRed', 'secondary']).isRequired,
  style: PropTypes.object,
  onClick: PropTypes.func,
};


export default Radium(Button);
