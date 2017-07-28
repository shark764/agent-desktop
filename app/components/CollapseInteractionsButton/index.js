/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* CollapseInteractionsButton
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import Radium from 'radium';

function CollapseInteractionsButton(props) {
  const styles = {
    base: {
      borderTop: '1px solid black',
      borderRight: '1px solid black',
      borderBottom: '1px solid black',
      borderRadius: '3px',
      height: '75px',
      backgroundColor: '#072931',
      position: 'absolute',
      bottom: '50%',
      cursor: 'pointer',
      transition: 'left 0.3s linear',
      left: '0px',
      zIndex: '2',
    },
    expandedBase: {
      left: '72px',
    },
    triangle: {
      borderWidth: '6px',
      borderStyle: 'solid',
      borderColor: '#FFF transparent transparent #FFF',
      borderImage: 'initial',
      transform: 'rotate(135deg)',
      borderRadius: '3px',
      boxShadow: '-6px -6px 6px -4px rgba(0,0,0,0.29)',
      position: 'relative',
      top: '45%',
      right: '25%',
    },
    expandedTriangle: {
      transform: 'rotate(-45deg)',
      right: '0',
      left: '25%',
    },
  };

  return (
    <div
      style={[styles.base, !props.isCollapsed && styles.expandedBase]}
      onClick={props.toggleInteractionsBar}
    >
      <div
        style={[styles.triangle, !props.isCollapsed && styles.expandedTriangle]}
      />
    </div>
  );
}

CollapseInteractionsButton.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  toggleInteractionsBar: PropTypes.func.isRequired,
};

export default Radium(CollapseInteractionsButton);
