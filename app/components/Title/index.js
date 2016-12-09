/**
*
* Title
*
*/

import React, { PropTypes } from 'react';

import { FormattedMessage } from 'react-intl';
import Wrapper from './wrapper';

function Title(props) {
  return (
    <Wrapper>
      <span style={props.style || {}}>
        <FormattedMessage {...props.text} />
      </span>
    </Wrapper>
  );
}

Title.propTypes = {
  text: PropTypes.object.isRequired,
  style: PropTypes.object,
};

export default Title;
