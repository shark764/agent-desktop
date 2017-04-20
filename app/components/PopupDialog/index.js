/**
*
* PopupDialog
*
*/

import React from 'react';
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
      paddingTop: '16px',
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
        props.isVisible && <div style={styles.mask} id="screen-mask-status-menu" onClick={props.hide} />
      }
      <VelocityTransitionGroup enter={{ animation: 'transition.slideUpIn', duration: '100' }} leave={{ animation: 'transition.slideUpOut', duration: '100' }}>
        { props.isVisible &&
          <div id={props.id} style={styles.base}>
            <span style={[styles.triangle]} />
            {props.children}
          </div>
        }
      </VelocityTransitionGroup>
    </div>
  );
}

PopupDialog.propTypes = {
  widthPx: React.PropTypes.number,
  arrowLeftOffsetPx: React.PropTypes.number,
  id: React.PropTypes.string,
  children: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.array]).isRequired,
  isVisible: React.PropTypes.bool.isRequired,
  hide: React.PropTypes.func.isRequired,
};

export default Radium(PopupDialog);
