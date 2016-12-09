/**
*
* TextInput
*
*/

import React, { PropTypes } from 'react';

import { injectIntl, intlShape } from 'react-intl';
import Wrapper from './wrapper';

import Radium from 'radium';


function TextInput(props) {
  const { formatMessage } = props.intl;
  const styles = {
    base: {
      width: '282px',
      height: '44px',
      backgroundColor: '#ffffff',
      border: 'solid 1px #979797',
      fontFamily: 'ProximaNova',
      fontSize: '20px',
      fontWeight: 'bold',
      fontStyle: 'normal',
      fontStretch: 'normal',
      color: '#494949',
      outline: 'none',

      ':focus': {
        boxShadow: '0 0 6px 1px rgba(0, 0, 0, 0.12)',
        border: 'solid 1px #23cdf4',
      },
    },
  };

  return (
    <Wrapper>
      <input style={styles.base} onClick={() => this.setState({ focused: true })} type="text" key={formatMessage(props.placeholder)} value={props.value} placeholder={formatMessage(props.placeholder)} onChange={(e) => props.cb(e.target.value)} autoComplete={props.autocomplete || ''} />
    </Wrapper>
  );
}

TextInput.propTypes = {
  intl: intlShape.isRequired,
  placeholder: PropTypes.object.isRequired,
  cb: PropTypes.func.isRequired,
  autocomplete: PropTypes.string,
  value: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default injectIntl(Radium(TextInput));
