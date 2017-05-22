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
    maxWidth: '400px',
    maxHeight: '400px',
  },
};

function Image(props) {
  return (
    <div id={props.id} style={props.style}>
      <div>
        { props.placeholder }
      </div>
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
