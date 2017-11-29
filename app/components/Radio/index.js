/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * Radio
 *
 */

import React from 'react';

import { injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';

import Radium from 'radium';

function Radio(props) {
  const { formatMessage } = props.intl;
  const styles = {
    base: {
      fontSize: '16px',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontStretch: 'normal',
      color: '#494949',
      verticalAlign: 'middle',
    },
    radio: {
      marginTop: '-1px',
      verticalAlign: 'middle',
    },
  };

  return (
    <span style={Object.assign({}, props.style)}>
      {props.options.map((option) => (
        <span
          id={`agent-select-dir-1-${option.id}-container`}
          key={`agent-select-dir-1-${option.id}-container`}
          style={{ margin: '0px 12px 0px 12px' }}
        >
          <input
            id={`agent-select-dir-1-${option.id}-input`}
            key={`agent-select-dir-${option.id}`}
            type="radio"
            checked={props.value === formatMessage(option)}
            onChange={() => props.cb(formatMessage(option))}
            style={styles.radio}
          />
          <span
            id={`agent-select-dir-1-${option.id}-label`}
            key={`agent-select-dir-1-${option.id}-label`}
            style={styles.base}
          >
            {' '}
            {formatMessage(option)}{' '}
          </span>
        </span>
      ))}
    </span>
  );
}

Radio.propTypes = {
  intl: intlShape.isRequired,
  value: PropTypes.string.isRequired,
  style: PropTypes.object,
  options: PropTypes.array,
};

export default injectIntl(Radium(Radio));
