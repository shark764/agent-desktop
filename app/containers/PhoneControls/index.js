/*
 *
 * PhoneControls
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import PhoneControlsInactive from 'containers/PhoneControlsInactive';
import PhoneControlsActive from 'containers/PhoneControlsActive';

import { selectActiveVoiceInteraction } from './selectors';

export class PhoneControls extends BaseComponent {

  styles = {
    base: {
      backgroundColor: '#031417',
      color: '#FFFFFF',
    },
    topTriangle: {
      width: '0px',
      height: '0px',
      borderTop: 'none',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderBottom: '10px solid white',
      position: 'absolute',
      marginTop: '4px',
      zIndex: 3,
    },
    phoneControlsPopupMenu: {
      width: '282px',
      margin: '10px 0 0 14px',
      backgroundColor: '#FFFFFF',
      color: '#4B4B4B',
      boxShadow: '0 0 6px 0 rgba(0,0,0,0.23)',
      borderRadius: '3px',
      overflow: 'hidden',
      position: 'absolute',
      zIndex: 2,
      padding: '25px 20px 20px',
    },
  }

  render() {
    return (
      <div style={[this.styles.base, this.props.style]}>
        {
          this.props.activeVoiceInteraction
          ? <PhoneControlsActive activeVoiceInteraction={this.props.activeVoiceInteraction} style={this.styles} />
          : <PhoneControlsInactive style={this.styles} />
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  activeVoiceInteraction: selectActiveVoiceInteraction(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    dispatch,
  };
}

PhoneControls.propTypes = {
  activeVoiceInteraction: PropTypes.object,
  style: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(PhoneControls));
