/**
*
* Image
*
*/

import React, { PropTypes } from 'react';
import Radium from 'radium';

function Image(props) {
  const styles = {
    img: {
      maxWidth: '400px',
      maxHeight: '400px',
    },
  };

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
