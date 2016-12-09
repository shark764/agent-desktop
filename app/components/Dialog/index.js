/**
*
* Dialog
*
*/

import React, { PropTypes, Children } from 'react';
import Wrapper from './wrapper';

function Dialog(props) {
  return (
    <Wrapper>
      {Children.toArray(props.children)}
    </Wrapper>
  );
}

Dialog.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Dialog;
