/**
*
* Title
*
*/

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

function Title(props) {
  const styles = {
    base: {
      fontSize: '20px',
      fontWeight: 'bold',
      fontStyle: 'normal',
      fontStretch: 'normal',
      color: '#494949',
    },
  };

  return (
    <span id={props.id} style={[styles.base, props.style]}>
      <FormattedMessage style={styles.center} {...props.text} />
    </span>
  );
}

Title.propTypes = {
  text: PropTypes.object.isRequired,
  style: PropTypes.object,
  id: PropTypes.string.isRequired,
};

export default Radium(Title);
