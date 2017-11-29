/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * Image
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

const styles = {
  img: {
    maxWidth: '100%',
  },
};

function Image(props) {
  return (
    <div id={props.id} style={props.style}>
      <div>{props.placeholder}</div>
      <img src={props.src} alt="" style={styles.img} />
    </div>
  );
}

Image.propTypes = {
  id: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
};

export default Radium(Image);
