/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * PopupDialog
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

const styles = {
  base: {
    width: '100px',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 0 6px 1px rgba(0,0,0,0.29)',
    margin: '10px',
    color: '#4b4b4b',
    zIndex: 3,
    position: 'relative',
  },
  triangle: {
    position: 'absolute',
    width: '0px',
    height: '0px',
    left: '40px',
    bottom: '-7px',
    zIndex: '1',
    borderWidth: '8px',
    borderStyle: 'solid',
    borderColor: '#FFF transparent transparent #FFF',
    borderImage: 'initial',
    transform: 'rotate(-134deg)',
    boxShadow: '-6px -6px 11px -4px rgba(0,0,0,0.29)',
    borderRadius: '3px',
  },
  mask: {
    position: 'fixed',
    height: '100vh',
    width: '100vw',
    top: '0px',
    left: '0px',
    zIndex: '2',
  },
};

function PopupDialog(props) {
  styles.base.width = `${props.widthPx}px`;
  styles.triangle.left = `${
    typeof props.arrowLeftOffsetPx !== 'undefined'
      ? props.arrowLeftOffsetPx
      : Math.round(props.widthPx / 4)
  }px`;

  return (
    <div>
      {// Transparent mask to catch click outside of dialog
        props.isVisible && (
          <div style={styles.mask} id="screen-mask" onClick={props.hide} />
        )
      }
      {props.isVisible && (
        <div id={props.id} style={[styles.base, props.style]}>
          <span style={[styles.triangle]} />
          {props.children}
        </div>
      )}
    </div>
  );
}

PopupDialog.propTypes = {
  id: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  widthPx: PropTypes.number.isRequired,
  arrowLeftOffsetPx: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
    .isRequired,
  isVisible: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
};

export default Radium(PopupDialog);
