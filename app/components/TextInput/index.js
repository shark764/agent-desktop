/**
*
* TextInput
*
*/

import React, { PropTypes } from 'react';

import { injectIntl, intlShape } from 'react-intl';
import Wrapper from './wrapper';
import styled from 'styled-components';


function TextInput(props) {
  const { formatMessage } = props.intl;
  const Input = styled.input`
    width: 282px;
    height: 44px;
    background-color: #ffffff;
    border: solid 1px #979797;
    font-family: ProximaNova;
    font-size: 20px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    color: #494949;
    outline: none;

    &:focus {
      box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.12);
      border: solid 1px #23cdf4;
    }
`;

  return (
    <Wrapper>
      <Input type="text" value={props.value} placeholder={formatMessage(props.placeholder)} onChange={(e) => props.cb(e.target.value)} autoComplete={props.autocomplete || ''} style={props.style || {}} />
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

export default injectIntl(TextInput);
