/**
*
* Checkbox
*
*/

import React, { PropTypes } from 'react';

import { injectIntl, intlShape } from 'react-intl';
import Wrapper from './wrapper';
import styled from 'styled-components';

function Checkbox(props) {
  const { formatMessage } = props.intl;
  const Text = styled.span`
    font-family: ProximaNova;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    color: #494949;
    margin-left: 0.5em;
    vertical-aligh: middle;
`;

  return (
    <Wrapper style={props.style || {}}>
      <input type="checkbox" checked={props.checked} onChange={props.cb} />
      <Text> {formatMessage(props.text)} </Text>
    </Wrapper>
  );
}


Checkbox.propTypes = {
  intl: intlShape.isRequired,
  text: PropTypes.object.isRequired,
  cb: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  style: PropTypes.object,
};

export default injectIntl(Checkbox);
