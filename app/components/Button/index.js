/**
*
* Button
*
*/

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

function Button(props) {
  return (
    <button>
      <FormattedMessage {...props.text} />
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.object.isRequired,
};


export default Radium(Button);
