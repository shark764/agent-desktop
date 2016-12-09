/**
*
* Button
*
*/

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import Wrapper from './wrapper';

function Button(props) {
  return (
    <Wrapper>
      <button>
        <FormattedMessage {...props.text} />
      </button>
    </Wrapper>
  );
}

Button.propTypes = {
  text: PropTypes.object.isRequired,
};


export default Button;
