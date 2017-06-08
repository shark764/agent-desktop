/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* Title
*
*/

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
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
