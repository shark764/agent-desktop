/**
*
* Logo
*
*/

import React, { PropTypes } from 'react';

import logo from './Serenova.png';
import Wrapper from './wrapper';


function Logo(props) {
  return (
    <Wrapper>
      <img src={logo} alt="Serenova" style={props.style || {}} />
    </Wrapper>
  );
}

Logo.propTypes = {
  style: PropTypes.object,
};


export default Logo;
