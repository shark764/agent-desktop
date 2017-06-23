/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* Checkbox
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { injectIntl, intlShape } from 'react-intl';

const styles = {
  label: {
    fontSize: '16px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    color: '#494949',
    marginLeft: '0.5em',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 'calc(100% - 25px)',
    display: 'inline-block',
  },
  checkbox: {
    verticalAlign: 'middle',
    height: '14px',
    width: '14px',
  },
};

function Checkbox(props) {
  const handleChange = (event) => {
    if (props.cb) {
      props.cb(event.target.checked, event);
    }
  };

  let label;
  if (props.text === undefined) {
    label = undefined;
  } else if (typeof props.text === 'string') {
    label = (
      <label htmlFor={props.id} style={[styles.label, props.labelStyle]}>
        {props.text}
      </label>
    );
  } else {
    const { formatMessage } = props.intl;
    label = (
      <label htmlFor={props.id} style={[styles.label, props.labelStyle]}>
        {formatMessage(props.text)}
      </label>
    );
  }

  return (
    <span style={props.style}>
      <input
        id={props.id}
        tabIndex={props.tabIndex}
        name={props.name}
        type="checkbox"
        style={[styles.checkbox, props.checkboxInputStyle]}
        checked={props.checked}
        disabled={!props.cb || props.disabled}
        onBlur={props.onBlur}
        onChange={handleChange}
      />
      {label}
    </span>
  );
}

Checkbox.propTypes = {
  intl: intlShape,
  name: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  cb: PropTypes.func,
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  labelStyle: PropTypes.object,
  checkboxInputStyle: PropTypes.object,
  id: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  tabIndex: PropTypes.number,
};

Checkbox.defaultProps = {
  tabIndex: 0,
};

export default injectIntl(Radium(Checkbox));
