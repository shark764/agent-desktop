/**
*
* PopupDialog
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { VelocityTransitionGroup } from 'velocity-react';

import Radium from 'radium';

function PopupDialog(props) {
  const leftOffsetPx = (typeof props.arrowLeftOffsetPx !== 'undefined') ? props.arrowLeftOffsetPx : Math.round(props.widthPx / 4);

  const styles = {
    base: {
      width: `${props.widthPx}px`,
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 6px 1px rgba(0,0,0,0.29)',
      padding: '16px 0 0 0',
      margin: '10px',
      color: '#4b4b4b',
    },
    triangle: {
      position: 'absolute',
      width: '0px',
      height: '0px',
      left: `${leftOffsetPx}px`,
      bottom: '-5px',
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
    },
  };

  return (
    <div>
      {
        // Transparent mask to catch click outside of dialog
        props.isVisible && <div style={styles.mask} id="screen-mask" onClick={props.hide} />
      }
      <VelocityTransitionGroup enter={{ animation: 'transition.slideUpIn', duration: '100' }} leave={{ animation: 'transition.slideUpOut', duration: '100' }}>
        { props.isVisible &&
          <div id={props.id} style={[styles.base, props.style]}>
            <span style={[styles.triangle]} />
            {props.children}
          </div>
        }
      </VelocityTransitionGroup>
    </div>
  );
}

PopupDialog.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  widthPx: PropTypes.number.isRequired,
  arrowLeftOffsetPx: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
  isVisible: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
};

export default Radium(PopupDialog);
