/**
*
* Radio
*
*/

import React, { PropTypes } from 'react';

import { injectIntl, intlShape } from 'react-intl';

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
      marginLeft: '0.5em',
      verticalAlign: 'middle',
    },
  };

  return (
    <span style={Object.assign({}, props.style)}>
      {props.options.map((option) =>
        <span key={`agent-select-dir-1-${option.id}-container`} style={{ marginLeft: '24px' }}>
          <input key={`agent-select-dir-${option.id}`} type="radio" checked={props.value === formatMessage(option)} onChange={() => props.cb(formatMessage(option))} />
          <span key={`agent-select-dir-1-${option.id}-label`} style={styles.base}> {formatMessage(option)} </span>
        </span>
      )}
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
