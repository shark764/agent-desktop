/**
*
* Button
*
*/

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

function Button(props) {
  const styles = {
    base: {
      borderRadius: '8px',
      backgroundColor: '#23cdf4',
      fontSize: '16px',
      fontWeight: 'bold',
      fontStyle: 'normal',
      fontStretch: 'normal',
      color: '#ffffff',
      paddingTop: '14px',
      paddingBottom: '14px',
      paddingLeft: '28px',
      paddingRight: '28px',
      cursor: 'pointer',
      outline: 'none',
      marginTop: '14px',
      ':hover': {
        backgroundColor: '#1FB8DC',
      },
      ':active': {
        backgroundColor: '#14778D',
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
  style: PropTypes.object,
  onClick: PropTypes.func,
};


export default Radium(Button);
