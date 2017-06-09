/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* Dialog
*
*/

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

const styles = {
  base: {
    width: '542px',
    height: '543px',
    borderRadius: '3px',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.09)',
  },
};

function Dialog(props) {
  return (
    <div {...props} style={[styles.base, props.style]}>
      {Children.toArray(props.children)}
    </div>
  );
}

Dialog.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

export default Radium(Dialog);
