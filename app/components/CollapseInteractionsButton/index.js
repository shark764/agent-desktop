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

import './styles.css';

function CollapseInteractionsButton(props) {
  const styles = {
    base: {
      borderRadius: '0px 3px 3px 0px',
      height: '75px',
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
      position: 'relative',
      top: '43%',
      right: '25%',
      margin: '2px',
    },
    expandedTriangle: {
      transform: 'rotate(-45deg)',
      right: '0',
      left: '25%',
    },
  };

  return (
    <div
      className={
        props.isCollapsed && props.hasUnrespondedInteractions
          ? 'pendingInteraction'
          : 'interactionNotPending'
      }
      id="toggleInteractionsBar"
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
  hasUnrespondedInteractions: PropTypes.bool,
};

export default Radium(CollapseInteractionsButton);
