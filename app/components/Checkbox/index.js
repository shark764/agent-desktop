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
      fontSize: '16px',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontStretch: 'normal',
      color: '#494949',
      marginLeft: '0.5em',
      verticalAlign: 'middle',
    },
    checkbox: {
      height: '14px',
      width: '14px',
    },
  };

  const handleChange = (event) => {
    if (props.cb) {
      props.cb(event.target.checked, event);
    }
  };

  return (
    <span style={props.style}>
      <input
        style={styles.checkbox}
        id={props.id}
        name={props.name}
        type="checkbox"
        checked={props.checked}
        disabled={!props.cb}
        onBlur={props.onBlur}
        onChange={handleChange}
      />
      {props.text ? <span style={styles.base}> {formatMessage(props.text)} </span> : null}
    </span>
  );
}


Checkbox.propTypes = {
  intl: intlShape.isRequired,
  name: PropTypes.string,
  text: PropTypes.object,
  cb: PropTypes.func,
  checked: PropTypes.bool.isRequired,
  style: PropTypes.object,
  id: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
};

export default injectIntl(Radium(Checkbox));
