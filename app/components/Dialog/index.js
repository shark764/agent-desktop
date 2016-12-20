/**
*
* Dialog
*
*/

import React, { PropTypes, Children } from 'react';
import Radium from 'radium';

function Dialog(props) {
  const styles = {
    base: {
      width: '542px',
      height: '543px',
      borderRadius: '3px',
      backgroundColor: '#ffffff',
      boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.09)',
    },
  };
  return (
    <div {...props} style={Object.assign(styles.base, props.style)}>
      {Children.toArray(props.children)}
    </div>
  );
}

Dialog.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

export default Radium(Dialog);
