/**
*
* Logo
*
*/

import React, { PropTypes } from 'react';

import logo from './Serenova.png';


function Logo(props) {
  return (
    <img src={logo} alt="Serenova" style={Object.assign({ width: props.width, height: props.height }, props.style)} />
  );
}

Logo.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  style: PropTypes.object,
};


export default Logo;
