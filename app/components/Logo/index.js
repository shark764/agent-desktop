/**
*
* Logo
*
*/

import React, { PropTypes } from 'react';

import logo from './Serenova.png';


function Logo(props) {
  return (
    <img src={logo} alt="Serenova" style={props.style || {}} />
  );
}

Logo.propTypes = {
  style: PropTypes.object,
};


export default Logo;
