/**
*
* Checkbox
*
*/

import React, { PropTypes } from 'react';

import { injectIntl, intlShape } from 'react-intl';
import Radium from 'radium';

function Checkbox(props) {
  const { formatMessage } = props.intl;
  const styles = {
    base: {
      fontFamily: 'ProximaNova',
      fontSize: '16px',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontStretch: 'normal',
      color: '#494949',
      marginLeft: '0.5em',
      verticalAlign: 'middle',
    },
  };

  return (
    <span style={props.style}>
      <input type="checkbox" checked={props.checked} onChange={(e) => props.cb(e.target.checked)} />
      <span style={styles.base}> {formatMessage(props.text)} </span>
    </span>
  );
}


Checkbox.propTypes = {
  intl: intlShape.isRequired,
  text: PropTypes.object.isRequired,
  cb: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  style: PropTypes.object,
};

export default injectIntl(Radium(Checkbox));
